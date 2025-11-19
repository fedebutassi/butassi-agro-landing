import Navbar from "@/components/Navbar";
import ContactSection from "@/components/ContactSection";
import WhatsAppButton from "@/components/WhatsAppButton";
import Footer from "@/components/Footer";

const Contacto = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20">
        <ContactSection />
      </main>
      <WhatsAppButton />
      <Footer />
    </div>
  );
};

export default Contacto;
