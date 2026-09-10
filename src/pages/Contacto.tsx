import Navbar from "@/components/Navbar";
import ContactSection from "@/components/ContactSection";
import WhatsAppButton from "@/components/WhatsAppButton";
import Footer from "@/components/Footer";
import { usePageMeta } from "@/hooks/usePageMeta";

const Contacto = () => {
  usePageMeta({
    title: "Contacto | Butassi Hnos. Corralito, Córdoba",
    description: "Envianos tu consulta o contactanos por WhatsApp, teléfono o email desde Corralito, Córdoba.",
    path: "/contacto",
  });

  return (
    <div className="min-h-screen">
      <Navbar />
      <main id="main-content" className="pt-20">
        <ContactSection />
      </main>
      <WhatsAppButton />
      <Footer />
    </div>
  );
};

export default Contacto;
