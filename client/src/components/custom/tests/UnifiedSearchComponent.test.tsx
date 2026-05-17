import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UnifiedSearchComponent from "../UnifiedSearchComponent"; // Adjust relative path to match your folder hierarchy
import React from "react";

// 1. Mock Next.js Navigation Engine Layers with reactive parameter states
const mockReplace = vi.fn();
let mockUrlParams = new URLSearchParams("");

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
  useSearchParams: () => ({
    get: (key: string) => mockUrlParams.get(key),
  }),
}));

// 2. Mock Custom Fallback Graphic Image Components
vi.mock("@/components/custom/ImageWithFallback", () => ({
  default: ({ src, alt, className }: any) => (
    <img src={src} alt={alt} className={className} data-testid="mock-fallback-img" />
  ),
}));

// 3. Mock Next.js Link component to render as a plain anchor element
vi.mock("next/link", () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

// 4. ✅ PERMANENT FIX: Mock algoliasearch dynamically to prevent top-level 
// process.env initialization evaluation failures during hoisted execution steps
const mockAlgoliaSearchMethod = vi.fn();
vi.mock("algoliasearch", () => ({
  algoliasearch: () => ({
    search: (...args: any[]) => mockAlgoliaSearchMethod(...args),
  }),
}));

// --- DOMAIN-SPECIFIC MOCK HITS RESPONSE MATRICES ---
const createMockSearchResponse = () => ({
  results: [
    { hits: [{ objectID: "job-123", documentId: "doc-j1", title: "Embedded Firmware Specialist", jobtype: "Full-time", statu: "active", description: "STM32 and power electronic diagnostics panel designs.", deadline: "2026-12-31" }] }, // Jobs
    { hits: [{ objectID: "test-456", firstname: "Amit", lastname: "Nandi", job: "Co-Founder", text: "Exceptional thryistor-based charging framework conversion blueprints." }] }, // Testimonials
    { hits: [] }, // Success Stories
    { hits: [{ objectID: "srv-789", name: "Vienna Rectifier R&D", description: "11kW industrial hardware engineering architecture setups.", slug: "vienna-rectifier-rd" }] }, // Services
    { hits: [] }, // Projects
    { hits: [{ objectID: "post-101", title: "Silicon Carbide Switching Baselines", slug: "sic-switching-baselines", description: "Overcurrent fault alarm latch logic benchmarks across multi-phase frameworks." }] }, // Blog Posts
    { hits: [] }, // Pages
    { hits: [] }, // Logos
    { hits: [] }, // Industries
    { hits: [] }, // Free Resources
    { hits: [] }, // FAQs
    { hits: [] }, // Categories
  ],
});

describe("UnifiedSearchComponent Multi-Index Search Engine Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUrlParams = new URLSearchParams("");
    // Standard mock returns resolved multi-index search collections cleanly
    mockAlgoliaSearchMethod.mockResolvedValue(createMockSearchResponse());
  });

  it("should present the baseline welcome layout when initialized with a blank search context", () => {
    render(<UnifiedSearchComponent />);

    expect(screen.getByPlaceholderText("Search across all content types...")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Unified Content Search" })).toBeInTheDocument();
    expect(screen.getByText("Jobs")).toBeInTheDocument();
    expect(screen.getByText("Testimonials")).toBeInTheDocument();
  });


  it("should read initial URL query patterns safely and load results on mount", async () => {
    mockUrlParams = new URLSearchParams("q=thyristor");
    render(<UnifiedSearchComponent />);

    expect(screen.getByPlaceholderText("Search across all content types...")).toHaveValue("thyristor");

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 3, name: "Embedded Firmware Specialist" })).toBeInTheDocument();
    });
  });

  it("should apply client-side type sorting filters when button chips are clicked", async () => {
    mockUrlParams = new URLSearchParams("q=rectifier");
    render(<UnifiedSearchComponent />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 3, name: "Embedded Firmware Specialist" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 3, name: "Vienna Rectifier R&D" })).toBeInTheDocument();
    });

    // Locate and fire the 'Jobs' filter pill
    const jobsFilterBtn = screen.getByRole("button", { name: /^Jobs$/ });
    fireEvent.click(jobsFilterBtn);

    // Filter isolation checklist runs
    expect(screen.getByRole("heading", { level: 3, name: "Embedded Firmware Specialist" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 3, name: "Vienna Rectifier R&D" })).toBeNull();
  });

  it("should present an error fallback box cleanly if the network connection breaks", async () => {
    mockAlgoliaSearchMethod.mockRejectedValue(new Error("Algolia API Rate Limit Exceeded"));
    mockUrlParams = new URLSearchParams("q=fails");
    
    render(<UnifiedSearchComponent />);

    await waitFor(() => {
      expect(screen.getByText("Search failed. Please try again.")).toBeInTheDocument();
    });
    
    expect(screen.queryByTestId("mock-swiper")).toBeNull();
  });

  it("should mount clear fallback labels if search results complete completely empty", async () => {
    mockAlgoliaSearchMethod.mockResolvedValue({
      results: Array(12).fill(null).map(() => ({ hits: [] })),
    });
    mockUrlParams = new URLSearchParams("q=missing-term");

    render(<UnifiedSearchComponent />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 3, name: "No results found" })).toBeInTheDocument();
    });
  });
});