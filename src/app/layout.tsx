import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";


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
  title: "Nilkanth - Authentic Cloud Kitchen | Mint & Amethyst Edition",
  description: "Experience authentic vegetarian cuisine with Nilkanth. delicious soups, starters, curries, and more delivered with warmth. Order online now!",
  keywords: ["cloud kitchen", "vegetarian food", "indian cuisine", "food delivery", "nilkanth", "authentic veg", "paneer", "soup", "biryani"],
  openGraph: {
    title: "Nilkanth - Authentic Cloud Kitchen",
    description: "Experience authentic vegetarian cuisine with Nilkanth. delicious soups, starters, curries, and more delivered with warmth.",
    url: "https://nilkanth-kitchen.com", // Placeholder URL
    siteName: "Nilkanth Cloud Kitchen",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nilkanth - Authentic Cloud Kitchen",
    description: "Authentic vegetarian cuisine delivered with warmth.",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#ebfdf5", // mint-whisper
};

import { GoogleOAuthProvider } from "@react-oauth/google";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning={true}
        className={`${playfair.variable} ${inter.variable} antialiased bg-mint-whisper text-dark-evergreen selection:bg-emerald-green selection:text-white-light`}
      >
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
          <AuthProvider>
            <CartProvider>
              <Navbar />
              {children}
            </CartProvider>
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
