"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const heroImageY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      id="home"
      ref={ref}
      className="relative min-h-screen flex items-center overflow-hidden pt-20"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Warm gradient overlay */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-saffron/8 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-emerald/5 via-transparent to-transparent rounded-full blur-3xl" />
        {/* Mandala-like decorative circle */}
        <motion.div
          style={{ y: heroImageY }}
          className="absolute -top-20 -right-20 w-[500px] h-[500px] border border-saffron/10 rounded-full"
        />
        <motion.div
          style={{ y: heroImageY }}
          className="absolute -top-10 -right-10 w-[400px] h-[400px] border border-emerald/8 rounded-full"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left - Text Content */}
          <motion.div
            style={{ y: textY, opacity }}
            className="relative z-10"
          >
            {/* Pure veg badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald/10 rounded-full mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
              <span
                className="text-xs font-semibold text-emerald uppercase tracking-widest"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                100% Pure Vegetarian
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 80, damping: 15 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-charcoal leading-[1.1] mb-6"
            >
              Authentic Flavors.
              <br />
              <span className="relative inline-block">
                <span className="relative z-10 text-emerald">Modern Comfort.</span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
                  className="absolute bottom-2 left-0 right-0 h-3 bg-saffron/25 -z-0 origin-left rounded-full"
                />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-lg text-warm-gray max-w-md mb-10 leading-relaxed"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              From Veg Manchow Soup to Paneer Handi, experience Nilkanth&apos;s
              legacy at home. Premium vegetarian cuisine, delivered with love.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4 items-center"
            >
              <Link
                href="/menu"
                className="group relative px-8 py-4 bg-gradient-to-r from-saffron to-saffron-dark text-charcoal font-bold rounded-full shadow-xl shadow-saffron/25 hover:shadow-saffron/40 hover:scale-105 active:scale-95 transition-all duration-300 text-base"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  View Menu
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
              <a
                href="#about"
                className="px-8 py-4 border-2 border-charcoal/15 text-charcoal/80 font-semibold rounded-full hover:border-emerald/30 hover:text-emerald hover:bg-emerald/5 transition-all duration-300 text-base"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Our Story
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-14 flex gap-10"
            >
              {[
                { value: "140+", label: "Dishes" },
                { value: "13", label: "Categories" },
                { value: "100%", label: "Vegetarian" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-emerald" style={{ fontFamily: "var(--font-playfair)" }}>
                    {stat.value}
                  </p>
                  <p className="text-xs text-warm-gray font-medium uppercase tracking-wider" style={{ fontFamily: "var(--font-inter)" }}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right - Hero Image */}
          <motion.div
            style={{ y: heroImageY }}
            className="relative flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 60, damping: 15 }}
              className="relative w-full max-w-lg aspect-square"
            >
              {/* Glow behind image */}
              <div className="absolute inset-4 bg-gradient-to-br from-saffron/20 to-emerald/10 rounded-full blur-3xl" />

              {/* Main image */}
              <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/Gemini_Generated_Image_63msgd63msgd63ms-1-resized-1770359445127.webp?width=8000&height=8000&resize=contain"
                  alt="Nilkanth Restaurant signature dish"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Floating price card */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0, type: "spring" }}
                className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 border border-light-border/50"
              >
                <p className="text-xs text-warm-gray font-medium" style={{ fontFamily: "var(--font-inter)" }}>Most Loved</p>
                <p className="text-sm font-bold text-charcoal" style={{ fontFamily: "var(--font-playfair)" }}>Paneer Butter Masala</p>
                <p className="text-lg font-bold text-emerald" style={{ fontFamily: "var(--font-inter)" }}>&#8377;180</p>
              </motion.div>

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, type: "spring" }}
                className="absolute -top-2 -right-2 bg-gradient-to-br from-saffron to-saffron-dark text-charcoal rounded-full px-4 py-2 shadow-lg"
              >
                <p className="text-xs font-bold" style={{ fontFamily: "var(--font-inter)" }}>Pure Veg</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
