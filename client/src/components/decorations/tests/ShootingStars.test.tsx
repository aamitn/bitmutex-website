import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render } from "@testing-library/react";
import ShootingStars from "../shooting-star"; 

describe("ShootingStars Canvas Animation Pipeline Suite", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();

    globalThis.window.innerWidth = 1920;
    globalThis.window.innerHeight = 1080;

    // Direct mock mapping safely translates structural animation updates into simple micro-ticks
    vi.spyOn(globalThis, "requestAnimationFrame").mockImplementation((cb: FrameRequestCallback) => {
      return setTimeout(() => cb(performance.now()), 16) as any;
    });
    vi.spyOn(globalThis, "cancelAnimationFrame").mockImplementation((id: number) => {
      clearTimeout(id);
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("should securely mount structural SVG nodes and set up hidden reference elements natively", () => {
    const spySpawn = vi.spyOn(globalThis, "setTimeout");
    const { container } = render(<ShootingStars />);
    
    const baseSvg = container.querySelector("svg");
    const animatedRect = container.querySelector("rect")!;

    expect(baseSvg).toBeInTheDocument();
    expect(animatedRect).toBeInTheDocument();
    expect(spySpawn).toHaveBeenCalled();
  });



  it("should cleanly drop scheduled macro hooks and cancellation loop pointers upon component destruction", () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, "clearTimeout");
    const { unmount } = render(<ShootingStars />);

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});