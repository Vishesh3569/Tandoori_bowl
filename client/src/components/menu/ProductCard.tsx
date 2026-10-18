"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { MenuItem } from "../../types";
import { useCartStore } from "../../store/useCartStore";

interface ProductCardProps {
  item: MenuItem;
}

export const ProductCard: React.FC<ProductCardProps> = ({ item }) => {
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  // Check current quantity of this specific item in the cart
  const cartEntry = items.find((i) => i.menuItem._id === item._id);
  const quantity = cartEntry ? cartEntry.quantity : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative flex flex-col justify-between rounded-3xl border-3 border-[#FFD000] bg-gradient-to-b from-[#A0001E] to-[#60000E] p-5 shadow-[4px_4px_0px_0px_#FFD000] transition-all duration-300 hover:shadow-[6px_6px_0px_0px_#FFD000] hover:translate-y-[-2px]"
    >
      {/* Header: Badge & Price Stamp */}
      <div className="flex items-center justify-between z-20">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-md border-2 border-emerald-400 bg-white p-0.5 shadow-sm">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
          </span>
          {item.badge && (
            <span className="rounded-md bg-[#FFD000] px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-black shadow-sm rotate-[-2deg]">
              {item.badge}
            </span>
          )}
        </div>

        <div className="rounded-full bg-[#FFD000] px-3 py-1 font-black text-black text-lg border-2 border-black rotate-[2deg] shadow-md font-display">
          ₹{item.price}
        </div>
      </div>

      {/* 3D Pop-out Food Stage */}
      <div className="relative my-4 flex h-48 w-full items-center justify-center overflow-visible">
        <div className="absolute h-36 w-36 rounded-full bg-[#FFD000]/30 blur-2xl transition-all duration-300 group-hover:scale-130 group-hover:bg-[#FFD000]/50" />

        <motion.div
          className="relative z-30 h-full w-full flex items-center justify-center"
          whileHover={{
            scale: 1.25,
            y: -22,
            rotateZ: -2,
          }}
          transition={{
            type: "spring",
            stiffness: 420,
            damping: 18,
          }}
        >
          <img
            src={item.imageUrl}
            alt={item.name}
            className="max-h-full max-w-full object-contain food-pop-shadow transition-all duration-300 pointer-events-none select-none"
            loading="lazy"
            onError={(e) => {
              // Graceful fallback to avoid broken img icons if file is missing
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&auto=format&fit=crop&q=60";
            }}
          />
        </motion.div>
      </div>

      {/* Item Details */}
      <div className="z-20 mt-1 flex flex-col gap-1">
        {item.tagline && (
          <p className="text-[11px] font-black uppercase tracking-wider text-[#FFD000]">
            {item.tagline}
          </p>
        )}
        <h3 className="text-xl font-black uppercase text-white font-display tracking-wide drop-shadow-sm leading-tight">
          {item.name}
        </h3>
        <p className="line-clamp-2 text-xs font-medium text-amber-100/90 leading-relaxed">
          {item.description}
        </p>
      </div>

      {/* Inline Quantity Stepper / Add Button */}
      <div className="mt-5 z-20 h-11">
        <AnimatePresence mode="wait">
          {quantity === 0 ? (
            <motion.button
              key="add-btn"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => addItem(item, false)} // false prevents auto opening drawer
              className="flex h-full w-full items-center justify-center gap-2 rounded-2xl border-2 border-black bg-[#FFD000] text-sm font-black uppercase tracking-wider text-black shadow-[2px_2px_0px_0px_#000] transition-all hover:bg-white hover:text-[#D90429]"
            >
              <Plus className="h-4 w-4 stroke-[3]" />
              <span>Add to Pre-Order</span>
            </motion.button>
          ) : (
            <motion.div
              key="stepper"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex h-full w-full items-center justify-between rounded-2xl border-2 border-black bg-white px-3 shadow-[2px_2px_0px_0px_#000]"
            >
              <button
                onClick={() => updateQuantity(item._id, -1)}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#D90429] text-white transition-colors hover:bg-black active:scale-90"
              >
                <Minus className="h-4 w-4 stroke-[3]" />
              </button>

              <div className="flex flex-col items-center">
                <span className="text-base font-black text-black leading-none">
                  {quantity}
                </span>
                <span className="text-[9px] font-bold uppercase tracking-tight text-zinc-500">
                  in bowl
                </span>
              </div>

              <button
                onClick={() => updateQuantity(item._id, 1)}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FFD000] text-black border border-black transition-colors hover:bg-[#D90429] hover:text-white active:scale-90"
              >
                <Plus className="h-4 w-4 stroke-[3]" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};