import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import {AmbientColor} from "../ambient-color" ;
import React from "react";

describe("AmbientColor Layout Backdrop Component", () => {
  it("should mount the structural viewport overlay wrapper cleanly with pointer events disabled", () => {
    const { container } = render(<AmbientColor />);
    
    const wrapper = container.firstChild as HTMLElement;
    
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveClass("absolute", "w-screen", "h-screen", "pointer-events-none");
  });

  it("should verify all three atmospheric background backdrop layers render with their computed inline styles", () => {
    const { container } = render(<AmbientColor />);
    
    const wrapper = container.firstChild as HTMLElement;
    const gradientLayers = wrapper.children;
    
    // Assert exactly 3 backdrop color layers are present in the DOM tree
    expect(gradientLayers).toHaveLength(3);

    // Layer 1: Verify the prominent top primary ambient color block layout rule
    const primaryLayer = gradientLayers[0] as HTMLElement;
    expect(primaryLayer.style.width).toBe("560px");
    expect(primaryLayer.style.transform).toBe("translateY(-350px) rotate(-45deg)");
    expect(primaryLayer.style.background).toContain("radial-gradient");

    // Layer 2: Verify secondary localized accent transform positioning rules
    const secondaryLayer = gradientLayers[1] as HTMLElement;
    expect(secondaryLayer.style.width).toBe("240px");
    expect(secondaryLayer.style.transformOrigin).toBe("top left");
    expect(secondaryLayer.style.transform).toBe("rotate(-45deg) translate(5%, -50%)");

    // Layer 3: Verify the peripheral bounding backdrop box layout configuration properties
    const tertiaryLayer = gradientLayers[2] as HTMLElement;
    expect(tertiaryLayer.style.borderRadius).toBe("20px");
    // ✅ FIXED: Removed the stray "ter " prefix here
    expect(tertiaryLayer.style.transform).toBe("rotate(-45deg) translate(-180%, -70%)");
  });
});