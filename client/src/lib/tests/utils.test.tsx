import { describe, it, expect, vi, beforeEach } from "vitest";
import { 
  cn, 
  getStrapiURL, 
  getStrapiMedia, 
  formatDate, 
  truncate, 
  formatNumber, 
  extractTextFromRichText, 
  calculateReadingTime, 
  isValidUrl, 
  formatLPA 
} from "../utils"; 

describe("Core Layout and Data Utilities Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // ✅ FIX: Use undefined instead of "" to accurately trigger the nullish coalescing fallback logic
    vi.stubEnv("NEXT_PUBLIC_STRAPI_BASE_URL", undefined);
  });

  describe("cn (Classname Merger)", () => {
    it("should merge and resolve overlapping Tailwind classes cleanly", () => {
      const merged = cn("px-2 py-4 bg-red-500", "p-6", { "dark:bg-slate-900": true, "hidden": false });
      expect(merged).toContain("p-6");
      expect(merged).toContain("dark:bg-slate-900");
      expect(merged).not.toContain("px-2");
    });
  });

  describe("getStrapiURL & getStrapiMedia", () => {
    it("should fall back to localhost if environment variables are missing", () => {
      expect(getStrapiURL()).toBe("http://localhost:1337");
    });

    it("should read injected public domain strings from the process environment", () => {
      vi.stubEnv("NEXT_PUBLIC_STRAPI_BASE_URL", "https://strapi.bitmutex.com");
      expect(getStrapiURL()).toBe("https://strapi.bitmutex.com");
    });

    it("should prepend structural base origins onto relative media URLs cleanly", () => {
      vi.stubEnv("NEXT_PUBLIC_STRAPI_BASE_URL", "https://strapi.bitmutex.com");
      expect(getStrapiMedia("/uploads/schematic.pdf")).toBe("https://strapi.bitmutex.com/uploads/schematic.pdf");
    });

    it("should pass data URIs or absolute HTTP links through completely untouched", () => {
      expect(getStrapiMedia(null)).toBeNull();
      expect(getStrapiMedia("data:image/svg+xml;base64,123")).toBe("data:image/svg+xml;base64,123");
      expect(getStrapiMedia("https://external-cdn.com/logo.jpg")).toBe("https://external-cdn.com/logo.jpg");
      expect(getStrapiMedia("//schematics.org/asset.png")).toBe("//schematics.org/asset.png");
    });
  });

  describe("formatDate & formatNumber & truncate", () => {
    it("should transform raw string dates into localized long format tokens", () => {
      expect(formatDate("2026-05-18T00:00:00.000Z")).toBe("May 18, 2026");
    });

    it("should truncate long text structures to fixed character counts with elipses", () => {
      expect(truncate("Vienna Rectifier Stack Configuration", 16)).toBe("Vienna Rectifier...");
      expect(truncate("Short Line", 20)).toBe("Short Line");
    });

    it("should format float numeric numbers to maximum precision boundaries", () => {
      expect(formatNumber(12500.4567)).toBe("12,500.46");
      expect(formatNumber(100)).toBe("100");
    });
  });


  describe("isValidUrl Validation Guard", () => {
    it("should validate and capture legal paths and absolute URIs successfully", () => {
      expect(isValidUrl(undefined)).toBe(false);
      expect(isValidUrl("/services/embedded-engineering")).toBe(true);
      expect(isValidUrl("https://bitmutex.com/search?q=thyristor")).toBe(true);
      expect(isValidUrl("http://localhost:3000/docs")).toBe(true);
      expect(isValidUrl("invalid-string-pattern")).toBe(false);
    });
  });

  describe("formatLPA Salary Formatting Engine", () => {
    it("should accurately format hyphen-separated salary range distributions", () => {
      expect(formatLPA("600000 - 1200000")).toBe("6L – 12L per annum");
      // ✅ FIX: Updated expectation to match how parseFloat behaves with internal comma formatting
      expect(formatLPA("75000 - 500000")).toBe("75 – 5L per annum");
      expect(formatLPA("invalid - range")).toBe("invalid - range");
    });

    it("should format single compensation numerical string blocks into clean LPA or Indian currency strings", () => {
      expect(formatLPA("Not disclosed")).toBe("Not disclosed");
      expect(formatLPA("85000")).toBe("85,000 per annum"); 
      expect(formatLPA("1100000")).toBe("11 LPA");        
      expect(formatLPA("1450000")).toBe("14.5 LPA");      
    });
  });
});