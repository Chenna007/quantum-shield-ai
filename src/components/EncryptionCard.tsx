"use client";

import { motion } from "framer-motion";
import { ScanResult } from "@/utils/api";

export default function EncryptionCard({ data }: { data: ScanResult }) {
  const enc = data.encryption;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="rounded-2xl border border-slate-700/70 bg-slate-900/65 p-6"
    >
      <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-100">
        <span className="h-2 w-2 rounded-full bg-cyan-300" />
        Encryption Details
      </h3>
      <div className="mb-5 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Cipher Suite</span>
          <span className="font-mono text-xs text-slate-100">{enc.cipher_suite}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">TLS Version</span>
          <span className="font-mono text-xs text-slate-100">{enc.protocol}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Key Length</span>
          <span className="font-mono text-xs text-slate-100">{enc.key_bits}-bit</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Header Score</span>
          <span className="font-mono text-xs text-slate-100">{data.headers.score}/100</span>
        </div>
      </div>

      {enc.vulnerabilities.length > 0 && (
        <div className="mb-4">
          <p className="mb-2 text-sm font-medium text-rose-300">Quantum-Vulnerable Components</p>
          <div className="space-y-2">
            {enc.vulnerabilities.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-start gap-2 text-xs"
              >
                <span
                  className={`mt-0.5 px-1.5 py-0.5 rounded font-medium uppercase ${
                    v.risk_level === "critical"
                      ? "bg-rose-500/20 text-rose-200"
                      : "bg-amber-500/20 text-amber-200"
                  }`}
                >
                  {v.risk_level}
                </span>
                <div>
                  <span className="font-semibold text-slate-100">{v.algorithm}</span>
                  <span className="ml-1 text-slate-400">- {v.reason}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {enc.safe_components.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium text-emerald-300">Quantum-Safe Components</p>
          <div className="flex flex-wrap gap-2">
            {enc.safe_components.map((s, i) => (
              <span
                key={i}
                className="rounded-md bg-emerald-500/10 px-2 py-1 font-mono text-xs text-emerald-200"
              >
                {s.algorithm}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
