"use client";

import { motion } from "framer-motion";
import { ScanResult } from "@/utils/api";

const severityClass: Record<string, string> = {
  critical: "bg-rose-500/15 text-rose-300 border-rose-400/40",
  high: "bg-orange-500/15 text-orange-300 border-orange-400/40",
  medium: "bg-amber-500/15 text-amber-200 border-amber-400/40",
  low: "bg-emerald-500/15 text-emerald-300 border-emerald-400/40",
  info: "bg-cyan-500/15 text-cyan-300 border-cyan-400/40",
};

export default function FindingsCard({ data }: { data: ScanResult }) {
  const findings = data.findings;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.2 }}
      className="rounded-2xl border border-slate-700/70 bg-slate-900/65 p-6"
    >
      <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-100">
        <span className="h-2 w-2 rounded-full bg-cyan-300" />
        Vulnerability Findings
      </h3>
      <div className="space-y-2.5">
        {findings.length === 0 && (
          <p className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-sm text-emerald-200">
            No major findings detected in this scan.
          </p>
        )}
        {findings.slice(0, 10).map((finding, i) => (
          <motion.div
            key={`${finding.title}-${i}`}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 * i }}
            className="rounded-xl border border-slate-700 bg-slate-950/50 p-3"
          >
            <div className="mb-2 flex items-center gap-2">
              <span
                className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                  severityClass[finding.severity] || severityClass.info
                }`}
              >
                {finding.severity}
              </span>
              <span className="text-xs text-slate-400">{finding.category || "General"}</span>
            </div>
            <p className="text-sm font-semibold text-slate-100">{finding.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-400">{finding.detail}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
