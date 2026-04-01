"use client";

import { motion } from "framer-motion";
import { ScanResult } from "@/utils/api";

const priorityStyles: Record<string, string> = {
  high: "bg-danger/10 text-danger border-danger/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  info: "bg-accent/10 text-accent-light border-accent/20",
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
      className="bg-card border border-card-border rounded-2xl p-6"
    >
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-accent" />
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
                <p className="font-semibold text-sm text-foreground">{rec.title}</p>
                <p className="text-xs text-muted mt-1 leading-relaxed">{rec.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
