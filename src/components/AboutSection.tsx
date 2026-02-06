"use client";

import { motion } from "framer-motion";
import { Leaf, Heart, Flame, Award } from "lucide-react";

const values = [
  {
    icon: Leaf,
    title: "100% Vegetarian",
    description: "Every dish is crafted with the finest vegetarian ingredients. No compromises.",
  },
  {
    icon: Heart,
    title: "Made with Love",
    description: "Recipes passed down through generations, prepared with genuine care and passion.",
  },
  {
    icon: Flame,
    title: "Fresh & Hot",
    description: "From our kitchen to your doorstep. We ensure every order arrives fresh and piping hot.",
  },
  {
    icon: Award,
    title: "Premium Quality",
    description: "We source the best ingredients and maintain the highest standards of hygiene.",
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="relative py-28 bg-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-emerald/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-saffron/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="text-center mb-20"
        >
          <span
            className="text-sm font-semibold text-saffron-dark uppercase tracking-[0.2em] mb-3 block"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Our Story
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-charcoal mb-6">
            The <span className="text-emerald">Nilkanth</span> Promise
          </h2>
          <p
            className="text-warm-gray text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Born from a passion for authentic vegetarian cuisine, Nilkanth Restaurant
            brings the rich flavors of North Indian and Chinese cooking right to your
            doorstep. Every dish tells a story of tradition, quality, and love.
          </p>
        </motion.div>

        {/* Values Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, i) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: i * 0.1,
                type: "spring",
                stiffness: 100,
                damping: 20,
              }}
            >
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group text-center p-8 rounded-3xl bg-cream/50 border border-light-border/50 hover:bg-white hover:shadow-[0_8px_40px_rgba(15,81,50,0.08)] transition-all duration-500"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald/10 to-emerald/5 flex items-center justify-center mx-auto mb-6 group-hover:from-emerald group-hover:to-emerald-light transition-all duration-500">
                  <value.icon
                    size={28}
                    className="text-emerald group-hover:text-white transition-colors duration-500"
                  />
                </div>
                <h3
                  className="text-lg font-bold text-charcoal mb-3"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {value.title}
                </h3>
                <p
                  className="text-sm text-warm-gray leading-relaxed"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {value.description}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Highlight Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="mt-20 bg-gradient-to-r from-emerald to-emerald-light rounded-3xl p-10 sm:p-14 text-center text-white shadow-xl shadow-emerald/20"
        >
          <h3
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            140+ Dishes. One Promise.
          </h3>
          <p
            className="text-white/80 text-lg max-w-xl mx-auto"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            From comforting Dals to sizzling Tandoori, from aromatic Biryanis to
            indulgent Desserts &mdash; taste the difference that love makes.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
