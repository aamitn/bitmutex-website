import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import IndustryDetailPage, { generateMetadata } from "./page"; // Adjust path if named page.tsx
import { fetchIndustryBySlug } from "@/data/loaders";
import fetchContentType from "@/lib/strapi/fetchContentType";

// 1. Mock External Data Fetchers and Core Modules Cleanly
vi.mock("@/data/loaders", () => ({
  fetchIndustryBySlug: vi.fn(),
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

// Mock Next.js navigation primitives to handle redirect testing patterns seamlessly
const mockNotFound = vi.fn();
vi.mock("next/navigation", () => ({
  notFound: () => mockNotFound(),
}));

// 2. Mock Lucide Icons safely with standard keys to bypass runtime missing-property crashes
vi.mock("lucide-react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("lucide-react")>();
  return {
    ...actual,
    Sparkles: () => <div data-testid="mock-sparkles">Sparkles Icon</div>,
    ArrowLeft: () => <div data-testid="mock-arrow-left">Arrow Left Icon</div>,
    ArrowRight: () => <div data-testid="mock-arrow-right">Arrow Right Icon</div>,
    ArrowUpRight: () => <div data-testid="mock-arrow-up-right">Arrow Up Right Icon</div>,
    TrendingUp: () => <div data-testid="mock-trending-up">Trending Up Icon</div>,
    Target: () => <div data-testid="mock-target">Target Icon</div>,
    CheckCircle2: () => <div data-testid="mock-check-circle">Check Circle Icon</div>,
    AlertTriangle: () => <div data-testid="mock-alert-triangle">Alert Triangle Icon</div>,
    Cpu: () => <div data-testid="mock-cpu">Cpu Icon</div>,
  };
});

// Mock Radix Accordion UI components to ensure layout values render cleanly flatly in JSDOM
vi.mock("@/components/ui/accordion", () => ({
  Accordion: ({ children }: any) => <div data-testid="mock-accordion">{children}</div>,
  AccordionItem: ({ children }: any) => <div>{children}</div>,
  AccordionTrigger: ({ children }: any) => <button>{children}</button>,
  AccordionContent: ({ children }: any) => <div>{children}</div>,
}));

describe("IndustryDetailPage Server Suite & SEO Context", () => {
  const mockPageProps = { params: Promise.resolve({ slug: "fintech" }) };

const mockIndustryData = {
    uuid: "ind-101",
    slug: "fintech",
    name: "Fintech Innovation",
    description: "Modernizing core processing banking layers.",
    details: "<h2>The Future of Currency</h2><p>Sanitized detailed content pass.</p>",
    icon: "cpu", 
    challenges: [{ name: "Legacy technical ledger debt" }],
    opportunities: [{ name: "Decentralized automated liquidity pools" }],
    solutions: [{ name: "Cloud-native real-time trade settlement architectures" }],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("IndustryDetailPage Server Component Rendering", () => {
    it("should successfully mount structure nodes and display full metrics datasets on a clean match", async () => {
      vi.mocked(fetchIndustryBySlug).mockResolvedValueOnce(mockIndustryData);

      // Resolve async functional component promise array
      const PageJSX = await IndustryDetailPage(mockPageProps);
      render(PageJSX);

      // Verify header sections match text content bindings
      expect(screen.getByRole("heading", { name: "Fintech Innovation" })).toBeInTheDocument();
      expect(screen.getByText("Modernizing core processing banking layers.")).toBeInTheDocument();

      // Verify sub-components / icons mapped correctly
      expect(screen.getByTestId("mock-cpu")).toBeInTheDocument();
      expect(screen.getByTestId("mock-accordion")).toBeInTheDocument();

      // Verify rich html layout container received data safely
      expect(screen.getByText("The Future of Currency")).toBeInTheDocument();
      expect(screen.getByText("Sanitized detailed content pass.")).toBeInTheDocument();

      // Verify cards and array lists iterated perfectly
      expect(screen.getByText("Key Challenges")).toBeInTheDocument();
      expect(screen.getByText("Legacy technical ledger debt")).toBeInTheDocument();

      expect(screen.getByText("Growth Opportunities")).toBeInTheDocument();
      expect(screen.getByText("Decentralized automated liquidity pools")).toBeInTheDocument();

      expect(screen.getByText("Tailored Solutions")).toBeInTheDocument();
      expect(screen.getByText("Cloud-native real-time trade settlement architectures")).toBeInTheDocument();
    });

    it("should invoke Next.js notFound() routing hook if the returned record structure is null", async () => {
      vi.mocked(fetchIndustryBySlug).mockResolvedValueOnce(null);

      await IndustryDetailPage(mockPageProps);

      expect(mockNotFound).toHaveBeenCalledTimes(1);
    });
  });

  describe("generateMetadata SEO Method Pass", () => {
    it("should display page-not-found parameters gracefully if template collection layer returns null", async () => {
      vi.mocked(fetchContentType).mockResolvedValueOnce(null);

      const metadata = await generateMetadata(mockPageProps);

      expect(metadata.title).toBe("Page Not Found | Bitmutex Technologies");
      expect(metadata.robots).toBe("noindex, nofollow");
    });

    it("should synthesize expected title formatting blocks using base component text configurations as structural fallback pointers", async () => {
      vi.mocked(fetchContentType).mockResolvedValueOnce({
        name: "Fintech",
        description: "Transforming banking options.",
        seo: null, // Force default fallback calculation
      });

      const metadata = await generateMetadata(mockPageProps);

      expect(metadata.title).toBe("Fintech Industry | Bitmutex");
      expect(metadata.description).toBe("Transforming banking options.");
      expect(metadata.openGraph?.url).toBe("http://localhost:3000/industries/fintech");
      expect(metadata.alternates?.canonical).toBe("http://localhost:3000/industries/fintech");
    });

    it("should process explicitly defined Strapi v5 nested SEO configuration rows gracefully when present", async () => {
      vi.mocked(fetchContentType).mockResolvedValueOnce({
        name: "Fintech",
        description: "Standard text.",
        seo: {
          metaTitle: "Custom Fintech Insights Overwrite",
          metaDescription: "Custom targeted description overrides tracking passes.",
          metaImage: { url: "/assets/fintech-og.jpg" },
        },
      });

      const metadata = await generateMetadata(mockPageProps);

      expect(metadata.title).toBe("Custom Fintech Insights Overwrite | Bitmutex");
      expect(metadata.description).toBe("Custom targeted description overrides tracking passes.");
      expect((metadata.openGraph?.images as any)[0].url).toBe("https://strapi-cdn.com/assets/fintech-og.jpg");
    });
  });
});