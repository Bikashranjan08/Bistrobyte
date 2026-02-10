"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Menu, X, Search, ShoppingBag, ArrowLeft } from "lucide-react";
import { menuData, MenuItem } from "@/lib/menuData";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "./AuthModal";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "home", href: "/", isRoute: true },
  { label: "menu", href: "/menu", isRoute: true },
  { label: "about us", href: "#about", isRoute: false }, // Updated per user request
  { label: "contact us", href: "#contact", isRoute: false },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<MenuItem[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const isMenuPage = pathname === "/menu";
  const { cartCount } = useCart();
  const { isAuthenticated, user, logout, openModal } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length > 2) {
      const query = searchQuery.toLowerCase();
      const allItems = menuData.flatMap((cat) => cat.items);
      const matches = allItems
        .filter((item) => item.name.toLowerCase().includes(query))
        .slice(0, 5);
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/menu?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setMobileOpen(false);
      setSuggestions([]);
      setSearchQuery("");
    }
  };

  const handleSuggestionClick = (itemName: string) => {
    router.push(`/menu?q=${encodeURIComponent(itemName)}`);
    setSearchOpen(false);
    setMobileOpen(false);
    setSuggestions([]);
    setSearchQuery("");
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
        ? "bg-white/80 backdrop-blur-xl shadow-[0_2px_30px_rgba(16,185,129,0.08)] border-b border-light-border/50"
        : "bg-transparent backdrop-blur-none"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-[80px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="relative w-32 h-16 md:w-40 md:h-20">
              <Image
                src="/logo.png"
                alt="Nilkanth Logo"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 128px, 160px"
                priority
              />
            </div>
          </Link>

          {/* Center Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {isMenuPage ? (
              <Link href="/" className="flex items-center gap-2 text-dark-evergreen hover:text-emerald-green transition-colors group">
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-bold text-lg" style={{ fontFamily: "var(--font-inter)" }}>Back to Home</span>
              </Link>
            ) : (
              navLinks.map((link) =>
                link.isRoute ? (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="relative text-[15px] font-medium text-dark-evergreen/80 hover:text-emerald-green transition-colors duration-300 group"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-emerald-green rounded-full group-hover:w-full transition-all duration-300" />
                  </Link>
                ) : (
                  <a
                    key={link.href}
                    href={link.href}
                    className="relative text-[15px] font-medium text-dark-evergreen/80 hover:text-emerald-green transition-colors duration-300 group"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-emerald-green rounded-full group-hover:w-full transition-all duration-300" />
                  </a>
                )
              )
            )}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-full text-dark-evergreen/60 hover:text-emerald-green hover:bg-emerald-green/5 transition-all duration-200"
              aria-label="Search"
            >
              <Search size={20} strokeWidth={1.8} />
            </button>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative w-10 h-10 flex items-center justify-center rounded-full text-dark-evergreen/60 hover:text-emerald-green hover:bg-emerald-green/5 transition-all duration-200"
              aria-label="Cart"
            >
              <ShoppingBag size={20} strokeWidth={1.8} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-royal-amethyst text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Order Now CTA */}
            <Link
              href="/menu"
              className="ml-2 px-6 py-2.5 bg-gradient-to-r from-emerald-green to-emerald-dark text-white text-sm font-semibold rounded-full shadow-lg shadow-emerald-green/20 hover:shadow-emerald-green/40 hover:scale-[1.03] active:scale-95 transition-all duration-300"
              style={{ fontFamily: "--font-inter" }}
            >
              Order Now
            </Link>


            {/* Login/User Button */}
            {isAuthenticated ? (
              <div className="ml-2 flex items-center gap-3">
                <Link href="/profile" className="w-10 h-10 rounded-full bg-emerald-green/10 flex items-center justify-center text-emerald-dark border border-emerald-green/20 hover:border-emerald-green hover:scale-105 transition-all overflow-hidden cursor-pointer">
                  {user?.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={user.name || "User"}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="font-bold text-sm">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </Link>
                <div className="flex flex-col items-start">
                  <Link href="/profile" className="text-xs font-bold text-emerald-dark hover:text-emerald-green transition-colors mb-0.5">
                    My Profile
                  </Link>
                  <Link href="/my-orders" className="text-xs font-bold text-emerald-dark/60 hover:text-emerald-green transition-colors mb-0.5">
                    My Orders
                  </Link>
                  <button
                    onClick={logout}
                    className="text-xs font-bold text-emerald-dark/60 hover:text-red-500 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={openModal}
                className="ml-2 px-5 py-2.5 rounded-full border border-dark-evergreen/10 text-dark-evergreen font-bold text-sm hover:bg-dark-evergreen hover:text-white transition-all duration-300"
              >
                Login
              </button>
            )}
          </div>

          <AuthModal />

          {/* Mobile Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/cart"
              className="relative w-9 h-9 flex items-center justify-center rounded-full text-dark-evergreen/60"
              aria-label="Cart"
            >
              <ShoppingBag size={18} strokeWidth={1.8} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-royal-amethyst text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-xl text-dark-evergreen"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar (Desktop) */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="hidden md:block border-t border-light-border/30 overflow-hidden bg-white/90 backdrop-blur-xl"
          >
            <div className="max-w-2xl mx-auto px-6 py-4">
              <form onSubmit={handleSearch} className="relative flex items-center gap-3 bg-mint-whisper rounded-full px-5 py-3 shadow-inner border border-emerald-green/10">
                <Search size={18} className="text-dark-evergreen/40 shrink-0" />
                <input
                  type="text"
                  placeholder="Search for dishes... (e.g., Paneer Tikka, Biryani)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-dark-evergreen placeholder:text-dark-evergreen/40 outline-none"
                  style={{ fontFamily: "var(--font-inter)" }}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="text-dark-evergreen/40 hover:text-dark-evergreen transition-colors"
                >
                  <X size={16} />
                </button>

                {/* Desktop Suggestions */}
                <AnimatePresence>
                  {suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-light-border/50 overflow-hidden z-50"
                    >
                      {suggestions.map((item, idx) => (
                        <div
                          key={`${item.name}-${idx}`}
                          onClick={() => handleSuggestionClick(item.name)}
                          className="px-5 py-3 hover:bg-mint-whisper cursor-pointer flex items-center justify-between group transition-colors"
                        >
                          <span className="text-sm font-medium text-dark-evergreen group-hover:text-emerald-green" style={{ fontFamily: "var(--font-inter)" }}>
                            {item.name}
                          </span>
                          <span className="text-xs text-dark-evergreen/40 font-medium">
                            &#8377;{item.price}
                          </span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu - Slide-in Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden fixed inset-0 top-[80px] bg-black/50 backdrop-blur-sm z-[100]"
              onClick={() => setMobileOpen(false)}
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="md:hidden fixed top-[80px] right-0 bottom-0 w-[280px] bg-white shadow-2xl z-[101] overflow-y-auto"
            >
              <div className="px-6 py-6 flex flex-col gap-4 h-full">
                {/* Mobile Search */}
                <div className="relative">
                  <form onSubmit={handleSearch} className="flex items-center gap-3 bg-mint-whisper rounded-2xl px-5 py-4 border border-emerald-green/10 shadow-sm">
                    <Search size={20} className="text-dark-evergreen/40 shrink-0" />
                    <input
                      type="text"
                      placeholder="Search dishes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 bg-transparent text-base text-dark-evergreen placeholder:text-dark-evergreen/40 outline-none"
                      style={{ fontFamily: "var(--font-inter)" }}
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="text-dark-evergreen/40"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </form>

                  {/* Mobile Suggestions */}
                  <AnimatePresence>
                    {suggestions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-light-border/50 overflow-hidden z-50"
                      >
                        {suggestions.map((item, idx) => (
                          <div
                            key={`${item.name}-${idx}`}
                            onClick={() => handleSuggestionClick(item.name)}
                            className="px-5 py-4 hover:bg-mint-whisper cursor-pointer flex items-center justify-between group transition-colors border-b border-light-border/10 last:border-0"
                          >
                            <span className="text-base font-medium text-dark-evergreen group-hover:text-emerald-green" style={{ fontFamily: "var(--font-inter)" }}>
                              {item.name}
                            </span>
                            <span className="text-sm text-dark-evergreen/60 font-bold">
                              &#8377;{item.price}
                            </span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Navigation Links */}
                <div className="flex flex-col gap-1">
                  {navLinks.map((link, i) =>
                    link.isRoute ? (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setMobileOpen(false)}
                          className="block px-4 py-3 text-base font-semibold text-dark-evergreen hover:bg-emerald-green/5 hover:text-emerald-green rounded-lg transition-all duration-200"
                          style={{ fontFamily: "var(--font-inter)" }}
                        >
                          {link.label}
                        </Link>
                      </motion.div>
                    ) : (
                      <motion.a
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="block px-4 py-3 text-base font-semibold text-dark-evergreen hover:bg-emerald-green/5 hover:text-emerald-green rounded-lg transition-all duration-200"
                        style={{ fontFamily: "var(--font-inter)" } as React.CSSProperties}
                      >
                        {link.label}
                      </motion.a>
                    )
                  )}
                </div>

                {/* Login/Profile Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-4 pt-4 border-t border-light-border/30"
                >
                  {isAuthenticated ? (
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-3 px-4 py-3 bg-emerald-green/5 rounded-lg">
                        <div className="w-12 h-12 rounded-full bg-emerald-green/10 flex items-center justify-center text-emerald-dark border-2 border-emerald-green/20 overflow-hidden shrink-0">
                          {user?.avatar ? (
                            <Image
                              src={user.avatar}
                              alt={user.name || "User"}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="font-bold text-lg">
                              {user?.name?.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-dark-evergreen">{user?.name}</span>
                          <span className="text-xs text-dark-evergreen/60">{user?.email}</span>
                        </div>
                      </div>
                      <Link
                        href="/profile"
                        onClick={() => setMobileOpen(false)}
                        className="block px-4 py-3 text-sm font-semibold text-dark-evergreen hover:bg-emerald-green/5 hover:text-emerald-green rounded-lg transition-all"
                      >
                        My Profile
                      </Link>
                      <Link
                        href="/my-orders"
                        onClick={() => setMobileOpen(false)}
                        className="block px-4 py-3 text-sm font-semibold text-dark-evergreen hover:bg-emerald-green/5 hover:text-emerald-green rounded-lg transition-all"
                      >
                        My Orders
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setMobileOpen(false);
                        }}
                        className="block px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-lg transition-all text-left"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        openModal();
                        setMobileOpen(false);
                      }}
                      className="w-full px-6 py-3 bg-gradient-to-r from-emerald-green to-emerald-dark text-white text-base font-bold rounded-xl shadow-lg shadow-emerald-green/20 hover:shadow-emerald-green/40 active:scale-95 transition-all"
                    >
                      Login / Sign Up
                    </button>
                  )}
                </motion.div>

                {/* Order Now CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-auto pt-4"
                >
                  <Link
                    href="/menu"
                    onClick={() => setMobileOpen(false)}
                    className="w-full block py-4 bg-dark-evergreen text-white text-center text-base font-bold rounded-xl shadow-lg"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    Order Now
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav >
  );
}
