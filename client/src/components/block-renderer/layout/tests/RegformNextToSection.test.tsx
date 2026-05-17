import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { RegformNextToSection } from "../regform-next-to-section"; 
import React from "react";

// 1. Mock external subcomponent layers to isolate text-parsing paths
vi.mock("@/components/decorations/shooting-star", () => ({
  default: () => <div data-testid="mock-shooting-stars" />,
}));
vi.mock("@/components/forms/register-form", () => ({
  RegisterForm: () => <div data-testid="mock-register-form" />,
}));

// 2. Mock design element primitives
vi.mock("../../elements/heading", () => ({
  Heading: ({ children, className }: any) => <h1 className={className}>{children}</h1>,
}));
vi.mock("../../elements/subheading", () => ({
  Subheading: ({ children, className }: any) => <h2 className={className}>{children}</h2>,
}));

// 3. Mock Framer Motion to bypass animation timing bottlenecks
vi.mock("framer-motion", async () => {
  const ReactComponentProxy = (tagName: string) => {
    return React.forwardRef(({ children, whileHover, whileTap, whileInView, initial, animate, transition, style, ...props }: any, ref: any) => {
      return React.createElement(tagName, { ...props, ref, style }, children);
    });
  };
  return {
    motion: new Proxy({}, {
      get(_target, prop: string) {
        if (prop === "span") {
          // ✅ FIX: Spread all incoming props onto the element to retain the child text evaluation layout
          return React.forwardRef(({ children, whileHover, whileTap, whileInView, initial, animate, transition, ...props }: any, ref: any) => (
            <span data-testid="typewriter-output" ref={ref} {...props}>{children}</span>
          ));
        }
        return ReactComponentProxy(prop);
      }
    }),
  };
});

// --- SAMPLE DATA CONFIGURATIONS FOR SIMULATION ---
const mockRegformProps = {
  heading: "Scale Engineering Workspace Systems", 
  sub_heading: "Deploy low-latency firmware baseline instances seamlessly onto your corporate network layout.",
};

describe("RegformNextToSection View Layout Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should mount accessory decoration panels and render split columns cleanly", () => {
    render(<RegformNextToSection {...mockRegformProps as any} />);

    expect(screen.getByTestId("mock-shooting-stars")).toBeInTheDocument();
    expect(screen.getByTestId("mock-register-form")).toBeInTheDocument();
    expect(screen.getByText("Deploy low-latency firmware baseline instances seamlessly onto your corporate network layout.")).toBeInTheDocument();
  });

  it("should calculate target highlight string indicators and initialize the typewriter loop sequentially", () => {
    render(<RegformNextToSection {...mockRegformProps as any} />);

    const layoutHeader = screen.getByRole("heading", { level: 1 });
    expect(layoutHeader).toBeInTheDocument();
    expect(layoutHeader.textContent).toContain("Scale Engineering");
    expect(layoutHeader.textContent).toContain("Systems");
  });

  it("should handle structural skeletons gracefully if parameters initialize with brief text lengths", () => {
    const briefProps = {
      heading: "Optimize", 
      sub_heading: "Brief Baseline Structure",
    };

    const { container } = render(<RegformNextToSection {...briefProps as any} />);
    expect(container.firstChild).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });
});