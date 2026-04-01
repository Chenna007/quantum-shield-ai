"use client";

import { motion } from "framer-motion";
import { ScanResult } from "@/utils/api";

export default function InsightsCard({ data }: { data: ScanResult }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.3 }}
      className="rounded-2xl border border-slate-700/70 bg-slate-900/65 p-6"
    >
      <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-100">
        <span className="h-2 w-2 rounded-full bg-cyan-300" />
        Intelligent Insights
      </h3>

      <div className="space-y-3">
        {data.insights.map((insight, i) => (
          <motion.div
            key={`${insight.title}-${i}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            className="rounded-xl border border-slate-700 bg-slate-950/50 p-3"
          >
            <p className="text-sm font-semibold text-slate-100">{insight.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-400">{insight.detail}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
