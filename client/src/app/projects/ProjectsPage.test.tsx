import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import ProjectsPage, { generateMetadata } from "./page"; // Adjust path if needed
import { fetchProjects } from "@/data/loaders";
import fetchContentType from "@/lib/strapi/fetchContentType";

// 1. Mock External Data Fetchers and Strapi Content Handlers
vi.mock("@/data/loaders", () => ({
  fetchProjects: vi.fn(),
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

// Mock standard UI Radix primitive selectors that execute inside server/client bounds
vi.mock("@/components/ui/select", () => {
  return {
    Select: ({ children, defaultValue }: any) => <div data-testid="mock-select" data-value={defaultValue}>{children}</div>,
    SelectTrigger: ({ children }: any) => <div data-testid="mock-select-trigger">{children}</div>,
    SelectValue: ({ placeholder }: any) => <span>{placeholder}</span>,
    SelectContent: ({ children }: any) => <div data-testid="mock-select-content">{children}</div>,
    SelectItem: ({ children, value }: any) => <div data-testid="mock-select-item" data-item-value={value}>{children}</div>,
  };
});

describe("ProjectsPage Server Layout & Metadata Matrix Suite", () => {
  const mockPagePropsBase = {
    searchParams: Promise.resolve({}),
  };

  const mockProjectsPayload = [
    {
      id: 1,
      name: "Vienna Rectifier Stack",
      description: "An 11kW power electronics power stack framework architecture.",
      slug: "vienna-rectifier-stack",
      imageUrl: "/uploads/vienna.jpg",
      category: "Power Electronics",
    },
    {
      id: 2,
      name: "Automated PyQt6 Plategen",
      description: "AutoCAD COM integration for asset nameplates configurations.",
      slug: "pyqt6-plategen",
      imageUrl: "/uploads/plategen.jpg",
      category: "Automation",
    },
  ];

  const mockStrapiPageMeta = {
    heading: "Bitmutex Portfolio",
    sub_heading: "Innovative Engineering Solutions",
    description: "Deep dive look into our recent hardware design, firmware assemblies, and architectures.",
    seo: {
      metaTitle: "Bitmutex Active Labs",
      metaDescription: "Explore structural system design components built to scale indefinitely.",
      metaImage: { url: "/assets/labs-og.png" },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("ProjectsPage Layout Interface Filters Rendering", () => {
    it("should display default values, active project grids, and statistical bar ratios when matches align", async () => {
      vi.mocked(fetchProjects).mockResolvedValueOnce(mockProjectsPayload);

      const PageJSX = await ProjectsPage(mockPagePropsBase);
      render(PageJSX);

      // Verify header sections derived from local defaults or initial bindings parse out correctly
      expect(screen.getByRole("heading", { name: /Featured Projects/i })).toBeInTheDocument();
      expect(screen.getByText("Vienna Rectifier Stack")).toBeInTheDocument();
      expect(screen.getByText("Automated PyQt6 Plategen")).toBeInTheDocument();

      // Check text summary strings match statistical math arrays footprint
      expect(screen.getByText("Showing 2 of 2 projects")).toBeInTheDocument();
    });

    it("should narrow project cards matching text search queries inside filtered project blocks", async () => {
      vi.mocked(fetchProjects).mockResolvedValueOnce(mockProjectsPayload);
      
      const SearchParamsProps = {
        searchParams: Promise.resolve({ search: "PyQt6" }),
      };

      const PageJSX = await ProjectsPage(SearchParamsProps);
      render(PageJSX);

      expect(screen.getByText("Automated PyQt6 Plategen")).toBeInTheDocument();
      expect(screen.queryByText("Vienna Rectifier Stack")).not.toBeInTheDocument();
      expect(screen.getByText("Showing 1 of 2 projects")).toBeInTheDocument();
    });

    it("should apply selective category constraints when isolating distinct taxonomy entries", async () => {
      vi.mocked(fetchProjects).mockResolvedValueOnce(mockProjectsPayload);
      
      const CategoryParamsProps = {
        searchParams: Promise.resolve({ category: "Power Electronics" }),
      };

      const PageJSX = await ProjectsPage(CategoryParamsProps);
      render(PageJSX);

      expect(screen.getByText("Vienna Rectifier Stack")).toBeInTheDocument();
      expect(screen.queryByText("Automated PyQt6 Plategen")).not.toBeInTheDocument();
    });

    it("should render a clear-filter fallback callout screen if results resolve to empty arrays", async () => {
      vi.mocked(fetchProjects).mockResolvedValueOnce(mockProjectsPayload);
      
      const EmptyParamsProps = {
        searchParams: Promise.resolve({ search: "Missing Non-existent Stack Term" }),
      };

      const PageJSX = await ProjectsPage(EmptyParamsProps);
      render(PageJSX);

      expect(screen.getByRole("heading", { name: "No projects found" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Clear Filters/i })).toBeInTheDocument();
    });
  });

  describe("generateMetadata Staging Configuration Builders", () => {
    const mockMetaParams = { params: Promise.resolve({ slug: "projects" }) };

    it("should resolve fallback tracking names if the content type response maps to null", async () => {
      vi.mocked(fetchContentType).mockResolvedValueOnce(null);

      const meta = await generateMetadata(mockMetaParams);

      expect(meta.title).toBe("Projects Not Found | Bitmutex Technologies");
      expect(meta.robots).toBe("noindex, nofollow");
    });

    it("should accurately assign structural values using active Strapi schema properties on valid calls", async () => {
      vi.mocked(fetchContentType).mockResolvedValueOnce(mockStrapiPageMeta);

      const meta = await generateMetadata(mockMetaParams);

      expect(meta.title).toBe("Bitmutex Active Labs | Bitmutex");
      expect(meta.description).toBe("Explore structural system design components built to scale indefinitely.");
      expect((meta.openGraph?.images as any)[0].url).toBe("https://strapi-cdn.com/assets/labs-og.png");
      expect(meta.openGraph?.url).toBe("http://localhost:3000/projects");
    });

    it("should fallback cleanly to standard field configurations if SEO metadata blocks are missing", async () => {
      vi.mocked(fetchContentType).mockResolvedValueOnce({
        ...mockStrapiPageMeta,
        seo: null, // Force variable pipeline evaluations down fallback trees
      });

      const meta = await generateMetadata(mockMetaParams);

      expect(meta.title).toBe("Bitmutex Portfolio | Bitmutex");
      expect(meta.description).toBe("Deep dive look into our recent hardware design, firmware assemblies, and architectures.");
    });
  });
});