import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "@/hooks/useAnalytics";

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

const GoogleAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  if (!GA_ID) return null;

  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', { anonymize_ip: true });
          `,
        }}
      />
    </>
  );
};

export default GoogleAnalytics;
