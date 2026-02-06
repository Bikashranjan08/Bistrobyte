"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-charcoal text-white pt-20 pb-8 overflow-hidden">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald via-saffron to-emerald" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-12 mb-16">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald to-emerald-light flex items-center justify-center">
                <span
                  className="text-white font-bold text-lg"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  N
                </span>
              </div>
              <div>
                <h3
                  className="text-xl font-bold"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Nilkanth
                </h3>
                <p
                  className="text-[10px] uppercase tracking-[0.2em] text-white/50 -mt-0.5"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Restaurant
                </p>
              </div>
            </div>
            <p
              className="text-white/60 text-sm leading-relaxed max-w-xs"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Premium vegetarian cloud kitchen delivering authentic North Indian
              and Chinese flavors to your doorstep.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="text-sm font-semibold uppercase tracking-wider text-saffron mb-6"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { href: "#home", label: "Home" },
                { href: "#menu", label: "Menu" },
                { href: "#about", label: "About" },
                { href: "#contact", label: "Contact" },
                { href: "/menu", label: "Full Menu" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-saffron text-sm transition-colors duration-300"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4
              className="text-sm font-semibold uppercase tracking-wider text-saffron mb-6"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Popular Categories
            </h4>
            <ul className="space-y-3">
              {["Starters", "Main Course", "Biryani", "Tandoori", "Noodles"].map(
                (cat) => (
                  <li key={cat}>
                    <span
                      className="text-white/60 text-sm"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {cat}
                    </span>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p
            className="text-white/40 text-sm"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            &copy; {new Date().getFullYear()} Nilkanth Restaurant. All rights reserved.
          </p>
          <motion.button
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-saffron flex items-center justify-center transition-colors duration-300"
          >
            <ArrowUp size={18} />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
