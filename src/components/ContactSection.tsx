// src/components/ContactSection.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { trackEvent } from "@/hooks/useAnalytics";

const contactSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  email: z.string().email("El email no es válido"),
  mensaje: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
  telefono: z.string().optional(),
  tipoConsulta: z.string().optional(),
  company: z.string().optional(),
});

type FormData = {
  nombre: string;
  email: string;
  telefono: string;
  tipoConsulta: string;
  mensaje: string;
  company?: string;
};

const EMPTY_FORM: FormData = { nombre: "", email: "", telefono: "", tipoConsulta: "", mensaje: "", company: "" };
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY;

const ContactSection = () => {
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.company?.trim()) return; // honeypot

    const result = contactSchema.safeParse(formData);
    if (!result.success) { toast.error(result.error.errors[0].message); return; }

    setSending(true);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `Consulta web — ${formData.nombre}`,
          from_name: formData.nombre,
          email: formData.email,
          telefono: formData.telefono || "—",
          tipo_consulta: formData.tipoConsulta || "—",
          mensaje: formData.mensaje,
          botcheck: formData.company,
        }),
      });

      const data = await res.json() as { success: boolean };
      if (!data.success) throw new Error("Error en Web3Forms");

      toast.success("¡Mensaje enviado! Te respondemos a la brevedad.");
      trackEvent("contact_form_submit", { tipo: formData.tipoConsulta || "general" });
      setFormData(EMPTY_FORM);
    } catch {
      toast.error("Hubo un error al enviar. Intentá de nuevo.");
    } finally {
      setSending(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  return (
    <section id="contacto" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Contacto</h1>
            <div className="w-24 h-1 bg-accent mx-auto mb-6 rounded-full" />
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              ¿Tenés alguna consulta? Estamos para ayudarte
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8 animate-fade-in-up">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-6">Información de Contacto</h3>
                <div className="space-y-6">
                  {[
                    { icon: MapPin, title: "Ubicación", content: <p className="text-muted-foreground">Corralito, Córdoba, Argentina</p> },
                    { icon: Mail, title: "Email", content: <a href={`mailto:${import.meta.env.VITE_CONTACT_EMAIL}`} className="text-primary hover:underline break-all">{import.meta.env.VITE_CONTACT_EMAIL}</a> },
                    { icon: Phone, title: "Teléfono", content: <a href="tel:+5493571327923" className="text-primary hover:underline">+54 9 3571 327923<br />+54 9 3571 319460<br />+54 9 3571 319461</a> },
                  ].map(({ icon: Icon, title, content }) => (
                    <div key={title} className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div><h4 className="font-semibold text-foreground mb-1">{title}</h4>{content}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-muted/50 rounded-xl p-6 border border-border">
                <h4 className="font-semibold text-foreground mb-3">Horario de Atención</h4>
                <p className="text-muted-foreground">Lunes a Viernes: 8:00 - 18:00<br />Sábados: 8:00 - 12:00</p>
              </div>
            </div>

            <div className="animate-fade-in-up" style={{ animationDelay: "150ms" }}>
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <input type="text" name="company" value={formData.company} onChange={handleChange} className="hidden" tabIndex={-1} autoComplete="off" />

                {[
                  { id: "nombre", label: "Nombre *", type: "text", placeholder: "Tu nombre completo", required: true },
                  { id: "email", label: "Email *", type: "email", placeholder: "tu@email.com", required: true },
                  { id: "telefono", label: "Teléfono", type: "tel", placeholder: "+54 9 3571 000000", required: false },
                ].map(({ id, label, type, placeholder, required }) => (
                  <div key={id}>
                    <Label htmlFor={id} className="text-foreground">{label}</Label>
                    <Input id={id} name={id} type={type} value={formData[id as keyof FormData]} onChange={handleChange} required={required} className="mt-2" placeholder={placeholder} />
                  </div>
                ))}

                <div>
                  <Label htmlFor="tipoConsulta" className="text-foreground">Tipo de Consulta</Label>
                  <Select value={formData.tipoConsulta} onValueChange={(v) => setFormData(p => ({ ...p, tipoConsulta: v }))}>
                    <SelectTrigger className="mt-2"><SelectValue placeholder="Seleccioná una opción" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Compra y venta de cereales">Compra y venta de cereales</SelectItem>
                      <SelectItem value="Pedido de cotización de productos">Pedido de cotización de productos</SelectItem>
                      <SelectItem value="Otra">Otra</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="mensaje" className="text-foreground">Mensaje *</Label>
                  <Textarea id="mensaje" name="mensaje" value={formData.mensaje} onChange={handleChange} required className="mt-2 min-h-[150px]" placeholder="Contanos cómo podemos ayudarte..." />
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={sending}>
                  {sending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Enviando...</> : <><Send className="w-4 h-4 mr-2" />Enviar Mensaje</>}
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
