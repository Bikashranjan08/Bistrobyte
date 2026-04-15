"use client";

import { useState, useMemo, useRef, Suspense, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, ArrowLeft, X } from "lucide-react";
import Image from "next/image";
import RestaurantPriceList from "@/components/RestaurantPriceList";

interface FoodItem {
  id: string;
  name: string;
  category: string;
  description?: string;
  image: string;
  isVeg: boolean;
}

interface RestaurantOption {
  restaurant: {
    id: string;
    name: string;
    address: {
      street: string;
      city: string;
    };
    phone: string;
    isOnline: boolean;
  };
  menuItem: {
    id: string;
    price: number;
    customImage?: string;
  };
}

interface MenuItemWithRestaurants {
  foodItem: FoodItem;
  restaurants: RestaurantOption[];
  lowestPrice: number | null;
  highestPrice: number | null;
}

function MenuPageContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const initialQuery = searchParams.get("q") || "";
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [menuData, setMenuData] = useState<MenuItemWithRestaurants[]>([]);
  const [loading, setLoading] = useState(true);
  const categoryBarRef = useRef<HTMLDivElement>(null);

  // Fetch menu data from API
  useEffect(() => {
    fetchMenuData();
  }, []);

  const fetchMenuData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/menu');
      const data = await res.json();
      
      if (data.success) {
        setMenuData(data.data.items);
      }
    } catch (error) {
      console.error('Error fetching menu:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sync state with URL params when they change
  useEffect(() => {
    setSearchQuery(searchParams.get("q") || "");
  }, [searchParams]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(menuData.map(item => item.foodItem.category));
    return Array.from(cats).sort();
  }, [menuData]);

  const allCategories = useMemo(
    () => [{ id: "all", title: "All", emoji: "🍽️" }, ...categories.map(cat => ({
      id: cat.toLowerCase().replace(/\s+/g, '-'),
      title: cat,
      emoji: getCategoryEmoji(cat)
    }))],
    [categories]
  );

  const filteredData = useMemo(() => {
    let items = menuData;

    // Filter by category
    if (activeCategory !== "all") {
      const categoryTitle = allCategories.find(c => c.id === activeCategory)?.title;
      items = items.filter(item => item.foodItem.category === categoryTitle);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(item => 
        item.foodItem.name.toLowerCase().includes(q) ||
        item.foodItem.category.toLowerCase().includes(q)
      );
    }

    return items;
  }, [activeCategory, searchQuery, menuData, allCategories]);

  // Group by category for display
  const groupedByCategory = useMemo(() => {
    return filteredData.reduce((acc, item) => {
      const category = item.foodItem.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {} as { [key: string]: MenuItemWithRestaurants[] });
  }, [filteredData]);

  const totalItems = filteredData.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-mint-whisper pt-[80px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-green mx-auto mb-4"></div>
          <p className="text-emerald-dark/60" style={{ fontFamily: "var(--font-inter)" }}>
            Loading menu...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mint-whisper pt-[80px]">
      {/* Sub-Header (Search & Categories) */}
      <div className="sticky top-[80px] z-30 bg-white/80 backdrop-blur-xl border-b border-emerald-green/10 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Title & Back */}
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
            ` in ${allCategories.find((c) => c.id === activeCategory)?.title}`}
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
            {Object.keys(groupedByCategory).length === 0 ? (
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
              Object.entries(groupedByCategory).map(([category, items]) => (
                <div key={category}>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-2xl">{getCategoryEmoji(category)}</span>
                    <h2
                      className="text-2xl font-bold text-dark-evergreen"
                      style={{ fontFamily: "var(--font-playfair)" }}
                    >
                      {category}
                    </h2>
                    <span
                      className="text-xs font-medium text-emerald-dark/60 bg-emerald-green/10 px-3 py-1 rounded-full"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {items.length} items
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {items.map((item, idx) => (
                      <motion.div
                        key={item.foodItem.id}
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
                                src={item.foodItem.image || "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=400&fit=crop"}
                                alt={item.foodItem.name}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 128px, 128px"
                              />
                            </div>
                            {/* Veg Indicator */}
                            <div className="absolute bottom-1 right-1 bg-white rounded-full p-1.5 shadow-md z-10">
                              <div className={`w-3 h-3 border rounded-sm flex items-center justify-center ${item.foodItem.isVeg ? 'border-emerald-green' : 'border-red-500'}`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${item.foodItem.isVeg ? 'bg-emerald-green' : 'bg-red-500'}`} />
                              </div>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="text-center w-full space-y-2">
                            <h3
                              className="text-base font-bold text-dark-evergreen leading-tight group-hover:text-emerald-green transition-colors"
                              style={{ fontFamily: "var(--font-playfair)" }}
                            >
                              {item.foodItem.name}
                            </h3>
                            {item.foodItem.description && (
                              <p className="text-[10px] text-emerald-dark/50 line-clamp-2 px-2" style={{ fontFamily: "var(--font-inter)" }}>
                                {item.foodItem.description}
                              </p>
                            )}
                            
                            {/* Restaurant Price List */}
                            <div className="pt-2">
                              <RestaurantPriceList
                                foodItemId={item.foodItem.id}
                                foodItemName={item.foodItem.name}
                                foodItemImage={item.foodItem.image}
                                isVeg={item.foodItem.isVeg}
                                restaurants={item.restaurants}
                                lowestPrice={item.lowestPrice}
                              />
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

// Helper function to get emoji for category
function getCategoryEmoji(category: string): string {
  const emojiMap: { [key: string]: string } = {
    "Soups": "🍜",
    "Salads & Sides": "🥗",
    "Starters": "🍢",
    "Tandoori": "🔥",
    "Dal": "🫕",
    "Main Course": "🍛",
    "Rice": "🍚",
    "Biryani": "🥘",
    "Noodles": "🍝",
    "Fried Rice": "🍳",
    "Naan & Roti": "🫓",
    "Desserts": "🍮",
    "Cold Drinks": "🥤",
    "Non-Veg": "🍗",
  };
  return emojiMap[category] || "🍽️";
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
