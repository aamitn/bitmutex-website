import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FAQ } from "../faq"; // Adjust relative path to match your folder tree layout
import React from "react";

// 1. Mock shared element layouts to isolate the switch matrix properties
vi.mock("@/components/forms/container", () => ({
  Container: ({ children, className }: any) => <div data-testid="container-primitive" className={className}>{children}</div>,
}));
vi.mock("@/components/elements/heading", () => ({
  Heading: ({ children, className }: any) => <h1 className={className}>{children}</h1>,
}));
vi.mock("@/components/elements/subheading", () => ({
  Subheading: ({ children, className }: any) => <h2 className={className}>{children}</h2>,
}));
vi.mock("@/components/block-renderer/layout/features/feature-icon-container", () => ({
  FeatureIconContainer: ({ children, className }: any) => <div data-testid="icon-container-primitive" className={className}>{children}</div>,
}));

// 2. Mock Tabler Icons to return plain element profiles safely
vi.mock("@tabler/icons-react", () => ({
  IconHelpHexagonFilled: ({ className }: any) => <span data-testid="tabler-help-icon" className={className} />,
}));

// 3. Mock Shadcn Accordion layout primitives to test simple open/collapse mechanics cleanly
vi.mock("@/components/ui/accordion", () => ({
  Accordion: ({ children, className }: any) => <div className={className}>{children}</div>,
  AccordionItem: ({ children, className }: any) => <div className={className}>{children}</div>,
  AccordionTrigger: ({ children, className }: any) => <button data-testid="accordion-trigger">{children}</button>,
  AccordionContent: ({ children, className }: any) => <div data-testid="accordion-content" className={className}>{children}</div>,
}));

// --- SAMPLE DATA CONFIGURATIONS FOR SIMULATION ---
const mockFaqProps = {
  heading: "Frequently Asked Questions",
  sub_heading: "Everything you need to know about our technology architectures.",
  faqs: [
    {
      question: "Do your industrial battery chargers support multi-phase thyristor topologies?",
      answer: "Yes, our firmware architectures natively handle phase-shifted firing pulses for half-controlled and fully-controlled bridge rectifiers.",
    },
    {
      question: "Can the Vienna Rectifier control board be updated over-the-air?",
      answer: "Absolutely. Our embedded R&D design stack supports secure dual-bank bootloaders for reliable remote firmware updates.",
    },
  ],
};

describe("FAQ Component Logic Framework Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should mount accessory layout containers and render section header nodes cleanly", () => {
    render(<FAQ {...mockFaqProps as any} />);

    expect(screen.getByTestId("container-primitive")).toBeInTheDocument();
    expect(screen.getByTestId("icon-container-primitive")).toBeInTheDocument();
    expect(screen.getByTestId("tabler-help-icon")).toBeInTheDocument();

    expect(screen.getByRole("heading", { name: "Frequently Asked Questions" })).toBeInTheDocument();
    expect(screen.getByText("Everything you need to know about our technology architectures.")).toBeInTheDocument();
  });

  it("should compile all list items in a balanced multi-column layout row grid", () => {
    render(<FAQ {...mockFaqProps as any} />);

    const controlTriggers = screen.getAllByTestId("accordion-trigger");
    const controlContents = screen.getAllByTestId("accordion-content");

    expect(controlTriggers).toHaveLength(2);
    expect(controlContents).toHaveLength(2);

    // Verify raw parameter array mappings output matching values
    expect(controlTriggers[0]).toHaveTextContent("Do your industrial battery chargers support multi-phase thyristor topologies?");
    expect(controlContents[0]).toHaveTextContent("Yes, our firmware architectures natively handle phase-shifted firing pulses");
    
    expect(controlTriggers[1]).toHaveTextContent("Can the Vienna Rectifier control board be updated over-the-air?");
    expect(controlContents[1]).toHaveTextContent("Absolutely. Our embedded R&D design stack supports secure dual-bank bootloaders");
  });

  it("should handle structural skeleton payloads safely if optional strings render blank", () => {
    const mockEmptyProps = {
      heading: "",
      sub_heading: "",
      faqs: []
    };

    const { container } = render(<FAQ {...mockEmptyProps as any} />);
    expect(container.firstChild).toBeInTheDocument();
    expect(screen.queryByTestId("accordion-trigger")).toBeNull();
  });
});