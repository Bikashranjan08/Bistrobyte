"use client";

import { useState, useMemo, useRef, Suspense, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { menuData } from "@/lib/menuData";
import { useCart } from "@/context/CartContext";
import { Search, ArrowLeft, X } from "lucide-react";
import Image from "next/image";


function MenuPageContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const initialQuery = searchParams.get("q") || "";
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const categoryBarRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();

  // Sync state with URL params when they change (e.g. back button navigation)
  useEffect(() => {
    setSearchQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const allCategories = useMemo(
    () => [{ id: "all", title: "All", emoji: "🍽️" }, ...menuData],
    []
  );

  const filteredData = useMemo(() => {
    let categories = activeCategory === "all" ? menuData : menuData.filter((c) => c.id === activeCategory);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      categories = categories
        .map((cat) => ({
          ...cat,
          items: cat.items.filter((item) => item.name.toLowerCase().includes(q)),
        }))
        .filter((cat) => cat.items.length > 0);
    }

    return categories;
  }, [activeCategory, searchQuery]);

  const totalItems = filteredData.reduce((sum, cat) => sum + cat.items.length, 0);

  return (
    <div className="min-h-screen bg-mint-whisper pt-[80px]">


      {/* Sub-Header (Search & Categories) */}
      <div className="sticky top-[80px] z-30 bg-white/80 backdrop-blur-xl border-b border-emerald-green/10 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Title & Back (Optional, or simplifed) */}
            <div className="flex items-center justify-between md:justify-start gap-4">
              <Link
                href="/"
                className="md:hidden flex items-center gap-2 text-emerald-dark/70 hover:text-emerald-green"
              >
                <ArrowLeft size={18} />
                <span className="text-sm font-medium">Home</span>
              </Link>
              <h1 className="text-xl font-bold text-dark-evergreen" style={{ fontFamily: "var(--font-playfair)" }}>
                Our Menu
              </h1>
            </div>

            {/* Search */}
            <div className="relative w-full md:max-w-md">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-dark/40"
              />
              <input
                type="text"
                placeholder="Search dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-10 py-3 min-h-[44px] bg-mint-whisper rounded-xl border border-emerald-green/10 text-sm sm:text-sm text-dark-evergreen focus:outline-none focus:ring-2 focus:ring-emerald-green/20"
                style={{ fontFamily: "var(--font-inter)" }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X size={14} className="text-emerald-dark" />
                </button>
              )}
            </div>
          </div>

          {/* Category pills */}
          <div
            ref={categoryBarRef}
            className="flex gap-2 overflow-x-auto pt-4 pb-1 scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {allCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex-shrink-0 px-4 py-2.5 min-h-[44px] rounded-full text-sm font-medium transition-all duration-300 touch-manipulation ${activeCategory === cat.id
                  ? "bg-emerald-green text-white shadow-lg shadow-emerald-green/20"
                  : "bg-white text-dark-evergreen/70 border border-emerald-green/10 hover:border-emerald-green/30 hover:text-emerald-green"
                  }`}
                style={{ fontFamily: "var(--font-inter)" }}
              >
                <span className="mr-1.5">{cat.emoji}</span>
                {cat.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <p
          className="text-sm text-emerald-dark/60 mb-8"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Showing {totalItems} dishes
          {activeCategory !== "all" &&
            ` in ${menuData.find((c) => c.id === activeCategory)?.title}`}
          {searchQuery && ` matching "${searchQuery}"`}
        </p>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeCategory}-${searchQuery}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-12"
          >
            {filteredData.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-4xl mb-4">🍽️</p>
                <p
                  className="text-lg text-emerald-dark/60"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  No dishes found. Try a different search.
                </p>
              </div>
            ) : (
              filteredData.map((category) => (
                <div key={category.id}>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-2xl">{category.emoji}</span>
                    <h2
                      className="text-2xl font-bold text-dark-evergreen"
                      style={{ fontFamily: "var(--font-playfair)" }}
                    >
                      {category.title}
                    </h2>
                    <span
                      className="text-xs font-medium text-emerald-dark/60 bg-emerald-green/10 px-3 py-1 rounded-full"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {category.items.length} items
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {category.items.map((item, idx) => (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, margin: "-20px" }}
                        transition={{ delay: Math.min(idx * 0.05, 0.4) }}
                        className="group"
                      >
                        <div className="relative flex flex-col items-center bg-white/40 backdrop-blur-sm rounded-3xl p-4 border border-white/50 hover:border-emerald-green/20 hover:shadow-[0_10px_40px_-10px_rgba(16,185,129,0.1)] hover:bg-white/80 transition-all duration-300">

                          {/* Round Image Frame */}
                          <div className="relative w-32 h-32 mb-4">
                            <div className="absolute inset-0 rounded-full border-4 border-white shadow-lg overflow-hidden group-hover:scale-105 transition-transform duration-500">
                              <Image
                                src={item.image || "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=400&fit=crop"}
                                alt={item.name}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 128px, 128px"
                              />
                            </div>
                            {/* Veg Indicator */}
                            <div className="absolute bottom-1 right-1 bg-white rounded-full p-1.5 shadow-md z-10">
                              <div className="w-3 h-3 border border-emerald-green rounded-sm flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-green" />
                              </div>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="text-center w-full space-y-1">
                            <h3
                              className="text-base font-bold text-dark-evergreen leading-tight group-hover:text-emerald-green transition-colors"
                              style={{ fontFamily: "var(--font-playfair)" }}
                            >
                              {item.name}
                            </h3>
                            {item.description && (
                              <p className="text-[10px] text-emerald-dark/50 line-clamp-2 px-2" style={{ fontFamily: "var(--font-inter)" }}>
                                {item.description}
                              </p>
                            )}
                            <div className="pt-2 flex items-center justify-center gap-3">
                              <span
                                className="text-sm font-bold text-dark-evergreen"
                                style={{ fontFamily: "var(--font-inter)" }}
                              >
                                &#8377;{item.price}
                              </span>
                              <button
                                onClick={() => addToCart(item)}
                                className="w-10 h-10 min-w-[44px] min-h-[44px] sm:w-8 sm:h-8 sm:min-w-0 sm:min-h-0 flex items-center justify-center rounded-full bg-emerald-green text-white hover:bg-emerald-dark hover:scale-110 active:scale-95 transition-all shadow-lg shadow-emerald-green/20 touch-manipulation"
                                aria-label={`Add ${item.name} to cart`}
                              >
                                <span className="font-bold text-xl sm:text-lg leading-none mb-0.5">+</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-mint-whisper flex items-center justify-center">
          <p className="text-emerald-dark/60" style={{ fontFamily: "var(--font-inter)" }}>
            Loading menu...
          </p>
        </div>
      }
    >
      <MenuPageContent />
    </Suspense>
  );
}
