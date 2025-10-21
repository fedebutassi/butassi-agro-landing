import { Wheat, Sprout, Users } from "lucide-react";

const AboutSection = () => {
  const features = [
    {
      icon: Wheat,
      title: "Cereales",
      description: "Comercialización de cereales de alta calidad con trayectoria y confianza en el mercado"
    },
    {
      icon: Sprout,
      title: "Agroquímicos",
      description: "Productos fitosanitarios de primera línea para el cuidado y protección de cultivos"
    },
    {
      icon: Users,
      title: "Empresa Familiar",
      description: "Compromiso y dedicación de generaciones al servicio del campo argentino"
    }
  ];

  return (
    <section id="nosotros" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Nuestra Empresa
            </h2>
            <div className="w-24 h-1 bg-accent mx-auto mb-6 rounded-full"></div>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Somos una empresa familiar de Río Tercero, Córdoba, con una sólida trayectoria 
              en la comercialización de cereales y agroquímicos. Nuestro compromiso es brindar 
              servicios de apoyo agrícola de calidad con la confianza y cercanía que nos caracteriza.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-card rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up border border-border"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-16 bg-card rounded-2xl p-8 md:p-12 shadow-lg border border-border animate-fade-in">
            <div className="max-w-3xl mx-auto text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                ¿Por qué elegirnos?
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                En Butassi Hnos. entendemos las necesidades del campo argentino. 
                Trabajamos día a día para ofrecer soluciones eficientes y personalizadas 
                que acompañen el crecimiento de nuestros clientes.
              </p>
              <p className="text-primary font-semibold text-xl">
                Confianza, calidad y servicio personalizado
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
