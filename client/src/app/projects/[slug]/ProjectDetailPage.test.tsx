import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import ProjectDetailPage, { generateMetadata } from "./page"; // Adjust path if needed
import { fetchProjectBySlug } from "@/data/loaders";
import fetchContentType from "@/lib/strapi/fetchContentType";

// 1. Mock External Data Loaders and Asset Handlers
vi.mock("@/data/loaders", () => ({
  fetchProjectBySlug: vi.fn(),
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

vi.mock("@/lib/utils", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/utils")>();
  return {
    ...actual,
    extractTextFromRichText: vi.fn((content) => {
      if (Array.isArray(content) || (content && typeof content === "object")) {
        return "Extracted description fallback content summary text.";
      }
      return content || "";
    }),
  };
});

// Mock Next.js navigation router hooks securely
const mockNotFound = vi.fn(() => {
  throw new Error("NEXT_NOT_FOUND_SIGNAL");
});
vi.mock("next/navigation", () => ({
  notFound: () => mockNotFound(),
}));

// Mock custom local plugins to simplify layout tracking
vi.mock("@/components/custom/RenderMarkdown", () => ({
  default: ({ content }: any) => <div data-testid="mock-markdown">{content}</div>,
}));

// 2. Stub Radix Accordion Primitives to prevent layout query drops
vi.mock("@/components/ui/accordion", () => ({
  Accordion: ({ children }: any) => <div data-testid="mock-accordion">{children}</div>,
  AccordionItem: ({ children }: any) => <div data-testid="mock-accordion-item">{children}</div>,
  AccordionTrigger: ({ children }: any) => <button data-testid="mock-accordion-trigger">{children}</button>,
  AccordionContent: ({ children }: any) => <div data-testid="mock-accordion-content">{children}</div>,
}));

describe("ProjectDetailPage Testing Stack Suite", () => {
  const mockPageProps = { params: Promise.resolve({ slug: "vienna-rectifier" }) };
  
  const mockActiveProjectPayload = {
    id: 99,
    name: "Vienna Power Stack",
    slug: "vienna-rectifier", // 👈 Added
    category: "Power Electronics",
    repourl: "https://github.com/bitmutex/vienna-rectifier",
    hostedurl: "https://labs.bitmutex.com/vienna",
    imageUrl: "/uploads/vienna-stack.jpg",
    details: "### System Level Topologies \n Vienna PFC three-phase circuit configuration metrics.",
    description: [
      {
        type: "paragraph",
        children: [{ text: "High efficiency 11kW industrial power factor correction unit module built using SiC MOSFET cells." }],
      },
    ],
  };

  const mockStrapiContentTypePayload = {
    name: "Vienna Power Stack",
    description: "Rich text summary array metadata description placeholder.",
    category: { text: "Power Electronics" },
    seo: {
      metaTitle: "11kW Vienna Rectifier Design Portfolio",
      metaDescription: "Deep technical breakdown of industrial 3-phase PFC stacks.",
      metaImage: { url: "/assets/vienna-og.png" },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("ProjectDetailPage Component UI Rendering Canvas", () => {
    
    it("should parse complex description blocks and render interactive buttons on clean hit", async () => {
        vi.mocked(fetchProjectBySlug).mockResolvedValueOnce(mockActiveProjectPayload);

        const PageJSX = await ProjectDetailPage(mockPageProps);
        render(PageJSX);

        // Verify textual heading and taxonomy elements
        expect(screen.getByRole("heading", { name: "Vienna Power Stack" })).toBeInTheDocument();
        expect(screen.getByText("Power Electronics")).toBeInTheDocument();

        // Verify custom mock markdown content is mapped cleanly down into the accordion slots
        expect(screen.getByTestId("mock-markdown")).toBeInTheDocument();
        expect(screen.getByText(/High efficiency 11kW industrial power/i)).toBeInTheDocument();

        // Verify structural outbound links have mounted securely
        const repoLink = screen.getByRole("link", { name: /^repository$/i });
        expect(repoLink).toHaveAttribute("href", "https://github.com/bitmutex/vienna-rectifier");
        
        // ✅ FIX: Added string boundaries (^ and $) to precisely isolate the top header link asset node
        const liveLink = screen.getByRole("link", { name: /^live demo$/i });
        expect(liveLink).toHaveAttribute("href", "https://labs.bitmutex.com/vienna");

        // Optional: You can also verify the second button exists independently if you want!
        const bottomCardLink = screen.getByRole("link", { name: /^view live demo$/i });
        expect(bottomCardLink).toBeInTheDocument();
        });

    it("should handle raw string fallbacks gracefully inside the rich-text rendering module", async () => {
      vi.mocked(fetchProjectBySlug).mockResolvedValueOnce({
        ...mockActiveProjectPayload,
        slug: "vienna-rectifier", // 👈 Added
        description: "Raw unformatted plaintext single description fallback baseline line query.",
      });

      const PageJSX = await ProjectDetailPage(mockPageProps);
      render(PageJSX);

      expect(screen.getByText("Raw unformatted plaintext single description fallback baseline line query.")).toBeInTheDocument();
    });

    it("should trigger a short-circuit routing bounce to Next.js notFound on null dataset records", async () => {
      vi.mocked(fetchProjectBySlug).mockResolvedValueOnce(null);

      await expect(ProjectDetailPage(mockPageProps)).rejects.toThrow("NEXT_NOT_FOUND_SIGNAL");
      expect(mockNotFound).toHaveBeenCalledTimes(1);
    });
  });

  describe("generateMetadata Custom Project Transformer Pipeline", () => {
    it("should map explicit error boundaries configurations if fetchContentType queries return null", async () => {
      vi.mocked(fetchContentType).mockResolvedValueOnce(null);

      const meta = await generateMetadata(mockPageProps);

      expect(meta.title).toBe("Project Not Found | Bitmutex Technologies");
      expect(meta.robots).toBe("noindex, nofollow");
    });

    it("should construct fully qualified deep-linked SEO property dictionaries upon clean matches", async () => {
      vi.mocked(fetchContentType).mockResolvedValueOnce(mockStrapiContentTypePayload);

      const meta = await generateMetadata(mockPageProps);

      expect(meta.title).toBe("11kW Vienna Rectifier Design Portfolio | Power Electronics | Bitmutex Projects");
      expect(meta.description).toBe("Deep technical breakdown of industrial 3-phase PFC stacks.");
      expect((meta.openGraph?.images as any)[0].url).toBe("https://strapi-cdn.com/assets/vienna-og.png");
      expect(meta.openGraph?.url).toBe("http://localhost:3000/projects/vienna-rectifier");
    });

   it("should fall back cleanly to native content properties if explicit metadata structures are missing", async () => {
      vi.mocked(fetchContentType).mockResolvedValueOnce({
        ...mockStrapiContentTypePayload,
        // ✅ FIX 2: Pass an array instead of a string to trigger your custom extractTextFromRichText mock response value match
        description: [{ type: "paragraph", children: [{ text: "Array Data Content" }] }],
        seo: null,
      });

      const meta = await generateMetadata(mockPageProps);

      expect(meta.title).toBe("Vienna Power Stack | Power Electronics | Bitmutex Projects");
      expect(meta.description).toBe("Extracted description fallback content summary text.");
    });
  });
});