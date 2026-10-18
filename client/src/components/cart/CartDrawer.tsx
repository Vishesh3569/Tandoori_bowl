"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "../../store/useCartStore";
import { useAuthStore } from "../../store/useAuthStore";
import api from "../../lib/api";
import { CartItemRow } from "./CartItemRow";
import { OrderSuccessModal } from "../ui/OrderSuccessModal";

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const CartDrawer: React.FC = () => {
  const { isOpen, closeCart, items, getTotalPrice, getTotalItems, clearCart } = useCartStore();
  const { user, openAuthModal, token } = useAuthStore();
  const [selectedSlot, setSelectedSlot] = useState("11:30 AM - 12:30 PM");
  const [loading, setLoading] = useState(false);

  // Success Modal State
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<{
    orderId?: string;
    deliverySlot: string;
    totalAmount: number;
    itemCount: number;
  } | null>(null);

  const subtotal = getTotalPrice();
  const totalItemCount = getTotalItems();

  const handleCheckout = async () => {
    if (!user || !token) {
      closeCart();
      openAuthModal();
      return;
    }

    try {
      setLoading(true);

      const orderRes = await api.post("/orders", {
        items: items.map((i) => ({
          menuItemId: i.menuItem._id,
          quantity: i.quantity,
        })),
        deliverySlot: selectedSlot,
      });

      // === BYPASS / SIMULATION SUCCESS ===
      if (orderRes.data.bypassPayment) {
        setConfirmedOrder({
          orderId: orderRes.data.order._id,
          deliverySlot: selectedSlot,
          totalAmount: subtotal,
          itemCount: totalItemCount,
        });
        clearCart();
        closeCart();
        setIsSuccessOpen(true);
        return;
      }

      // === RAZORPAY UPI GATEWAY ===
      const resLoaded = await loadRazorpayScript();
      if (!resLoaded) {
        alert("Unable to load Razorpay payment gateway. Please check your internet connection.");
        return;
      }

      const { order, razorpayOrder } = orderRes.data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.trim() || "",
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Tandoori Bowl",
        description: `Pre-Order Slot: ${selectedSlot}`,
        image: "/images/logo.png",
        order_id: razorpayOrder.id,
        handler: async function (response: any) {
          try {
            await api.post("/orders/verify-payment", {
              orderId: order._id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            setConfirmedOrder({
              orderId: order._id,
              deliverySlot: selectedSlot,
              totalAmount: subtotal,
              itemCount: totalItemCount,
            });
            clearCart();
            closeCart();
            setIsSuccessOpen(true);
          } catch {
            alert("Payment signature verification failed. Please contact kitchen support.");
          }
        },
        prefill: {
          name: user.name || "Customer",
          contact: `+91${user.phone}`,
        },
        theme: {
          color: "#D90429",
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (err: any) {
      alert(err.response?.data?.message || "Order placement failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeCart}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 250 }}
                className="w-screen max-w-md bg-[#60000E] border-l-4 border-black shadow-2xl flex flex-col justify-between"
              >
                {/* Header */}
                <div className="p-5 border-b-2 border-black/40 bg-[#FFD000] text-black flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D90429] text-white border-2 border-black shadow-sm">
                      <ShoppingBag className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black uppercase tracking-tight text-[#850014] font-display leading-tight">
                        Your Order Bowl
                      </h2>
                      <p className="text-[10px] font-black uppercase tracking-widest text-black/80">
                        Pre-order Pickup &amp; Delivery
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={closeCart}
                    className="rounded-xl border border-black/30 p-1.5 text-black hover:bg-black hover:text-white transition-colors"
                  >
                    <X className="h-5 w-5 stroke-[2.5]" />
                  </button>
                </div>

                {/* Items List */}
                <div className="flex-1 overflow-y-auto p-5 space-y-3">
                  {items.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center text-amber-200/60">
                      <ShoppingBag className="h-16 w-16 mb-3 opacity-30 text-[#FFD000]" />
                      <p className="text-base font-black uppercase text-[#FFD000]">
                        Your bowl is empty
                      </p>
                      <p className="text-xs font-medium text-amber-100/70 mt-1">
                        Add some Drip Rolls or the OG Burger to begin!
                      </p>
                    </div>
                  ) : (
                    items.map((cartItem) => (
                      <CartItemRow
                        key={cartItem.menuItem._id}
                        item={cartItem}
                      />
                    ))
                  )}
                </div>

                {/* Footer Controls */}
                {items.length > 0 && (
                  <div className="p-5 border-t-2 border-black/40 bg-[#4A000A] space-y-4">
                    <div>
                      <label className="text-xs font-black uppercase tracking-wider text-[#FFD000] block mb-1.5">
                        Select Pre-Order Slot (11 AM - 3 PM)
                      </label>
                      <select
                        value={selectedSlot}
                        onChange={(e) => setSelectedSlot(e.target.value)}
                        className="w-full rounded-xl bg-[#60000E] border-2 border-black px-3 py-2 text-sm text-[#FFD000] font-black focus:outline-none focus:border-[#FFD000]"
                      >
                        <option value="11:30 AM - 12:30 PM">11:30 AM - 12:30 PM</option>
                        <option value="12:30 PM - 01:30 PM">12:30 PM - 01:30 PM</option>
                        <option value="01:30 PM - 02:30 PM">01:30 PM - 02:30 PM</option>
                        <option value="02:30 PM - 03:30 PM">02:30 PM - 03:30 PM</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black uppercase text-amber-100">
                        Total Amount:
                      </span>
                      <span className="text-2xl font-black text-[#FFD000] font-display">
                        ₹{subtotal}
                      </span>
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      disabled={loading}
                      onClick={handleCheckout}
                      className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-black bg-[#FFD000] py-3.5 text-sm font-black uppercase tracking-wider text-black shadow-[3px_3px_0px_0px_#000] transition-all hover:bg-white hover:text-[#D90429] disabled:opacity-50"
                    >
                      <span>
                        {loading
                          ? "Securing Slot..."
                          : user
                          ? "Pay with UPI (GPay / PhonePe / Paytm)"
                          : "Login to Pre-Order"}
                      </span>
                      <ArrowRight className="h-4 w-4 stroke-[3]" />
                    </motion.button>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <OrderSuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        orderDetails={confirmedOrder}
      />
    </>
  );
};