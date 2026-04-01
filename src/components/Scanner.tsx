"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { scanDomain, ScanResult } from "@/utils/api";

interface ScannerProps {
  onResult: (result: ScanResult) => void;
  onError: (error: string) => void;
  onScanStart?: () => void;
}

export default function Scanner({ onResult, onError, onScanStart }: ScannerProps) {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain.trim()) return;
    setLoading(true);
    onError("");
    onScanStart?.();
    try {
      const result = await scanDomain(domain.trim());
      onResult(result);
    } catch (err) {
      onError(err instanceof Error ? err.message : "Scan failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleScan} className="w-full max-w-2xl mx-auto">
      <div className="relative flex items-center">
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="Enter domain or URL (e.g. microsoft.com)"
          disabled={loading}
          className="w-full rounded-2xl border border-slate-600/70 bg-slate-900/90 px-6 py-4 pr-40 text-lg text-slate-100 placeholder:text-slate-500 transition-all duration-300 focus:border-cyan-300 focus:outline-none focus:ring-1 focus:ring-cyan-300"
        />
        <motion.button
          type="submit"
          disabled={loading || !domain.trim()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="absolute right-2 rounded-xl bg-cyan-400 px-6 py-2.5 font-semibold text-slate-900 transition-colors duration-200 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <LoadingSpinner />
              Scanning target...
            </span>
          ) : (
            "Scan Your System"
          )}
        </motion.button>
      </div>
    </form>
  );
}

function LoadingSpinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
