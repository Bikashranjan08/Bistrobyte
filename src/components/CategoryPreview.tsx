"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { menuData, categoryImages } from "@/lib/menuData";
import { ArrowRight } from "lucide-react";

const featuredCategories = menuData.filter((c) =>
  ["starters", "main-course", "biryani", "tandoori", "noodles", "desserts"].includes(c.id)
);

export default function CategoryPreview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section id="menu" ref={containerRef} className="relative py-28 overflow-hidden bg-mint-whisper">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-b from-emerald-green/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="text-center mb-16"
        >
          <span
            className="text-sm font-semibold text-royal-amethyst uppercase tracking-[0.2em] mb-3 block"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Explore Our Kitchen
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-dark-evergreen mb-4">
            What&apos;s <span className="text-emerald-green">Cooking?</span>
          </h2>
          <p
            className="text-emerald-dark/70 text-lg max-w-xl mx-auto"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Drag to explore our signature categories. Every dish is crafted with love and the finest ingredients.
          </p>
        </motion.div>

        {/* Horizontal drag gallery */}
        <motion.div
          className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide cursor-grab active:cursor-grabbing"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
          drag="x"
          dragConstraints={containerRef}
          dragElastic={0.2}
        >
          {featuredCategories.map((category, i) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-50px" }}
              transition={{
                delay: i * 0.1,
                type: "spring",
                stiffness: 100,
                damping: 20,
              }}
              className="snap-center flex-shrink-0 w-[300px] sm:w-[340px]"
            >
              <Link href={`/menu?category=${category.id}`}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="group bg-white/60 backdrop-blur-md rounded-3xl overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_50px_rgba(16,185,129,0.12)] border border-emerald-green/10 transition-shadow duration-500"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={categoryImages[category.id] || categoryImages.starters}
                      alt={category.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                      <span className="text-xs font-semibold text-emerald-green" style={{ fontFamily: "var(--font-inter)" }}>
                        {category.items.length} items
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3
                        className="text-xl font-bold text-dark-evergreen group-hover:text-emerald-green transition-colors"
                      >
                        {category.title}
                      </h3>
                      <motion.div
                        className="w-10 h-10 rounded-full bg-mint-whisper flex items-center justify-center group-hover:bg-emerald-green group-hover:text-white transition-all duration-300"
                        whileHover={{ scale: 1.1 }}
                      >
                        <ArrowRight size={16} />
                      </motion.div>
                    </div>
                    <p
                      className="text-sm text-emerald-dark/70"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {category.items.slice(0, 3).map((item) => item.name).join(", ")}
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                      <span className="text-xs font-medium text-emerald-dark/60" style={{ fontFamily: "var(--font-inter)" }}>
                        Starting from
                      </span>
                      <span
                        className="text-lg font-bold text-emerald-green"
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        &#8377;{Math.min(...category.items.map((item) => item.price))}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* View full menu CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          className="text-center mt-12"
        >
          <Link
            href="/menu"
            className="inline-flex items-center gap-3 px-8 py-4 bg-dark-evergreen text-white font-semibold rounded-full hover:bg-emerald-green transition-colors duration-300 shadow-lg"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Explore Full Menu
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
