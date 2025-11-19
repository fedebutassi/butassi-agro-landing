import Navbar from "@/components/Navbar";
import WhatsAppButton from "@/components/WhatsAppButton";
import Footer from "@/components/Footer";

const Pizarra = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20">
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Pizarra de Rosario
              </h1>
              <div className="w-24 h-1 bg-accent mx-auto mb-6 rounded-full" />
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Precios actualizados del mercado
              </p>
            </div>
            
            <div className="max-w-2xl mx-auto">
              <div className="bg-muted/30 rounded-xl p-4 border border-border">
                {/* Placeholder para la imagen de 1080x1920 */}
                <div className="w-full aspect-[9/16] bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground text-center px-4">
                    Imagen de pizarra (1080x1920)<br />
                    <span className="text-sm">Sube tu imagen aquí</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <WhatsAppButton />
      <Footer />
    </div>
  );
};

export default Pizarra;
