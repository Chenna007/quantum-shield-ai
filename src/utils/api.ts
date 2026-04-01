const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export interface SeverityItem {
  severity: string;
  category?: string;
  title: string;
  detail: string;
}

export interface ScanResult {
  domain: string;
  scanned_at: string;
  ip_addresses: string[];
  domain_info: {
    common_name: string;
    organization: string;
    issuer: string;
    valid_from: string;
    valid_until: string;
    serial_number: string;
    san: string[];
  };
  encryption: {
    cipher_suite: string;
    protocol: string;
    key_bits: number;
    vulnerabilities: {
      algorithm: string;
      risk_level: string;
      reason: string;
    }[];
    safe_components: {
      algorithm: string;
      risk_level: string;
      reason: string;
    }[];
  };
  headers: {
    present: { name: string; label: string; value: string }[];
    missing: {
      name: string;
      label: string;
      severity: string;
      description: string;
    }[];
    score: number;
  };
  ports: {
    port: number;
    service: string;
    risk: string;
    open: boolean;
  }[];
  http_redirect: {
    redirects: boolean;
    target?: string | null;
    status_code?: number | null;
  };
  risk: {
    score: number;
    level: string;
    label: string;
    breakdown: {
      ssl: { score: number; label: string };
      headers: { score: number; label: string };
      ports: { score: number; label: string };
      quantum: { score: number; label: string };
      redirect: { score: number; label: string };
    };
  };
  findings: SeverityItem[];
  insights: SeverityItem[];
  recommendations: {
    priority: string;
    title: string;
    description: string;
  }[];
  charts: {
    risk_pie: { name: string; value: number; color: string }[];
    risk_bar: { name: string; risk: string; value: number }[];
    score_gauge: { score: number; max: number; level: string };
  };
}

export async function scanDomain(domain: string): Promise<ScanResult> {
  const base = API_URL || "/api";
  const res = await fetch(`${base}/scan?domain=${encodeURIComponent(domain)}`);
  if (!res.ok) {
    const raw = await res.text();
    let detail = "Scan failed";
    try {
      const parsed = JSON.parse(raw) as { detail?: string };
      detail = parsed.detail || detail;
    } catch {
      if (raw?.trim()) {
        detail = raw.trim();
      }
    }
    throw new Error(detail || `Error ${res.status}`);
  }
  return res.json() as Promise<ScanResult>;
}
