import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import SuccessStoryClient from "./SuccessStoryClient"; // Adjust path if needed
import React from "react";
import userEvent from "@testing-library/user-event";

// 1. Mock Next.js Dynamic Component Wrappers
vi.mock("next/dynamic", () => ({
  default: () => {
    const MockStoryMap = ({ location }: any) => (
      <div data-testid="mock-story-map">Map Center Lat: {location?.lat}</div>
    );
    return MockStoryMap;
  },
}));

// ✅ FIX: Partially mock utils to keep 'cn' functional for shadcn UI buttons while stubbing isValidUrl
vi.mock("@/lib/utils", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/utils")>();
  return {
    ...actual,
    isValidUrl: vi.fn((url) => url && url.startsWith("https://")),
  };
});

// 3. Mock yet-another-react-lightbox to isolate structural DOM testing
vi.mock("yet-another-react-lightbox", () => ({
  default: ({ open, slides, index }: any) => open ? (
    <div data-testid="mock-lightbox" data-index={index}>
      Active Slide: {slides[index]?.src}
    </div>
  ) : null,
}));

// Mock Lightbox auxiliary utility plugins cleanly
vi.mock("yet-another-react-lightbox/plugins/zoom", () => ({ default: {} }));
vi.mock("yet-another-react-lightbox/plugins/download", () => ({ default: {} }));

// 4. Proxy Interceptor to catch structural runtime Lucide string reflection lookups safely
vi.mock("lucide-react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("lucide-react")>();
  
  const baseMock = {
    ...actual,
    TrendingUp: () => <svg data-testid="trending-up-icon" />,
    AlertCircle: () => <svg data-testid="fallback-icon" />,
  };

  return new Proxy(baseMock, {
    get(target, prop) {
      return prop in target ? (target as any)[prop] : undefined;
    }
  });
});

describe("SuccessStoryClient Individual Case Layout Suite", () => {
  const mockStoryPayload = {
    uuid: 501,
    name: "Industrial Battery Stack Upgrade",
    content: "Developed high frequency modern full bridge topologies for thyristor replacement upgrades.",
    slug: "industrial-battery-stack",
    industry: "Power Electronics",
    websiteurl: "https://bitmutex-client.com",
    casestudy: "invalid-local-path-string", // Triggers CTA unavailable fallback test block
    logo: "/logos/client-logo.png",
    glimpses: [
      { url: "/glimpses/stack-1.jpg" },
      { url: "/glimpses/stack-2.jpg" },
    ],
    location: [
      { name: "Kolkata Hub, India", lat: "22.572645", lon: "88.363892" }
    ],
    services: [{ name: "Hardware Prototyping" }],
    stack: [{ name: "SiC Power MOSFETs" }],
    impacts: [
      {
        name: "Efficiency Surge",
        description: "Achieved absolute reduction in thermal baseline overheads across operational loads.",
        icon: "trending-up",
      }
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });


  it("should securely parse icon names dynamically and isolate impact cards safely without crashing the lookup routine", () => {
    render(<SuccessStoryClient story={mockStoryPayload} />);

    // Verify key impact cards map down structural layout text streams
    expect(screen.getByRole("heading", { name: "Efficiency Surge" })).toBeInTheDocument();
    expect(screen.getByText(/Achieved absolute reduction in thermal baseline/i)).toBeInTheDocument();

    // Verify proxy successfully mapped "trending-up" string name onto the mock svg element canvas
    expect(screen.getByTestId("trending-up-icon")).toBeInTheDocument();
  });

  it("should evaluate case studies and external client URLs cleanly and apply corresponding button disabled states", () => {
    render(<SuccessStoryClient story={mockStoryPayload} />);

    // Valid URL (https://) check path -> Should yield an operational hyperlink anchor element
    const visitWebsiteBtn = screen.getByRole("link", { name: /Visit Website/i });
    expect(visitWebsiteBtn).toHaveAttribute("href", "https://bitmutex-client.com");

    // Invalid URL baseline check path -> Should yield a disabled structural layout button configuration
    const brokenCaseStudyBtn = screen.getByRole("button", { name: /Case Study Unavailable/i });
    expect(brokenCaseStudyBtn).toBeDisabled();
    expect(brokenCaseStudyBtn).toHaveClass("cursor-not-allowed");
  });

  it("should render client gallery glimpses and link them cleanly onto active Lightbox media triggers", async () => {
    // SETUP: Initialize your userEvent engine instance
    const user = userEvent.setup();
    render(<SuccessStoryClient story={mockStoryPayload} />);

    const galleryImages = screen.getAllByRole("img");
    
    const glimpseImage = galleryImages.find(img => img.getAttribute("alt") === "Glimpse 1");
    expect(glimpseImage).toHaveAttribute("src", expect.stringContaining("stack-1.jpg"));

    expect(screen.queryByTestId("mock-lightbox")).not.toBeInTheDocument();

    // UPDATE: Fire an async browser click event natively
    if (glimpseImage) {
      await user.click(glimpseImage);
    }

    expect(screen.getByTestId("mock-lightbox")).toBeInTheDocument();
    expect(screen.getByText(/Active Slide: \/glimpses\/stack-1.jpg/i)).toBeInTheDocument();
  });
});