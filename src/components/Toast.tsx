"use client";

import { AnimatePresence, motion } from "framer-motion";

interface ToastProps {
  message: string;
  visible: boolean;
}

export default function Toast({ message, visible }: ToastProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.22 }}
          className="fixed bottom-6 right-6 z-[90] rounded-xl border border-cyan-300/30 bg-slate-900/90 px-4 py-3 text-sm text-cyan-100 shadow-[0_8px_32px_rgba(34,211,238,0.22)]"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
