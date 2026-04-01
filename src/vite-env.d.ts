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
