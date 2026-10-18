"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, Calendar } from "lucide-react";
import { PREORDER_SCHEDULE } from "../../lib/timeUtils";

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="relative z-10 w-full max-w-md rounded-2xl border-2 border-tandoori-yellow/30 bg-tandoori-charcoal p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-4 border-b border-tandoori-border">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-tandoori-red/20 text-tandoori-yellow">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-wider text-tandoori-cream font-display">
                    Pre-Order Timings
                  </h3>
                  <p className="text-xs text-zinc-400">Tandoori Bowl Kitchen Schedule</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 space-y-2.5">
              {PREORDER_SCHEDULE.map((slot) => (
                <div
                  key={slot.day}
                  className="flex items-center justify-between rounded-xl bg-tandoori-card px-4 py-3 border border-tandoori-border/60 hover:border-tandoori-yellow/40 transition-colors"
                >
                  <span className="font-semibold text-zinc-200">{slot.day}</span>
                  <div className="flex items-center gap-1.5 text-sm font-bold text-tandoori-yellow">
                    <Clock className="h-4 w-4" />
                    <span>{slot.time}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl bg-tandoori-red/10 p-3.5 border border-tandoori-red/30 text-center">
              <p className="text-xs font-semibold text-tandoori-yellow">
                Orders placed during the 11 AM - 3 PM window are delivered fresh the same day.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};