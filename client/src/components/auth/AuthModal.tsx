"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import api from "../../lib/api";

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, login } = useAuthStore();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(phone)) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/request-otp", { phone });

      // If OTP bypass is active in .env, login immediately
      if (res.data.bypassOtp) {
        login(res.data.user, res.data.token);
        closeAuthModal();
        setPhone("");
        return;
      }

      // If SMS mode is on, transition to OTP input step
      if (res.data.debugOtp) {
        alert(`Dev OTP Code: ${res.data.debugOtp}`);
      }
      setStep("otp");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to process login.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/verify-otp", {
        phone,
        otp,
        name,
      });

      login(res.data.user, res.data.token);
      setStep("phone");
      setPhone("");
      setOtp("");
      closeAuthModal();
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid OTP code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAuthModal}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative z-10 w-full max-w-sm rounded-3xl border-3 border-black bg-[#60000E] p-6 shadow-2xl text-white"
          >
            <button
              onClick={closeAuthModal}
              className="absolute right-4 top-4 rounded-xl border border-black/30 p-1.5 text-white hover:bg-black transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-5">
              <h3 className="text-2xl font-black uppercase tracking-tight text-[#FFD000] font-display">
                {step === "phone" ? "Pre-Order Login" : "Enter Verification OTP"}
              </h3>
              <p className="text-xs font-bold text-amber-100/70 mt-1">
                {step === "phone"
                  ? "Enter your mobile number to checkout"
                  : `4-digit code sent to +91 ${phone}`}
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-xl bg-red-950/80 p-2.5 border-2 border-red-500 text-xs font-bold text-red-200">
                {error}
              </div>
            )}

            {step === "phone" ? (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-[#FFD000] block mb-1">
                    Phone Number
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-sm font-black text-amber-200">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                      maxLength={10}
                      placeholder="9876543210"
                      className="w-full rounded-xl bg-[#850014] border-2 border-black pl-12 pr-4 py-2.5 text-sm font-bold text-white placeholder-amber-200/40 focus:border-[#FFD000] focus:outline-none"
                    />
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  disabled={loading}
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-black bg-[#FFD000] py-3 text-sm font-black uppercase tracking-wider text-black shadow-[2px_2px_0px_0px_#000] hover:bg-white hover:text-[#D90429] transition-all disabled:opacity-50"
                >
                  <span>{loading ? "Connecting..." : "Continue"}</span>
                  <ArrowRight className="h-4 w-4 stroke-[3]" />
                </motion.button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-[#FFD000] block mb-1">
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="E.g. Vishesh"
                    className="w-full rounded-xl bg-[#850014] border-2 border-black px-4 py-2 text-sm font-bold text-white placeholder-amber-200/40 focus:border-[#FFD000] focus:outline-none mb-3"
                  />

                  <label className="text-xs font-black uppercase tracking-wider text-[#FFD000] block mb-1">
                    4-Digit OTP
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    maxLength={4}
                    placeholder="1234"
                    className="w-full text-center tracking-widest text-xl font-black rounded-xl bg-[#850014] border-2 border-black py-2 text-[#FFD000] focus:border-[#FFD000] focus:outline-none"
                  />
                </div>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  disabled={loading}
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-black bg-[#FFD000] py-3 text-sm font-black uppercase tracking-wider text-black shadow-[2px_2px_0px_0px_#000] hover:bg-white hover:text-[#D90429] transition-all disabled:opacity-50"
                >
                  <span>{loading ? "Verifying..." : "Verify & Login"}</span>
                  <ArrowRight className="h-4 w-4 stroke-[3]" />
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};