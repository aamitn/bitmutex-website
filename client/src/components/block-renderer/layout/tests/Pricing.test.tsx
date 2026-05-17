import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { Pricing } from "../pricing"; 
import React from "react";

// 1. Mock Next.js Link component to render as a plain anchor element
vi.mock("next/link", () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

// 2. Mock Lucide Icons
vi.mock("lucide-react", () => ({
  Check: ({ size, className }: any) => <span data-testid="lucide-check" data-size={size} className={className} />,
}));

// --- SAMPLE DATA CONFIGURATIONS FOR SIMULATION ---
const mockPricingProps = {
  priceCard: [
    {
      id: "tier-standard",
      heading: "Startup Prototype",
      description: "Perfect for initial hardware firmware baseline evaluations.",
      price: 49,
      selected: false,
      link: { href: "/checkout/startup", text: "Deploy Solution" },
      feature: [
        { id: "feat-1", description: "Standard PCB layout review" },
        { id: "feat-2", description: "24-hour baseline latch alarm logs" }
      ]
    },
    {
      id: "tier-popular",
      heading: "Enterprise Scale",
      description: "Full production architecture for 11kW Vienna stacks.",
      price: 299,
      selected: true, 
      link: { href: "/checkout/enterprise", text: "Scale Power Stack" },
      feature: [
        { id: "feat-3", description: "Silicon Carbide conversion blueprints" },
        { id: "feat-4", description: "Continuous remote calibration loops" }
      ]
    }
  ]
};

describe("Pricing Layout Grid Section Component Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should mount semantic layout grids and render pricing items correctly", () => {
    render(<Pricing {...mockPricingProps as any} />);

    expect(screen.getByRole("heading", { level: 4, name: "Startup Prototype" })).toBeInTheDocument();
    expect(screen.getByText("Perfect for initial hardware firmware baseline evaluations.")).toBeInTheDocument();
    expect(screen.getByText("$49")).toBeInTheDocument();

    expect(screen.getByRole("heading", { level: 4, name: "Enterprise Scale" })).toBeInTheDocument();
    expect(screen.getByText("$299")).toBeInTheDocument();
  });

  it("should parse feature parameter sub-arrays and mount action icon checklists cleanly", () => {
    render(<Pricing {...mockPricingProps as any} />);

    const featuresList = screen.getAllByTestId("lucide-check");
    expect(featuresList).toHaveLength(4);
    expect(screen.getByText("Standard PCB layout review")).toBeInTheDocument();
    expect(screen.getByText("Silicon Carbide conversion blueprints")).toBeInTheDocument();
  });

  it("should attach primary border outlines and float badges if selected flag parses as true", () => {
    const { container } = render(<Pricing {...mockPricingProps as any} />);

    // ✅ FIX: Use heading role lookups + .closest() to accurately traverse JSDOM layout parent blocks
    const standardCard = screen.getByRole("heading", { level: 4, name: "Startup Prototype" }).closest(".shadow-lg");
    const popularCard = screen.getByRole("heading", { level: 4, name: "Enterprise Scale" }).closest(".shadow-lg");

    expect(standardCard).not.toHaveClass("border-2 border-primary");
    expect(popularCard).toHaveClass("border-2 border-primary");
    
    expect(within(container).queryByText("Most popular")).toBeInTheDocument();
  });

  it("should generate call-to-action anchor routes referencing specific tier items", () => {
    render(<Pricing {...mockPricingProps as any} />);

    const standardActionBtn = screen.getByRole("link", { name: "Deploy Solution" });
    expect(standardActionBtn).toHaveAttribute("href", "/checkout/startup");

    const corporateActionBtn = screen.getByRole("link", { name: "Scale Power Stack" });
    expect(corporateActionBtn).toHaveAttribute("href", "/checkout/enterprise");
  });

  it("should handle structural skeletons gracefully if list setups evaluate as empty cards", () => {
    const mockEmptyMatrix = {
      priceCard: []
    };

    const { container } = render(<Pricing {...mockEmptyMatrix as any} />);
    expect(container.firstChild).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 4 })).toBeNull();
  });
});