"use client";

import { motion } from "framer-motion";
import { ScanResult } from "@/utils/api";

export default function EncryptionCard({ data }: { data: ScanResult }) {
  const enc = data.encryption;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-card border border-card-border rounded-2xl p-6"
    >
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-accent" />
        Encryption Details
      </h3>
      <div className="space-y-3 mb-5">
        <div className="flex justify-between text-sm">
          <span className="text-muted">Cipher Suite</span>
          <span className="font-mono text-xs text-foreground">{enc.cipher_suite}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted">Protocol</span>
          <span className="font-mono text-xs text-foreground">{enc.protocol}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted">Key Length</span>
          <span className="font-mono text-xs text-foreground">{enc.key_bits}-bit</span>
        </div>
      </div>

      {enc.vulnerabilities.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium text-danger mb-2">Quantum-Vulnerable Components</p>
          <div className="space-y-2">
            {enc.vulnerabilities.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-start gap-2 text-xs"
              >
                <span
                  className={`mt-0.5 px-1.5 py-0.5 rounded font-medium uppercase ${
                    v.risk_level === "critical"
                      ? "bg-danger/20 text-danger"
                      : "bg-warning/20 text-warning"
                  }`}
                >
                  {v.risk_level}
                </span>
                <div>
                  <span className="font-semibold text-foreground">{v.algorithm}</span>
                  <span className="text-muted ml-1">— {v.reason}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {enc.safe_components.length > 0 && (
        <div>
          <p className="text-sm font-medium text-success mb-2">Quantum-Safe Components</p>
          <div className="flex flex-wrap gap-2">
            {enc.safe_components.map((s, i) => (
              <span
                key={i}
                className="px-2 py-1 text-xs bg-success/10 text-success rounded-md font-mono"
              >
                {s.algorithm}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
