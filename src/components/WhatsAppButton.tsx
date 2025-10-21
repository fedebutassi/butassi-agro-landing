import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  const whatsappNumber = "5493571000000"; // Número de ejemplo
  const whatsappMessage = encodeURIComponent("Hola! Me gustaría consultar sobre sus servicios.");

  return (
    <a
      href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white rounded-full p-4 shadow-2xl hover:scale-110 transition-transform duration-300 animate-pulse-soft group"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-foreground text-background px-4 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm font-medium shadow-lg">
        ¡Escribinos!
      </span>
    </a>
  );
};

export default WhatsAppButton;
