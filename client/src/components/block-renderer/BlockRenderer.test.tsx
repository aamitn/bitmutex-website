import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { BlockRenderer } from "./index"; // Adjust path to where this file lives
import React from "react";

// Mock all internal sub-component layout targets to return simple flat data attributes
vi.mock("@/components/block-renderer/layout/hero", () => ({ Hero: () => <div data-testid="mock-hero" /> }));
vi.mock("@/components/block-renderer/layout/card-carousel", () => ({ CardCarousel: () => <div data-testid="mock-card-grid" /> }));
vi.mock("@/components/block-renderer/layout/section-heading", () => ({ SectionHeading: () => <div data-testid="mock-section-heading" /> }));
vi.mock("@/components/block-renderer/layout/content-with-image", () => ({ ContentWithImage: () => <div data-testid="mock-content-with-image" /> }));
vi.mock("@/components/block-renderer/layout/pricing", () => ({ Pricing: () => <div data-testid="mock-price-grid" /> }));
vi.mock("@/components/block-renderer/layout/ckeditor-block", () => ({ CkeditorBlock: () => <div data-testid="mock-ckeditor-block" /> }));
vi.mock("@/components/block-renderer/layout/ckeditor-block-markdown", () => ({ CkeditorBlockMarkdown: () => <div data-testid="mock-ckeditor-markdown" /> }));
vi.mock("@/components/block-renderer/layout/form-next-to-section", () => ({ FormNextToSection: () => <div data-testid="mock-form-section" /> }));
vi.mock("@/components/block-renderer/layout/regform-next-to-section", () => ({ RegformNextToSection: () => <div data-testid="mock-regform-section" /> }));
vi.mock("@/components/block-renderer/layout/brands", () => ({ Brands: () => <div data-testid="mock-brands" /> }));
vi.mock("@/components/block-renderer/layout/faq", () => ({ FAQ: () => <div data-testid="mock-faq" /> }));
vi.mock("@/components/block-renderer/layout/post-block", () => ({ PostBlock: () => <div data-testid="mock-post-block" /> }));
vi.mock("@/components/block-renderer/layout/service-block", () => ({ ServiceBlock: () => <div data-testid="mock-service-block" /> }));
vi.mock("@/components/block-renderer/layout/testimonials/index", () => ({ Testimonials: () => <div data-testid="mock-testimonials" /> }));
vi.mock("@/components/block-renderer/blocks/video", () => ({ Video: () => <div data-testid="mock-video" /> }));
vi.mock("@/components/block-renderer/blocks/text", () => ({ Text: () => <div data-testid="mock-text" /> }));

describe("BlockRenderer Core CMS Router Engine Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should sequentially execute switch-maps and project exact component matching stubs", () => {
    // Array of mock dynamic blocks covering layout/ block type component configurations
    const mockCmsBlocks = [
      { __component: "layout.hero", id: 1 },
      { __component: "layout.card-grid", id: 2 },
      { __component: "layout.section-heading", id: 3 },
      { __component: "layout.content-with-image", id: 4 },
      { __component: "layout.price-grid", id: 5 },
      { __component: "layout.ckeditor-block", id: 6 },
      { __component: "layout.ckeditor-block-markdown", id: 7 },
      { __component: "layout.form-next-to-section", id: 8 },
      { __component: "layout.regform-next-to-section", id: 9 },
      { __component: "layout.brands", id: 10 },
      { __component: "layout.faq", id: 11 },
      { __component: "layout.post-block", id: 12 },
      { __component: "layout.service-block", id: 13 },
      { __component: "layout.testimonials", id: 14 },
      { __component: "blocks.video", id: 15 },
      { __component: "blocks.text", id: 16 },
    ];

    // Explicitly cast to any array to satisfy complete CMS model validation bounds cleanly
    render(<BlockRenderer blocks={mockCmsBlocks as any[]} />);

    // Assert that every single mapped factory component outputs completely into the DOM tree
    expect(screen.getByTestId("mock-hero")).toBeInTheDocument();
    expect(screen.getByTestId("mock-card-grid")).toBeInTheDocument();
    expect(screen.getByTestId("mock-section-heading")).toBeInTheDocument();
    expect(screen.getByTestId("mock-content-with-image")).toBeInTheDocument();
    expect(screen.getByTestId("mock-price-grid")).toBeInTheDocument();
    expect(screen.getByTestId("mock-ckeditor-block")).toBeInTheDocument();
    expect(screen.getByTestId("mock-ckeditor-markdown")).toBeInTheDocument();
    expect(screen.getByTestId("mock-form-section")).toBeInTheDocument();
    expect(screen.getByTestId("mock-regform-section")).toBeInTheDocument();
    expect(screen.getByTestId("mock-brands")).toBeInTheDocument();
    expect(screen.getByTestId("mock-faq")).toBeInTheDocument();
    expect(screen.getByTestId("mock-post-block")).toBeInTheDocument();
    expect(screen.getByTestId("mock-service-block")).toBeInTheDocument();
    expect(screen.getByTestId("mock-testimonials")).toBeInTheDocument();
    expect(screen.getByTestId("mock-video")).toBeInTheDocument();
    expect(screen.getByTestId("mock-text")).toBeInTheDocument();
  });

  it("should safely drop unmapped component variations or random signatures without breaking execution trees", () => {
    const mockUnknownBlocks = [
      { __component: "layout.unsupported-feature-flag", id: 99 },
      { __component: "blocks.corrupted-strapi-signature", id: 100 },
    ];

    const { container } = render(<BlockRenderer blocks={mockUnknownBlocks as any[]} />);
    
    // Default switch paths should map gracefully straight to null containers
    expect(container.firstChild).toBeNull();
  });
});