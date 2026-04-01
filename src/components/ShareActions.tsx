"use client";

import { motion } from "framer-motion";
import { ScanResult } from "@/utils/api";
import {
  buildMailtoLink,
  buildWhatsappLink,
  downloadJsonReport,
  downloadPdfReport,
} from "@/utils/report";

interface ShareActionsProps {
  data: ScanResult;
  onToast: (message: string) => void;
}

function ActionButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="rounded-lg border border-cyan-300/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:border-cyan-300/50 hover:bg-cyan-400/15"
    >
      {label}
    </motion.button>
  );
}

export default function ShareActions({ data, onToast }: ShareActionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
      className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-700/70 bg-slate-900/70 p-4"
    >
      <div>
        <p className="text-sm font-semibold text-slate-100">Report & Sharing</p>
        <p className="text-xs text-slate-400">
          Export findings or share this scan instantly with your team.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <ActionButton
          label="Download PDF"
          onClick={() => {
            downloadPdfReport(data);
            onToast("Report downloaded (PDF)");
          }}
        />
        <ActionButton
          label="Download JSON"
          onClick={() => {
            downloadJsonReport(data);
            onToast("Report downloaded (JSON)");
          }}
        />
        <ActionButton
          label="Share via Email"
          onClick={() => {
            window.open(buildMailtoLink(data), "_self");
            onToast("Opening email client");
          }}
        />
        <ActionButton
          label="Share on WhatsApp"
          onClick={() => {
            window.open(buildWhatsappLink(data), "_blank", "noopener,noreferrer");
            onToast("Opening WhatsApp share");
          }}
        />
      </div>
    </motion.div>
  );
}
