"use client";

import React from "react";
import { Plus, Minus, Trash2 } from "lucide-react";
import { CartItem } from "../../types";
import { useCartStore } from "../../store/useCartStore";

interface CartItemRowProps {
  item: CartItem;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({ item }) => {
  const { updateQuantity, removeItem } = useCartStore();
  const { menuItem, quantity } = item;
  const itemTotal = menuItem.price * quantity;

  return (
    <div className="flex items-center justify-between rounded-2xl border-2 border-black/40 bg-gradient-to-r from-[#850014] to-[#60000E] p-3 shadow-md">
      {/* Food thumbnail & Info */}
      <div className="flex items-center gap-3">
        <div className="relative h-14 w-14 shrink-0 rounded-xl bg-black/30 p-1 flex items-center justify-center border border-[#FFD000]/30 overflow-visible">
          <img
            src={menuItem.imageUrl}
            alt={menuItem.name}
            className="h-full w-full object-contain food-pop-shadow"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=200&auto=format&fit=crop&q=60";
            }}
          />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-black uppercase tracking-tight text-white line-clamp-1">
            {menuItem.name}
          </span>
          <span className="text-xs font-black text-[#FFD000]">
            ₹{itemTotal}
            {quantity > 1 && (
              <span className="text-[10px] font-normal text-amber-200/80 ml-1">
                (₹{menuItem.price} each)
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Stepper Controls */}
      <div className="flex items-center gap-2">
        <div className="flex items-center rounded-xl border border-black bg-white px-1.5 py-0.5 shadow-sm">
          <button
            onClick={() => updateQuantity(menuItem._id, -1)}
            className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#D90429] text-white hover:bg-black transition-colors active:scale-90"
            title="Decrease quantity"
          >
            <Minus className="h-3 w-3 stroke-[3]" />
          </button>

          <span className="w-6 text-center text-xs font-black text-black">
            {quantity}
          </span>

          <button
            onClick={() => updateQuantity(menuItem._id, 1)}
            className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#FFD000] text-black border border-black hover:bg-[#D90429] hover:text-white transition-colors active:scale-90"
            title="Increase quantity"
          >
            <Plus className="h-3 w-3 stroke-[3]" />
          </button>
        </div>

        <button
          onClick={() => removeItem(menuItem._id)}
          className="p-1.5 text-zinc-400 hover:text-[#FFD000] transition-colors"
          title="Remove item"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};