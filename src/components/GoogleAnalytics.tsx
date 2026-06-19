import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "@/hooks/useAnalytics";

// La etiqueta de gtag.js se carga en index.html (una sola por página).
// Este componente solo registra los cambios de ruta de la SPA como page views.
const GoogleAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  return null;
};

export default GoogleAnalytics;
