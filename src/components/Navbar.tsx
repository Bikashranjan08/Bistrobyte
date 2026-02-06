"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Menu, X, Search, ShoppingBag } from "lucide-react";

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "/menu", label: "Menu", isRoute: true },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const cartCount = 0;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-cream/90 backdrop-blur-xl shadow-[0_2px_30px_rgba(15,81,50,0.08)] border-b border-light-border/50"
          : "bg-cream/60 backdrop-blur-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <span
              className="text-2xl font-bold text-emerald italic tracking-tight"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Nilkanth
            </span>
          </Link>

          {/* Center Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) =>
              link.isRoute ? (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative text-[15px] font-medium text-charcoal/70 hover:text-charcoal transition-colors duration-300 group"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-saffron rounded-full group-hover:w-full transition-all duration-300" />
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  className="relative text-[15px] font-medium text-charcoal/70 hover:text-charcoal transition-colors duration-300 group"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-saffron rounded-full group-hover:w-full transition-all duration-300" />
                </a>
              )
            )}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-full text-charcoal/60 hover:text-charcoal hover:bg-charcoal/5 transition-all duration-200"
              aria-label="Search"
            >
              <Search size={20} strokeWidth={1.8} />
            </button>

            {/* Cart */}
            <Link
              href="/menu"
              className="relative w-10 h-10 flex items-center justify-center rounded-full text-charcoal/60 hover:text-charcoal hover:bg-charcoal/5 transition-all duration-200"
              aria-label="Cart"
            >
              <ShoppingBag size={20} strokeWidth={1.8} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-saffron text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Order Now CTA */}
            <Link
              href="/menu"
              className="ml-2 px-6 py-2.5 bg-gradient-to-r from-emerald to-[#1a7a4a] text-white text-sm font-semibold rounded-full shadow-lg shadow-emerald/20 hover:shadow-emerald/40 hover:scale-[1.03] active:scale-95 transition-all duration-300"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Order Now
            </Link>
          </div>

          {/* Mobile Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/menu"
              className="relative w-9 h-9 flex items-center justify-center rounded-full text-charcoal/60"
              aria-label="Cart"
            >
              <ShoppingBag size={18} strokeWidth={1.8} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-saffron text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-xl text-charcoal"
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
            className="hidden md:block border-t border-light-border/30 overflow-hidden"
          >
            <div className="max-w-2xl mx-auto px-6 py-4">
              <div className="flex items-center gap-3 bg-white rounded-full px-5 py-3 shadow-sm border border-light-border/50">
                <Search size={18} className="text-charcoal/40 shrink-0" />
                <input
                  type="text"
                  placeholder="Search for dishes... (e.g., Paneer Tikka, Biryani)"
                  className="flex-1 bg-transparent text-sm text-charcoal placeholder:text-charcoal/40 outline-none"
                  style={{ fontFamily: "var(--font-inter)" }}
                  autoFocus
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="text-charcoal/40 hover:text-charcoal transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="md:hidden bg-cream/95 backdrop-blur-xl border-t border-light-border/50 overflow-hidden"
          >
            <div className="px-6 py-5 flex flex-col gap-1">
              {/* Mobile Search */}
              <div className="flex items-center gap-3 bg-white rounded-full px-4 py-2.5 mb-4 border border-light-border/50">
                <Search size={16} className="text-charcoal/40 shrink-0" />
                <input
                  type="text"
                  placeholder="Search dishes..."
                  className="flex-1 bg-transparent text-sm text-charcoal placeholder:text-charcoal/40 outline-none"
                  style={{ fontFamily: "var(--font-inter)" }}
                />
              </div>

              {navLinks.map((link, i) =>
                link.isRoute ? (
                  <motion.div key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="block px-4 py-3 text-base font-medium text-charcoal/80 hover:text-emerald hover:bg-emerald/5 rounded-xl transition-all"
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
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="px-4 py-3 text-base font-medium text-charcoal/80 hover:text-emerald hover:bg-emerald/5 rounded-xl transition-all"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {link.label}
                  </motion.a>
                )
              )}
              <Link
                href="/menu"
                onClick={() => setMobileOpen(false)}
                className="mt-3 px-6 py-3 bg-gradient-to-r from-emerald to-[#1a7a4a] text-white text-center text-sm font-semibold rounded-full shadow-lg shadow-emerald/20"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Order Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
