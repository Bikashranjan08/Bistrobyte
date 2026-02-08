"use client";

import { motion } from "framer-motion";
import { Leaf, Heart, Flame, Award, UtensilsCrossed, Truck, ShieldCheck, ChefHat } from "lucide-react";
import NextImage from "next/image";

const values = [
  {
    icon: Leaf,
    title: "100% Vegetarian",
    description: "Every dish is crafted with the finest vegetarian ingredients. No compromises, ever.",
  },
  {
    icon: Heart,
    title: "Made with Love",
    description: "Recipes passed down through generations, prepared with genuine care and passion.",
  },
  {
    icon: Flame,
    title: "Fresh & Hot",
    description: "From our kitchen to your doorstep — every order arrives fresh and piping hot.",
  },
  {
    icon: Award,
    title: "Premium Quality",
    description: "We source the best ingredients and maintain the highest standards of hygiene.",
  },
];

const stats = [
  { number: "140+", label: "Dishes on Menu" },
  { number: "10+", label: "Cuisine Styles" },
  { number: "1000+", label: "Happy Customers" },
  { number: "100%", label: "Pure Vegetarian" },
];

/* Decorative mandala-style SVG corner ornament */
function MandalaCorner({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity="0.15">
        {/* Outer arcs */}
        <path
          d="M0 0 C0 110.5 89.5 200 200 200"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M0 30 C0 124 76 200 170 200"
          stroke="currentColor"
          strokeWidth="1"
        />
        <path
          d="M0 60 C0 137.3 62.7 200 140 200"
          stroke="currentColor"
          strokeWidth="1"
        />
        <path
          d="M0 90 C0 150.7 49.3 200 110 200"
          stroke="currentColor"
          strokeWidth="1"
        />
        {/* Petal shapes */}
        <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="1" />
        <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="0.8" />
        <circle cx="50" cy="50" r="50" stroke="currentColor" strokeWidth="0.6" />
        {/* Small decorative dots */}
        <circle cx="20" cy="20" r="3" fill="currentColor" />
        <circle cx="80" cy="20" r="2" fill="currentColor" />
        <circle cx="20" cy="80" r="2" fill="currentColor" />
        <circle cx="100" cy="100" r="3" fill="currentColor" />
        <circle cx="140" cy="140" r="2" fill="currentColor" />
        <circle cx="60" cy="140" r="2" fill="currentColor" />
        <circle cx="140" cy="60" r="2" fill="currentColor" />
        {/* Inner petal pattern */}
        <path
          d="M50 30 Q65 50 50 70 Q35 50 50 30Z"
          stroke="currentColor"
          strokeWidth="0.8"
        />
        <path
          d="M30 50 Q50 35 70 50 Q50 65 30 50Z"
          stroke="currentColor"
          strokeWidth="0.8"
        />
      </g>
    </svg>
  );
}

export default function AboutSection() {
  return (
    <section id="about" className="relative overflow-hidden bg-mint-whisper">
      {/* ═══ Hero: Pure Veg. Pure Love. ═══ */}
      <div className="relative py-24 sm:py-32 overflow-hidden">
        {/* Mandala corners */}
        <MandalaCorner className="absolute top-0 left-0 w-48 sm:w-64 h-48 sm:h-64 text-royal-amethyst" />
        <MandalaCorner className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 text-royal-amethyst -scale-x-100" />
        <MandalaCorner className="absolute bottom-0 left-0 w-36 sm:w-48 h-36 sm:h-48 text-emerald-green -scale-y-100" />
        <MandalaCorner className="absolute bottom-0 right-0 w-36 sm:w-48 h-36 sm:h-48 text-emerald-green scale-x-[-1] scale-y-[-1]" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Text content */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ type: "spring", stiffness: 80, damping: 20 }}
            >
              <span
                className="text-sm font-semibold text-royal-amethyst uppercase tracking-[0.2em] mb-4 block"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Our Story
              </span>
              <h2
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-dark-evergreen mb-6 leading-tight"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Pure Veg.{" "}
                <span className="text-emerald-green">Pure Love.</span>
              </h2>
              <p
                className="text-emerald-dark/70 text-lg leading-relaxed mb-6"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                From our modern cloud kitchen to your doorstep, we bring you the
                authentic taste of Nilkanth. 100% vegetarian, prepared with care
                and hygiene.
              </p>
              <p
                className="text-emerald-dark/70 text-base leading-relaxed"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Born from a deep passion for authentic vegetarian cuisine, Nilkanth
                Cloud Kitchen brings the rich flavors of North Indian, Chinese, and
                Tandoori cooking right to your table. Every dish tells a story of
                tradition, quality, and love.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.15 }}
              className="flex justify-center"
            >
              <div className="relative w-full max-w-2xl">
                {/* Circular frame behind illustration */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-96 h-96 sm:w-[28rem] sm:h-[28rem] rounded-full bg-gradient-to-br from-emerald-green/10 to-royal-amethyst/5 border border-emerald-green/10" />
                </div>
                {/* Kitchen SVG illustration */}
                <div className="relative z-10 flex items-center justify-center py-8">
                  <NextImage
                    src="/about-us-chef-final.png"
                    alt="Our Cloud Kitchen Team"
                    width={1000}
                    height={750}
                    className="w-full max-w-xl drop-shadow-2xl rounded-2xl"
                    priority
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ═══ Stats Bar ═══ */}
      <div className="bg-dark-evergreen py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-50px" }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
                className="text-center"
              >
                <p
                  className="text-3xl sm:text-4xl font-bold text-emerald-green mb-1"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {stat.number}
                </p>
                <p
                  className="text-white/70 text-sm font-medium"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ Values Grid ═══ */}
      <div className="bg-white py-24 sm:py-28 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #10B981 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-50px" }}
            transition={{ type: "spring", stiffness: 80, damping: 20 }}
            className="text-center mb-16"
          >
            <span
              className="text-sm font-semibold text-royal-amethyst uppercase tracking-[0.2em] mb-3 block"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Why Choose Us
            </span>
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-dark-evergreen mb-4"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              The <span className="text-emerald-green">Nilkanth</span> Promise
            </h2>
            <p
              className="text-emerald-dark/70 text-lg max-w-2xl mx-auto"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Nourish your body, elevate your soul. Here is what sets us apart.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-50px" }}
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
                  className="group text-center p-8 rounded-3xl bg-mint-whisper border border-emerald-green/10 hover:bg-white hover:shadow-[0_8px_40px_rgba(16,185,129,0.12)] transition-all duration-500"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-green/10 to-emerald-green/5 flex items-center justify-center mx-auto mb-6 group-hover:from-emerald-green group-hover:to-emerald-green/80 transition-all duration-500">
                    <value.icon
                      size={28}
                      className="text-emerald-green group-hover:text-white transition-colors duration-500"
                    />
                  </div>
                  <h3
                    className="text-lg font-bold text-dark-evergreen mb-3"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {value.title}
                  </h3>
                  <p
                    className="text-sm text-emerald-dark/70 leading-relaxed"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {value.description}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ Our Journey / Story Section ═══ */}
      <div className="bg-mint-whisper py-24 sm:py-28 relative overflow-hidden">
        <MandalaCorner className="absolute bottom-0 right-0 w-48 h-48 text-royal-amethyst scale-x-[-1] scale-y-[-1]" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Cuisine mosaic */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: "-50px" }}
              transition={{ type: "spring", stiffness: 80, damping: 20 }}
              className="grid grid-cols-2 gap-6"
            >
              {[
                { icon: UtensilsCrossed, label: "North Indian", desc: "Rich curries & gravies", color: "from-emerald-green to-emerald-dark" },
                { icon: Flame, label: "Tandoori", desc: "Clay oven specials", color: "from-royal-amethyst to-royal-amethyst-light" },
                { icon: ChefHat, label: "Chinese", desc: "Indo-Chinese fusion", color: "from-emerald-green to-emerald-green" },
                { icon: Truck, label: "Cloud Kitchen", desc: "Fast delivery to you", color: "from-royal-amethyst/80 to-royal-amethyst-light" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: false, margin: "-50px" }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative rounded-2xl p-6 bg-gradient-to-br ${item.color} text-white overflow-hidden shadow-lg`}
                >
                  <item.icon size={32} className="mb-3 opacity-90" />
                  <h4
                    className="font-bold text-base mb-1"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {item.label}
                  </h4>
                  <p
                    className="text-xs text-white/80"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: "-50px" }}
              transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.1 }}
            >
              <span
                className="text-sm font-semibold text-royal-amethyst uppercase tracking-[0.2em] mb-4 block"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                What We Serve
              </span>
              <h2
                className="text-3xl sm:text-4xl font-bold text-dark-evergreen mb-6"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                A Menu That Speaks{" "}
                <span className="text-emerald-green">Flavors</span>
              </h2>
              <div className="space-y-4" style={{ fontFamily: "var(--font-inter)" }}>
                <p className="text-emerald-dark/80 leading-relaxed">
                  Our extensive menu features over <strong className="text-dark-evergreen">140+ dishes</strong> spanning
                  comforting Soups, crispy Starters, aromatic Biryanis, rich Main Courses,
                  fresh Tandoori breads, and indulgent Desserts.
                </p>
                <p className="text-emerald-dark/80 leading-relaxed">
                  From the classic <strong className="text-dark-evergreen">Paneer Butter Masala</strong> and{" "}
                  <strong className="text-dark-evergreen">Mushroom Tikka</strong> to our signature{" "}
                  <strong className="text-dark-evergreen">Nilkanth Spl Veg Soup</strong> — each dish
                  is a celebration of vegetarian excellence.
                </p>
              </div>

              {/* Mini feature list */}
              <div className="mt-8 grid grid-cols-2 gap-3">
                {["Soups & Salads", "Noodles & Fried Rice", "Starters & Tandoori", "Biryanis & Curries", "Dal & Breads", "Desserts & Drinks"].map(
                  (item) => (
                    <div key={item} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-green flex-shrink-0" />
                      <span
                        className="text-sm text-dark-evergreen/80"
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        {item}
                      </span>
                    </div>
                  )
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ═══ Hygiene & Trust Banner ═══ */}
      <div className="bg-white py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-50px" }}
            transition={{ type: "spring", stiffness: 80, damping: 20 }}
            className="bg-gradient-to-r from-emerald-green to-emerald-dark rounded-3xl p-10 sm:p-14 text-white shadow-xl shadow-emerald-green/20 relative overflow-hidden"
          >
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/3" />

            <div className="relative z-10 grid sm:grid-cols-2 gap-8 items-center">
              <div>
                <h3
                  className="text-3xl sm:text-4xl font-bold mb-4"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Hygiene First. Always.
                </h3>
                <p
                  className="text-white/80 text-lg leading-relaxed"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Our cloud kitchen follows the strictest hygiene protocols.
                  Every ingredient is fresh, every surface is sanitized, and
                  every meal is packed with care — so you can enjoy with
                  complete peace of mind.
                </p>
              </div>
              <div className="flex sm:justify-end">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: ShieldCheck, text: "FSSAI Certified" },
                    { icon: Leaf, text: "Pure Veg Only" },
                    { icon: Flame, text: "Fresh Daily" },
                    { icon: Truck, text: "Safe Delivery" },
                  ].map((item) => (
                    <div
                      key={item.text}
                      className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-3"
                    >
                      <item.icon size={18} className="text-emerald-300 flex-shrink-0" />
                      <span
                        className="text-sm font-medium text-white/90"
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
