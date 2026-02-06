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

  const heroImageY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      id="home"
      ref={ref}
      className="relative min-h-screen flex items-center overflow-hidden pt-20"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 65% 50%, rgba(255,165,0,0.07) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 20% 80%, rgba(34,139,34,0.04) 0%, transparent 60%), linear-gradient(180deg, #FFFBF5 0%, #FFF9F0 40%, #FFFDF8 100%)",
      }}
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Soft golden orb top-right */}
        <div className="absolute -top-32 -right-32 w-[700px] h-[700px] bg-gradient-to-bl from-saffron/10 via-saffron/4 to-transparent rounded-full blur-3xl" />
        {/* Green tint bottom-left */}
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-gradient-to-tr from-emerald/6 to-transparent rounded-full blur-3xl" />
        {/* Subtle decorative rings */}
        <motion.div
          style={{ y: heroImageY }}
          className="absolute top-1/4 right-1/4 w-[350px] h-[350px] border border-saffron/8 rounded-full"
        />
        <motion.div
          style={{ y: heroImageY }}
          className="absolute top-[30%] right-[22%] w-[250px] h-[250px] border border-emerald/6 rounded-full"
        />
        {/* Sparkle dots */}
        <motion.div
          animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.2, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute top-[20%] right-[15%] w-2 h-2 bg-saffron/40 rounded-full"
        />
        <motion.div
          animate={{ opacity: [0.2, 0.7, 0.2], scale: [1, 1.3, 1] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
          className="absolute top-[60%] right-[45%] w-1.5 h-1.5 bg-emerald/30 rounded-full"
        />
        <motion.div
          animate={{ opacity: [0.4, 0.9, 0.4], scale: [1, 1.15, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
          className="absolute top-[15%] left-[55%] w-1.5 h-1.5 bg-saffron/30 rounded-full"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-4 items-center">
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
              className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-gradient-to-r from-emerald/10 to-emerald/5 rounded-full mb-8 border border-emerald/15 backdrop-blur-sm"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald opacity-60" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald" />
              </span>
              <span
                className="text-xs font-semibold text-emerald uppercase tracking-[0.2em]"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                100% Pure Vegetarian
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.3,
                type: "spring",
                stiffness: 80,
                damping: 15,
              }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-charcoal leading-[1.08] mb-6"
            >
              <span className="block">Authentic Flavors.</span>
              <span className="relative inline-block mt-1">
                <span className="relative z-10 bg-gradient-to-r from-emerald via-emerald to-emerald/80 bg-clip-text text-transparent">
                  Modern Comfort.
                </span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
                  className="absolute bottom-2 left-0 right-0 h-3 bg-saffron/20 -z-0 origin-left rounded-full"
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
              From Veg Manchow Soup to Paneer Handi, experience
              Nilkanth&apos;s legacy at home. Premium vegetarian cuisine,
              delivered with love.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4 items-center"
            >
              <Link
                href="/menu"
                className="group relative px-8 py-4 bg-gradient-to-r from-saffron via-saffron to-saffron-dark text-charcoal font-bold rounded-full shadow-xl shadow-saffron/25 hover:shadow-saffron/40 hover:scale-105 active:scale-95 transition-all duration-300 text-base overflow-hidden"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <span className="relative z-10 flex items-center gap-2">
                  View Menu
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              </Link>
              <a
                href="#about"
                className="px-8 py-4 border-2 border-charcoal/12 text-charcoal/70 font-semibold rounded-full hover:border-emerald/30 hover:text-emerald hover:bg-emerald/5 transition-all duration-300 text-base backdrop-blur-sm"
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
                <div key={stat.label} className="relative">
                  <p
                    className="text-3xl font-bold bg-gradient-to-br from-emerald to-emerald/70 bg-clip-text text-transparent"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {stat.value}
                  </p>
                  <p
                    className="text-[11px] text-warm-gray/80 font-medium uppercase tracking-[0.15em] mt-0.5"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right - Floating Paneer Handi Image */}
          <motion.div
            style={{ y: heroImageY }}
            className="relative flex items-center justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-[560px] aspect-square">
              {/* Ambient glow behind dish */}
              <div className="absolute inset-[15%] bg-gradient-to-br from-saffron/25 via-orange-300/15 to-emerald/10 rounded-full blur-[80px]" />
              <div className="absolute inset-[25%] bg-saffron/15 rounded-full blur-[60px]" />

              {/* Main floating dish image */}
              <motion.div
                initial={{ opacity: 0, y: 60, scale: 0.85 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  delay: 0.4,
                  type: "spring",
                  stiffness: 50,
                  damping: 14,
                }}
                className="relative w-full h-full"
              >
                {/* Continuous floating animation */}
                <motion.div
                  animate={{ y: [-8, 8, -8] }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative w-full h-full"
                >
                  <Image
                    src="/paneer-handi.png"
                    alt="Signature Paneer Handi - Nilkanth Cloud Kitchen"
                    fill
                      className="object-contain drop-shadow-2xl"
                      sizes="(max-width: 768px) 90vw, 560px"
                      style={{
                        filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.15)) drop-shadow(0 10px 20px rgba(255,165,0,0.1))",
                      }}
                      priority
                  />
                </motion.div>
              </motion.div>

              {/* Floating card - Most Loved */}
              <motion.div
                initial={{ opacity: 0, x: -40, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 1.0, type: "spring", stiffness: 80 }}
                className="absolute bottom-[12%] -left-2 sm:left-0 z-20"
              >
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl shadow-charcoal/8 p-4 border border-white/60"
                >
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-saffron text-sm">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
                  </div>
                  <p
                    className="text-[13px] font-bold text-charcoal"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    Paneer Handi
                  </p>
                  <p
                    className="text-xs text-warm-gray/70 mt-0.5"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    Most Loved Dish
                  </p>
                  <p
                    className="text-lg font-bold bg-gradient-to-r from-emerald to-emerald/80 bg-clip-text text-transparent mt-1"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    &#8377;220
                  </p>
                </motion.div>
              </motion.div>

              {/* Floating badge - Pure Veg */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, type: "spring", stiffness: 100 }}
                className="absolute top-[8%] right-[5%] z-20"
              >
                <motion.div
                  animate={{ y: [0, -5, 0], rotate: [0, 2, -2, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="bg-gradient-to-br from-emerald to-emerald/90 text-white rounded-2xl px-4 py-3 shadow-xl shadow-emerald/20"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/80 rounded-sm flex items-center justify-center">
                      <span className="w-2 h-2 bg-white rounded-full" />
                    </span>
                    <p
                      className="text-xs font-bold tracking-wide"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      Pure Veg
                    </p>
                  </div>
                </motion.div>
              </motion.div>

              {/* Floating card - Order count */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4, type: "spring" }}
                className="absolute top-[35%] -right-2 sm:right-0 z-20"
              >
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl shadow-charcoal/8 px-4 py-3 border border-white/60"
                >
                  <p
                    className="text-xs text-warm-gray/70"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    Today&apos;s Orders
                  </p>
                  <p
                    className="text-xl font-bold text-charcoal"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    250+
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cream to-transparent pointer-events-none" />
    </section>
  );
}
