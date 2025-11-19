import Navbar from "@/components/Navbar";
import WhatsAppButton from "@/components/WhatsAppButton";
import Footer from "@/components/Footer";

const Productos = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20">
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Nuestros Productos
              </h1>
              <div className="w-24 h-1 bg-accent mx-auto mb-6 rounded-full" />
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Productos de alta calidad para satisfacer tus necesidades
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <p className="text-muted-foreground text-center">
                Contenido de productos próximamente...
              </p>
            </div>
          </div>
        </section>
      </main>
      <WhatsAppButton />
      <Footer />
    </div>
  );
};

export default Productos;
