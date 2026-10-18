"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Flame, ShoppingBag, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";

interface OrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderDetails: {
    orderId?: string;
    deliverySlot: string;
    totalAmount: number;
    itemCount: number;
  } | null;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  isOpen,
  onClose,
  orderDetails,
}) => {
  useEffect(() => {
    if (isOpen) {
      // Confetti burst matching the yellow and red brand palette
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#FFD000", "#D90429", "#FB8500", "#FFFFFF"],
      });

      const timer = setTimeout(() => {
        confetti({
          particleCount: 40,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#FFD000", "#D90429"],
        });
        confetti({
          particleCount: 40,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#FFD000", "#D90429"],
        });
      }, 250);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!orderDetails) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with heavy blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotate: -3 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 30 }}
            transition={{ type: "spring", stiffness: 350, damping: 20 }}
            className="relative z-10 w-full max-w-sm overflow-hidden rounded-3xl border-4 border-black bg-gradient-to-b from-[#A0001E] to-[#60000E] p-6 text-center shadow-[8px_8px_0px_0px_#000]"
          >
            {/* Ambient gold glow behind the check icon */}
            <div className="absolute left-1/2 top-10 -translate-x-1/2 h-36 w-36 rounded-full bg-[#FFD000]/30 blur-2xl pointer-events-none" />

            {/* Animated Check badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 400, damping: 15 }}
              className="relative mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl border-3 border-black bg-[#FFD000] shadow-[3px_3px_0px_0px_#000]"
            >
              <motion.div
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <Check className="h-10 w-10 stroke-[3.5] text-black" />
              </motion.div>
            </motion.div>

            {/* Heading */}
            <span className="inline-block rounded-md border-2 border-black bg-[#FFD000] px-3 py-0.5 text-[10px] font-black uppercase tracking-widest text-black shadow-sm mb-2 rotate-[-1deg]">
              Order Confirmed &amp; In Queue
            </span>
            <h3 className="text-3xl font-black uppercase tracking-tight text-white font-display drop-shadow">
              BOWL BOOKED!
            </h3>
            <p className="mt-1 text-xs font-semibold text-amber-100/80">
              The kitchen has locked in your fresh pre-order slot.
            </p>

            {/* Receipt Card */}
            <div className="my-5 rounded-2xl border-2 border-black bg-[#850014] p-4 text-left shadow-inner space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-amber-200">
                <span>Selected Slot:</span>
                <span className="rounded-lg bg-black/40 px-2 py-0.5 font-black text-[#FFD000]">
                  {orderDetails.deliverySlot}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-amber-200">
                <span>Items Ordered:</span>
                <span className="font-black text-white">{orderDetails.itemCount} items</span>
              </div>
              <div className="flex items-center justify-between border-t border-black/40 pt-2 text-sm font-black text-white">
                <span>Total Paid:</span>
                <span className="text-lg font-black text-[#FFD000] font-display">
                  ₹{orderDetails.totalAmount}
                </span>
              </div>
            </div>

            {/* Dismiss CTA */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-black bg-[#FFD000] py-3 text-sm font-black uppercase tracking-wider text-black shadow-[3px_3px_0px_0px_#000] hover:bg-white hover:text-[#D90429] transition-all"
            >
              <span>Done &amp; Check Menu</span>
              <ArrowRight className="h-4 w-4 stroke-[3]" />
            </motion.button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};