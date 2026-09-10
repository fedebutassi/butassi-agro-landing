import { useEffect } from "react";
import { SITE_URL } from "@/lib/site";

interface PageMeta {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
}

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

export function usePageMeta({ title, description, path, noindex }: PageMeta): void {
  useEffect(() => {
    document.title = title;

    const url = `${SITE_URL}${path}`;
    setMeta('meta[name="description"]', "name", "description", description);
    setCanonical(url);
    setMeta('meta[property="og:url"]', "property", "og:url", url);

    let robotsMeta: HTMLMetaElement | null = null;
    if (noindex) {
      robotsMeta = document.createElement("meta");
      robotsMeta.name = "robots";
      robotsMeta.content = "noindex";
      document.head.appendChild(robotsMeta);
    }

    return () => {
      if (robotsMeta?.parentNode) {
        robotsMeta.parentNode.removeChild(robotsMeta);
      }
    };
  }, [title, description, path, noindex]);
}
