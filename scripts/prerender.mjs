#!/usr/bin/env node
// scripts/prerender.mjs
// Prerenderiza rutas con Puppeteer headless para que crawlers y previews
// de redes sociales vean el <head> correcto por página sin ejecutar JS.
//
// Se ejecuta DESPUÉS de `vite build` como paso de postbuild.
// Cada ruta se navega en Chromium, se espera a que usePageMeta setee
// window.__META_READY__, y se captura el HTML resultante.

import puppeteer from "puppeteer-core";
import { createServer } from "node:http";
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  statSync,
} from "node:fs";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const DIST = join(ROOT, "dist");
const PORT = 45_678;
const TIMEOUT_MS = 30_000;

// Fuente única de verdad: el mismo JSON que usa usePageMeta en runtime.
const ROUTES_META = JSON.parse(
  readFileSync(join(ROOT, "src/lib/routes-meta.json"), "utf-8"),
);

// Leer SITE_URL desde site.ts para no duplicar el valor.
const SITE_URL = readFileSync(join(ROOT, "src/lib/site.ts"), "utf-8")
  .match(/SITE_URL\s*=\s*"([^"]+)"/)?.[1];
if (!SITE_URL) throw new Error("No se pudo leer SITE_URL de src/lib/site.ts");

const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

/** Rutas a prerenderizar. /404 se guarda como dist/404.html (Vercel la sirve como 404 custom). */
const ROUTES = Object.keys(ROUTES_META);

const MIME = /** @type {Record<string,string>} */ ({
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".txt": "text/plain",
  ".xml": "application/xml",
});

/** Servidor estático mínimo sobre dist/. Fallback SPA a index.html. */
function startServer() {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      const pathname = (req.url ?? "/").split("?")[0];
      let filePath = join(DIST, pathname);

      try {
        if (statSync(filePath).isDirectory()) {
          filePath = join(filePath, "index.html");
        }
      } catch {
        // no existe → fallback SPA
      }

      if (!existsSync(filePath)) {
        filePath = join(DIST, "index.html");
      }

      try {
        const content = readFileSync(filePath);
        const ext = extname(filePath);
        res.writeHead(200, {
          "Content-Type": MIME[ext] || "application/octet-stream",
        });
        res.end(content);
      } catch {
        res.writeHead(500);
        res.end();
      }
    });

    server.listen(PORT, "127.0.0.1", () => resolve(server));
  });
}

/**
 * Inyecta/reemplaza tags del <head> con los valores del config.
 * Garantiza que el HTML final tenga los meta correctos aunque el runtime
 * no los haya seteado (ej: render falló por falta de datos externos).
 */
function injectHead(html, route) {
  const meta = ROUTES_META[route];
  if (!meta) return html;

  const canonical = `${SITE_URL}${route === "/" ? "/" : route}`;

  // title
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${meta.title}</title>`);

  // meta description
  html = html.replace(
    /<meta name="description" content="[^"]*"/,
    `<meta name="description" content="${meta.description}"`,
  );

  // canonical
  html = html.replace(
    /<link rel="canonical" href="[^"]*"/,
    `<link rel="canonical" href="${canonical}"`,
  );

  // og:url
  html = html.replace(
    /<meta property="og:url" content="[^"]*"/,
    `<meta property="og:url" content="${canonical}"`,
  );

  // og:image (mismo para todas las rutas)
  html = html.replace(
    /<meta property="og:image" content="[^"]*"/,
    `<meta property="og:image" content="${OG_IMAGE}"`,
  );

  // robots noindex
  if (meta.noindex) {
    if (!html.includes('name="robots"')) {
      html = html.replace("</head>", `<meta name="robots" content="noindex">\n</head>`);
    }
  } else {
    html = html.replace(/<meta name="robots" content="[^"]*">\n?/g, "");
  }

  return html;
}

/**
 * Lanza Chromium adaptándose al entorno:
 * - Linux (Vercel): usa @sparticuz/chromium (binario incluido en el paquete)
 * - macOS/otro (local): usa Chrome del sistema o CHROME_PATH
 */
async function launchBrowser() {
  if (process.platform === "linux") {
    const chromium = (await import("@sparticuz/chromium")).default;
    chromium.setGraphicsMode = false;
    return puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: "shell",
    });
  }

  // macOS / Windows: Chrome del sistema
  const executablePath =
    process.env.CHROME_PATH ||
    (process.platform === "darwin"
      ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
      : "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe");

  return puppeteer.launch({
    executablePath,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });
}

async function prerender() {
  console.log("[prerender] Iniciando...");
  const server = await startServer();

  const browser = await launchBrowser();

  const LOCAL_ORIGIN = `http://127.0.0.1:${PORT}`;

  try {
    for (const route of ROUTES) {
      const page = await browser.newPage();

      // Allowlist: solo requests al servidor local. Abortar TODO lo externo
      // (Supabase, GA, Sentry, Google Fonts, etc.) para que el prerender sea
      // determinístico y no dependa de red.
      await page.setRequestInterception(true);
      page.on("request", (req) => {
        if (req.url().startsWith(LOCAL_ORIGIN)) {
          req.continue();
        } else {
          req.abort();
        }
      });

      // domcontentloaded basta: los module scripts ya ejecutaron y React montó.
      // Los lazy chunks cargan de localhost (inmediato).
      await page.goto(`${LOCAL_ORIGIN}${route}`, {
        waitUntil: "domcontentloaded",
        timeout: TIMEOUT_MS,
      });

      // Esperar a que usePageMeta setee __META_READY__
      // Fallback: si no llega, capturar igual (mejor HTML parcial que build roto)
      try {
        await page.waitForFunction(() => window.__META_READY__ === true, {
          timeout: TIMEOUT_MS,
        });
      } catch {
        console.warn(
          `[prerender] WARN: __META_READY__ no llego para ${route}, capturando con delay`,
        );
        await new Promise((r) => setTimeout(r, 3_000));
      }

      // Capturar HTML y forzar los meta tags del config (determinístico)
      const html = injectHead(await page.content(), route);

      if (route === "/404") {
        writeFileSync(join(DIST, "404.html"), html);
      } else if (route === "/") {
        writeFileSync(join(DIST, "index.html"), html);
      } else {
        const dir = join(DIST, route.slice(1));
        mkdirSync(dir, { recursive: true });
        writeFileSync(join(dir, "index.html"), html);
      }

      console.log(
        `[prerender] ${route} → dist/${route === "/" ? "index.html" : route === "/404" ? "404.html" : route.slice(1) + "/index.html"}`,
      );
      await page.close();
    }
  } finally {
    await browser.close();
    server.close();
  }

  console.log("[prerender] Completado.");
}

prerender().catch((err) => {
  console.error("[prerender] Error:", err.message || err);
  process.exit(1);
});
