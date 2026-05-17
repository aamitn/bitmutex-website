import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import BrandKitPage, { generateMetadata } from "./page"; // Adjust path if named page.tsx
import fetchContentType from "@/lib/strapi/fetchContentType";

// 1. Mock External Core Network Layers and Utilities
vi.mock("@/lib/strapi/fetchContentType", () => ({
  default: vi.fn(),
}));

vi.mock("@/lib/strapi/strapiImage", () => ({
  strapiImage: (url: string) => `https://strapi-cdn.com${url}`,
}));

vi.mock("@/lib/metadata", () => ({
  generateMetadataObject: vi.fn(() => ({})),
}));

// 2. Mock Dependent UI Components to Isolate the Server Page Logic
vi.mock("./BrandKitClient", () => ({
  default: ({ logos }: any) => (
    <div data-testid="mock-brandkit-client">
      Logos Mounted: {logos.length} | First Logo: {logos[0]?.company}
    </div>
  ),
}));

vi.mock("@/components/custom/ColorCard", () => ({
  default: ({ color }: any) => (
    <div data-testid="mock-color-card">
      Color: {color.name} | Hex: {color.hex} | RGB: {color.rgb} | CMYK: {color.cmyk}
    </div>
  ),
}));

describe("BrandKitPage Server Component & SEO Suite", () => {
  const mockParams = { params: Promise.resolve({ slug: "brand-kit" }) };

  const mockStrapiPayload = {
    data: {
      colors: [
        { id: 10, name: "Bitmutex Blue", hexcode: "#0055ff" },
        { id: 11, name: "Amber Spark", hexcode: "#fbbf24" },
      ],
      brandlogo: [
        {
          id: 1,
          company: "Bitmutex Primary Logo",
          image: { url: "/uploads/logo_white.png", name: "logo_white.png" },
        },
      ],
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_STRAPI_BASE_URL = "http://localhost:1337";
  });

  describe("BrandKitPage Rendering Ecosystem", () => {
    it("should fetch, parse color spaces accurately, and render layout sections cleanly", async () => {
      vi.mocked(fetchContentType).mockResolvedValueOnce(mockStrapiPayload);

      const PageJSX = await BrandKitPage();
      render(PageJSX);

      // Verify that structural headers render effectively
      expect(screen.getByText("Brand Identity System")).toBeInTheDocument();
      expect(screen.getByText("Color Palette")).toBeInTheDocument();
      expect(screen.getByText("Logo Assets")).toBeInTheDocument();

      // Verify the color translation utility calculations map correctly to the cards
      expect(screen.getAllByTestId("mock-color-card")).toHaveLength(2);
      expect(screen.getByText(/Color: Bitmutex Blue | Hex: #0055ff | RGB: rgb\(0, 85, 255\) | CMYK: cmyk\(100, 67, 0, 0\)/i)).toBeInTheDocument();
      expect(screen.getByText(/Color: Amber Spark | Hex: #fbbf24 | RGB: rgb\(251, 191, 36\) | CMYK: cmyk\(0, 24, 86, 2\)/i)).toBeInTheDocument();

      // Verify mapped images base url calculations passed cleanly to the client bundle
      expect(screen.getByTestId("mock-brandkit-client")).toBeInTheDocument();
      expect(screen.getByText("Logos Mounted: 1 | First Logo: Bitmutex Primary Logo")).toBeInTheDocument();
    });

    it("should render a clean user warning message if the fetch handler returns null parameters", async () => {
      vi.mocked(fetchContentType).mockResolvedValueOnce(null);

      const PageJSX = await BrandKitPage();
      render(PageJSX);

      expect(screen.getByText("Error: Unable to fetch data")).toBeInTheDocument();
      expect(screen.queryByText("Brand Identity System")).not.toBeInTheDocument();
    });
  });

  describe("generateMetadata Generator Hooks", () => {
    it("should fallback to default error fields if requested content-type cannot be found", async () => {
      vi.mocked(fetchContentType).mockResolvedValueOnce(null);

      const meta = await generateMetadata(mockParams);

      expect(meta.title).toBe("Page Not Found | Bitmutex Technologies");
      expect(meta.robots).toBe("noindex, nofollow");
    });

    it("should format metadata title configurations using page heading fallbacks", async () => {
      vi.mocked(fetchContentType).mockResolvedValueOnce({
        heading: "Media Assets",
        sub_heading: "Corporate style guidelines",
        description: "Official logotypes, values, and hex colors configuration mapping assets.",
        seo: null, // Forces structural fallback evaluation
      });

      const meta = await generateMetadata(mockParams);

      expect(meta.title).toBe("Media Assets | Bitmutex");
      expect(meta.description).toBe("Official logotypes, values, and hex colors configuration mapping assets.");
      expect(meta.openGraph?.url).toBe("http://localhost:3000/brand-kit");
    });

    it("should process explicitly configured nested SEO object blocks if present in the data response", async () => {
      vi.mocked(fetchContentType).mockResolvedValueOnce({
        heading: "Media Assets",
        description: "Fallback text block.",
        seo: {
          metaTitle: "Custom Branding Guide Overwrite",
          metaDescription: "Custom production description rule configuration override passes.",
          metaImage: { url: "/assets/brandkit-og.jpg" },
        },
      });

      const meta = await generateMetadata(mockParams);

      expect(meta.title).toBe("Custom Branding Guide Overwrite | Bitmutex");
      expect(meta.description).toBe("Custom production description rule configuration override passes.");
      expect((meta.openGraph?.images as any)[0].url).toBe("https://strapi-cdn.com/assets/brandkit-og.jpg");
    });
  });
});