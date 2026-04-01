# QuantumShield AI

**Post-Quantum Cybersecurity Risk Detection Platform**

Scan any domain to detect quantum-vulnerable encryption and get actionable recommendations for migrating to post-quantum cryptography standards.

![Next.js](https://img.shields.io/badge/Next.js-000?logo=nextdotjs&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)

---

## Features

- **Quantum Risk Scoring** — Identifies RSA, ECDSA, DHE, and other algorithms vulnerable to Shor's algorithm
- **Certificate Analysis** — Deep inspection of SSL/TLS certificates, cipher suites, and key exchange
- **Visual Dashboard** — Risk distribution charts, encryption component analysis, and security score gauges
- **Migration Recommendations** — Prioritized guidance for transitioning to NIST-approved PQC algorithms (CRYSTALS-Kyber, Dilithium, FALCON, SPHINCS+)
- **Smooth Animations** — Framer Motion page transitions, loading states, and hover effects

---

## Tech Stack

| Layer    | Technology                          |
| -------- | ----------------------------------- |
| Frontend | Next.js, Tailwind CSS, Framer Motion, Recharts |
| Backend  | Python FastAPI                      |
| Charts   | Recharts (Pie, Bar, Radial)         |

---

## Project Structure

```
quantumshield-ai/
├── src/
│   ├── app/            # Pages & layout
│   ├── components/     # UI components
│   └── utils/          # API client
├── backend/
│   ├── app.py          # FastAPI server
│   └── requirements.txt
├── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js >= 20
- Python >= 3.10

### 1. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate    # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --reload
```

The API will be running at `http://localhost:8000`.

### 2. Frontend

```bash
npm install
cp .env.example .env.local   # Set NEXT_PUBLIC_API_URL
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## API Endpoints

| Method | Endpoint         | Description                    |
| ------ | ---------------- | ------------------------------ |
| GET    | `/`              | Health check                   |
| GET    | `/scan?domain=`  | Scan domain for quantum risks  |

### Example

```bash
curl "http://localhost:8000/scan?domain=google.com"
```

---

## Deployment

### Frontend — Vercel

1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Add environment variable:
   - `NEXT_PUBLIC_API_URL` = your deployed backend URL
6. Click **Deploy**

### Backend — Render

1. Go to [render.com](https://render.com) and create a new **Web Service**
2. Connect your GitHub repository
3. Set:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app:app --host 0.0.0.0 --port $PORT`
4. Deploy

### Backend — Railway

1. Go to [railway.app](https://railway.app) and create a new project
2. Connect your GitHub repository
3. Set the **Root Directory** to `backend`
4. Add start command: `uvicorn app:app --host 0.0.0.0 --port $PORT`
5. Deploy

---

## Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: QuantumShield AI platform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/quantumshield-ai.git
git push -u origin main
```

---

## License

MIT
