import ssl
import socket
import json
import hashlib
import random
from datetime import datetime, timezone
from urllib.parse import urlparse

from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="QuantumShield AI",
    description="Post-Quantum Cybersecurity Risk Detection API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Quantum-vulnerable cipher suites and algorithms
QUANTUM_VULNERABLE = {
    "RSA": {"risk": "critical", "reason": "Vulnerable to Shor's algorithm"},
    "ECDSA": {"risk": "critical", "reason": "Vulnerable to Shor's algorithm on elliptic curves"},
    "ECDHE": {"risk": "high", "reason": "Elliptic curve key exchange vulnerable to quantum attacks"},
    "DHE": {"risk": "high", "reason": "Diffie-Hellman vulnerable to Shor's algorithm"},
    "DH": {"risk": "high", "reason": "Diffie-Hellman vulnerable to Shor's algorithm"},
    "DSA": {"risk": "critical", "reason": "Digital Signature Algorithm vulnerable to quantum factoring"},
}

QUANTUM_SAFE = {
    "AES-256": {"risk": "low", "reason": "Symmetric encryption with sufficient key length for post-quantum"},
    "AES-128": {"risk": "medium", "reason": "Symmetric encryption — increase to 256-bit for post-quantum safety"},
    "ChaCha20": {"risk": "low", "reason": "Symmetric stream cipher, quantum-resistant with sufficient key size"},
    "SHA-256": {"risk": "low", "reason": "Hash function with adequate output length"},
    "SHA-384": {"risk": "low", "reason": "Hash function with strong post-quantum security margin"},
}

POST_QUANTUM_ALGORITHMS = [
    "CRYSTALS-Kyber",
    "CRYSTALS-Dilithium",
    "FALCON",
    "SPHINCS+",
]


def clean_domain(raw: str) -> str:
    raw = raw.strip()
    if "://" in raw:
        raw = urlparse(raw).hostname or raw
    raw = raw.split("/")[0].split(":")[0]
    return raw.lower()


def get_cert_info(domain: str) -> dict:
    ctx = ssl.create_default_context()
    conn = ctx.wrap_socket(socket.socket(), server_hostname=domain)
    conn.settimeout(10)
    conn.connect((domain, 443))
    cert = conn.getpeercert()
    cipher = conn.cipher()
    version = conn.version()
    conn.close()
    return {"cert": cert, "cipher": cipher, "tls_version": version}


def analyze_encryption(cipher_info: tuple) -> dict:
    cipher_name = cipher_info[0]
    protocol = cipher_info[1]
    bits = cipher_info[2]

    components = cipher_name.replace("-", "_").split("_")

    vulnerabilities = []
    safe_components = []

    for comp in components:
        comp_upper = comp.upper()
        for algo, info in QUANTUM_VULNERABLE.items():
            if algo in comp_upper:
                vulnerabilities.append({
                    "algorithm": algo,
                    "risk_level": info["risk"],
                    "reason": info["reason"],
                })
        for algo, info in QUANTUM_SAFE.items():
            clean = algo.replace("-", "")
            if clean in comp_upper or algo.replace("-", "_") in comp_upper:
                safe_components.append({
                    "algorithm": algo,
                    "risk_level": info["risk"],
                    "reason": info["reason"],
                })

    return {
        "cipher_suite": cipher_name,
        "protocol": protocol,
        "key_bits": bits,
        "vulnerabilities": vulnerabilities,
        "safe_components": safe_components,
    }


def calculate_risk_score(encryption_analysis: dict, cert: dict) -> dict:
    score = 100  # Start at 100 (safest)

    # Deduct for vulnerabilities
    for v in encryption_analysis["vulnerabilities"]:
        if v["risk_level"] == "critical":
            score -= 30
        elif v["risk_level"] == "high":
            score -= 20
        elif v["risk_level"] == "medium":
            score -= 10

    # Deduct for weak key length
    if encryption_analysis["key_bits"] < 256:
        score -= 10

    # Deduct for older TLS
    if encryption_analysis["protocol"] in ("TLSv1", "TLSv1.1"):
        score -= 25
    elif encryption_analysis["protocol"] == "TLSv1.2":
        score -= 5

    # Bonus for safe components
    score += len(encryption_analysis["safe_components"]) * 5

    score = max(0, min(100, score))

    if score >= 80:
        level = "low"
        label = "Low Risk"
    elif score >= 50:
        level = "medium"
        label = "Medium Risk"
    elif score >= 25:
        level = "high"
        label = "High Risk"
    else:
        level = "critical"
        label = "Critical Risk"

    return {
        "score": score,
        "level": level,
        "label": label,
    }


def generate_recommendations(risk: dict, encryption: dict) -> list[dict]:
    recs = []

    for v in encryption["vulnerabilities"]:
        recs.append({
            "priority": "high" if v["risk_level"] in ("critical", "high") else "medium",
            "title": f"Migrate away from {v['algorithm']}",
            "description": f"{v['reason']}. Consider migrating to post-quantum alternatives like {random.choice(POST_QUANTUM_ALGORITHMS)}.",
        })

    if encryption["key_bits"] < 256:
        recs.append({
            "priority": "medium",
            "title": "Increase key length to 256-bit",
            "description": "Grover's algorithm effectively halves symmetric key strength. Use AES-256 for post-quantum safety.",
        })

    if encryption["protocol"] != "TLSv1.3":
        recs.append({
            "priority": "high",
            "title": "Upgrade to TLS 1.3",
            "description": "TLS 1.3 removes legacy algorithms and improves security posture.",
        })

    recs.append({
        "priority": "info",
        "title": "Plan post-quantum migration",
        "description": f"Begin evaluating NIST-approved PQC algorithms: {', '.join(POST_QUANTUM_ALGORITHMS)}.",
    })

    return recs


def build_chart_data(encryption: dict, risk: dict) -> dict:
    vuln_count = len(encryption["vulnerabilities"])
    safe_count = len(encryption["safe_components"])

    risk_breakdown = []
    for v in encryption["vulnerabilities"]:
        risk_breakdown.append({"name": v["algorithm"], "risk": v["risk_level"], "value": 30 if v["risk_level"] == "critical" else 20})
    for s in encryption["safe_components"]:
        risk_breakdown.append({"name": s["algorithm"], "risk": s["risk_level"], "value": 10 if s["risk_level"] == "medium" else 5})

    return {
        "risk_pie": [
            {"name": "Vulnerable", "value": vuln_count, "color": "#ef4444"},
            {"name": "Safe", "value": max(safe_count, 1), "color": "#22c55e"},
        ],
        "risk_bar": risk_breakdown if risk_breakdown else [{"name": "Baseline", "risk": "low", "value": 10}],
        "score_gauge": {
            "score": risk["score"],
            "max": 100,
            "level": risk["level"],
        },
    }


@app.get("/")
def root():
    return {"status": "ok", "service": "QuantumShield AI", "version": "1.0.0"}


@app.get("/scan")
def scan(domain: str = Query(..., description="Domain to scan")):
    domain = clean_domain(domain)
    if not domain:
        raise HTTPException(status_code=400, detail="Invalid domain")

    try:
        info = get_cert_info(domain)
    except socket.gaierror:
        raise HTTPException(status_code=404, detail=f"Domain '{domain}' could not be resolved")
    except socket.timeout:
        raise HTTPException(status_code=504, detail=f"Connection to '{domain}' timed out")
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Could not connect to '{domain}': {str(e)}")

    cert = info["cert"]
    encryption = analyze_encryption(info["cipher"])
    risk = calculate_risk_score(encryption, cert)
    recommendations = generate_recommendations(risk, encryption)
    charts = build_chart_data(encryption, risk)

    # Extract cert metadata
    subject = dict(x[0] for x in cert.get("subject", []))
    issuer = dict(x[0] for x in cert.get("issuer", []))

    return {
        "domain": domain,
        "scanned_at": datetime.now(timezone.utc).isoformat(),
        "domain_info": {
            "common_name": subject.get("commonName", "N/A"),
            "organization": subject.get("organizationName", "N/A"),
            "issuer": issuer.get("organizationName", "N/A"),
            "valid_from": cert.get("notBefore", "N/A"),
            "valid_until": cert.get("notAfter", "N/A"),
            "serial_number": cert.get("serialNumber", "N/A"),
            "san": [entry[1] for entry in cert.get("subjectAltName", [])],
        },
        "encryption": {
            "cipher_suite": encryption["cipher_suite"],
            "protocol": encryption["protocol"],
            "key_bits": encryption["key_bits"],
            "vulnerabilities": encryption["vulnerabilities"],
            "safe_components": encryption["safe_components"],
        },
        "risk": risk,
        "recommendations": recommendations,
        "charts": charts,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
