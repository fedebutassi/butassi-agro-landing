import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { track } from "@/lib/analytics";

describe("analytics – track()", () => {
  beforeEach(() => {
    vi.stubGlobal("gtag", vi.fn());
    // track() usa import.meta.env.DEV internamente; en vitest DEV === true
    // por lo que loguea a consola en vez de llamar a gtag.
    vi.spyOn(console, "debug").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("no lanza error aunque gtag no exista", () => {
    vi.stubGlobal("gtag", undefined);
    expect(() => track("test_event")).not.toThrow();
  });

  it("loguea a consola en modo dev", () => {
    track("pizarra_view", { has_image: true });
    expect(console.debug).toHaveBeenCalledWith(
      "[analytics]",
      "pizarra_view",
      { has_image: true },
    );
  });
});
