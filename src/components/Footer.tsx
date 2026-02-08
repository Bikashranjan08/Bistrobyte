"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUp, Instagram, Facebook, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-dark-evergreen text-white pt-8 pb-0 overflow-hidden">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-green via-royal-amethyst to-emerald-green" />

      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Main footer content - 4 columns with namaste image */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
          {/* Quick Links */}
          <div>
            <h4
              className="text-base font-bold italic text-emerald-green mb-3"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { href: "#menu", label: "Menu" },
                { href: "#about", label: "About Us" },
                { href: "#contact", label: "Contact" },
                { href: "/menu", label: "Full Menu" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-emerald-green text-sm transition-colors duration-300"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h4
              className="text-base font-bold italic text-emerald-green mb-3"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Follow Us
            </h4>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:bg-emerald-green hover:border-emerald-green hover:text-white transition-all duration-300"
              >
                <Instagram size={16} />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:bg-emerald-green hover:border-emerald-green hover:text-white transition-all duration-300"
              >
                <Facebook size={16} />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4
              className="text-base font-bold italic text-emerald-green mb-3"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Contact Info
            </h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <MapPin size={14} className="text-emerald-green mt-0.5 shrink-0" />
                <p
                  className="text-white/70 text-sm leading-relaxed"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Avamment Road,
                  <br />
                  Nilkanth, IL-98001
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-emerald-green shrink-0" />
                <p
                  className="text-white/70 text-sm"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  +1 291 565 7788
                </p>
              </div>
            </div>
          </div>

          {/* Namaste Illustration */}
          <div className="flex flex-col items-center justify-center mt-12 lg:-mt-38 pointer-events-none select-none order-first lg:order-last">
            <div className="relative w-80 h-[450px]">
              <Image
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/beb49228-4a99-4310-a910-e58e1a27f2a6/ChatGPT-Image-Feb-6-2026-06_47_46-PM-1770384372593.png?width=800&height=800&resize=contain"
                alt="Namaste - Thank you"
                fill
                className="object-contain drop-shadow-2xl"
                sizes="(max-width: 768px) 250px, 400px"
                priority
              />
            </div>
            <p
              className="text-emerald-green text-2xl font-bold italic -mt-24 lg:-mt-37 relative z-10 drop-shadow-md"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Thank You!
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 bg-[#022C22] mt-6">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p
            className="text-white/40 text-xs"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            &copy; {new Date().getFullYear()} Nilkanth Cloud Kitchen. All rights reserved.
          </p>
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-emerald-green flex items-center justify-center transition-colors duration-300"
          >
            <ArrowUp size={14} />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
