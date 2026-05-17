import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { SparklesCore } from "../sparkles";
import { Testimonials } from "../index";
import React from "react";

// 1. Mock Next.js Image component to bypass background optimization pipelines
vi.mock("next/image", () => ({
  default: ({ src, alt, className }: any) => <img src={src} alt={alt} className={className} data-testid="mock-img" />,
}));

// 2. Mock framer-motion using our proxy strategy to completely strip animation attributes
vi.mock("framer-motion", async () => {
  const ReactComponentProxy = (tagName: string) => {
    return React.forwardRef(({ children, whileHover, whileTap, whileInView, initial, animate, transition, viewport, ...props }: any, ref: any) => {
      return React.createElement(tagName, { ...props, ref }, children);
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
  };
});

// 3. Mock react-fast-marquee to render children as a flat list
vi.mock("react-fast-marquee", () => ({
  default: ({ children, direction }: any) => (
    <div data-testid="mock-marquee" data-direction={direction || "left"}>
      {children}
    </div>
  ),
}));

// 4. Mock @tsparticles components to isolate internal canvas execution engines
vi.mock("@tsparticles/react", () => ({
  default: ({ id, particlesLoaded }: any) => {
    // Fire the initialization callback immediately inside JSDOM container paths
    setTimeout(() => particlesLoaded?.({} as any), 0);
    return <div data-testid="mock-particles" id={id} />;
  },
  ParticlesProvider: ({ children }: any) => <div data-testid="particles-provider">{children}</div>,
}));
vi.mock("@tsparticles/slim", () => ({
  loadSlim: vi.fn().mockResolvedValue(true),
}));

// 5. Mock shared layout typography hooks
vi.mock("../../../elements/heading", () => ({
  Heading: ({ children, className }: any) => <h1 className={className}>{children}</h1>,
}));
vi.mock("../../../elements/subheading", () => ({
  Subheading: ({ children, className }: any) => <h2 className={className}>{children}</h2>,
}));

// --- SAMPLE DATA SHAPES FOR TEST ISOLATION ---
const mockTestimonialsList = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  text: `This is test testimonial statement number ${i + 1}`,
  firstname: `UserFirst${i + 1}`,
  lastname: `UserLast${i + 1}`,
  job: `Staff Engineer ${i + 1}`,
  image: i % 2 === 0 ? { url: `/assets/avatars/user-${i + 1}.png` } : null,
}));

describe("Testimonials & Sparkles Core Unified Layout Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("File 1: SparklesCore Animation Canvas Canvas Layers", () => {
    it("should mount particle providers and map custom element density overrides cleanly", () => {
      render(
        <SparklesCore
          id="test-canvas"
          background="#000000"
          particleColor="#FF5733"
          particleDensity={80}
        />
      );

      expect(screen.getByTestId("particles-provider")).toBeInTheDocument();
      const particlesWidget = screen.getByTestId("mock-particles");
      expect(particlesWidget).toBeInTheDocument();
      expect(particlesWidget).toHaveAttribute("id", "test-canvas");
    });
  });

describe("File 3: Main Testimonials Section Wrapper Module", () => {
    it("should map headers, subheadings, and stream rows of card elements successfully", () => {
      // ✅ FIX: Remove the explicit TestimonialsProps type restriction from the variable declaration
      const mockProps = {
        heading: "Loved by Embedded Engineering Experts",
        sub_heading: "Discover how Bitmutex powers critical thyristor control architectures globally.",
        testimonials: mockTestimonialsList.slice(0, 4),
      };

      // ✅ FIX: Cast the props payload inline using `as any` to satisfy the full CMS model contract safely
      render(<Testimonials {...mockProps as any} />);

      expect(screen.getByText("Loved by Embedded Engineering Experts")).toBeInTheDocument();
      expect(screen.getByText("Discover how Bitmutex powers critical thyristor control architectures globally.")).toBeInTheDocument();

      // Ensure sparkles canvas embeds inside the hero section layout background block cleanly
      expect(screen.getByTestId("mock-particles")).toBeInTheDocument();

      // Verify loop rendering displays all 4 filtered text elements completely
      mockProps.testimonials.forEach((item) => {
        expect(screen.getByText(item.text)).toBeInTheDocument();
        expect(screen.getByText(`${item.firstname} ${item.lastname}`)).toBeInTheDocument();
      });
    });

    it("should print a graceful empty state notification block if the incoming dataset loads empty or null", () => {
      // ✅ FIX: Remove type assignment from empty payload
      const mockEmptyProps = {
        heading: "Empty Matrix",
        sub_heading: "Subtext",
        testimonials: null as any,
      };

      // ✅ FIX: Cast directly to bypass unmet component attributes (`__component`, `createdAt`, etc.)
      render(<Testimonials {...mockEmptyProps as any} />);
      expect(screen.getByText("No testimonials available")).toBeInTheDocument();
    });
  });
});