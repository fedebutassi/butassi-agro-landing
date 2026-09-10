#!/usr/bin/env node
// scripts/prerender.mjs
// Prerenderiza rutas con Puppeteer headless para que crawlers y previews
// de redes sociales vean el <head> correcto por página sin ejecutar JS.
//
// Se ejecuta DESPUÉS de `vite build` como paso de postbuild.
// Cada ruta se navega en Chromium, se espera a que usePageMeta setee
// window.__META_READY__, y se captura el HTML resultante.

import puppeteer from "puppeteer";
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
const TIMEOUT_MS = 15_000;

/** Rutas a prerenderizar. /404 se guarda como dist/404.html (Vercel la sirve como 404 custom). */
const ROUTES = ["/", "/productos", "/pizarra", "/contacto", "/privacidad", "/404"];

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

async function prerender() {
  console.log("[prerender] Iniciando...");
  const server = await startServer();

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });

  try {
    for (const route of ROUTES) {
      const page = await browser.newPage();

      // Bloquear requests a terceros innecesarios para el prerender
      await page.setRequestInterception(true);
      page.on("request", (req) => {
        const url = req.url();
        if (
          url.includes("googletagmanager.com") ||
          url.includes("google-analytics.com") ||
          url.includes("sentry.io")
        ) {
          req.abort();
        } else {
          req.continue();
        }
      });

      await page.goto(`http://127.0.0.1:${PORT}${route}`, {
        waitUntil: "networkidle2",
        timeout: TIMEOUT_MS,
      });

      // Esperar a que usePageMeta setee __META_READY__
      await page.waitForFunction(() => window.__META_READY__ === true, {
        timeout: TIMEOUT_MS,
      });

      const html = await page.content();

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
