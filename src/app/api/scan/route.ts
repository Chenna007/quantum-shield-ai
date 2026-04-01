import { NextRequest, NextResponse } from "next/server";
import * as tls from "tls";
import * as net from "net";

const QUANTUM_VULNERABLE: Record<string, { risk: string; reason: string }> = {
  RSA: { risk: "critical", reason: "Vulnerable to Shor's algorithm" },
  ECDSA: { risk: "critical", reason: "Vulnerable to Shor's algorithm on elliptic curves" },
  ECDHE: { risk: "high", reason: "Elliptic curve key exchange vulnerable to quantum attacks" },
  DHE: { risk: "high", reason: "Diffie-Hellman vulnerable to Shor's algorithm" },
  DH: { risk: "high", reason: "Diffie-Hellman vulnerable to Shor's algorithm" },
  DSA: { risk: "critical", reason: "Digital Signature Algorithm vulnerable to quantum factoring" },
};

const QUANTUM_SAFE: Record<string, { risk: string; reason: string }> = {
  "AES256": { risk: "low", reason: "Symmetric encryption with sufficient key length for post-quantum" },
  "AES128": { risk: "medium", reason: "Symmetric encryption — increase to 256-bit for post-quantum safety" },
  "CHACHA20": { risk: "low", reason: "Symmetric stream cipher, quantum-resistant with sufficient key size" },
  "SHA256": { risk: "low", reason: "Hash function with adequate output length" },
  "SHA384": { risk: "low", reason: "Hash function with strong post-quantum security margin" },
};

const SAFE_DISPLAY: Record<string, string> = {
  AES256: "AES-256", AES128: "AES-128", CHACHA20: "ChaCha20", SHA256: "SHA-256", SHA384: "SHA-384",
};

const PQC_ALGORITHMS = ["CRYSTALS-Kyber", "CRYSTALS-Dilithium", "FALCON", "SPHINCS+"];

function cleanDomain(raw: string): string {
  raw = raw.trim();
  if (raw.includes("://")) {
    try { raw = new URL(raw).hostname; } catch { /* keep raw */ }
  }
  raw = raw.split("/")[0].split(":")[0];
  return raw.toLowerCase();
}

interface CertInfo {
  subject: Record<string, string>;
  issuer: Record<string, string>;
  valid_from: string;
  valid_to: string;
  serialNumber: string;
  subjectaltname?: string;
  cipher: { name: string; standardName: string; version: string };
  protocol: string;
  bits: number;
}

function getCertInfo(domain: string): Promise<CertInfo> {
  return new Promise((resolve, reject) => {
    const socket = tls.connect(443, domain, { servername: domain, timeout: 10000 }, () => {
      const cert = socket.getPeerCertificate();
      const cipher = socket.getCipher() as { name: string; standardName?: string; version: string; bits?: number };
      const protocol = socket.getProtocol() || "unknown";

      if (!cert || !cert.subject) {
        socket.destroy();
        return reject(new Error("No certificate returned"));
      }

      const parseField = (obj: Record<string, string> | string | undefined): Record<string, string> => {
        if (!obj || typeof obj === "string") return {};
        return obj as Record<string, string>;
      };

      resolve({
        subject: parseField(cert.subject as unknown as Record<string, string>),
        issuer: parseField(cert.issuer as unknown as Record<string, string>),
        valid_from: cert.valid_from || "N/A",
        valid_to: cert.valid_to || "N/A",
        serialNumber: cert.serialNumber || "N/A",
        subjectaltname: cert.subjectaltname || "",
        cipher: {
          name: cipher?.name || "unknown",
          standardName: cipher?.standardName || cipher?.name || "unknown",
          version: cipher?.version || "unknown",
        },
        protocol,
        bits: cipher?.bits || 0,
      });
      socket.destroy();
    });

    socket.on("timeout", () => { socket.destroy(); reject(new Error("Connection timed out")); });
    socket.on("error", (err) => { reject(err); });
  });
}

function analyzeEncryption(cipherName: string, protocol: string, bits: number) {
  const components = cipherName.replace(/-/g, "_").split("_");
  const vulnerabilities: { algorithm: string; risk_level: string; reason: string }[] = [];
  const safe_components: { algorithm: string; risk_level: string; reason: string }[] = [];

  for (const comp of components) {
    const upper = comp.toUpperCase();
    for (const [algo, info] of Object.entries(QUANTUM_VULNERABLE)) {
      if (upper.includes(algo)) {
        if (!vulnerabilities.find(v => v.algorithm === algo)) {
          vulnerabilities.push({ algorithm: algo, risk_level: info.risk, reason: info.reason });
        }
      }
    }
    for (const [key, info] of Object.entries(QUANTUM_SAFE)) {
      if (upper.includes(key)) {
        const displayName = SAFE_DISPLAY[key] || key;
        if (!safe_components.find(s => s.algorithm === displayName)) {
          safe_components.push({ algorithm: displayName, risk_level: info.risk, reason: info.reason });
        }
      }
    }
  }

  return { cipher_suite: cipherName, protocol, key_bits: bits, vulnerabilities, safe_components };
}

function calculateRiskScore(enc: ReturnType<typeof analyzeEncryption>) {
  let score = 100;
  for (const v of enc.vulnerabilities) {
    if (v.risk_level === "critical") score -= 30;
    else if (v.risk_level === "high") score -= 20;
    else if (v.risk_level === "medium") score -= 10;
  }
  if (enc.key_bits < 256) score -= 10;
  if (["TLSv1", "TLSv1.1"].includes(enc.protocol)) score -= 25;
  else if (enc.protocol === "TLSv1.2") score -= 5;
  score += enc.safe_components.length * 5;
  score = Math.max(0, Math.min(100, score));

  let level: string, label: string;
  if (score >= 80) { level = "low"; label = "Low Risk"; }
  else if (score >= 50) { level = "medium"; label = "Medium Risk"; }
  else if (score >= 25) { level = "high"; label = "High Risk"; }
  else { level = "critical"; label = "Critical Risk"; }

  return { score, level, label };
}

function generateRecommendations(risk: ReturnType<typeof calculateRiskScore>, enc: ReturnType<typeof analyzeEncryption>) {
  const recs: { priority: string; title: string; description: string }[] = [];
  for (const v of enc.vulnerabilities) {
    const pqc = PQC_ALGORITHMS[Math.floor(Math.random() * PQC_ALGORITHMS.length)];
    recs.push({
      priority: ["critical", "high"].includes(v.risk_level) ? "high" : "medium",
      title: `Migrate away from ${v.algorithm}`,
      description: `${v.reason}. Consider migrating to post-quantum alternatives like ${pqc}.`,
    });
  }
  if (enc.key_bits < 256) {
    recs.push({ priority: "medium", title: "Increase key length to 256-bit", description: "Grover's algorithm effectively halves symmetric key strength. Use AES-256 for post-quantum safety." });
  }
  if (enc.protocol !== "TLSv1.3") {
    recs.push({ priority: "high", title: "Upgrade to TLS 1.3", description: "TLS 1.3 removes legacy algorithms and improves security posture." });
  }
  recs.push({ priority: "info", title: "Plan post-quantum migration", description: `Begin evaluating NIST-approved PQC algorithms: ${PQC_ALGORITHMS.join(", ")}.` });
  return recs;
}

function buildChartData(enc: ReturnType<typeof analyzeEncryption>, risk: ReturnType<typeof calculateRiskScore>) {
  const risk_breakdown: { name: string; risk: string; value: number }[] = [];
  for (const v of enc.vulnerabilities) risk_breakdown.push({ name: v.algorithm, risk: v.risk_level, value: v.risk_level === "critical" ? 30 : 20 });
  for (const s of enc.safe_components) risk_breakdown.push({ name: s.algorithm, risk: s.risk_level, value: s.risk_level === "medium" ? 10 : 5 });

  return {
    risk_pie: [
      { name: "Vulnerable", value: enc.vulnerabilities.length, color: "#ef4444" },
      { name: "Safe", value: Math.max(enc.safe_components.length, 1), color: "#22c55e" },
    ],
    risk_bar: risk_breakdown.length ? risk_breakdown : [{ name: "Baseline", risk: "low", value: 10 }],
    score_gauge: { score: risk.score, max: 100, level: risk.level },
  };
}

export async function GET(request: NextRequest) {
  const domain = request.nextUrl.searchParams.get("domain");
  if (!domain) {
    return NextResponse.json({ detail: "Missing domain parameter" }, { status: 400 });
  }

  const cleaned = cleanDomain(domain);
  if (!cleaned) {
    return NextResponse.json({ detail: "Invalid domain" }, { status: 400 });
  }

  try {
    const info = await getCertInfo(cleaned);
    const enc = analyzeEncryption(info.cipher.standardName || info.cipher.name, info.protocol, info.bits);
    const risk = calculateRiskScore(enc);
    const recommendations = generateRecommendations(risk, enc);
    const charts = buildChartData(enc, risk);

    const san = info.subjectaltname
      ? info.subjectaltname.split(",").map((s: string) => s.trim().replace("DNS:", ""))
      : [];

    return NextResponse.json({
      domain: cleaned,
      scanned_at: new Date().toISOString(),
      domain_info: {
        common_name: info.subject.CN || "N/A",
        organization: info.subject.O || "N/A",
        issuer: info.issuer.O || "N/A",
        valid_from: info.valid_from,
        valid_until: info.valid_to,
        serial_number: info.serialNumber,
        san,
      },
      encryption: {
        cipher_suite: enc.cipher_suite,
        protocol: enc.protocol,
        key_bits: enc.key_bits,
        vulnerabilities: enc.vulnerabilities,
        safe_components: enc.safe_components,
      },
      risk,
      recommendations,
      charts,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Scan failed";
    if (message.includes("ENOTFOUND") || message.includes("getaddrinfo")) {
      return NextResponse.json({ detail: `Domain '${cleaned}' could not be resolved` }, { status: 404 });
    }
    if (message.includes("timed out")) {
      return NextResponse.json({ detail: `Connection to '${cleaned}' timed out` }, { status: 504 });
    }
    return NextResponse.json({ detail: `Could not connect to '${cleaned}': ${message}` }, { status: 502 });
  }
}
