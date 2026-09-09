// src/lib/analytics.ts
// Capa de analytics centralizada para GA4.
// Se carga dinámicamente desde import.meta.env.VITE_GA_MEASUREMENT_ID.
// Si la variable no está definida, el módulo no hace nada (safe para dev local).

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

/** True cuando el visitante es un bot, headless browser o Lighthouse. */
function isBot(): boolean {
  if (navigator.webdriver === true) return true;
  return /HeadlessChrome|Lighthouse|bot/i.test(navigator.userAgent);
}

/**
 * Si la URL trae ?internal=1, marca la sesión como interna en localStorage.
 * Devuelve true si la sesión está marcada.
 */
function checkInternal(): boolean {
  try {
    if (new URLSearchParams(window.location.search).get("internal") === "1") {
      localStorage.setItem("analytics_internal", "1");
    }
    return localStorage.getItem("analytics_internal") === "1";
  } catch {
    return false;
  }
}

/**
 * Carga el script de GA4 y configura el tracker.
 * Llamar una vez al arranque (en main.tsx, antes del render).
 *
 * No hace nada si:
 * - VITE_GA_MEASUREMENT_ID no está definido
 * - El visitante es un bot / headless browser
 */
export function initAnalytics(): void {
  if (!GA_ID || isBot()) return;

  window.dataLayer = window.dataLayer || [];
  // Stub estándar de gtag: pushea los argumentos a dataLayer para que
  // el script los procese cuando termine de cargar.
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  } as typeof window.gtag;

  // Consent Mode v2: denegado por defecto
  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });

  // Restaurar consentimiento si el usuario ya aceptó
  if (localStorage.getItem("cookie_consent") === "accepted") {
    window.gtag("consent", "update", { analytics_storage: "granted" });
  }

  window.gtag("js", new Date());

  const isInternal = checkInternal();
  window.gtag("config", GA_ID, {
    // send_page_view queda en default (true).
    // La medición mejorada de GA4 ya captura cambios de historial (SPA).
    // NO implementar page_view manual — se duplica.
    ...(isInternal ? { traffic_type: "internal" } : {}),
  });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);
}

/**
 * Envía un evento custom a GA4.
 * En modo dev (import.meta.env.DEV) loguea a consola en vez de enviar.
 * No hace nada si gtag no fue cargado.
 */
export function track(
  name: string,
  params?: Record<string, string | number | boolean>,
): void {
  if (import.meta.env.DEV) {
    console.debug("[analytics]", name, params);
    return;
  }
  window.gtag?.("event", name, params);
}
