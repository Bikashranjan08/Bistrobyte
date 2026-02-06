"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#menu", label: "Menu" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
          ? "bg-cream/80 backdrop-blur-xl shadow-[0_2px_30px_rgba(15,81,50,0.08)] border-b border-light-border/50"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald to-emerald-light flex items-center justify-center shadow-lg group-hover:shadow-emerald/30 transition-shadow duration-300">
              <span className="text-white font-bold text-lg" style={{ fontFamily: "var(--font-playfair)" }}>N</span>
            </div>
            <div>
              <h1
                className="text-xl font-bold text-emerald tracking-tight"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Nilkanth
              </h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-warm-gray font-medium -mt-0.5">
                Restaurant
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative px-5 py-2 text-sm font-medium text-charcoal/70 hover:text-emerald transition-colors duration-300 group"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-saffron rounded-full group-hover:w-6 transition-all duration-300" />
              </a>
            ))}
            <Link
              href="/menu"
              className="ml-4 px-6 py-2.5 bg-gradient-to-r from-emerald to-emerald-light text-white text-sm font-semibold rounded-full shadow-lg shadow-emerald/20 hover:shadow-emerald/40 hover:scale-105 active:scale-95 transition-all duration-300"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Full Menu
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-cream-dark/80 text-charcoal"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

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
            <div className="px-6 py-6 flex flex-col gap-2">
              {navLinks.map((link, i) => (
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
              ))}
              <Link
                href="/menu"
                onClick={() => setMobileOpen(false)}
                className="mt-2 px-6 py-3 bg-gradient-to-r from-emerald to-emerald-light text-white text-center text-sm font-semibold rounded-full"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                View Full Menu
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
