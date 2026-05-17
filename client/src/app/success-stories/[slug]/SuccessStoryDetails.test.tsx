import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import SuccessStoryDetails, { generateMetadata } from "./page"; // Adjust path if needed
import { fetchSuccessStoryBySlug } from "@/data/loaders";
import fetchContentType from "@/lib/strapi/fetchContentType";
import { generateCombinedOgImage } from "@/lib/strapi/generateOgImage";

// 1. Mock External Fetching Layer and Strapi Core
vi.mock("@/data/loaders", () => ({
  fetchSuccessStoryBySlug: vi.fn(),
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

vi.mock("@/lib/strapi/generateOgImage", () => ({
  generateCombinedOgImage: vi.fn(),
}));

// Mock the Client Child component to keep the server test fast and isolated
vi.mock("./SuccessStoryClient", () => ({
  default: ({ story }: any) => <div data-testid="mock-client">Client Rendered: {story.name}</div>,
}));

describe("SuccessStoryDetails Server Layout & Metadata Pipeline Suite", () => {
  const mockParamsPromise = Promise.resolve({ slug: "industrial-battery-upgrade" });
  const mockPageProps = { params: mockParamsPromise };

const mockServerStoryPayload = {
    uuid: 701,
    name: "Industrial Battery Upgrade",
    content: "Full bridge thyristor replacement topology optimizations.",
    slug: "industrial-battery-upgrade",
    industry: "Power Electronics",
    websiteurl: "https://bitmutex.com",
    logo: null,
    glimpses: [],
    casestudy: null,
    impacts: [],
    stack: [],
    services: [],
    location: []
  };

  const mockStrapiBasePayload = {
    name: "Industrial Battery Upgrade",
    content: "Full bridge thyristor replacement topology optimizations.",
    seo: {
      metaTitle: "Industrial Battery Stack Success Case Study",
      metaDescription: "Deep dive look into thyristor-based design modernization.",
      metaImage: null,
    },
    logo: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("SuccessStoryDetails Server View Component", () => {
    it("should fetch data cleanly on the server and forward props to the client visualization layer", async () => {
      vi.mocked(fetchSuccessStoryBySlug).mockResolvedValueOnce(mockServerStoryPayload);

      const PageJSX = await SuccessStoryDetails(mockPageProps);
      render(PageJSX);

      expect(screen.getByTestId("mock-client")).toBeInTheDocument();
      expect(screen.getByText(/Client Rendered: Industrial Battery Upgrade/i)).toBeInTheDocument();
    });

    it("should mount an explicit placeholder message string if server data requests return null", async () => {
      vi.mocked(fetchSuccessStoryBySlug).mockResolvedValueOnce(null);

      const PageJSX = await SuccessStoryDetails(mockPageProps);
      render(PageJSX);

      expect(screen.getByText("Success story not found.")).toBeInTheDocument();
      expect(screen.queryByTestId("mock-client")).not.toBeInTheDocument();
    });
  });

  describe("generateMetadata Hook Configurator Matrix", () => {
    it("should fallback to explicit missing page flags if fetchContentType returns null", async () => {
      vi.mocked(fetchContentType).mockResolvedValueOnce(null);

      const meta = await generateMetadata({ params: mockParamsPromise });

      expect(meta.title).toBe("Story Not Found | Bitmutex Technologies");
      expect(meta.robots).toBe("noindex, nofollow");
    });

    it("should map an explicit predefined seo.metaImage target whenever present", async () => {
      vi.mocked(fetchContentType).mockResolvedValueOnce({
        ...mockStrapiBasePayload,
        seo: {
          ...mockStrapiBasePayload.seo,
          metaImage: { url: "/predefined-seo-og.png" },
        },
      });

      const meta = await generateMetadata({ params: mockParamsPromise });

      expect((meta.openGraph?.images as any)[0].url).toBe("https://strapi-cdn.com/predefined-seo-og.png");
      expect(generateCombinedOgImage).not.toHaveBeenCalled();
    });

    it("should dynamically trigger generateCombinedOgImage canvas generators if metaImage is empty but a customer logo exists", async () => {
      vi.mocked(fetchContentType).mockResolvedValueOnce({
        ...mockStrapiBasePayload,
        logo: { url: "/customer-logo-raw.png" },
      });
      vi.mocked(generateCombinedOgImage).mockResolvedValueOnce("https://generated-cdn.com/combined-canvas.png");

      const meta = await generateMetadata({ params: mockParamsPromise });

      expect(generateCombinedOgImage).toHaveBeenCalledWith(
        "https://strapi-cdn.com/customer-logo-raw.png",
        "industrial-battery-upgrade",
        expect.any(String)
      );
      expect((meta.openGraph?.images as any)[0].url).toBe("https://generated-cdn.com/combined-canvas.png");
    });

    it("should assign an empty array safely to images if both metaImage and logo definitions are blank", async () => {
      vi.mocked(fetchContentType).mockResolvedValueOnce(mockStrapiBasePayload);

      const meta = await generateMetadata({ params: mockParamsPromise });

      expect(meta.openGraph?.images).toEqual([]);
    });

    it("should execute default structural metadata property assignments if active seo blocks are missing entirely", async () => {
      vi.mocked(fetchContentType).mockResolvedValueOnce({
        ...mockStrapiBasePayload,
        seo: null,
      });

      const meta = await generateMetadata({ params: mockParamsPromise });

      expect(meta.title).toBe("Industrial Battery Upgrade  | Success Stories with Bitmutex");
      expect(meta.description).toContain("How Industrial Battery Upgrade succeeded with Bitmutex");
    });
  });
});