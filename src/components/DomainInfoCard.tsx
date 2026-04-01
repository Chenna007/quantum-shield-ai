"use client";

import { motion } from "framer-motion";
import { ScanResult } from "@/utils/api";

export default function DomainInfoCard({ data }: { data: ScanResult }) {
  const info = data.domain_info;
  const rows = [
    { label: "Common Name", value: info.common_name },
    { label: "Organization", value: info.organization },
    { label: "Issuer", value: info.issuer },
    { label: "Valid From", value: info.valid_from },
    { label: "Valid Until", value: info.valid_until },
    { label: "Serial Number", value: info.serial_number },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card border border-card-border rounded-2xl p-6"
    >
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-accent" />
        Domain Information
      </h3>
      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between items-center text-sm">
            <span className="text-muted">{row.label}</span>
            <span className="text-foreground font-mono text-xs max-w-[60%] truncate text-right">
              {row.value}
            </span>
          </div>
        ))}
        {info.san.length > 0 && (
          <div className="pt-3 border-t border-card-border">
            <span className="text-muted text-sm">Subject Alt Names</span>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {info.san.slice(0, 5).map((san) => (
                <span
                  key={san}
                  className="px-2 py-0.5 text-xs bg-accent/10 text-accent-light rounded-md font-mono"
                >
                  {san}
                </span>
              ))}
              {info.san.length > 5 && (
                <span className="px-2 py-0.5 text-xs text-muted">
                  +{info.san.length - 5} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
