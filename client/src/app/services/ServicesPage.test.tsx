import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import ServicesPage, { generateMetadata } from "./page"; // Adjust path if needed
import { fetchServices } from "@/data/loaders";
import fetchContentType from "@/lib/strapi/fetchContentType";
import React from "react";

// 1. Mock External Data Loaders and Asset Utilities
vi.mock("@/data/loaders", () => ({
  fetchServices: vi.fn(),
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

// Mock child component slider to eliminate slider interval loops inside tests
vi.mock("@/components/custom/TechStackSlider", () => ({
  default: ({ logos }: any) => <div data-testid="mock-slider">Slider Logos: {logos.length}</div>,
}));

// Mock lucide-react icon map array safely to check getLucideIcon parsing
vi.mock("lucide-react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("lucide-react")>();
  
  const baseMock = {
    ...actual,
    Cpu: () => <svg data-testid="cpu-icon" />,
    AlertCircle: () => <svg data-testid="fallback-icon" />,
  };

  return new Proxy(baseMock, {
    get(target, prop) {
      // If the property exists on our target mock, use it; otherwise return undefined safely
      return prop in target ? (target as any)[prop] : undefined;
    }
  });
});

describe("ServicesPage Layout and Metadata Configuration Suite", () => {
  const mockMetaParams = { params: Promise.resolve({ slug: "services" }) };

  const mockServicesPayload = [
    {
      uuid: "srv-111",
      name: "Embedded R&D and Firmware Systems",
      description: "Industrial thyrister configurations and STM32 firmware design architectures.",
      slug: "embedded-systems",
      icon: "cpu", // Will verify split/Pascal mapping rules
      techstacklogos: [{ url: "/logos/stm32.png" }, { url: "/logos/kicad.png" }],
      service_items: [],
    },
    {
      uuid: "srv-222",
      name: "Fullstack Cloud Engineering",
      description: "Scalable enterprise web projects utilizing TanStack, NextJS, and Convex DB.",
      slug: "fullstack-cloud",
      icon: "invalid-icon-name-string", // Will trigger fallback pathing
      techstacklogos: [],
      service_items: [],
    },
  ];

  const mockStrapiContentTypePayload = {
    heading: "Bitmutex Technical Catalog",
    sub_heading: "Next-Gen Engineering Capabilities",
    description: "Deep dive look into our active hardware, software, and firmware capabilities.",
    seo: {
      metaTitle: "Bitmutex Core Solutions",
      metaDescription: "Enterprise grade engineering delivery models optimized for industrial platforms.",
      metaImage: { url: "/assets/services-og.png" },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("generateMetadata Pipeline Transformers", () => {
    it("should present absolute error configuration rules if fetchContentType resolves to null", async () => {
      vi.mocked(fetchContentType).mockResolvedValueOnce(null);

      const meta = await generateMetadata(mockMetaParams);

      expect(meta.title).toBe("Page Not Found | Bitmutex Technologies");
      expect(meta.robots).toBe("noindex, nofollow");
    });

    it("should assemble standard SEO meta-dictionaries upon valid handshake responses", async () => {
      vi.mocked(fetchContentType).mockResolvedValueOnce(mockStrapiContentTypePayload);

      const meta = await generateMetadata(mockMetaParams);

      expect(meta.title).toBe("Bitmutex Core Solutions  | Bitmutex");
      expect(meta.description).toBe("Enterprise grade engineering delivery models optimized for industrial platforms.");
      expect((meta.openGraph?.images as any)[0].url).toBe("https://strapi-cdn.com/assets/services-og.png");
      expect(meta.openGraph?.url).toBe("http://localhost:3000/services");
    });

    it("should fallback smoothly onto base properties if dedicated seo blocks are omitted", async () => {
      vi.mocked(fetchContentType).mockResolvedValueOnce({
        ...mockStrapiContentTypePayload,
        seo: null, // Forces state assignment mapping routes down the default pipeline loops
      });

      const meta = await generateMetadata(mockMetaParams);

      expect(meta.title).toBe("Bitmutex Technical Catalog | Bitmutex");
      expect(meta.description).toBe("Deep dive look into our active hardware, software, and firmware capabilities.");
    });
  });
});