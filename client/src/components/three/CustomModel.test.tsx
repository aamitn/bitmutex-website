import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render } from "@testing-library/react";
import CustomModel from "./CustomModel"; // Adjust path or filename if needed
import React from "react";

// 1. Mock @react-three/drei to intercept asset network requests
vi.mock("@react-three/drei", () => ({
  useGLTF: vi.fn(() => ({
    scene: {
      isObject3D: true,
      uuid: "mock-gltf-scene-uuid",
      children: [],
    },
  })),
}));

// 2. Mock @react-three/fiber Hooks to safely intercept the frame loop runner execution
vi.mock("@react-three/fiber", () => ({
  useFrame: (callback: () => void) => {
    // Force frame callbacks to execute synchronously exactly once per test run
    React.useEffect(() => {
      callback();
    }, []);
  },
}));

describe("CustomModel 3D Asset Render Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // ✅ Inject 3D rotation properties into the standard HTML element prototype 
    // so the primitive ref evaluates safely when called by useFrame loops.
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
  });

  afterEach(() => {
    // Clean up our prototype patches to avoid leaking configuration states
    try {
      Object.defineProperty(HTMLElement.prototype, "rotation", { value: undefined });
    } catch (e) {}
  });

  it("should parse properties and mount primitive asset wrappers cleanly without throwing network exceptions", () => {
    const { container } = render(
      <CustomModel url="/assets/models/converter-stack.glb" scale={2.5} />
    );

    // Verify that the custom fiber layout tag maps down into the virtual canvas tree structure
    const primitiveElement = container.querySelector("primitive");
    expect(primitiveElement).toBeInTheDocument();

    // Validate custom layout dimensions pass down correctly
    expect(primitiveElement).toHaveAttribute("scale", "2.5");
  });
});