"use client";

import { motion } from "framer-motion";
import { ScanResult } from "@/utils/api";

const priorityStyles: Record<string, string> = {
  high: "border-rose-400/30 bg-rose-500/10 text-rose-200",
  medium: "border-amber-400/30 bg-amber-500/10 text-amber-200",
  info: "border-cyan-300/30 bg-cyan-500/10 text-cyan-200",
};

const priorityIcons: Record<string, string> = {
  high: "!",
  medium: "~",
  info: "i",
};

export default function RecommendationCard({ data }: { data: ScanResult }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-2xl border border-slate-700/70 bg-slate-900/65 p-6"
    >
      <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-100">
        <span className="h-2 w-2 rounded-full bg-cyan-300" />
        Recommendations
      </h3>
      <div className="space-y-3">
        {data.recommendations.map((rec, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
            className={`p-4 rounded-xl border ${priorityStyles[rec.priority] || priorityStyles.info}`}
          >
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-current/10 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 border border-current/20">
                {priorityIcons[rec.priority] || "i"}
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-100">{rec.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-300">{rec.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
