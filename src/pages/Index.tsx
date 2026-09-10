import { Suspense, lazy } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import WhatsAppButton from "@/components/WhatsAppButton";
import Footer from "@/components/Footer";
import { usePageMeta } from "@/hooks/usePageMeta";

const RadarAgroClimatico = lazy(() => import("@/components/RadarAgroClimatico"));

const Index = () => {
  usePageMeta({
    title: "Butassi Hnos. | Agroquímicos y Cereales - Corralito, Córdoba",
    description: "Butassi Hnos. — empresa familiar de Corralito, Córdoba. Compra y venta de cereales, agroquímicos y servicios de apoyo agrícola. Más de 20 años de trayectoria.",
    path: "/",
  });

  return (
    <div className="min-h-screen">
      <Navbar />
      <main id="main-content">
        <HeroSection />
        <Suspense fallback={<div className="py-16 px-4 bg-gradient-to-b from-primary/5 via-accent/5 to-background" />}>
          <RadarAgroClimatico />
        </Suspense>
        <AboutSection />
      </main>
      <WhatsAppButton />
      <Footer />
    </div>
  );
};

export default Index;
