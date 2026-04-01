"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Scanner from "@/components/Scanner";
import LoadingOverlay from "@/components/LoadingOverlay";
import DomainInfoCard from "@/components/DomainInfoCard";
import EncryptionCard from "@/components/EncryptionCard";
import RiskScoreCard from "@/components/RiskScoreCard";
import RecommendationCard from "@/components/RecommendationCard";
import FindingsCard from "@/components/FindingsCard";
import InsightsCard from "@/components/InsightsCard";
import ShareActions from "@/components/ShareActions";
import Toast from "@/components/Toast";
import HeroBackground from "@/components/HeroBackground";
import { RiskPieChart, RiskBarChart, SecurityScoreGauge } from "@/components/Charts";
import { ScanResult } from "@/utils/api";

export default function Home() {
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState("");
  const [scanning, setScanning] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2400);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleResult = (data: ScanResult) => {
    setResult(data);
    setScanning(false);
  };

  const handleError = (msg: string) => {
    setError(msg);
    if (msg) setScanning(false);
  };

  return (
    <main className="relative flex-1 overflow-hidden bg-slate-950">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -left-28 top-0 h-[460px] w-[460px] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute right-0 top-24 h-[520px] w-[520px] rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 h-[360px] w-[360px] rounded-full bg-rose-500/10 blur-[120px]" />
      </div>

      <div className="relative z-10">
        <header className="sticky top-0 z-50 border-b border-slate-800/70 bg-slate-950/80 backdrop-blur">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-300/30 bg-cyan-400/10">
                <svg className="h-5 w-5 text-cyan-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-100">QuantumShield AI</p>
                <p className="text-[11px] uppercase tracking-[0.18em] text-cyan-300/80">Security Cloud</p>
              </div>
            </div>
            <p className="hidden text-xs text-slate-400 sm:block">Post-Quantum Cybersecurity Risk Detection</p>
          </div>
        </header>

        <section className="mx-auto max-w-7xl px-6 pb-14 pt-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative mb-12 rounded-3xl border border-slate-800/50 bg-slate-900/35 px-6 py-10 text-center"
          >
            <HeroBackground />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-1.5 text-xs uppercase tracking-widest text-cyan-200"
            >
              <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300" />
              Startup-grade cyber intelligence
            </motion.div>

            <h1 className="mx-auto max-w-5xl text-5xl font-semibold tracking-tight text-slate-100 sm:text-6xl lg:text-7xl">
              QuantumShield AI
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-base text-slate-300 sm:text-xl">
              Post-Quantum Cybersecurity Risk Detection.
              Scan internet-facing assets for encryption weaknesses, header gaps, port exposure, and transport risks.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.45 }}
              className="mt-10"
            >
              <Scanner
                onResult={handleResult}
                onError={handleError}
                onScanStart={() => {
                  setScanning(true);
                  setResult(null);
                  setError("");
                }}
              />
            </motion.div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mx-auto mt-6 inline-flex items-center gap-2 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-2 text-sm text-rose-200"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <AnimatePresence>
            {!result && !scanning && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.4 }}
                className="mx-auto grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-3"
              >
                {[
                  {
                    title: "Real Recon Engine",
                    desc: "Live port exposure checks, TLS handshakes, and security header analysis.",
                  },
                  {
                    title: "Advanced Risk Scoring",
                    desc: "Weighted scoring across SSL, headers, ports, redirects, and quantum risk.",
                  },
                  {
                    title: "Instant Reporting",
                    desc: "Download PDF/JSON reports and share findings with one click.",
                  },
                ].map((feature, i) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 + i * 0.12 }}
                    className="rounded-2xl border border-slate-700/70 bg-slate-900/65 p-5"
                  >
                    <p className="text-sm font-semibold text-cyan-200">{feature.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">{feature.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>{scanning && !result && <LoadingOverlay />}</AnimatePresence>
        </section>

        <AnimatePresence>
          {result && (
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45 }}
              className="mx-auto max-w-7xl px-6 pb-16"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 flex flex-wrap items-center justify-center gap-3"
              >
                <span className="text-xs uppercase tracking-wider text-slate-400">Scan target</span>
                <span className="rounded-lg border border-cyan-300/30 bg-cyan-500/10 px-3 py-1 font-mono text-sm text-cyan-200">
                  {result.domain}
                </span>
                <span className="text-xs text-slate-400">{new Date(result.scanned_at).toLocaleString()}</span>
              </motion.div>

              <ShareActions data={result} onToast={setToast} />

              <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                <DomainInfoCard data={result} />
                <EncryptionCard data={result} />
                <RiskScoreCard data={result} />
              </div>

              <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                <RiskPieChart data={result} />
                <RiskBarChart data={result} />
                <SecurityScoreGauge data={result} />
              </div>

              <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <FindingsCard data={result} />
                <InsightsCard data={result} />
              </div>

              <RecommendationCard data={result} />
            </motion.section>
          )}
        </AnimatePresence>

        <footer className="border-t border-slate-800/70">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-8 text-xs text-slate-500 sm:flex-row">
            <p>QuantumShield AI</p>
            <p>Post-Quantum Cybersecurity Risk Detection Platform</p>
            <p>Designed and developed by Chenna Keshava</p>
          </div>
        </footer>
      </div>

      <Toast message={toast} visible={Boolean(toast)} />
    </main>
  );
}
