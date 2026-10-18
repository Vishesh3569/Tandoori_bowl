"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, ChevronRight, AlertCircle } from "lucide-react";
import { getPreorderStatus } from "../../lib/timeUtils";
import { ScheduleModal } from "../ui/ScheduleModal";
import { PreorderStatus } from "../../types";

export const PreorderBanner: React.FC = () => {
  const [status, setStatus] = useState<PreorderStatus | null>(null);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  useEffect(() => {
    setStatus(getPreorderStatus());
    const timer = setInterval(() => {
      setStatus(getPreorderStatus());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  if (!status) {
    return (
      <div className="w-full bg-[#A0001E] py-2 text-center text-xs font-bold text-[#FFD000]">
        Checking pre-order kitchen hours...
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        onClick={() => setIsScheduleOpen(true)}
        className={`w-full cursor-pointer border-b-2 border-black/20 py-2.5 transition-colors ${
          status.isOpen
            ? "bg-[#D90429] text-[#FFD000] hover:bg-[#B50322]"
            : "bg-[#47000B] text-[#FFD000] hover:bg-[#5E000F]"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 text-xs sm:text-sm font-black tracking-wide">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#FFD000] px-2 py-0.5 text-[10px] font-black uppercase text-black">
              {status.isOpen ? "ACTIVE" : "NOTICE"}
            </span>
            <span>{status.message}</span>
          </div>

          <div className="flex items-center gap-1 text-xs underline font-bold group">
            <Clock className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">11 AM - 3 PM Hours</span>
            <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </motion.div>

      <ScheduleModal isOpen={isScheduleOpen} onClose={() => setIsScheduleOpen(false)} />
    </>
  );
};