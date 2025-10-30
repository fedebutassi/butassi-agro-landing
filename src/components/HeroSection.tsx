import { ChevronDown } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import logoImage from "@/assets/butassihnos.png";

const HeroSection = () => {
  const scrollToContact = () => {
    document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/70 to-background/95" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="bg-background/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl animate-float">
              <img 
                src={logoImage}
                alt="Butassi Hnos." 
                className="h-32 md:h-40 w-auto mx-auto"
              />
            </div>
          </div>

          {/* Slogan */}
          <h2 className="text-3xl md:text-5xl font-bold text-background drop-shadow-lg">
            Servicios de Apoyo Agrícola
          </h2>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-background/95 drop-shadow max-w-2xl mx-auto">
            Comercialización de cereales y agroquímicos en Corralito, Córdoba.
          </p>

          {/* CTA Button */}
          <div className="pt-6">
            <button
              onClick={scrollToContact}
              className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold h-12 rounded-md px-8 text-base inline-flex items-center justify-center gap-2"
            >
              Contáctanos
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-background drop-shadow-lg" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
