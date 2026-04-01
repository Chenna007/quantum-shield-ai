"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Scanner from "@/components/Scanner";
import LoadingOverlay from "@/components/LoadingOverlay";
import DomainInfoCard from "@/components/DomainInfoCard";
import EncryptionCard from "@/components/EncryptionCard";
import RiskScoreCard from "@/components/RiskScoreCard";
import RecommendationCard from "@/components/RecommendationCard";
import { RiskPieChart, RiskBarChart, SecurityScoreGauge } from "@/components/Charts";
import { ScanResult } from "@/utils/api";

export default function Home() {
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState("");
  const [scanning, setScanning] = useState(false);

  const handleResult = (data: ScanResult) => {
    setResult(data);
    setScanning(false);
  };

  const handleError = (msg: string) => {
    setError(msg);
    if (msg) setScanning(false);
  };

  return (
    <main className="flex-1">
      {/* Gradient background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-card-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <span className="font-semibold text-lg">QuantumShield</span>
              <span className="text-xs px-2 py-0.5 bg-accent/10 text-accent-light rounded-full font-medium">
                AI
              </span>
            </div>
            <nav className="flex items-center gap-6 text-sm text-muted">
              <span className="hidden sm:inline hover:text-foreground transition-colors cursor-pointer">
                Docs
              </span>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-card border border-card-border rounded-full text-sm text-muted mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              Post-Quantum Security Analysis
            </motion.div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-foreground via-foreground to-muted bg-clip-text">
                QuantumShield{" "}
              </span>
              <span className="bg-gradient-to-r from-accent to-purple-400 bg-clip-text text-transparent">
                AI
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Post-Quantum Cybersecurity Risk Detection.
              <br />
              <span className="text-foreground/70">
                Scan any domain to assess quantum vulnerability and get actionable migration recommendations.
              </span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
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
                  className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-danger/10 border border-danger/20 text-danger text-sm rounded-xl"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Features grid when no results */}
          <AnimatePresence>
            {!result && !scanning && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-8"
              >
                {[
                  {
                    title: "Quantum Risk Analysis",
                    desc: "Detect RSA, ECDSA, and other quantum-vulnerable algorithms in your TLS configuration.",
                    icon: (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
                    ),
                  },
                  {
                    title: "Certificate Inspection",
                    desc: "Deep-dive into SSL/TLS certificates, cipher suites, and key exchange mechanisms.",
                    icon: (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    ),
                  },
                  {
                    title: "Migration Roadmap",
                    desc: "Get prioritized recommendations for transitioning to NIST-approved post-quantum algorithms.",
                    icon: (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
                    ),
                  },
                ].map((feature, i) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + i * 0.15 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="bg-card/50 border border-card-border rounded-2xl p-6 cursor-default"
                  >
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                      <svg className="w-5 h-5 text-accent-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        {feature.icon}
                      </svg>
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted leading-relaxed">{feature.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading state */}
          <AnimatePresence>
            {scanning && !result && <LoadingOverlay />}
          </AnimatePresence>
        </section>

        {/* Results Dashboard */}
        <AnimatePresence>
          {result && (
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-7xl mx-auto px-6 pb-20"
            >
              {/* Scanned domain badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-3 mb-10"
              >
                <span className="text-sm text-muted">Results for</span>
                <span className="px-3 py-1 bg-card border border-card-border rounded-lg font-mono text-sm text-accent-light">
                  {result.domain}
                </span>
                <span className="text-xs text-muted">
                  {new Date(result.scanned_at).toLocaleString()}
                </span>
              </motion.div>

              {/* Top row: Domain, Encryption, Risk Score */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <DomainInfoCard data={result} />
                <EncryptionCard data={result} />
                <RiskScoreCard data={result} />
              </div>

              {/* Charts row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <RiskPieChart data={result} />
                <RiskBarChart data={result} />
                <SecurityScoreGauge data={result} />
              </div>

              {/* Recommendations */}
              <RecommendationCard data={result} />
            </motion.section>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="border-t border-card-border/50 mt-auto">
          <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted">
              <div className="w-5 h-5 rounded bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              QuantumShield AI
            </div>
            <p className="text-xs text-muted">
              Post-Quantum Cybersecurity Risk Detection Platform
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
