const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID ?? "G-ZQFFGQ3VRZ";

const gtag = (...args: unknown[]) => {
  if (typeof window !== "undefined" && (window as Record<string, unknown>).gtag) {
    ((window as Record<string, unknown>).gtag as (...a: unknown[]) => void)(...args);
  }
};

export const trackEvent = (
  eventName: string,
  params?: Record<string, unknown>
) => {
  if (!GA_ID) return;
  gtag("event", eventName, params);
};

export const trackPageView = (path: string) => {
  if (!GA_ID) return;
  gtag("config", GA_ID, { page_path: path });
};
