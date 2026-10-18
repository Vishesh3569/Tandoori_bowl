"use client";

import React, { useState } from "react";
import { ShoppingBag, User as UserIcon, LogOut, Receipt } from "lucide-react";
import { useCartStore } from "../../store/useCartStore";
import { useAuthStore } from "../../store/useAuthStore";
import { OrderHistoryModal } from "../ui/OrderHistoryModal";

export const Navbar: React.FC = () => {
  const { toggleCart, getTotalItems } = useCartStore();
  const { user, openAuthModal, logout } = useAuthStore();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const totalItems = getTotalItems();
  const [logoError, setLogoError] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b-4 border-black/30 bg-[#FFD000] text-black shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="relative h-14 w-14 sm:h-16 sm:w-16 flex items-center justify-center">
              {!logoError ? (
                <img
                  src="/images/logo.png"
                  alt="Tandoori Bowl Logo"
                  onError={() => setLogoError(true)}
                  className="h-full w-full object-contain filter drop-shadow-md"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#850014] text-[#FFD000] font-black text-xs border-2 border-black">
                  TB
                </div>
              )}
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#850014] font-display leading-none drop-shadow-sm">
                Tandoori Bowl
              </h1>
              <p className="text-[10px] font-black uppercase tracking-widest text-black/80">
                Est. 2025 • Daily Pre-Orders
              </p>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsHistoryOpen(true)}
                  className="flex items-center gap-1.5 rounded-xl border-2 border-black bg-white px-3 py-1.5 text-xs font-black uppercase text-black hover:bg-[#850014] hover:text-[#FFD000] transition-colors shadow-sm"
                >
                  <Receipt className="h-3.5 w-3.5 text-[#D90429]" />
                  <span className="hidden sm:inline">My Orders</span>
                </button>

                <button
                  onClick={logout}
                  title="Log out"
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#850014] text-white hover:bg-black transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className="flex items-center gap-1.5 rounded-xl border-2 border-black bg-white px-3.5 py-1.5 text-xs font-black uppercase text-black hover:bg-black hover:text-[#FFD000] transition-colors shadow-sm"
              >
                <UserIcon className="h-4 w-4 text-[#D90429]" />
                <span>Login</span>
              </button>
            )}

            {/* Cart Trigger */}
            <button
              onClick={toggleCart}
              className="relative flex items-center gap-2 rounded-xl border-2 border-black bg-[#D90429] px-4 py-2 text-xs font-black uppercase tracking-wider text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform active:translate-y-0.5 active:shadow-none hover:bg-[#A0001E]"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">My Bowl</span>
              {totalItems > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FFD000] text-[11px] font-black text-black ml-0.5">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Order History Modal */}
      <OrderHistoryModal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
    </>
  );
};