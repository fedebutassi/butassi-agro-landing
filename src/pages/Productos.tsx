import { useState } from "react";
import Navbar from "@/components/Navbar";
import WhatsAppButton from "@/components/WhatsAppButton";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Send, Trash2 } from "lucide-react";

type ProductItem = {
  nombre: string;
  cantidad: string;
};

const Productos = () => {
  const [productos, setProductos] = useState<ProductItem[]>([
    { nombre: "", cantidad: "" },
  ]);

  const whatsappNumber = "5493571327923";

  const handleAgregarCampo = () => {
    setProductos((prev) => [...prev, { nombre: "", cantidad: "" }]);
  };

  const handleEliminar = (index: number) => {
    if (productos.length === 1) return;
    setProductos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: keyof ProductItem, value: string) => {
    setProductos((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const productosValidos = productos.filter(
    (p) => p.nombre.trim() && p.cantidad.trim()
  );

  const generarMensaje = () => {
    let mensaje = "¡Hola! Me gustaría solicitar cotización de los siguientes productos:\n\n";
    productosValidos.forEach((item, index) => {
      mensaje += `${index + 1}. ${item.nombre} - Cantidad: ${item.cantidad}\n`;
    });
    mensaje += "\n¡Gracias!";
    return mensaje;
  };

  const handleEnviar = () => {
    const mensaje = encodeURIComponent(generarMensaje());
    window.open(`https://wa.me/${whatsappNumber}?text=${mensaje}`, "_blank");
  };

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

            {/* Formulario de cotización */}
            <div className="max-w-2xl mx-auto">
              <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-foreground text-center mb-2">
                  Solicita tu cotización de productos sin cargo
                </h2>
                <p className="text-muted-foreground text-center mb-8">
                  Agregá los productos que necesitás y envianos tu pedido
                </p>

                {/* Campos de productos */}
                <div className="space-y-4 mb-6">
                  {productos.map((item, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-3 items-end"
                    >
                      <div>
                        {index === 0 && (
                          <Label htmlFor={`producto-${index}`} className="text-foreground">
                            Nombre del producto
                          </Label>
                        )}
                        <Input
                          id={`producto-${index}`}
                          value={item.nombre}
                          onChange={(e) => handleChange(index, "nombre", e.target.value)}
                          placeholder="Ej: Glifosato, Atrazina, 2,4-D..."
                          className={index === 0 ? "mt-2" : ""}
                        />
                      </div>
                      <div>
                        {index === 0 && (
                          <Label htmlFor={`cantidad-${index}`} className="text-foreground">
                            Cantidad (kg o lt)
                          </Label>
                        )}
                        <Input
                          id={`cantidad-${index}`}
                          value={item.cantidad}
                          onChange={(e) => handleChange(index, "cantidad", e.target.value)}
                          placeholder="Ej: 100 lt, 50 kg"
                          className={index === 0 ? "mt-2" : ""}
                        />
                      </div>
                      {productos.length > 1 ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEliminar(index)}
                          className="text-destructive hover:text-destructive/80 h-10 w-10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      ) : (
                        <div className="w-10" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Botón agregar */}
                <Button
                  variant="outline"
                  onClick={handleAgregarCampo}
                  className="w-full mb-6"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar otro producto
                </Button>

                {/* Vista previa del mensaje */}
                {productosValidos.length > 0 && (
                  <div className="border border-border rounded-lg p-4 mb-6 bg-muted/50">
                    <h3 className="font-semibold text-foreground mb-3">
                      Vista previa del mensaje:
                    </h3>
                    <p className="text-muted-foreground whitespace-pre-line text-sm">
                      {generarMensaje()}
                    </p>
                  </div>
                )}

                {/* Botón de enviar */}
                {productosValidos.length > 0 && (
                  <Button
                    onClick={handleEnviar}
                    size="lg"
                    className="w-full bg-[#25D366] hover:bg-[#1da851] text-white"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Enviar por WhatsApp
                  </Button>
                )}
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

export default Productos;
