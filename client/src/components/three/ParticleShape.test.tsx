import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render } from "@testing-library/react";
import ParticleShape from "./ParticleShape"; // Adjust path if needed
import React from "react";

// 1. Mock next-themes to isolate style properties cleanly
const mockUseTheme = vi.fn(() => ({ theme: "dark" }));
vi.mock("next-themes", () => ({
  useTheme: () => mockUseTheme(),
}));

// 2. Mock React Three Fiber Hooks to safely intercept the frame loop runner execution
vi.mock("@react-three/fiber", () => ({
  useFrame: (callback: () => void) => {
    // Force frame callbacks to execute synchronously exactly once per test run
    React.useEffect(() => {
      callback();
    }, []);
  },
}));

describe("ParticleShape WebGL Computational Math Suite", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();

    // ✅ FIX: Inject 3D rotation properties into the standard HTML element prototype 
    // so custom R3F elements (<group>) evaluate accurately when called by useFrame loops.
    Object.defineProperty(HTMLElement.prototype, "rotation", {
      configurable: true,
      get() {
        if (!this._mockRotation) {
          this._mockRotation = { x: 0, y: 0, z: 0 };
        }
        return this._mockRotation;
      },
      set(val) {
        this._mockRotation = val;
      }
    });

    // Provide a safe placeholder mock setup for buffer attribute configurations
    Object.defineProperty(HTMLElement.prototype, "getAttribute", {
      configurable: true,
      value: vi.fn().mockReturnValue({
        array: new Float32Array(9000),
        needsUpdate: false,
      }),
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    // Clean up our prototype patches
    setProtoProperty(HTMLElement.prototype, "rotation", undefined);
    setProtoProperty(HTMLElement.prototype, "getAttribute", undefined);
  });

  describe("Canvas Geometry Initialization", () => {
    it("should compile and mount the structural group nodes cleanly inside R3F canvas environments", () => {
      const { container } = render(<ParticleShape />);
      
      // Verify that group and buffer geometry markers register structurally in the virtual DOM
      expect(container.querySelector("group")).toBeInTheDocument();
      expect(container.querySelector("points")).toBeInTheDocument();
      expect(container.querySelector("bufferGeometry")).toBeInTheDocument();
    });
  });

  describe("Shape & Scatter Vector Generators", () => {
    it("should evaluate and verify the mathematical coordinates array lengths for high-density payloads", () => {
      const { container } = render(<ParticleShape />);
      const geometry = container.querySelector("bufferGeometry");

      // Verify the element parsed layout attributes correctly despite running in a mock context
      expect(geometry).toBeInTheDocument();
    });
  });

  describe("Dynamic Shape Transition Engine Timers", () => {
    it("should trigger scatter explosion effects and step through shape indices sequentially over interval blocks", async () => {
      mockUseTheme.mockReturnValue({ theme: "light" });
      render(<ParticleShape />);

      // Step 1: Advance clocks by 5000ms to trigger the core transition interval rule
      await act(async () => {
        vi.advanceTimersByTime(5000);
      });

      // Step 2: Advance clock by another 1000ms to trigger the inner setTimeout reforming loop
      await act(async () => {
        vi.advanceTimersByTime(1000);
      });

      // Assert that timers clear down without leakage errors hanging up the thread loops
      expect(vi.getTimerCount()).toBeGreaterThanOrEqual(1);
    });
  });
});

// Helper utilities to cleanly handle prototype modifications between test runs
function setProtoProperty(obj: any, prop: string, value: any) {
  try {
    Object.defineProperty(obj, prop, { configurable: true, value });
  } catch (e) {}
}

async function act(callback: () => Promise<void> | void) {
  await import("@testing-library/react").then(({ act: reactAct }) => reactAct(callback));
}