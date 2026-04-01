# QuantumShield AI

Production-ready Post-Quantum Cybersecurity Risk Detection Platform.

QuantumShield AI is a startup-grade cybersecurity SaaS project that scans internet-facing domains for transport and crypto weaknesses, quantifies security posture with a weighted risk engine, and delivers actionable remediation guidance.

## Why This Project Stands Out

- Real vulnerability scanning in FastAPI (no paid APIs)
- Advanced weighted risk engine with 0-100 score and risk bands
- Rule-based intelligent insights for quantum-era readiness
- Premium Next.js dashboard with animated charts and polished UX
- Downloadable reports (PDF + JSON) and instant share actions
- Deployable split architecture: Vercel frontend + Render/Railway backend

## Core Capabilities

### 1. Real Vulnerability Scanning (Backend)

- TLS/SSL handshake and certificate parsing
- Cipher suite and TLS protocol detection
- Open-port reconnaissance across common high-risk services
- Security header analysis with missing-header severity tagging
- HTTP to HTTPS redirect validation

### 2. Advanced Risk Engine

Weighted score across:

- SSL/TLS risk
- Header security risk
- Port exposure risk
- Quantum cryptography risk
- Transport redirect posture

Output:

- Overall Security Score (0-100)
- Risk Level: Secure, Moderate, High Risk
- Risk breakdown object for charting and reporting

### 3. Intelligent Insights Engine

Rule-based security intelligence (no external AI API), including guidance like:

- RSA and ECDHE quantum migration warnings
- TLS version hardening recommendations
- Header and network exposure prioritization

### 4. Premium Dashboard Experience

- Startup-grade landing and dashboard UI
- Framer Motion transitions and loading states
- Recharts visualizations:
  - Pie chart (risk distribution)
  - Bar chart (security metrics)
  - Gauge-style score card

### 5. Reporting and Sharing

- Download report as PDF
- Download full raw scan as JSON
- Share via prefilled email (`mailto:`)
- Share via WhatsApp (`wa.me`) with key findings
- Toast UX feedback for share/export actions

## Tech Stack

- Frontend: Next.js 14, TypeScript, Tailwind CSS, Framer Motion, Recharts, jsPDF
- Backend: FastAPI, Python socket/ssl/http clients
- Deployment: Vercel (frontend), Render or Railway (backend)

## Project Structure

```text
quantumshield-ai/
├── backend/
│   ├── app.py
│   └── requirements.txt
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   └── api/scan/route.ts
│   ├── components/
│   └── utils/
├── public/
├── package.json
└── README.md
```

## Local Development

### Prerequisites

- Node.js 20+ recommended
- Python 3.10+

### 1. Start Backend (FastAPI)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

Backend endpoint: `http://localhost:8000`

### 2. Start Frontend (Next.js)

```bash
npm install
cp .env.example .env.local
npm run dev
```

Frontend endpoint: `http://localhost:3000`

## Environment Variables

Use `.env.local` in the frontend root:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
BACKEND_API_URL=http://localhost:8000
```

Notes:

- Frontend client uses `NEXT_PUBLIC_API_URL`.
- Next API proxy route uses `BACKEND_API_URL` first, then falls back to `NEXT_PUBLIC_API_URL`.

## API Endpoints

### `GET /`

Health check.

### `GET /scan?domain=example.com`

Runs a real scan and returns:

- Domain certificate metadata
- TLS/cipher details
- Header posture and missing controls
- Open ports and exposure risks
- Findings, insights, recommendations
- Overall risk score and chart-ready data

## Deployment

## Frontend on Vercel

1. Push repository to GitHub.
2. Import project into Vercel.
3. Add env vars:
   - `NEXT_PUBLIC_API_URL=https://<your-backend-domain>`
   - `BACKEND_API_URL=https://<your-backend-domain>`
4. Deploy.

## Backend on Render

1. Create a new Web Service from your GitHub repo.
2. Root directory: `backend`
3. Build command:

```bash
pip install -r requirements.txt
```

4. Start command:

```bash
uvicorn app:app --host 0.0.0.0 --port 10000
```

## Backend on Railway

1. Create project from GitHub repo.
2. Set root directory to `backend`.
3. Start command:

```bash
uvicorn app:app --host 0.0.0.0 --port 10000
```

## GitHub Commands

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <repo_url>
git push -u origin main
```

## Demo Checklist

- Enter a target domain and run scan
- Review score, findings, and charts
- Download PDF and JSON report
- Share scan via email or WhatsApp

## License

MIT
