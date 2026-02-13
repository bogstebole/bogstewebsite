"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface RetroWindowProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function RetroWindow({ isOpen, onClose, title = "SYSTEM", children }: RetroWindowProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 pointer-events-auto"
            onClick={onClose}
          />

          {/* Window Container */}
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 100 }}
            animate={{ 
              scale: 1, 
              opacity: 1, 
              y: 0,
              transition: { type: "spring", bounce: 0.4, duration: 0.8 } 
            }}
            exit={{ 
              scale: 0, 
              opacity: 0, 
              y: 100,
              transition: { duration: 0.3 } 
            }}
            className="relative w-full max-w-5xl h-[85vh] bg-[#1a1a2e] border-4 border-[#4ade80] shadow-[0_0_40px_rgba(74,222,128,0.3)] pointer-events-auto overflow-hidden flex flex-col retro-window-clip"
            style={{
              clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)"
            }}
          >
            {/* CRT Effects */}
            <div className="absolute inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))]" style={{ backgroundSize: "100% 2px, 3px 100%" }} />
            <div className="absolute inset-0 pointer-events-none z-50 opacity-10 animate-flicker mix-blend-overlay bg-white" />

            {/* Header Bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#4ade80]/10 border-b-2 border-[#4ade80] relative z-40">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-[#fbbf24] rounded-full animate-pulse" />
                <h2 className="font-mono text-[#4ade80] text-sm tracking-wider uppercase font-bold" style={{ fontFamily: '"Press Start 2P", monospace', textShadow: "0 0 10px rgba(74,222,128,0.5)" }}>
                  {title}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="group relative p-1.5 hover:bg-[#4ade80]/20 transition-colors rounded-sm"
              >
                <X className="w-5 h-5 text-[#4ade80] group-hover:text-white transition-colors" />
                <div className="absolute inset-0 border border-[#4ade80] opacity-0 group-hover:opacity-100 rounded-sm" />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 relative overflow-hidden bg-[#0f0f1a]">
              {/* Inner bezel shadow */}
              <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_60px_rgba(0,0,0,0.8)] z-30" />
              
              <div className="relative h-full overflow-y-auto">
                {children}
              </div>
            </div>

            {/* Footer Status Bar */}
            <div className="px-4 py-1.5 bg-[#4ade80]/5 border-t border-[#4ade80]/30 flex justify-between items-center text-[10px] font-mono text-[#4ade80]/60 z-40">
              <span>MEM: 64KB OK</span>
              <span className="animate-pulse">_CURSOR_ACTIVE</span>
            </div>
            
            {/* Decor corner */}
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-[#4ade80] clip-corner z-40" style={{ clipPath: "polygon(100% 0, 0 100%, 100% 100%)" }} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
