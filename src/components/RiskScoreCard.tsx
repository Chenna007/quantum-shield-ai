"use client";

import { motion } from "framer-motion";
import { ScanResult } from "@/utils/api";

const riskColors: Record<string, string> = {
  low: "#22c55e",
  medium: "#f59e0b",
  high: "#f97316",
  critical: "#ef4444",
};

const riskBgColors: Record<string, string> = {
  low: "bg-success/10 border-success/30",
  medium: "bg-warning/10 border-warning/30",
  high: "bg-orange-500/10 border-orange-500/30",
  critical: "bg-danger/10 border-danger/30",
};

export default function RiskScoreCard({ data }: { data: ScanResult }) {
  const { score, level, label } = data.risk;
  const color = riskColors[level] || riskColors.medium;
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`bg-card border rounded-2xl p-6 ${riskBgColors[level]}`}
    >
      <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
        Quantum Risk Score
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
            <span className="text-xs text-muted">/100</span>
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
          <p className="text-xs text-muted mt-3">
            {score >= 80
              ? "Strong post-quantum readiness"
              : score >= 50
              ? "Moderate quantum vulnerability"
              : "Significant quantum risk detected"}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
