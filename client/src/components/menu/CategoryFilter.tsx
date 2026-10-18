"use client";

import React from "react";
import { CategoryType } from "../../types";

interface CategoryFilterProps {
  activeCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
}

const CATEGORIES: { id: CategoryType; label: string }[] = [
  { id: "all", label: "All Items" },
  { id: "drip_roll", label: "Drip Rolls" },
  { id: "burger", label: "Burgers" },
];

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  return (
    <div className="flex items-center justify-center gap-3 py-4 overflow-x-auto no-scrollbar">
      {CATEGORIES.map((cat) => {
        const isActive = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`whitespace-nowrap rounded-2xl px-6 py-2.5 text-xs sm:text-sm font-black uppercase tracking-wider border-2 border-black transition-all ${
              isActive
                ? "bg-[#FFD000] text-black shadow-[3px_3px_0px_0px_#000] scale-105"
                : "bg-[#60000E] text-[#FFD000] hover:bg-[#780012]"
            }`}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
};