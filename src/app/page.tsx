import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TopDishes from "@/components/TopDishes";
import CategoryPreview from "@/components/CategoryPreview";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <TopDishes />
      <CategoryPreview />
      <AboutSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
