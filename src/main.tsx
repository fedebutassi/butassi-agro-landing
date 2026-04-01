import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;

async function bootstrap() {
  if (SENTRY_DSN) {
    const Sentry = await import("@sentry/react");
    Sentry.init({
      dsn: SENTRY_DSN,
      environment: import.meta.env.MODE,
      tracesSampleRate: 0.2,
      replaysOnErrorSampleRate: 1.0,
    });
  }

  createRoot(document.getElementById("root")!).render(<App />);
}

bootstrap();
