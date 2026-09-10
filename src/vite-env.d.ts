/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY: string;
  readonly VITE_SUPABASE_PROJECT_ID: string;
  readonly VITE_CONTACT_EMAIL: string;
  readonly VITE_WHATSAPP_NUMBER: string;
  readonly VITE_WEB3FORMS_KEY: string;
  readonly VITE_FACEBOOK_URL?: string;
  readonly VITE_INSTAGRAM_URL?: string;
  readonly VITE_LINKEDIN_URL?: string;
  readonly VITE_GA_MEASUREMENT_ID?: string;
  readonly VITE_SENTRY_DSN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Tipado de gtag / dataLayer para GA4 (cargado dinámicamente por src/lib/analytics.ts)
interface Window {
  /** Signal del prerender: true cuando usePageMeta terminó de setear el head. */
  __META_READY__?: boolean;
  dataLayer?: unknown[];
  gtag?: {
    (command: "config", targetId: string, config?: Record<string, unknown>): void;
    (command: "event", eventName: string, eventParams?: Record<string, string | number | boolean>): void;
    (command: "js", date: Date): void;
    (command: "consent", action: "default" | "update", params: Record<string, string>): void;
    (command: "set", params: Record<string, unknown>): void;
  };
}
