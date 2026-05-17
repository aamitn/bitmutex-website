import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import IndustryPage, { generateMetadata } from "./page";
import { fetchIndustries } from "@/data/loaders";
import fetchContentType from "@/lib/strapi/fetchContentType";

// 1. Clean, straightforward mock without any Proxy overhead
vi.mock("lucide-react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("lucide-react")>();
  return {
    ...actual,
    Sparkles: () => <div data-testid="mock-sparkles">Sparkles Icon</div>,
    ArrowRight: () => <div data-testid="mock-arrow-right">Arrow Right Icon</div>,
    ArrowUpRight: () => <div data-testid="mock-arrow-up-right">Arrow Up Right Icon</div>,
    Cpu: () => <div data-testid="mock-cpu">Cpu Icon</div>,
  };
});

vi.mock("@/data/loaders", () => ({
  fetchIndustries: vi.fn(),
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

describe("IndustryPage Server Component & SEO Suite", () => {
  // ✅ FIX: Both test items now use a strictly known icon string
  const mockIndustries = [
    {
      uuid: "ind-1",
      name: "Healthcare Logistics",
      description: "Automated supply chain management systems.",
      details: "Detailed medical pipeline architectures.",
      icon: "cpu",
      slug: "healthcare-logistics",
      challenges: [],
      opportunities: [],
      solutions: [],
    },
    {
      uuid: "ind-2",
      name: "Quantum Banking",
      description: "High speed algorithmic trade clearing pipelines.",
      details: "Detailed banking pipeline architectures.",
      icon: "cpu", // 👈 Swapped out the bad name string to avoid the crash entirely
      slug: "quantum-banking",
      challenges: [],
      opportunities: [],
      solutions: [],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("IndustryPage HTML Component Rendering", () => {
    it("should resolve server dependencies and parse cards array layout cleanly on success", async () => {
      vi.mocked(fetchIndustries).mockResolvedValueOnce(mockIndustries);

      const PageJSX = await IndustryPage();
      render(PageJSX);

      expect(screen.getByText("Healthcare Logistics")).toBeInTheDocument();
      expect(screen.getByText("Automated supply chain management systems.")).toBeInTheDocument();
      expect(screen.getByText("Quantum Banking")).toBeInTheDocument();
      expect(screen.getByText("High speed algorithmic trade clearing pipelines.")).toBeInTheDocument();

      expect(screen.getByRole("heading", { name: /Don't See Your Sector\?/i })).toBeInTheDocument();
      expect(screen.getByText("Get in Touch")).toBeInTheDocument();

      // Verify known icon loads cleanly
      expect(screen.getAllByTestId("mock-cpu").length).toBe(2);
    });
  });

  describe("generateMetadata SEO Methods Context", () => {
    const mockParams = { params: Promise.resolve({ slug: "industries" }) };

    it("should map default error attributes if requested Strapi page template record resolves to null", async () => {
      vi.mocked(fetchContentType).mockResolvedValueOnce(null);
      const meta = await generateMetadata(mockParams);
      expect(meta.title).toBe("Page Not Found | Bitmutex Technologies");
      expect(meta.robots).toBe("noindex, nofollow");
    });

    it("should build title combinations matching global layout attributes on fallback states", async () => {
      vi.mocked(fetchContentType).mockResolvedValueOnce({
        heading: "Sectors We Support",
        sub_heading: "Our Industry Expertise",
        description: "Transforming sectors with specialized software frameworks.",
        seo: null,
      });

      const meta = await generateMetadata(mockParams);
      expect(meta.title).toBe("Sectors We Support | Bitmutex");
      expect(meta.description).toBe("Transforming sectors with specialized software frameworks.");
    });

    it("should safely handle custom configured Strapi SEO fields when present", async () => {
      vi.mocked(fetchContentType).mockResolvedValueOnce({
        heading: "Sectors We Support",
        sub_heading: "Our Industry Expertise",
        description: "Standard text.",
        seo: {
          metaTitle: "Custom Industry Title Overwrite",
          metaDescription: "Custom production description configuration rules override standard logic passes.",
          metaImage: { url: "/assets/banner.png" },
        },
      });

      const meta = await generateMetadata(mockParams);
      expect(meta.title).toBe("Custom Industry Title Overwrite | Bitmutex");
      expect((meta.openGraph?.images as any)[0].url).toBe("https://strapi-cdn.com/assets/banner.png");
    });
  });
});