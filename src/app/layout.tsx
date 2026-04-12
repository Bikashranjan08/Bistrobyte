import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "BistroByte - Authentic Cloud Kitchen | Mint & Amethyst Edition",
  description: "Experience authentic vegetarian cuisine with BistroByte. delicious soups, starters, curries, and more delivered with warmth. Order online now!",
  keywords: ["cloud kitchen", "vegetarian food", "indian cuisine", "food delivery", "bistrobyte", "authentic veg", "paneer", "soup", "biryani"],
  openGraph: {
    title: "BistroByte - Authentic Cloud Kitchen",
    description: "Experience authentic vegetarian cuisine with BistroByte. delicious soups, starters, curries, and more delivered with warmth.",
    url: "https://bistrobyte-kitchen.com", // Placeholder URL
    siteName: "BistroByte Cloud Kitchen",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BistroByte - Authentic Cloud Kitchen",
    description: "Authentic vegetarian cuisine delivered with warmth.",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#ebfdf5", // mint-whisper
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <html lang="en">
        <body
          suppressHydrationWarning={true}
          className={`${playfair.variable} ${inter.variable} antialiased bg-mint-whisper text-dark-evergreen selection:bg-emerald-green selection:text-white-light`}
        >
          <CartProvider>
            <Toaster position="top-center" richColors />
            <Navbar />
            {children}
          </CartProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
