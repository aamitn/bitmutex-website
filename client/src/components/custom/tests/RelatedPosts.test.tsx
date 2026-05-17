import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import RelatedPosts from "../related-posts"; // Adjust relative path to match your folder tree layout
import React from "react";

// 1. Mock out the global Strapi data-fetch layer utility
const mockFetchContentType = vi.fn();
vi.mock("@/lib/strapi/fetchContentType", () => ({
  default: (...args: any[]) => mockFetchContentType(...args),
}));

// 2. Mock asset atom subcomponents to isolate parsing paths
vi.mock("@/components/custom/strapi-image", () => ({
  StrapiImage: ({ src, alt, className }: any) => (
    <img src={src} alt={alt} className={className} data-testid="mock-strapi-img" />
  ),
}));

// 3. Mock Next.js Link component to render as a plain anchor element
vi.mock("next/link", () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

// 4. Mock the DraggableSidebar client-side interactive drawer module
vi.mock("./DraggableSidebar", () => ({
  default: ({ posts, category }: any) => (
    <div data-testid="mock-draggable-sidebar" data-post-count={posts.length} data-category={category.text}>
      Sidebar Widget
    </div>
  ),
}));

// --- SAMPLE DATA CONFIGURATIONS FOR SIMULATION ---
const mockCategory = {
  id: 4,
  documentId: "cat-power-electronics",
  text: "Power Electronics"
};

const mockStrapiApiResponse = {
  data: [
    {
      id: 101,
      title: "Designing Vienna Rectifiers with High-Efficiency SiC Stacks",
      slug: "vienna-rectifiers-sic-stacks",
      documentId: "doc-p1",
      publishedAt: "2026-05-10T10:00:00.000Z",
      category: mockCategory,
      image: { url: "/uploads/vienna_rectifier.png" },
      excerpt: "An in-depth look into power electronics and grid efficiency metrics."
    },
    {
      id: 102,
      title: "Firmware Alarms and Latch Implementations on STM32 Rigs",
      slug: "firmware-alarms-stm32-latch",
      documentId: "doc-p2",
      publishedAt: "2026-04-18T14:30:00.000Z",
      category: mockCategory,
      image: null,
      excerpt: "Establishing safe hardware-based baseline boundaries."
    }
  ]
};

describe("RelatedPosts Asynchronous Server Component Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should catch broken runtime rejections gracefully and safely return null markup", async () => {
    // Suppress console.error logging in the test output frame for expected failures
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockFetchContentType.mockRejectedValue(new Error("Database Connection Timeout Error"));

    const ServerComponent = await RelatedPosts({ category: mockCategory });
    expect(ServerComponent).toBeNull();

    consoleErrorSpy.mockRestore();
  });
});