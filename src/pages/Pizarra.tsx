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

                {/* Imagen de pizarra */}
                <div className="w-full aspect-[9/16] bg-muted rounded-lg overflow-hidden">
                  <img
                    src="/pizarra2011.png"
                    alt="Pizarra de Rosario"
                    className="w-full h-full object-cover"
                  />
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
