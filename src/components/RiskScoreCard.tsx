"use client";

import { motion } from "framer-motion";
import { ScanResult } from "@/utils/api";

const riskColors: Record<string, string> = {
  secure: "#27d88f",
  moderate: "#f7b643",
  high_risk: "#ff5d5d",
};

const riskBgColors: Record<string, string> = {
  secure: "bg-emerald-500/10 border-emerald-400/30",
  moderate: "bg-amber-500/10 border-amber-400/30",
  high_risk: "bg-rose-500/10 border-rose-400/30",
};

export default function RiskScoreCard({ data }: { data: ScanResult }) {
  const { score, level, label } = data.risk;
  const color = riskColors[level] || riskColors.moderate;
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`rounded-2xl border p-6 ${riskBgColors[level] || riskBgColors.moderate}`}
    >
      <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold text-slate-100">
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
        Overall Security Score
      </h3>

      <div className="flex flex-col items-center">
        <div className="relative w-36 h-36">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-card-border"
            />
            <motion.circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke={color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className="text-3xl font-bold"
              style={{ color }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              {score}
            </motion.span>
            <span className="text-xs text-slate-400">/100</span>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-4 text-center"
        >
          <span
            className="px-3 py-1 rounded-full text-sm font-semibold"
            style={{ backgroundColor: `${color}20`, color }}
          >
            {label}
          </span>
          <p className="mt-3 text-xs text-slate-300">
            {score >= 80
              ? "Security controls look strong across transport and exposure"
              : score >= 50
              ? "Moderate risk posture with clear remediation priorities"
              : "High risk posture detected. Immediate hardening required"}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
