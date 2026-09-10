import Navbar from "@/components/Navbar";
import ContactSection from "@/components/ContactSection";
import WhatsAppButton from "@/components/WhatsAppButton";
import Footer from "@/components/Footer";
import { usePageMeta } from "@/hooks/usePageMeta";

const Contacto = () => {
  usePageMeta("/contacto");

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
