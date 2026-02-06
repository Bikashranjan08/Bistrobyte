"use client";

import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { menuData } from "@/lib/menuData";
import { Search, ArrowLeft, X } from "lucide-react";

function MenuPageContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const categoryBarRef = useRef<HTMLDivElement>(null);

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
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-cream/80 backdrop-blur-xl border-b border-light-border/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Top bar */}
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="flex items-center gap-2 text-charcoal/70 hover:text-emerald transition-colors"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              <ArrowLeft size={18} />
              <span className="text-sm font-medium">Back</span>
            </Link>
            <h1
              className="text-xl font-bold text-charcoal"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Our Menu
            </h1>
            <div className="w-16" />
          </div>

          {/* Search */}
          <div className="pb-3">
            <div className="relative max-w-md mx-auto">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray"
              />
              <input
                type="text"
                placeholder="Search dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-10 py-3 bg-white rounded-2xl border border-light-border/50 text-sm text-charcoal placeholder:text-warm-gray/60 focus:outline-none focus:ring-2 focus:ring-emerald/20 focus:border-emerald/30 transition-all"
                style={{ fontFamily: "var(--font-inter)" }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-warm-gray/10 hover:bg-warm-gray/20 transition-colors"
                >
                  <X size={14} className="text-warm-gray" />
                </button>
              )}
            </div>
          </div>

          {/* Category pills */}
          <div
            ref={categoryBarRef}
            className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {allCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat.id
                    ? "bg-emerald text-white shadow-lg shadow-emerald/20"
                    : "bg-white text-charcoal/70 border border-light-border/50 hover:border-emerald/30 hover:text-emerald"
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
          className="text-sm text-warm-gray mb-8"
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
                  className="text-lg text-warm-gray"
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
                      className="text-2xl font-bold text-charcoal"
                      style={{ fontFamily: "var(--font-playfair)" }}
                    >
                      {category.title}
                    </h2>
                    <span
                      className="text-xs font-medium text-warm-gray bg-cream-dark px-3 py-1 rounded-full"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {category.items.length} items
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.items.map((item, idx) => (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: Math.min(idx * 0.03, 0.3) }}
                      >
                        <div className="group flex items-center justify-between p-4 bg-white rounded-2xl border border-light-border/30 hover:shadow-[0_4px_20px_rgba(15,81,50,0.06)] hover:border-emerald/20 transition-all duration-300">
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Veg indicator */}
                            <div className="flex-shrink-0 w-5 h-5 border-2 border-emerald rounded-sm flex items-center justify-center">
                              <div className="w-2.5 h-2.5 rounded-full bg-emerald" />
                            </div>
                            <p
                              className="text-sm font-medium text-charcoal truncate group-hover:text-emerald transition-colors"
                              style={{ fontFamily: "var(--font-inter)" }}
                            >
                              {item.name}
                            </p>
                          </div>
                          <p
                            className="flex-shrink-0 text-sm font-bold text-emerald ml-4"
                            style={{ fontFamily: "var(--font-inter)" }}
                          >
                            &#8377;{item.price}
                          </p>
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

import { Suspense } from "react";

export default function MenuPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cream flex items-center justify-center">
          <p className="text-warm-gray" style={{ fontFamily: "var(--font-inter)" }}>
            Loading menu...
          </p>
        </div>
      }
    >
      <MenuPageContent />
    </Suspense>
  );
}
