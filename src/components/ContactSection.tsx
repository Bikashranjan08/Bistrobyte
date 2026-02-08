"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Clock } from "lucide-react";

export default function ContactSection() {
  return (
    <section id="contact" className="relative py-28 overflow-hidden bg-white">
      {/* Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-royal-amethyst/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
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
            Get In Touch
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-dark-evergreen mb-4">
            Visit <span className="text-emerald-green">Us</span>
          </h2>
          <p
            className="text-emerald-dark/70 text-lg max-w-xl mx-auto"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            We&apos;d love to serve you. Reach out for orders, catering, or just to say hello.
          </p>
        </motion.div>

        {/* Contact Cards */}
        <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            {
              icon: MapPin,
              title: "Location",
              lines: ["Cloud Kitchen", "Delivery Only"],
            },
            {
              icon: Phone,
              title: "Call Us",
              lines: ["For Orders & Inquiries", "Contact via app"],
            },
            {
              icon: Clock,
              title: "Hours",
              lines: ["Mon - Sun: 11AM - 11PM", "Open all days"],
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
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
                className="group text-center p-8 rounded-3xl bg-mint-whisper border border-emerald-green/10 hover:shadow-[0_8px_40px_rgba(16,185,129,0.12)] hover:bg-white transition-all duration-500"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-green/10 to-emerald-green/5 flex items-center justify-center mx-auto mb-5 group-hover:from-emerald-green group-hover:to-emerald-dark transition-all duration-500">
                  <item.icon
                    size={24}
                    className="text-emerald-green group-hover:text-white transition-colors duration-500"
                  />
                </div>
                <h3
                  className="text-lg font-bold text-dark-evergreen mb-2"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {item.title}
                </h3>
                {item.lines.map((line) => (
                  <p
                    key={line}
                    className="text-sm text-emerald-dark/70"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {line}
                  </p>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
