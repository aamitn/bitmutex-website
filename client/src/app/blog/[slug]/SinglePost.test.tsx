import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import SinglePost, { generateMetadata } from "./page"; // Adjust path if named page.tsx
import { getBlogPostBySlug } from "@/data/loaders";
import fetchContentType from "@/lib/strapi/fetchContentType";

// 1. Mock External Data Fetchers and Router Adapters
vi.mock("@/data/loaders", () => ({
  getBlogPostBySlug: vi.fn(),
}));

vi.mock("@/lib/strapi/fetchContentType", () => ({
  default: vi.fn(),
}));

vi.mock("@/lib/strapi/strapiImage", () => ({
  strapiImage: (url: string) => `https://strapi-cdn.com${url}`,
}));

vi.mock("@/lib/metadata", () => ({
  generateMetadataObject: vi.fn(() => ({})),
}));

// Mock Next.js header and navigation hooks safely
const mockNotFound = vi.fn(() => {
  throw new Error("NEXT_NOT_FOUND_SIGNAL"); 
});
vi.mock("next/navigation", () => ({
  notFound: () => mockNotFound(),
}));

vi.mock("next/headers", () => ({
  draftMode: vi.fn(async () => ({ isEnabled: false })),
}));

// Partially mock utils to preserve 'cn' while stubbing formatting metrics
vi.mock("@/lib/utils", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/utils")>();
  return {
    ...actual,
    formatDate: (d: string) => `Formatted Date: ${d}`,
    calculateReadingTime: (text: string) => text.length > 50 ? 12 : 3,
  };
});

// 2. Mock Visual Plugins and Embedded Social Interaction Frames
vi.mock("@/components/custom/strapi-image", () => ({
  StrapiImage: ({ src, alt }: any) => <img src={src} alt={alt} data-testid="mock-strapi-img" />,
}));

vi.mock("@/components/custom/RenderMarkdown", () => ({
  default: ({ content }: any) => <div data-testid="mock-markdown">{content}</div>,
}));

vi.mock("@/components/block-renderer/layout/ckeditor-block", () => ({
  CkeditorBlock: ({ content }: any) => <div data-testid="mock-ckeditor">{content}</div>,
}));

vi.mock("@/components/block-renderer", () => ({
  BlockRenderer: ({ blocks }: any) => <div data-testid="mock-block-renderer">Blocks: {blocks.length}</div>,
}));

vi.mock("@/components/ui/ReadingProgress", () => ({
  default: () => <div data-testid="mock-reading-progress">Reading Progress</div>,
}));

vi.mock("@/components/custom/TableOfContents", () => ({
  default: () => <div data-testid="mock-toc">Table of Contents</div>,
}));

vi.mock("@/components/custom/SocialShareButtons", () => ({
  default: ({ title }: any) => <div data-testid="mock-share">Share: {title}</div>,
}));

vi.mock("@/components/custom/related-posts", () => ({
  default: ({ category }: any) => <div data-testid="mock-related">Related: {category?.text}</div>,
}));

vi.mock("@/components/custom/DisqusComments", () => ({
  default: ({ post }: any) => <div data-testid="mock-comments">Comments for {post?.title}</div>,
}));

describe("SinglePost Server Component & SEO Suite", () => {
  const mockPageProps = { params: Promise.resolve({ slug: "scaling-nextjs" }) };

  const mockPostPayload = {
    data: [
      {
        id: 55,
        documentId: "doc-blog-55",
        createdAt: "2026-05-17T00:00:00.000Z",
        updatedAt: "2026-05-17T00:00:00.000Z",
        title: "Scaling NextJS Systems",
        slug: "scaling-nextjs",
        description: "An architecture playbook.",
        content: "Markdown body entry content section.",
        content1: "Secondary markdown paragraph notes.",
        content2: "<p>CKEditor raw string text line inputs</p>",
        publishedAt: "2026-05-17",
        views: 1240,
        image: { url: "/uploads/hero.jpg", alternativeText: "Cover Image" },
        category: { id: 1, documentId: "cat-1", text: "Architecture" },
        author: {
          firstname: "Terry",
          lastname: "Wiz",
          email: "terry@bitmutex.com",
          image: { url: "/uploads/terry.jpg", alternativeText: "Terry Headshot" },
        },
        blocks: [{ id: 1, __component: "blocks.rich-text" }],
      },
    ],
    meta: {
      pagination: {
        page: 1,
        pageSize: 1,
        total: 1,
        pageCount: 1,
      },
    },
  };
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("SinglePost HTML Interface Layout Rendering", () => {
    it("should successfully resolve data loaders and mount complex sub-widgets on match", async () => {
      vi.mocked(getBlogPostBySlug).mockResolvedValueOnce(mockPostPayload);

      const PageJSX = await SinglePost(mockPageProps);
      render(PageJSX);

      expect(screen.getByRole("heading", { name: "Scaling NextJS Systems" })).toBeInTheDocument();
      expect(screen.getByText("Terry Wiz")).toBeInTheDocument();
      expect(screen.getByText("terry@bitmutex.com")).toBeInTheDocument();
      expect(screen.getByText(/1240 views/i)).toBeInTheDocument();
      expect(screen.getByText(/Posted on Formatted Date: 2026-05-17/i)).toBeInTheDocument();
      expect(screen.getByText(/12\s+min read/i)).toBeInTheDocument();

      // ✅ FIX: Swapped to getAllByTestId because the layout loops render multiple markdown entries
      const markdownBlocks = screen.getAllByTestId("mock-markdown");
      expect(markdownBlocks).toHaveLength(2);
      expect(markdownBlocks[0]).toHaveTextContent("Markdown body entry content section.");
      expect(markdownBlocks[1]).toHaveTextContent("Secondary markdown paragraph notes.");
      
      expect(screen.getByTestId("mock-ckeditor")).toBeInTheDocument();
      expect(screen.getByTestId("mock-block-renderer")).toHaveTextContent("Blocks: 1");

      expect(screen.getByTestId("mock-reading-progress")).toBeInTheDocument();
      expect(screen.getByTestId("mock-toc")).toBeInTheDocument();
      expect(screen.getByTestId("mock-share")).toHaveTextContent("Share: Scaling NextJS Systems");
      expect(screen.getByTestId("mock-related")).toHaveTextContent("Related: Architecture");
      expect(screen.getByTestId("mock-comments")).toHaveTextContent("Comments for Scaling NextJS Systems");
    });

    it("should fallback to author name letter initials if author avatar image does not exist", async () => {
      vi.mocked(getBlogPostBySlug).mockResolvedValueOnce({
        data: [
          {
            ...mockPostPayload.data[0],
            author: {
              firstname: "Terry",
              lastname: "Wiz",
              email: null,
              image: null,
            },
          },
        ],
        meta: {
          pagination: { page: 1, pageSize: 1, total: 1, pageCount: 1 },
        },
      });

      const PageJSX = await SinglePost(mockPageProps);
      render(PageJSX);

      expect(screen.getByText("TW")).toBeInTheDocument();
    });

    it("should invoke Next.js notFound() transition routing if the payload yields an empty dataset", async () => {
      vi.mocked(getBlogPostBySlug).mockResolvedValueOnce({ 
        data: [] as any,
        meta: {
          pagination: { page: 1, pageSize: 0, total: 0, pageCount: 0 },
        },
      });

      await expect(SinglePost(mockPageProps)).rejects.toThrow("NEXT_NOT_FOUND_SIGNAL");
      expect(mockNotFound).toHaveBeenCalledTimes(1);
    });
  });

  describe("generateMetadata Blog Generator Ecosystem", () => {
    it("should map default error titles if page collection record matches to null", async () => {
      vi.mocked(fetchContentType).mockResolvedValueOnce(null);

      const meta = await generateMetadata(mockPageProps);

      expect(meta.title).toBe("Blog Not Found | Bitmutex Technologies");
      expect(meta.robots).toBe("noindex, nofollow");
    });

    it("should construct metadata fallback models using page layout text configurations upon clean resolution", async () => {
      vi.mocked(fetchContentType).mockResolvedValueOnce({
        title: "Fallback Post Title Reference",
        description: "Playbook analysis description copy guidelines.",
        category: { text: "Cloud" },
        seo: null,
      });

      const meta = await generateMetadata(mockPageProps);

      expect(meta.title).toBe("Fallback Post Title Reference |  Cloud  |Bitmutex Blogs");
      expect(meta.description).toBe("Playbook analysis description copy guidelines.");
      expect(meta.openGraph?.url).toBe("http://localhost:3000/blog/scaling-nextjs");
    });

    it("should process custom nested components injected via explicit Strapi SEO fields", async () => {
      vi.mocked(fetchContentType).mockResolvedValueOnce({
        title: "Standard Title",
        category: { text: "Cloud" },
        seo: {
          metaTitle: "Custom Explicit SEO Overwrite",
          metaDescription: "Targeted meta tags descriptions configuration guidelines parameters override standard operations.",
          metaImage: { url: "/assets/meta-card.png" },
        },
      });

      const meta = await generateMetadata(mockPageProps);

      expect(meta.title).toBe("Custom Explicit SEO Overwrite | Cloud | Bitmutex Blogs");
      expect(meta.description).toBe("Targeted meta tags descriptions configuration guidelines parameters override standard operations.");
      expect((meta.openGraph?.images as any)[0].url).toBe("https://strapi-cdn.com/assets/meta-card.png");
    });
  });
});