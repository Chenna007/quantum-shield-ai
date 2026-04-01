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
      className="rounded-2xl border border-slate-700/70 bg-slate-900/65 p-6"
    >
      <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-100">
        <span className="h-2 w-2 rounded-full bg-cyan-300" />
        Domain Information
      </h3>
      <div className="space-y-3 text-slate-200">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between items-center text-sm">
            <span className="text-slate-400">{row.label}</span>
            <span className="max-w-[60%] truncate text-right font-mono text-xs text-slate-100">
              {row.value}
            </span>
          </div>
        ))}
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-400">Resolved IPs</span>
          <span className="max-w-[60%] truncate text-right font-mono text-xs text-slate-100">
            {data.ip_addresses.length ? data.ip_addresses.join(", ") : "N/A"}
          </span>
        </div>
        {info.san.length > 0 && (
          <div className="border-t border-slate-700 pt-3">
            <span className="text-sm text-slate-400">Subject Alt Names</span>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {info.san.slice(0, 5).map((san) => (
                <span
                  key={san}
                  className="rounded-md bg-cyan-400/10 px-2 py-0.5 font-mono text-xs text-cyan-200"
                >
                  {san}
                </span>
              ))}
              {info.san.length > 5 && (
                <span className="px-2 py-0.5 text-xs text-slate-400">
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
