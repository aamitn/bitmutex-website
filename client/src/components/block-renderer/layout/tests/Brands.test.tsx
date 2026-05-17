import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Brands } from "../brands"; // Adjust relative path to match your folder layout
import React from "react";

// 1. Mock Next.js Image component to bypass core layout optimization checks
vi.mock("next/image", () => ({
  default: ({ src, alt, className }: any) => (
    <img src={src} alt={alt} className={className} data-testid="mock-logo" />
  ),
}));

// 2. Mock react-fast-marquee to render children as a plain list container
vi.mock("react-fast-marquee", () => ({
  default: ({ children, speed, direction }: any) => (
    <div data-testid="mock-marquee" data-speed={speed} data-direction={direction}>
      {children}
    </div>
  ),
}));

// 3. Mock internal typography elements
vi.mock("../../elements/heading", () => ({
  Heading: ({ children, className }: any) => <h1 className={className}>{children}</h1>,
}));
vi.mock("../../elements/subheading", () => ({
  Subheading: ({ children, className }: any) => <h2 className={className}>{children}</h2>,
}));

// 4. Mock the strapiImage url generator helper module
vi.mock("@/lib/strapi/strapiImage", () => ({
  strapiImage: (url: string) => `https://api.bitmutex.com${url}`,
}));

// --- SAMPLE DATA SHAPE FOR MARQUEE ISOLATION ---
const mockBrandsProps = {
  heading: "Trusted by Industrial Innovators",
  sub_heading: "Powering systems across standard setups.",
  logos: [
    { company: "Company Alpha", image: { url: "/uploads/logo_alpha.png" } },
    { company: "Company Beta", image: { url: "/uploads/logo_beta.png" } },
  ],
};

describe("Brands Partner Logo Marquee Loop Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should mount structural section headers and process content titles smoothly", () => {
    render(<Brands {...mockBrandsProps as any} />);

    expect(screen.getByText("Trusted by Industrial Innovators")).toBeInTheDocument();
    expect(screen.getByText("Powering systems across standard setups.")).toBeInTheDocument();
  });

  it("should pass configuration properties cleanly to the marquee slider engine", () => {
    render(<Brands {...mockBrandsProps as any} />);

    const marqueeWidget = screen.getByTestId("mock-marquee");
    expect(marqueeWidget).toBeInTheDocument();
    
    // Validate state velocity and direction defaults pass natively
    expect(marqueeWidget).toHaveAttribute("data-speed", "180");
    expect(marqueeWidget).toHaveAttribute("data-direction", "left");
  });

  it("should parse company logos through the Strapi asset converter loop completely", () => {
    render(<Brands {...mockBrandsProps as any} />);

    const renderedLogos = screen.getAllByTestId("mock-logo");
    expect(renderedLogos).toHaveLength(2);

    // Assert company 1 handles alt tags and asset path translations perfectly
    expect(renderedLogos[0]).toHaveAttribute("alt", "Company Alpha");
    expect(renderedLogos[0]).toHaveAttribute("src", "https://api.bitmutex.com/uploads/logo_alpha.png");

    // Assert company 2 handles alt tags and asset path translations perfectly
    expect(renderedLogos[1]).toHaveAttribute("alt", "Company Beta");
    expect(renderedLogos[1]).toHaveAttribute("src", "https://api.bitmutex.com/uploads/logo_beta.png");
  });
});