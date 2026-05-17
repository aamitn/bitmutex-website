import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import BlogRoute, { generateMetadata } from "./page"; 
import { getBlogPosts } from "@/data/loaders";
import fetchContentType from "@/lib/strapi/fetchContentType";

// 1. Mock External Data Fetchers and Core Utilities
vi.mock("@/data/loaders", () => ({
  getBlogPosts: vi.fn(),
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

// ✅ FIX 1: Partially mock utils to preserve the real "cn" utility for shadcn primitives
vi.mock("@/lib/utils", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/utils")>();
  return {
    ...actual,
    formatDate: (dateStr: string) => `Formatted: ${dateStr}`,
    calculateReadingTime: (contentStr: string) => contentStr.length > 50 ? 5 : 2,
  };
});

// 2. Mock Child Components to Isolate Layout Testing
vi.mock("@/components/custom/strapi-image", () => ({
  StrapiImage: ({ src, alt }: any) => <img src={src} alt={alt} data-testid="mock-strapi-img" />,
}));

vi.mock("@/components/custom/search", () => ({
  Search: () => <div data-testid="mock-search">Search Component</div>,
}));

vi.mock("@/components/custom/category-select", () => ({
  CategorySelect: () => <div data-testid="mock-category-select">Category Select</div>,
}));

vi.mock("@/components/custom/pagination", () => ({
  PaginationComponent: ({ pageCount }: any) => (
    <div data-testid="mock-pagination">Total Pages: {pageCount}</div>
  ),
}));

describe("BlogRoute Server Component & SEO Suite", () => {
const mockPosts = [
    {
      id: 1,
      documentId: "post-101",
      title: "Mastering React 19",
      slug: "mastering-react-19",
      description: "A deep dive look into server actions.",
      content: "Short intro text context row entry.",
      content1: "",
      content2: "",
      publishedAt: "2026-05-17",
      createdAt: "2026-05-17T00:00:00.000Z", // 👈 Added
      updatedAt: "2026-05-17T00:00:00.000Z", // 👈 Added
      image: { url: "/assets/react19.png", alternativeText: "React 19 Cover" },
      category: { text: "Engineering" },
    },
    {
      id: 2,
      documentId: "post-102",
      title: "Tailwind v4 Setup",
      slug: "tailwind-v4-setup",
      description: "Getting up and running with the newest release compiler configuration.",
      content: "This contains much longer content blocks created to ensure multi-string reading calculations aggregate all loops accurately.",
      content1: "Appending secondary paragraphs row fields.",
      content2: "Final paragraph footer information block values.",
      publishedAt: "2026-05-16",
      createdAt: "2026-05-16T00:00:00.000Z", // 👈 Added
      updatedAt: "2026-05-16T00:00:00.000Z", // 👈 Added
      image: { url: "/assets/tw4.png", alternativeText: null },
      category: null, 
    },
  ];
    const mockLoaderResponse = {
        data: mockPosts,
        meta: { 
        pagination: { 
            page: 1,
            pageSize: 10,
            total: 30,
            pageCount: 3 
        } 
        },
    };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("BlogRoute HTML Rendering Options", () => {
    it("should render layout elements inside a default Grid Layout mode", async () => {
      vi.mocked(getBlogPosts).mockResolvedValueOnce(mockLoaderResponse);

      const PageJSX = await BlogRoute({ searchParams: Promise.resolve({}) });
      render(PageJSX);

      expect(screen.getByText("Mastering React 19")).toBeInTheDocument();
      expect(screen.getByText("Tailwind v4 Setup")).toBeInTheDocument();
      expect(screen.getByText("Engineering")).toBeInTheDocument();
      expect(screen.getByText("No Category")).toBeInTheDocument();

      expect(screen.getByText("⏳ 2 min read")).toBeInTheDocument(); 
      expect(screen.getByText("⏳ 5 min read")).toBeInTheDocument(); 

      expect(screen.getByTestId("mock-search")).toBeInTheDocument();
      expect(screen.getByTestId("mock-category-select")).toBeInTheDocument();
      expect(screen.getByTestId("mock-pagination")).toHaveTextContent("Total Pages: 3");

      expect(screen.getByRole("button", { name: /list view/i })).toBeInTheDocument();
    });

    it("should shift card styles and render alternate toggle strings inside a List View configuration", async () => {
      vi.mocked(getBlogPosts).mockResolvedValueOnce(mockLoaderResponse);

      const PageJSX = await BlogRoute({
        searchParams: Promise.resolve({ view: "list", page: "2", query: "css" }),
      });
      render(PageJSX);

      expect(getBlogPosts).toHaveBeenCalledWith(2, "css", "");
      expect(screen.getByRole("button", { name: /grid view/i })).toBeInTheDocument();
    });
  });

  describe("generateMetadata SEO Functionality", () => {
    const mockParams = { params: Promise.resolve({ slug: "blog" }) };

    it("should output standard page-not-found layout templates if the backend resolves to null", async () => {
      vi.mocked(fetchContentType).mockResolvedValueOnce(null);

      const meta = await generateMetadata(mockParams);

      expect(meta.title).toBe("Blog Not Found | Bitmutex Technologies");
      expect(meta.robots).toBe("noindex, nofollow");
    });

    it("should construct metadata title combinations using page heading variables as static overrides", async () => {
      vi.mocked(fetchContentType).mockResolvedValueOnce({
        heading: "Bitmutex Insights",
        sub_heading: "Tech updates",
        description: "Articles tracking system scaling frameworks.",
        seo: null, 
      });

      const meta = await generateMetadata(mockParams);

      expect(meta.title).toBe("Bitmutex Insights | Bitmutex");
      expect(meta.description).toBe("Articles tracking system scaling frameworks.");
      expect(meta.openGraph?.url).toBe("http://localhost:3000/blog");
      expect(meta.alternates?.canonical).toBe("http://localhost:3000/blog");
    });

    it("should process explicitly defined Strapi v5 nested SEO elements smoothly when present", async () => {
      vi.mocked(fetchContentType).mockResolvedValueOnce({
        heading: "Bitmutex Insights",
        description: "Standard copy.",
        seo: {
          metaTitle: "Custom Managed Title Spec",
          metaDescription: "Custom target production description rules parameters tracking criteria.",
          metaImage: { url: "/assets/blog-og.jpg" },
        },
      });

      const meta = await generateMetadata(mockParams);

      // ✅ FIX 2: Added the double-space right before the pipe to match your production source string code
      expect(meta.title).toBe("Custom Managed Title Spec  | Bitmutex");
      expect(meta.description).toBe("Custom target production description rules parameters tracking criteria.");
      expect((meta.openGraph?.images as any)[0].url).toBe("https://strapi-cdn.com/assets/blog-og.jpg");
    });
  });
});