"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { KineticText } from "@/components/KineticText";

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
      className="relative min-h-[100dvh] flex items-center overflow-hidden pt-24 pb-12 lg:py-0"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% -20%, var(--color-mint-whisper) 0%, transparent 70%), radial-gradient(circle at 80% 80%, rgba(124, 58, 237, 0.03) 0%, transparent 50%), linear-gradient(180deg, #FFFFFF 0%, var(--color-mint-whisper) 100%)",
      }}
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Mint Glow Top Left */}
        <div className="absolute -top-40 -left-40 w-[800px] h-[800px] bg-gradient-to-br from-emerald-green/5 via-emerald-green/2 to-transparent rounded-full blur-3xl opacity-60" />

        {/* Amethyst Glow Bottom Right */}
        <div className="absolute -bottom-20 -right-20 w-[600px] h-[600px] bg-gradient-to-tl from-royal-amethyst/5 via-royal-amethyst/2 to-transparent rounded-full blur-3xl opacity-50" />

        {/* Kinetic Circles */}
        <motion.div
          style={{ y: heroImageY }}
          className="absolute top-1/3 right-[10%] w-[400px] h-[400px] border border-emerald-green/5 rounded-full"
        />
        <motion.div
          style={{ y: heroImageY }}
          className="absolute top-[40%] right-[15%] w-[200px] h-[200px] border border-royal-amethyst/5 rounded-full"
        />

        {/* Floating Particles */}
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3], y: [0, -20, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] right-[20%] w-3 h-3 bg-emerald-green/20 rounded-full blur-[1px]"
        />
        <motion.div
          animate={{ opacity: [0.2, 0.5, 0.2], y: [0, 30, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[30%] left-[10%] w-2 h-2 bg-royal-amethyst/20 rounded-full blur-[1px]"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-4 items-center">
          {/* Left - Text Content */}
          <motion.div
            style={{ y: textY, opacity }}
            className="relative z-10"
          >
            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 bg-white/60 backdrop-blur-md rounded-full mb-6 lg:mb-8 border border-emerald-green/10 shadow-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-green opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-green" />
              </span>
              <span
                className="text-xs font-semibold text-emerald-dark uppercase tracking-widest"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Kinetic Culinary Art
              </span>
            </motion.div>

            <div className="mb-6">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-dark-evergreen leading-[1.1] tracking-tight">
                <KineticText text="Authentic" type="word" className="block text-dark-evergreen" delay={0.2} />
                <span className="relative inline-block mt-1">
                  <KineticText
                    text="Modern Comfort."
                    type="word"
                    className="relative z-10 bg-gradient-to-r from-emerald-green via-emerald-green to-royal-amethyst bg-clip-text text-transparent"
                    delay={0.6}
                  />
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 1.0, duration: 0.8, ease: "circOut" }}
                    className="absolute bottom-1 lg:bottom-3 left-0 right-0 h-3 lg:h-4 bg-emerald-green/10 -z-0 origin-left rounded-sm -rotate-1"
                  />
                </span>
              </h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-base lg:text-lg text-emerald-dark/80 max-w-md mb-8 lg:mb-10 leading-relaxed font-light"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Experience a well-knitted symphony of flavors. North Indian & Chinese cuisine, reimagined for the modern palate.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="flex flex-wrap gap-4 items-center"
            >
              <Link
                href="/menu"
                className="group relative px-6 lg:px-8 py-3 lg:py-4 bg-dark-evergreen text-white font-medium rounded-full overflow-hidden shadow-lg shadow-emerald-green/20 hover:shadow-emerald-green/30 transition-all duration-300 transform hover:-translate-y-1"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-emerald-green to-emerald-dark opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative z-10 flex items-center gap-3 text-sm lg:text-base">
                  Explore Menu
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 3 }}
                  >
                    &rarr;
                  </motion.span>
                </span>
              </Link>
              <a
                href="#about"
                className="px-6 lg:px-8 py-3 lg:py-4 border border-dark-evergreen/10 text-dark-evergreen font-medium rounded-full hover:bg-emerald-green/5 transition-all duration-300 hover:border-emerald-green/30 backdrop-blur-sm text-sm lg:text-base"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Our Story
              </a>
            </motion.div>

            {/* Kinetic Stats */}
            <div className="mt-10 lg:mt-16 border-t border-emerald-green/10 pt-6 lg:pt-8 flex gap-10 lg:gap-12">
              {[
                { value: "140+", label: "Dishes" },
                { value: "100%", label: "Vegetarian" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + i * 0.1 }}
                >
                  <p className="text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-dark-evergreen to-emerald-green" style={{ fontFamily: "var(--font-playfair)" }}>
                    {stat.value}
                  </p>
                  <p className="text-xs text-emerald-dark/60 uppercase tracking-wider font-medium mt-1" style={{ fontFamily: "var(--font-inter)" }}>
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Hero Visual */}
          <motion.div
            style={{ y: heroImageY }}
            className="relative flex items-center justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-[280px] sm:max-w-[400px] lg:max-w-[580px] aspect-square mx-auto lg:mx-0">
              {/* Central Glow */}
              <div className="absolute inset-[15%] bg-gradient-to-tr from-emerald-green/20 via-white/50 to-royal-amethyst/10 rounded-full blur-[60px] animate-pulse-slow" />

              {/* Composition */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="relative w-full h-full z-10"
              >
                <motion.div
                  animate={{ y: [-15, 15, -15] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="relative w-full h-full"
                >
                  <Image
                    src="/paneer-handi.png"
                    alt="Signature Dish"
                    fill
                    className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
                    sizes="(max-width: 768px) 90vw, 580px"
                    priority
                  />
                </motion.div>
              </motion.div>

              {/* Floating Cards - Glassmorphism */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4, type: "spring" }}
                className="absolute top-[20%] right-0 z-20"
              >
                <div className="bg-white/80 backdrop-blur-xl border border-white/40 p-4 rounded-2xl shadow-xl shadow-emerald-green/5 max-w-[160px]">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-green animate-pulse" />
                    <span className="text-xs font-medium text-dark-evergreen">Live Kitchen</span>
                  </div>
                  <div className="h-1 w-full bg-emerald-green/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-emerald-green"
                      initial={{ width: 0 }}
                      animate={{ width: "70%" }}
                      transition={{ delay: 2, duration: 1.5 }}
                    />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.6, type: "spring" }}
                className="absolute bottom-[20%] left-0 z-20"
              >
                <div className="bg-white/80 backdrop-blur-xl border border-white/40 p-4 rounded-2xl shadow-xl shadow-royal-amethyst/5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-royal-amethyst/10 flex items-center justify-center text-royal-amethyst font-bold">
                    4.9
                  </div>
                  <div>
                    <p className="text-sm font-bold text-dark-evergreen">Top Rated</p>
                    <p className="text-xs text-emerald-dark/60">1k+ Reviews</p>
                  </div>
                </div>
              </motion.div>

            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
