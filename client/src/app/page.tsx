"use client";

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { MenuItem, CategoryType } from "../types";
import { PreorderBanner } from "../components/layout/PreorderBanner";
import { CategoryFilter } from "../components/menu/CategoryFilter";
import { ProductCard } from "../components/menu/ProductCard";
import { CartDrawer } from "../components/cart/CartDrawer";
import { AuthModal } from "../components/auth/AuthModal";

export default function Home() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<CategoryType>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get("http://localhost:5001/api/menu");
        if (res.data?.success && Array.isArray(res.data?.data)) {
          setItems(res.data.data);
        } else {
          setItems([]);
        }
      } catch (err: unknown) {
        console.error("Database fetch failed:", err);
        setError("Unable to connect to the kitchen database. Ensure the backend server is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  // Filter dynamically based on the database documents
  const displayedItems = useMemo(() => {
    if (activeCategory === "all") return items;
    return items.filter((item) => item.category === activeCategory);
  }, [items, activeCategory]);

  return (
    <main className="min-h-screen pb-24">
      {/* 1. Kitchen Schedule & Preorder Alert Banner */}
      <PreorderBanner />

      {/* 2. Hero Street Food Banner */}
      <section className="relative overflow-hidden py-10 text-center px-4">
        <div className="inline-block rounded-xl border-2 border-black bg-[#FFD000] px-4 py-1.5 text-xs font-black uppercase tracking-widest text-black shadow-[3px_3px_0px_0px_#000] mb-4 rotate-[-1deg]">
          ★ 11:00 AM - 3:00 PM DAILY PRE-ORDERS ONLY ★
        </div>

        <h2 className="text-5xl sm:text-7xl font-black uppercase tracking-tight text-[#FFD000] font-display drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)] leading-none">
          THE OG DRIP ROLLS <br />
          <span className="text-white">&amp; CHEESE BURGERS</span>
        </h2>

        <p className="mt-3 max-w-xl mx-auto text-sm sm:text-base font-bold text-amber-100 drop-shadow">
          Bigger Flavours • Messier Bites • Totally Worth It
        </p>

        {/* 3. Category Filter Tabs */}
        <div className="mt-6">
          <CategoryFilter
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />
        </div>
      </section>

      {/* 4. Food Items Grid (Fetched strictly from DB) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        {loading ? (
          <div className="flex h-52 flex-col items-center justify-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#FFD000] border-t-transparent" />
            <span className="text-sm font-black uppercase tracking-widest text-[#FFD000]">
              Loading menu from kitchen...
            </span>
          </div>
        ) : error ? (
          <div className="mx-auto max-w-md rounded-2xl border-2 border-red-500 bg-black/40 p-6 text-center shadow-lg">
            <p className="text-base font-bold text-red-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-xl border-2 border-black bg-[#FFD000] px-4 py-2 text-xs font-black uppercase text-black hover:bg-white"
            >
              Retry
            </button>
          </div>
        ) : displayedItems.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center text-center">
            <p className="text-xl font-black uppercase text-[#FFD000]">
              No items found in this section
            </p>
            <p className="text-xs font-bold text-amber-200 mt-1">
              Select another category or add items to your MongoDB collection.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pt-4">
            {displayedItems.map((item) => (
              <ProductCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </section>

      {/* Cart Drawer & Auth Modal Providers */}
      <CartDrawer />
      <AuthModal />
    </main>
  );
}