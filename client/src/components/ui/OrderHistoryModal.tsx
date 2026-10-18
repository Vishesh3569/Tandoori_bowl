"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Receipt, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import api from "../../lib/api";

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({ isOpen, onClose }) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      api
        .get("/orders/my-orders")
        .then((res) => setOrders(res.data.data || []))
        .catch((err) => console.error("Error fetching orders:", err))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

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
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            className="relative z-10 w-full max-w-lg rounded-3xl border-3 border-black bg-[#60000E] p-6 shadow-2xl max-h-[85vh] flex flex-col justify-between"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b-2 border-black/40">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFD000] text-black border-2 border-black shadow-sm">
                  <Receipt className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight text-[#FFD000] font-display">
                    Your Order History
                  </h3>
                  <p className="text-[10px] font-black uppercase text-amber-100/70">
                    Past Tandoori Bowl Pre-Orders
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-xl border border-black/30 p-1.5 text-white hover:bg-black transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Orders Feed */}
            <div className="flex-1 overflow-y-auto my-4 space-y-3 pr-1">
              {loading ? (
                <div className="py-12 text-center text-sm font-black uppercase text-[#FFD000] animate-pulse">
                  Fetching your bowls...
                </div>
              ) : orders.length === 0 ? (
                <div className="py-12 text-center text-amber-200/60">
                  <Receipt className="h-12 w-12 mx-auto mb-2 opacity-30 text-[#FFD000]" />
                  <p className="font-black uppercase text-sm">No past orders yet</p>
                  <p className="text-xs">Your booked slots will show up right here.</p>
                </div>
              ) : (
                orders.map((order) => (
                  <div
                    key={order._id}
                    className="rounded-2xl border-2 border-black bg-[#850014] p-4 shadow-md space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-white uppercase tracking-wider">
                        Slot: {order.deliverySlot}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase border border-black ${
                          order.paymentStatus === "paid"
                            ? "bg-emerald-400 text-black"
                            : "bg-amber-400 text-black"
                        }`}
                      >
                        {order.paymentStatus === "paid" ? "PAID (UPI)" : "PAYMENT PENDING"}
                      </span>
                    </div>

                    <div className="space-y-1 py-1 border-y border-black/20">
                      {order.items.map((it: any, idx: number) => (
                        <div key={idx} className="flex justify-between text-xs text-amber-100 font-semibold">
                          <span>
                            {it.quantity}x {it.name}
                          </span>
                          <span className="font-bold text-[#FFD000]">₹{it.price * it.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] font-medium text-amber-200/70">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span className="text-base font-black text-[#FFD000] font-display">
                        Total: ₹{order.subtotal}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={onClose}
              className="w-full rounded-xl border-2 border-black bg-[#FFD000] py-2.5 text-xs font-black uppercase tracking-wider text-black hover:bg-white transition-all shadow-[2px_2px_0px_0px_#000]"
            >
              Close History
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};