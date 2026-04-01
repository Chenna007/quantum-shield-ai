const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface ScanResult {
  domain: string;
  scanned_at: string;
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
  risk: {
    score: number;
    level: string;
    label: string;
  };
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
  const res = await fetch(`${API_URL}/scan?domain=${encodeURIComponent(domain)}`);
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Scan failed" }));
    throw new Error(error.detail || `Error ${res.status}`);
  }
  return res.json();
}
