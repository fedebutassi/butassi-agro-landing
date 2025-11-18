// src/components/ContactSection.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { toast } from "sonner";

type FormData = {
  nombre: string;
  email: string;
  telefono: string;
  mensaje: string;
  company?: string; // honeypot
};

const ContactSection = () => {
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    email: "",
    telefono: "",
    mensaje: "",
    company: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot: si viene con valor, no enviamos (probable bot)
    if (formData.company && formData.company.trim().length > 0) {
      return;
    }

    // Validación básica
    if (!formData.nombre || !formData.email || !formData.mensaje) {
      toast.error("Por favor completá todos los campos obligatorios");
      return;
    }

    // Crear el mailto link
    const subject = encodeURIComponent(`Consulta desde web - ${formData.nombre}`);
    const body = encodeURIComponent(
      `Nombre: ${formData.nombre}\n` +
      `Email: ${formData.email}\n` +
      (formData.telefono ? `Teléfono: ${formData.telefono}\n` : "") +
      `\nMensaje:\n${formData.mensaje}`
    );

    // Importante: con mailto no se puede forzar el "From"; será el del cliente del usuario.
    window.location.href = `mailto:federicobuta51@gmail.com?subject=${subject}&body=${body}`;

    toast.success("Abriendo tu cliente de correo...");

    // Limpiar formulario
    setFormData({
      nombre: "",
      email: "",
      telefono: "",
      mensaje: "",
      company: "",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section id="contacto" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Contacto
            </h2>
            <div className="w-24 h-1 bg-accent mx-auto mb-6 rounded-full" />
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              ¿Tenés alguna consulta? Estamos para ayudarte
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8 animate-fade-in-up">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-6">
                  Información de Contacto
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Ubicación</h4>
                      <p className="text-muted-foreground">
                        Corralito, Córdoba, Argentina
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Email</h4>
                      <a
                        href="mailto:federicobuta51@gmail.com"
                        className="text-primary hover:underline break-all"
                      >
                        federicobuta51@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Teléfono</h4>
                      <a
                        href="tel:+5493571327923"
                        className="text-primary hover:underline"
                      >
                        +54 9 3571 327923
                        +54 9 3571 319460
                        +54 9 3571 319460
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 rounded-xl p-6 border border-border">
                <h4 className="font-semibold text-foreground mb-3">Horario de Atención</h4>
                <p className="text-muted-foreground">
                  Lunes a Viernes: 8:00 - 18:00<ar />
                  Sábados: 8:00 - 12:00
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="animate-fade-in-up" style={{ animationDelay: "150ms" }}>
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                {/* honeypot */}
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div>
                  <Label htmlFor="nombre" className="text-foreground">
                    Nombre *
                  </Label>
                  <Input
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    className="mt-2"
                    placeholder="Tu nombre completo"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-foreground">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-2"
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <Label htmlFor="telefono" className="text-foreground">
                    Teléfono
                  </Label>
                  <Input
                    id="telefono"
                    name="telefono"
                    type="tel"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="mt-2"
                    placeholder="+54 9 3571 000000"
                  />
                </div>

                <div>
                  <Label htmlFor="mensaje" className="text-foreground">
                    Mensaje *
                  </Label>
                  <Textarea
                    id="mensaje"
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleChange}
                    required
                    className="mt-2 min-h-[150px]"
                    placeholder="Contanos cómo podemos ayudarte..."
                  />
                </div>

                <Button type="submit" size="lg" className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Mensaje
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
