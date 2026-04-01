import os
import socket
import ssl
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from http.client import HTTPConnection, HTTPSConnection
from typing import Any
from urllib.parse import urlparse

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="QuantumShield AI",
    description="Post-Quantum Cybersecurity Risk Detection API",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in os.getenv("CORS_ORIGINS", "*").split(",")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

QUANTUM_VULNERABLE = {
    "RSA": {"risk": "critical", "reason": "RSA may be broken by Shor's algorithm when large-scale quantum computers mature."},
    "ECDSA": {"risk": "critical", "reason": "Elliptic-curve signatures are vulnerable to quantum attacks via Shor's algorithm."},
    "ECDHE": {"risk": "high", "reason": "Elliptic-curve key exchange can be compromised by future quantum adversaries."},
    "DHE": {"risk": "high", "reason": "Diffie-Hellman key exchange is vulnerable to quantum factorization attacks."},
    "DH": {"risk": "high", "reason": "Classic Diffie-Hellman lacks long-term post-quantum confidentiality guarantees."},
    "DSA": {"risk": "critical", "reason": "DSA signatures are expected to fail against quantum-capable attackers."},
}

QUANTUM_SAFE = {
    "AES256": {"name": "AES-256", "risk": "low", "reason": "Strong symmetric cipher with improved post-quantum margin."},
    "CHACHA20": {"name": "ChaCha20", "risk": "low", "reason": "Modern stream cipher with strong quantum-era resilience."},
    "SHA384": {"name": "SHA-384", "risk": "low", "reason": "Hash strength offers strong quantum safety margin."},
    "SHA256": {"name": "SHA-256", "risk": "medium", "reason": "Adequate today, but larger hashes improve long-term confidence."},
}

PQC_ALGORITHMS = ["CRYSTALS-Kyber", "CRYSTALS-Dilithium", "FALCON", "SPHINCS+"]

SECURITY_HEADERS = [
    {"name": "content-security-policy", "label": "Content-Security-Policy", "severity": "high", "description": "Missing CSP increases XSS and injection risk."},
    {"name": "x-frame-options", "label": "X-Frame-Options", "severity": "medium", "description": "Missing X-Frame-Options increases clickjacking risk."},
    {"name": "x-xss-protection", "label": "X-XSS-Protection", "severity": "low", "description": "Legacy XSS protection header is not set."},
    {"name": "strict-transport-security", "label": "Strict-Transport-Security", "severity": "high", "description": "Missing HSTS allows downgrade attacks to plain HTTP."},
    {"name": "x-content-type-options", "label": "X-Content-Type-Options", "severity": "medium", "description": "Missing MIME-sniffing protection raises script-injection risk."},
]

COMMON_PORTS = [
    {"port": 21, "service": "FTP", "risk": "high"},
    {"port": 22, "service": "SSH", "risk": "info"},
    {"port": 23, "service": "Telnet", "risk": "critical"},
    {"port": 25, "service": "SMTP", "risk": "medium"},
    {"port": 53, "service": "DNS", "risk": "info"},
    {"port": 80, "service": "HTTP", "risk": "low"},
    {"port": 443, "service": "HTTPS", "risk": "info"},
    {"port": 3306, "service": "MySQL", "risk": "high"},
    {"port": 5432, "service": "PostgreSQL", "risk": "high"},
    {"port": 6379, "service": "Redis", "risk": "critical"},
    {"port": 8080, "service": "HTTP-Alt", "risk": "medium"},
    {"port": 8443, "service": "HTTPS-Alt", "risk": "low"},
    {"port": 27017, "service": "MongoDB", "risk": "critical"},
]


def clean_domain(raw: str) -> str:
    cleaned = raw.strip()
    if "://" in cleaned:
        cleaned = urlparse(cleaned).hostname or cleaned
    cleaned = cleaned.split("/")[0].split(":")[0].strip().lower()
    return cleaned


def get_cert_info(domain: str) -> dict[str, Any]:
    context = ssl.create_default_context()
    with socket.create_connection((domain, 443), timeout=8) as sock:
        with context.wrap_socket(sock, server_hostname=domain) as tls_sock:
            cert = tls_sock.getpeercert()
            cipher_name, _, key_bits = tls_sock.cipher()
            tls_version = tls_sock.version() or "unknown"
    return {
        "cert": cert,
        "cipher_suite": cipher_name,
        "key_bits": key_bits,
        "tls_version": tls_version,
    }


def analyze_encryption(cipher_suite: str, tls_version: str, key_bits: int) -> dict[str, Any]:
    components = cipher_suite.replace("-", "_").split("_")
    vulnerabilities: list[dict[str, str]] = []
    safe_components: list[dict[str, str]] = []

    for part in components:
        part_upper = part.upper()
        for algo, info in QUANTUM_VULNERABLE.items():
            if algo in part_upper and not any(v["algorithm"] == algo for v in vulnerabilities):
                vulnerabilities.append(
                    {
                        "algorithm": algo,
                        "risk_level": info["risk"],
                        "reason": info["reason"],
                    }
                )

        for token, info in QUANTUM_SAFE.items():
            if token in part_upper and not any(s["algorithm"] == info["name"] for s in safe_components):
                safe_components.append(
                    {
                        "algorithm": info["name"],
                        "risk_level": info["risk"],
                        "reason": info["reason"],
                    }
                )

    return {
        "cipher_suite": cipher_suite,
        "protocol": tls_version,
        "key_bits": key_bits,
        "vulnerabilities": vulnerabilities,
        "safe_components": safe_components,
    }


def scan_single_port(domain: str, port: int, timeout: float = 1.5) -> bool:
    try:
        with socket.create_connection((domain, port), timeout=timeout):
            return True
    except OSError:
        return False


def scan_ports(domain: str) -> list[dict[str, Any]]:
    findings: list[dict[str, Any]] = []
    with ThreadPoolExecutor(max_workers=20) as executor:
        futures = {
            executor.submit(scan_single_port, domain, item["port"]): item
            for item in COMMON_PORTS
        }
        for future, item in futures.items():
            if future.result():
                findings.append(
                    {
                        "port": item["port"],
                        "service": item["service"],
                        "risk": item["risk"],
                        "open": True,
                    }
                )
    return sorted(findings, key=lambda p: p["port"])


def fetch_headers(domain: str) -> dict[str, Any]:
    conn: HTTPSConnection | None = None
    try:
        conn = HTTPSConnection(domain, timeout=8)
        conn.request("GET", "/", headers={"User-Agent": "QuantumShield-Scanner/1.0"})
        res = conn.getresponse()
        headers = {k.lower(): v for k, v in res.getheaders()}
    except OSError:
        headers = {}
    finally:
        if conn:
            conn.close()

    present: list[dict[str, str]] = []
    missing: list[dict[str, str]] = []

    for header in SECURITY_HEADERS:
        value = headers.get(header["name"])
        if value:
            present.append(
                {
                    "name": header["name"],
                    "label": header["label"],
                    "value": value,
                }
            )
        else:
            missing.append(
                {
                    "name": header["name"],
                    "label": header["label"],
                    "severity": header["severity"],
                    "description": header["description"],
                }
            )

    score = round((len(present) / len(SECURITY_HEADERS)) * 100)
    return {"present": present, "missing": missing, "score": score}


def check_https_redirect(domain: str) -> dict[str, Any]:
    conn: HTTPConnection | None = None
    try:
        conn = HTTPConnection(domain, timeout=6)
        conn.request("GET", "/", headers={"User-Agent": "QuantumShield-Scanner/1.0"})
        res = conn.getresponse()
        location = res.getheader("Location") or ""
        redirects = res.status in (301, 302, 307, 308) and location.lower().startswith("https")
        return {
            "redirects": redirects,
            "target": location or None,
            "status_code": res.status,
        }
    except OSError:
        return {"redirects": False, "target": None, "status_code": None}
    finally:
        if conn:
            conn.close()


def calculate_overall_risk(
    encryption: dict[str, Any],
    headers: dict[str, Any],
    ports: list[dict[str, Any]],
    redirect: dict[str, Any],
) -> dict[str, Any]:
    ssl_score = 100
    for finding in encryption["vulnerabilities"]:
        if finding["risk_level"] == "critical":
            ssl_score -= 25
        elif finding["risk_level"] == "high":
            ssl_score -= 15
        else:
            ssl_score -= 8

    if encryption["protocol"] in ("TLSv1", "TLSv1.1"):
        ssl_score -= 30
    elif encryption["protocol"] == "TLSv1.2":
        ssl_score -= 8

    if encryption["key_bits"] and encryption["key_bits"] < 256:
        ssl_score -= 10

    ssl_score = max(0, min(100, ssl_score))
    header_score = headers["score"]

    port_score = 100
    for port in ports:
        if port["risk"] == "critical":
            port_score -= 20
        elif port["risk"] == "high":
            port_score -= 12
        elif port["risk"] == "medium":
            port_score -= 7
    port_score = max(0, min(100, port_score))

    redirect_score = 100 if redirect["redirects"] else 55
    quantum_score = max(0, 100 - (len(encryption["vulnerabilities"]) * 25))

    overall = round(
        (ssl_score * 0.28)
        + (header_score * 0.22)
        + (port_score * 0.22)
        + (quantum_score * 0.18)
        + (redirect_score * 0.10)
    )
    overall = max(0, min(100, overall))

    if overall >= 80:
        level = "secure"
        label = "Secure"
    elif overall >= 50:
        level = "moderate"
        label = "Moderate"
    else:
        level = "high_risk"
        label = "High Risk"

    return {
        "score": overall,
        "level": level,
        "label": label,
        "breakdown": {
            "ssl": {"score": ssl_score, "label": "SSL/TLS Risk"},
            "headers": {"score": header_score, "label": "Header Security Risk"},
            "ports": {"score": port_score, "label": "Port Exposure Risk"},
            "quantum": {"score": quantum_score, "label": "Quantum Risk"},
            "redirect": {"score": redirect_score, "label": "HTTPS Redirect"},
        },
    }


def build_findings(
    encryption: dict[str, Any], headers: dict[str, Any], ports: list[dict[str, Any]], redirect: dict[str, Any]
) -> list[dict[str, str]]:
    findings: list[dict[str, str]] = []

    for issue in encryption["vulnerabilities"]:
        findings.append(
            {
                "severity": issue["risk_level"],
                "category": "Quantum",
                "title": f"{issue['algorithm']} detected",
                "detail": issue["reason"],
            }
        )

    for header in headers["missing"]:
        findings.append(
            {
                "severity": header["severity"],
                "category": "Headers",
                "title": f"Missing {header['label']}",
                "detail": header["description"],
            }
        )

    for port in ports:
        if port["risk"] in ("critical", "high", "medium"):
            findings.append(
                {
                    "severity": port["risk"],
                    "category": "Network",
                    "title": f"Open {port['service']} on port {port['port']}",
                    "detail": "Public service exposure increases attack surface and requires strict access controls.",
                }
            )

    if not redirect["redirects"]:
        findings.append(
            {
                "severity": "high",
                "category": "Transport",
                "title": "HTTP traffic does not force HTTPS",
                "detail": "Users may connect over plain HTTP. Configure permanent HTTP to HTTPS redirects.",
            }
        )

    return findings


def generate_insights(encryption: dict[str, Any], risk: dict[str, Any], findings: list[dict[str, str]]) -> list[dict[str, str]]:
    insights: list[dict[str, str]] = []

    if encryption["vulnerabilities"]:
        top = encryption["vulnerabilities"][0]
        insights.append(
            {
                "severity": top["risk_level"],
                "title": f"{top['algorithm']} encryption detected",
                "detail": "This may become vulnerable to quantum attacks. Prioritize migration to CRYSTALS-Kyber and CRYSTALS-Dilithium compatible stacks.",
            }
        )

    if encryption["protocol"] == "TLSv1.3":
        insights.append(
            {
                "severity": "info",
                "title": "TLS 1.3 is enabled",
                "detail": "Your transport layer uses the current best-practice TLS version.",
            }
        )
    elif encryption["protocol"] == "TLSv1.2":
        insights.append(
            {
                "severity": "medium",
                "title": "TLS 1.2 detected",
                "detail": "TLS 1.2 is still common, but upgrading to TLS 1.3 reduces legacy cipher exposure.",
            }
        )
    else:
        insights.append(
            {
                "severity": "critical",
                "title": f"Outdated protocol {encryption['protocol']}",
                "detail": "Legacy TLS versions significantly increase exploitability and should be deprecated immediately.",
            }
        )

    if not findings:
        insights.append(
            {
                "severity": "info",
                "title": "No major weaknesses detected",
                "detail": "Current scan did not reveal high-impact findings. Continue periodic monitoring.",
            }
        )
    elif risk["score"] < 50:
        insights.append(
            {
                "severity": "high",
                "title": "Security posture needs immediate remediation",
                "detail": "Multiple controls are failing. Address high and critical findings in the next sprint.",
            }
        )

    return insights


def generate_recommendations(
    encryption: dict[str, Any], headers: dict[str, Any], ports: list[dict[str, Any]], redirect: dict[str, Any]
) -> list[dict[str, str]]:
    recs: list[dict[str, str]] = []
    pqc_list = ", ".join(PQC_ALGORITHMS)

    for vuln in encryption["vulnerabilities"]:
        recs.append(
            {
                "priority": "high" if vuln["risk_level"] in ("critical", "high") else "medium",
                "title": f"Replace {vuln['algorithm']} with post-quantum roadmap",
                "description": f"{vuln['reason']} Build migration planning around {pqc_list}.",
            }
        )

    if encryption["protocol"] != "TLSv1.3":
        recs.append(
            {
                "priority": "high",
                "title": "Upgrade endpoint to TLS 1.3",
                "description": "TLS 1.3 removes legacy ciphers and reduces handshake attack surface.",
            }
        )

    for missing in headers["missing"]:
        recs.append(
            {
                "priority": "high" if missing["severity"] == "high" else "medium",
                "title": f"Set {missing['label']} header",
                "description": missing["description"],
            }
        )

    for port in ports:
        if port["risk"] in ("critical", "high"):
            recs.append(
                {
                    "priority": "high",
                    "title": f"Restrict access to {port['service']} ({port['port']})",
                    "description": "Limit exposure using allowlists, VPN, or private networking.",
                }
            )

    if not redirect["redirects"]:
        recs.append(
            {
                "priority": "high",
                "title": "Force HTTP to HTTPS redirects",
                "description": "Configure a permanent 301/308 redirect for all plain HTTP traffic.",
            }
        )

    recs.append(
        {
            "priority": "info",
            "title": "Run quarterly quantum-readiness review",
            "description": f"Track crypto inventory and evaluate {pqc_list} for phased adoption.",
        }
    )
    return recs


def build_chart_data(risk: dict[str, Any]) -> dict[str, Any]:
    breakdown = risk["breakdown"]

    def score_color(score: int) -> str:
        if score >= 80:
            return "#27d88f"
        if score >= 50:
            return "#f7b643"
        return "#ff5d5d"

    def score_level(score: int) -> str:
        if score >= 80:
            return "secure"
        if score >= 50:
            return "moderate"
        return "high_risk"

    risk_pie = [
        {"name": "SSL/TLS", "value": breakdown["ssl"]["score"], "color": score_color(breakdown["ssl"]["score"])},
        {"name": "Headers", "value": breakdown["headers"]["score"], "color": score_color(breakdown["headers"]["score"])},
        {"name": "Ports", "value": breakdown["ports"]["score"], "color": score_color(breakdown["ports"]["score"])},
        {"name": "Quantum", "value": breakdown["quantum"]["score"], "color": score_color(breakdown["quantum"]["score"])},
    ]

    risk_bar = [
        {"name": "SSL/TLS", "risk": score_level(breakdown["ssl"]["score"]), "value": breakdown["ssl"]["score"]},
        {"name": "Headers", "risk": score_level(breakdown["headers"]["score"]), "value": breakdown["headers"]["score"]},
        {"name": "Ports", "risk": score_level(breakdown["ports"]["score"]), "value": breakdown["ports"]["score"]},
        {"name": "Quantum", "risk": score_level(breakdown["quantum"]["score"]), "value": breakdown["quantum"]["score"]},
        {"name": "Redirect", "risk": score_level(breakdown["redirect"]["score"]), "value": breakdown["redirect"]["score"]},
    ]

    return {
        "risk_pie": risk_pie,
        "risk_bar": risk_bar,
        "score_gauge": {
            "score": risk["score"],
            "max": 100,
            "level": risk["level"],
        },
    }


@app.get("/")
def root() -> dict[str, str]:
    return {
        "status": "ok",
        "service": "QuantumShield AI",
        "version": "2.0.0",
    }


@app.get("/scan")
def scan(domain: str = Query(..., description="Domain to scan")) -> dict[str, Any]:
    target = clean_domain(domain)
    if not target:
        raise HTTPException(status_code=400, detail="Invalid domain")

    try:
        cert_info = get_cert_info(target)
    except socket.gaierror:
        raise HTTPException(status_code=404, detail=f"Domain '{target}' could not be resolved")
    except socket.timeout:
        raise HTTPException(status_code=504, detail=f"Connection to '{target}' timed out")
    except OSError as exc:
        raise HTTPException(status_code=502, detail=f"Could not connect to '{target}': {exc}")

    encryption = analyze_encryption(
        cert_info["cipher_suite"],
        cert_info["tls_version"],
        cert_info["key_bits"],
    )

    with ThreadPoolExecutor(max_workers=3) as executor:
        headers_future = executor.submit(fetch_headers, target)
        ports_future = executor.submit(scan_ports, target)
        redirect_future = executor.submit(check_https_redirect, target)

        headers = headers_future.result()
        ports = ports_future.result()
        redirect = redirect_future.result()

    risk = calculate_overall_risk(encryption, headers, ports, redirect)
    findings = build_findings(encryption, headers, ports, redirect)
    insights = generate_insights(encryption, risk, findings)
    recommendations = generate_recommendations(encryption, headers, ports, redirect)
    charts = build_chart_data(risk)

    cert = cert_info["cert"]
    subject = dict(x[0] for x in cert.get("subject", []))
    issuer = dict(x[0] for x in cert.get("issuer", []))
    try:
        ip_addresses = socket.gethostbyname_ex(target)[2]
    except OSError:
        ip_addresses = []

    return {
        "domain": target,
        "scanned_at": datetime.now(timezone.utc).isoformat(),
        "ip_addresses": ip_addresses,
        "domain_info": {
            "common_name": subject.get("commonName", "N/A"),
            "organization": subject.get("organizationName", "N/A"),
            "issuer": issuer.get("organizationName", "N/A"),
            "valid_from": cert.get("notBefore", "N/A"),
            "valid_until": cert.get("notAfter", "N/A"),
            "serial_number": cert.get("serialNumber", "N/A"),
            "san": [entry[1] for entry in cert.get("subjectAltName", [])],
        },
        "encryption": encryption,
        "headers": headers,
        "ports": ports,
        "http_redirect": redirect,
        "risk": risk,
        "findings": findings,
        "insights": insights,
        "recommendations": recommendations,
        "charts": charts,
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
