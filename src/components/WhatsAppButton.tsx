import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";

const WhatsAppButton = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const whatsappNumber = "5493571327923";
  const whatsappMessage = encodeURIComponent("Hola! Me gustaría consultar sobre sus servicios.");

  useEffect(() => {
    if (dismissed) return;

    // Mostrar el tooltip después de 3 segundos
    const showTimer = setTimeout(() => {
      setShowTooltip(true);
    }, 3000);

    return () => clearTimeout(showTimer);
  }, [dismissed]);

  useEffect(() => {
    if (!showTooltip || dismissed) return;

    // Ocultar el tooltip después de 5 segundos y volver a mostrarlo
    const hideTimer = setTimeout(() => {
      setShowTooltip(false);
    }, 5000);

    const cycleTimer = setTimeout(() => {
      setShowTooltip(true);
    }, 15000);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(cycleTimer);
    };
  }, [showTooltip, dismissed]);

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDismissed(true);
    setShowTooltip(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Tooltip */}
      {showTooltip && !dismissed && (
        <div className="absolute bottom-full right-0 mb-3 animate-fade-in">
          <div className="relative bg-foreground text-background px-4 py-3 rounded-lg shadow-lg whitespace-nowrap">
            <button
              onClick={handleDismiss}
              className="absolute -top-2 -right-2 bg-muted text-muted-foreground rounded-full p-1 hover:bg-muted/80 transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-3 h-3" />
            </button>
            <p className="text-sm font-medium pr-2">💬 ¡Chateá con nosotros!</p>
            {/* Flecha */}
            <div className="absolute top-full right-6 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-foreground" />
          </div>
        </div>
      )}

      {/* Botón WhatsApp */}
      <a
        href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-[#25D366] text-white rounded-full p-4 shadow-2xl hover:scale-110 transition-transform duration-300 group"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
      </a>
    </div>
  );
};

export default WhatsAppButton;
