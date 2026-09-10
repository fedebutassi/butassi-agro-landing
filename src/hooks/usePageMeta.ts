import { useEffect } from "react";
import { SITE_URL } from "@/lib/site";
import routesMeta from "@/lib/routes-meta.json";

type RoutesMeta = Record<string, { title: string; description: string; noindex?: boolean }>;

const META = routesMeta as RoutesMeta;

function setMeta(selector: string, attr: string, key: string, content: string): void {
  let el = document.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

function setCanonical(href: string): void {
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    document.head.appendChild(el);
  }
  el.href = href;
}

export function usePageMeta(path: string): void {
  const meta = META[path];

  useEffect(() => {
    if (!meta) return;

    document.title = meta.title;

    const url = `${SITE_URL}${path}`;
    setMeta('meta[name="description"]', "name", "description", meta.description);
    setCanonical(url);
    setMeta('meta[property="og:url"]', "property", "og:url", url);

    let robotsMeta: HTMLMetaElement | null = null;
    if (meta.noindex) {
      robotsMeta = document.createElement("meta");
      robotsMeta.name = "robots";
      robotsMeta.content = "noindex";
      document.head.appendChild(robotsMeta);
    }

    // Signal para prerender: los meta tags están listos
    window.__META_READY__ = true;
    document.dispatchEvent(new Event("meta-ready"));

    return () => {
      if (robotsMeta?.parentNode) {
        robotsMeta.parentNode.removeChild(robotsMeta);
      }
    };
  }, [path, meta]);
}
