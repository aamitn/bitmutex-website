import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { PostBlock } from "../post-block"; // Adjust path to match your folder tree layout
import React from "react";

// 1. Mock Next.js Image component to bypass background optimization loaders
vi.mock("next/image", () => ({
  default: ({ src, alt, className }: any) => <img src={src} alt={alt} className={className} data-testid="mock-img" />,
}));

// 2. Mock Next.js Link component to render as a plain anchor element
vi.mock("next/link", () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

// 3. Mock shared structural element layouts
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
  FeatureIconContainer: ({ children, className }: any) => <div className={className}>{children}</div>,
}));

// 4. Mock Tabler Icons
vi.mock("@tabler/icons-react", () => ({
  IconArticle: ({ className }: any) => <span data-testid="tabler-article-icon" className={className} />,
}));

// 5. Mock Swiper layout components completely to bypass complex window calculations
vi.mock("swiper/react", () => ({
  Swiper: ({ children, className }: any) => <div data-testid="mock-swiper" className={className}>{children}</div>,
  SwiperSlide: ({ children, className }: any) => <div data-testid="mock-swiper-slide" className={className}>{children}</div>,
}));
vi.mock("swiper/modules", () => ({
  Navigation: vi.fn(),
  Pagination: vi.fn(),
  Autoplay: vi.fn(),
}));

// 6. Mock Framer Motion to bypass top-level hook calculations and clear out transition bottlenecks
vi.mock("framer-motion", async () => {
  const ReactComponentProxy = (tagName: string) => {
    return React.forwardRef(({ children, whileHover, whileTap, whileInView, initial, animate, transition, style, ...props }: any, ref: any) => {
      return React.createElement(tagName, { ...props, ref, style }, children);
    });
  };
  return {
    motion: new Proxy({}, {
      get(_target, prop: string) {
        return ReactComponentProxy(prop);
      }
    }),
  };
});

// --- SAMPLE DATA CONFIGURATIONS FOR SIMULATION ---
const mockPostProps = {
  heading: "Insights from the Laboratory",
  sub_heading: "Deep dives into industrial power stack engineering and firmware architectures.",
  posts: [
    {
      id: "post-1",
      title: "Optimizing High-Frequency Switching in 11kW Chargers",
      slug: "optimizing-switching-11kw",
      description: "A comprehensive case study on switching architectures utilizing high-performance Silicon Carbide MOSFET switching setups.",
      image: {
        url: "/uploads/si_carbide_mosfet.png"
      }
    },
    {
      id: "post-2",
      title: "Designing Fault-Tolerant STM32 Baselines",
      slug: "fault-tolerant-stm32",
      description: "How to properly establish firmware baselines to handle transient electrical overcurrent alarms and safely latch signals.",
      image: {
        url: "/uploads/stm32_firmware.png"
      }
    }
  ]
};

describe("PostBlock Carousel Component Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("NEXT_PUBLIC_STRAPI_BASE_URL", "https://api.bitmutex.com");
  });

  it("should mount parent container layouts and populate headers completely", () => {
    render(<PostBlock {...mockPostProps as any} />);

    expect(screen.getByTestId("container-primitive")).toBeInTheDocument();
    expect(screen.getByTestId("tabler-article-icon")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "Insights from the Laboratory" })).toBeInTheDocument();
    expect(screen.getByText("Deep dives into industrial power stack engineering and firmware architectures.")).toBeInTheDocument();
  });

  it("should pass individual list records into Swiper slide cards correctly", () => {
    render(<PostBlock {...mockPostProps as any} />);

    expect(screen.getByTestId("mock-swiper")).toBeInTheDocument();
    const slides = screen.getAllByTestId("mock-swiper-slide");
    expect(slides).toHaveLength(2);

    // Validate Post Card 1
    expect(screen.getByRole("heading", { level: 3, name: /Optimizing High-Frequency Switching/i })).toBeInTheDocument();
    const linkNode1 = screen.getByRole("link", { name: /Optimizing High-Frequency Switching/i });
    expect(linkNode1).toHaveAttribute("href", "/blog/optimizing-switching-11kw");

    // Validate Post Card 2
    expect(screen.getByRole("heading", { level: 3, name: /Designing Fault-Tolerant STM32 Baselines/i })).toBeInTheDocument();
  });

  it("should safely append environment source path prefixes onto images", () => {
    render(<PostBlock {...mockPostProps as any} />);

    const images = screen.getAllByTestId("mock-img");
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute("src", "https://api.bitmutex.com/uploads/si_carbide_mosfet.png");
  });



  it("should show structural fallbacks cleanly if the target array initializes with an empty list", () => {
    const emptyProps = {
      heading: "Recent Posts",
      sub_heading: "Blank Status",
      posts: []
    };

    render(<PostBlock {...emptyProps as any} />);
    expect(screen.getByText("No posts available.")).toBeInTheDocument();
  });

});