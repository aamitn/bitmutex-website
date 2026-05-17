import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import PageBySlugRoute, { generateStaticParams, generateMetadata } from "./page"; // Adjust path if named page.tsx
import { getAllPagesSlugs, getPageBySlug } from "@/data/loaders";
import fetchContentType from "@/lib/strapi/fetchContentType";

// 1. Mock External Data Loaders and Image Helpers
vi.mock("@/data/loaders", () => ({
  getAllPagesSlugs: vi.fn(),
  getPageBySlug: vi.fn(),
}));

vi.mock("@/lib/strapi/strapiImage", () => ({
  strapiImage: (url: string) => `https://strapi-cdn.com${url}`,
}));

vi.mock("@/lib/metadata", () => ({
  generateMetadataObject: vi.fn(() => ({})),
}));

// Mock Next.js navigation and draft headers safely
const mockNotFound = vi.fn(() => {
  throw new Error("NEXT_NOT_FOUND_SIGNAL");
});
vi.mock("next/navigation", () => ({
  notFound: () => mockNotFound(),
}));

vi.mock("next/headers", () => ({
  draftMode: vi.fn(async () => ({ isEnabled: false })),
}));

// 2. Mock BlockRenderer Component to Isolate Routing Layout
vi.mock("@/components/block-renderer", () => ({
  BlockRenderer: ({ blocks }: any) => <div data-testid="mock-blocks">Blocks Mounted: {blocks.length}</div>,
}));

describe("Dynamic Pages Routing Stack Suite", () => {
  const mockPageProps = { params: Promise.resolve({ slug: "services" }) };

  const mockStrapiResponse = {
    data: [
      {
        id: 1,
        documentId: "page-1",
        title: "Our Services",
        slug: "services",
        description: "Enterprise software development systems.",
        createdAt: "2026-05-17T00:00:00.000Z",
        updatedAt: "2026-05-17T00:00:00.000Z",
        blocks: [
          { id: 101, __component: "blocks.hero", title: "Welcome" },
          { id: 102, __component: "blocks.features" },
        ],
        seo: {
          metaTitle: "Custom Services Overview",
          metaDescription: "Tailored scalable application architectures built to last.",
          metaImage: { url: "/assets/services-og.png" },
        },
      },
    ],
    meta: { pagination: { page: 1, pageSize: 1, total: 1, pageCount: 1 } },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

describe("generateStaticParams Static Site Generation", () => {
    it("should fetch page records and map slugs cleanly for Next.js build-time matrix compilation", async () => {
      vi.mocked(getAllPagesSlugs).mockResolvedValueOnce({
        // ✅ FIX: Added mandatory documentId, createdAt, and updatedAt fields to fulfill the Strapi Document model type
        data: [
          { 
            id: 1, 
            slug: "about", 
            documentId: "doc-about", 
            createdAt: "2026-05-17T00:00:00.000Z", 
            updatedAt: "2026-05-17T00:00:00.000Z" 
          },
          { 
            id: 2, 
            slug: "contact", 
            documentId: "doc-contact", 
            createdAt: "2026-05-17T00:00:00.000Z", 
            updatedAt: "2026-05-17T00:00:00.000Z" 
          }
        ],
        meta: { pagination: { page: 1, pageSize: 2, total: 2, pageCount: 1 } },
      });

      const params = await generateStaticParams();

      expect(params).toEqual([
        { slug: "about" },
        { slug: "contact" },
      ]);
      expect(getAllPagesSlugs).toHaveBeenCalledTimes(1);
    });
  });

  describe("PageBySlugRoute Layout Rendering Engine", () => {
    it("should successfully mount the block rendering canvas on valid slug matches", async () => {
      vi.mocked(getPageBySlug).mockResolvedValueOnce(mockStrapiResponse);

      const PageJSX = await PageBySlugRoute(mockPageProps);
      render(PageJSX);

      expect(screen.getByTestId("mock-blocks")).toBeInTheDocument();
      expect(screen.getByText("Blocks Mounted: 2")).toBeInTheDocument();
    });

    it("should short-circuit runtime operations and route to Next.js notFound() on missing block collections", async () => {
      vi.mocked(getPageBySlug).mockResolvedValueOnce({
        data: [],
        meta: { pagination: { page: 1, pageSize: 0, total: 0, pageCount: 0 } },
      });

      await expect(PageBySlugRoute(mockPageProps)).rejects.toThrow("NEXT_NOT_FOUND_SIGNAL");
      expect(mockNotFound).toHaveBeenCalledTimes(1);
    });
  });

  describe("generateMetadata Custom SEO Evaluators", () => {
    it("should display the default page-not-found envelope metadata properties if data retrieval resolves to empty arrays", async () => {
      vi.mocked(getPageBySlug).mockResolvedValueOnce({
        data: [],
        meta: { pagination: { page: 1, pageSize: 0, total: 0, pageCount: 0 } },
      });

      const meta = await generateMetadata(mockPageProps);

      expect(meta.title).toBe("Page Not Found | Bitmutex Technologies");
      expect(meta.robots).toBe("noindex, nofollow");
    });

    it("should fallback cleanly to standard page values if nested SEO settings fields are absent", async () => {
      vi.mocked(getPageBySlug).mockResolvedValueOnce({
        data: [
          {
            ...mockStrapiResponse.data[0],
            seo: null, // Forces structural text variable fallbacks
          },
        ],
        meta: { pagination: { page: 1, pageSize: 1, total: 1, pageCount: 1 } },
      });

      const meta = await generateMetadata(mockPageProps);

      expect(meta.title).toBe("Our Services | Bitmutex");
      expect(meta.description).toBe("Enterprise software development systems.");
      expect(meta.openGraph?.url).toBe("http://localhost:3000/services");
    });

    it("should override baseline rules and inherit explicit SEO properties when attached", async () => {
      vi.mocked(getPageBySlug).mockResolvedValueOnce(mockStrapiResponse);

      const meta = await generateMetadata(mockPageProps);

      expect(meta.title).toBe("Custom Services Overview | Bitmutex");
      expect(meta.description).toBe("Tailored scalable application architectures built to last.");
      expect((meta.openGraph?.images as any)[0].url).toBe("https://strapi-cdn.com/assets/services-og.png");
    });
  });
});