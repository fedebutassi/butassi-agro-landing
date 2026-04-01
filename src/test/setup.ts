import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock import.meta.env
Object.defineProperty(globalThis, "import", {
  value: {
    meta: {
      env: {
        VITE_SUPABASE_URL: "https://test.supabase.co",
        VITE_SUPABASE_PUBLISHABLE_KEY: "test-key",
        VITE_SUPABASE_PROJECT_ID: "test-project",
        VITE_CONTACT_EMAIL: "test@example.com",
        VITE_WHATSAPP_NUMBER: "5491100000000",
        MODE: "test",
        BASE_URL: "/",
      },
    },
  },
});

// Mock supabase client
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    }),
    functions: {
      invoke: vi.fn().mockResolvedValue({ data: null, error: null }),
    },
  },
}));
