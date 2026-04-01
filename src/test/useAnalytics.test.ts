import { describe, it, expect, vi, beforeEach } from "vitest";
import { trackEvent, trackPageView } from "@/hooks/useAnalytics";

describe("useAnalytics", () => {
  beforeEach(() => {
    vi.stubGlobal("gtag", vi.fn());
  });

  it("trackEvent no lanza error cuando GA no está configurado", () => {
    expect(() => trackEvent("test_event")).not.toThrow();
  });

  it("trackPageView no lanza error cuando GA no está configurado", () => {
    expect(() => trackPageView("/test")).not.toThrow();
  });
});
