import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ContentWithImage } from "../content-with-image"; // Adjust path to match your folder hierarchy
import React from "react";

// 1. Mock the custom Strapi Image atom helper component
vi.mock("@/components/custom/strapi-image", () => ({
  StrapiImage: ({ src, alt, className }: any) => (
    <img src={src} alt={alt} className={className} data-testid="strapi-image-stub" />
  ),
}));

// 2. Mock next-themes hook parameters
const mockUseTheme = vi.fn(() => ({ theme: "dark" }));
vi.mock("next-themes", () => ({
  useTheme: () => mockUseTheme(),
}));

// 3. Mock framer-motion layout wrappers to remove animation state timing bottlenecks
vi.mock("framer-motion", async () => {
  const ReactComponentProxy = (tagName: string) => {
    return React.forwardRef(({ children, whileHover, whileTap, whileInView, initial, animate, transition, variants, style, ...props }: any, ref: any) => {
      // Flatten incoming variants object states into plain inline attributes to maintain element visibility
      const combinedStyles = { ...style };
      if (animate === "visible" && variants?.visible) {
        Object.assign(combinedStyles, variants.visible);
      }
      return React.createElement(tagName, { ...props, ref, style: combinedStyles }, children);
    });
  };

  return {
    motion: new Proxy({}, {
      get(_target, prop: string) {
        return ReactComponentProxy(prop);
      }
    }),
    useAnimation: () => ({
      start: vi.fn().mockResolvedValue(true),
    }),
    // Force element viewport detection flags to evaluate as true natively inside JSDOM containers
    useInView: () => true,
  };
});

// --- SAMPLE DATA BLOCK SHAPES ---
const mockContentProps = {
  heading: "High-Performance Power Converters",
  subHeading: "11kW Industrial Architectures",
  text: "Integrating Silicon Carbide (SiC) thyristor design frameworks for robust thermal management systems.",
  image: {
    url: "/uploads/power_stack_schematic.png",
    name: "Vienna Power Stack Diagram"
  },
  reverse: false,
};

describe("ContentWithImage Section Component Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseTheme.mockReturnValue({ theme: "dark" });
  });

  it("should mount titles, subheadings, and description layouts cleanly", () => {
    render(<ContentWithImage {...mockContentProps as any} />);

    expect(screen.getByRole("heading", { name: "High-Performance Power Converters" })).toBeInTheDocument();
    expect(screen.getByText("11kW Industrial Architectures")).toBeInTheDocument();
    expect(screen.getByText(/Integrating Silicon Carbide/i)).toBeInTheDocument();
  });

  it("should pass image properties to the Strapi image component", () => {
    render(<ContentWithImage {...mockContentProps as any} />);

    const coreImageNode = screen.getByTestId("strapi-image-stub");
    expect(coreImageNode).toBeInTheDocument();
    expect(coreImageNode).toHaveAttribute("src", "/uploads/power_stack_schematic.png");
    expect(coreImageNode).toHaveAttribute("alt", "Vienna Power Stack Diagram");
  });

  it("should arrange column directions normally when reverse style config is false", () => {
    const { container } = render(<ContentWithImage {...mockContentProps as any} />);
    
    // Default column flex structure matches standard flex row styles
    expect(container.firstChild).toHaveClass("md:flex-row");
    expect(container.firstChild).not.toHaveClass("md:flex-row-reverse");
  });

  it("should rearrange column layouts to reverse row flows when the parameter flips to true", () => {
    const invertedProps = { ...mockContentProps, reverse: true };
    const { container } = render(<ContentWithImage {...invertedProps as any} />);

    expect(container.firstChild).toHaveClass("md:flex-row-reverse");
    expect(container.firstChild).not.toHaveClass("md:flex-row");
  });

  it("should adjust ambient radial glow properties when switching light/dark modes", () => {
    mockUseTheme.mockReturnValue({ theme: "light" });
    const reversedLightProps = { ...mockContentProps, reverse: true };

    const { rerender } = render(<ContentWithImage {...reversedLightProps as any} />);
    
    // Light layout glows should scale against clear white alphas
    let ambientBlob = screen.getByTestId("strapi-image-stub").parentElement?.previousElementSibling;
    expect(ambientBlob).toHaveStyle({ background: "radial-gradient(circle closest-side, rgba(255, 255, 255, 0.4) 50%, rgba(0, 0, 0, 0.1) 90%)" });

    // Flip context engine variants back to dark layouts
    mockUseTheme.mockReturnValue({ theme: "dark" });
    rerender(<ContentWithImage {...reversedLightProps as any} />);
    
    ambientBlob = screen.getByTestId("strapi-image-stub").parentElement?.previousElementSibling;
    expect(ambientBlob).toHaveStyle({ background: "radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, rgba(0, 0, 0, 0) 60%)" });
  });

  it("should safely evaluate data parameters returning empty container elements if items load with default blank states", () => {
    // ✅ FIX: Explicit schema skeleton prevents runtime parameter destructuring errors
    const mockEmptyProps = {
      heading: "",
      subHeading: "",
      text: "",
      image: {
        url: "",
        name: ""
      },
      reverse: false
    };

    const { container } = render(<ContentWithImage {...mockEmptyProps as any} />);
    expect(container.firstChild).toBeInTheDocument();
  });
});