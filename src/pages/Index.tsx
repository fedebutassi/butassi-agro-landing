import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import RadarAgroClimatico from "@/components/RadarAgroClimatico";
import WhatsAppButton from "@/components/WhatsAppButton";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <RadarAgroClimatico />
      <AboutSection />
      <WhatsAppButton />
      <Footer />
    </div>
  );
};

export default Index;
