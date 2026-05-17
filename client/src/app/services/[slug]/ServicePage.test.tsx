import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import ServicePage, { generateMetadata } from "./page"; // Adjust relative path if needed
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

// Mock child component slider to isolate testing layout contexts
vi.mock("@/components/custom/TechStackSlider", () => ({
  default: ({ logos }: any) => <div data-testid="mock-slider">Slider Logos: {logos.length}</div>,
}));

// ✅ FIX: Proxy interceptor to catch structural runtime string reflection on icon lookups without throwing
vi.mock("lucide-react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("lucide-react")>();
  
  const baseMock = {
    ...actual,
    Zap: () => <svg data-testid="zap-icon" />,
    Target: () => <svg data-testid="target-icon" />,
    AlertCircle: () => <svg data-testid="fallback-icon" />,
  };

  return new Proxy(baseMock, {
    get(target, prop) {
      return prop in target ? (target as any)[prop] : undefined;
    }
  });
});

// Mock Next.js navigation router hooks safely
const mockNotFound = vi.fn(() => {
  throw new Error("NEXT_NOT_FOUND_SIGNAL");
});
vi.mock("next/navigation", () => ({
  notFound: () => mockNotFound(),
}));

describe("ServicePage Deep Sub-Route Dynamic Testing Suite", () => {
  const mockPageProps = { params: Promise.resolve({ slug: "embedded-systems" }) };

  const mockServicesCollection = [
    {
      uuid: "srv-embedded-99",
      name: "Embedded Engineering & R&D Labs",
      description: "Industrial hardware power electronics stack design layouts and firmware code compilation.",
      slug: "embedded-systems",
      icon: "zap",
      techstacklogos: [{ url: "/logos/kicad.png" }, { url: "/logos/altium.png" }],
      service_items: [
        {
          name: "PCB Design & Prototyping",
          description: "Multi-layer high-speed industrial signal routing tracking grids.",
          icon: "target",
        },
        {
          name: "Firmware Development",
          description: "Low-latency C2000 and STM32 embedded controller logic compilation loops.",
          icon: "invalid-icon-fallback-string-test",
        }
      ],
    },
  ];

  const mockStrapiMetadataPayload = {
    name: "Embedded Systems Development",
    description: "Enterprise custom industrial electronics layout solutions matrix.",
    seo: {
      metaTitle: "Industrial Embedded Engineering Experts",
      metaDescription: "Providing multi-layer PCB topology design, firmware development, and hardware R&D.",
      metaImage: { url: "/assets/embedded-og.png" },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("generateMetadata Custom Transformer Configurations Pipeline", () => {
    it("should provide an explicit missing page envelope dictionary if Strapi fetchContentType reads null", async () => {
      vi.mocked(fetchContentType).mockResolvedValueOnce(null);

      const meta = await generateMetadata(mockPageProps);

      expect(meta.title).toBe("Service Not Found | Bitmutex Technologies");
      expect(meta.robots).toBe("noindex, nofollow");
    });

    it("should assemble fully structured deep-linked SEO values upon clean metadata queries", async () => {
      vi.mocked(fetchContentType).mockResolvedValueOnce(mockStrapiMetadataPayload);

      const meta = await generateMetadata(mockPageProps);

      expect(meta.title).toBe("Industrial Embedded Engineering Experts | Bitmutex");
      expect(meta.description).toBe("Providing multi-layer PCB topology design, firmware development, and hardware R&D.");
      expect((meta.openGraph?.images as any)[0].url).toBe("https://strapi-cdn.com/assets/embedded-og.png");
      expect(meta.openGraph?.url).toBe("http://localhost:3000/services/embedded-systems");
    });
  });
});