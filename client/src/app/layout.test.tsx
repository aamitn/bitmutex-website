import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import RootLayout from "./layout"; // Adjust relative path if needed
import { getGlobalPageData } from "@/data/loaders";
import React from "react";

// 1. Mock next/font/google to eliminate layout variable extraction errors in node
vi.mock("next/font/google", () => ({
  Exo_2: () => ({ variable: "mock-font-sans" }),
  Fraunces: () => ({ variable: "mock-font-heading" }),
  JetBrains_Mono: () => ({ variable: "mock-font-mono" }),
  Caveat: () => ({ variable: "mock-font-special" }),
}));

// 2. Mock next-themes to render nested child components transparently
vi.mock("next-themes", () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-theme-provider">{children}</div>,
}));

// 3. Mock External Strapi API Fetching Loaders
vi.mock("@/data/loaders", () => ({
  getGlobalPageData: vi.fn(),
}));

// 4. Mock Next.js Navigation Signal Traps
const mockNotFound = vi.fn(() => {
  throw new Error("NEXT_NOT_FOUND_SIGNAL");
});
vi.mock("next/navigation", () => ({
  notFound: () => mockNotFound(),
}));

// 5. Mock Sub-Layout Elements & Core Structural Branding Components
vi.mock("@/components/layout", () => ({
  Header: ({ data }: any) => <header data-testid="mock-header">Header Logo: {data?.logoSrc}</header>,
  Footer: ({ data }: any) => <footer data-testid="mock-footer">Footer Logo: {data?.logoWideSrc}</footer>,
}));

vi.mock("@/components/custom/LoginButtonServer", () => ({
  default: () => <button data-testid="mock-login-btn">Login Button</button>,
}));

vi.mock("@/components/cookie/CookieConsent", () => ({
  default: () => <div data-testid="mock-cookie-consent" />,
}));

vi.mock("@/components/custom/ClientWidgets", () => ({
  default: () => <div data-testid="mock-widgets" />,
}));

vi.mock("@/components/custom/strapi-down-error-page", () => ({
  default: () => <div data-testid="mock-strapi-error-page">Strapi Down Error Canvas</div>,
}));

describe("RootLayout Global Shell Architecture Suite", () => {
const mockGlobalDataPayload = {
    data: {
      documentId: "doc-global-100", 
      createdAt: "2026-05-17T22:00:00.000Z", 
      updatedAt: "2026-05-17T22:00:00.000Z", 
      topNav: { title: "Main Nav Menu" },
      footer: { copyright: "© 2026 Bitmutex Technologies" },
      logo: { url: "/uploads/logo_main.png" },
      logowide: { url: "/uploads/logo_wide.png" },
    },
    meta: {},
  };

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_STRAPI_BASE_URL = "http://localhost:1337";
  });

  describe("Standard Operational State Lifecycle", () => {
    it("should resolve server side data, construct structural source image URLs, and render the children matrix cleanly", async () => {
      vi.mocked(getGlobalPageData).mockResolvedValueOnce(mockGlobalDataPayload);

      // Render Layout Server Component asynchronously
      const LayoutJSX = await RootLayout({
        children: <section data-testid="test-child-content">Active Route Content Area</section>,
      });
      render(LayoutJSX);

      // Verify Theme provider, login integrations, and client accessory widgets mount cleanly
      expect(screen.getByTestId("mock-theme-provider")).toBeInTheDocument();
      expect(screen.getByTestId("mock-login-btn")).toBeInTheDocument();
      expect(screen.getByTestId("mock-cookie-consent")).toBeInTheDocument();
      expect(screen.getByTestId("mock-widgets")).toBeInTheDocument();

      // Verify page layout main shell context passes down children arrays securely
      expect(screen.getByTestId("test-child-content")).toBeInTheDocument();

      // Verify dynamic header logo parsing logic compiles image destination paths accurately
      expect(screen.getByTestId("mock-header")).toHaveTextContent(
        "Header Logo: http://localhost:1337/uploads/logo_main.png"
      );

      // Verify dynamic footer wide logo parsing matches base parameters
      expect(screen.getByTestId("mock-footer")).toHaveTextContent(
        "Footer Logo: http://localhost:1337/uploads/logo_wide.png"
      );
    });

    it("should issue a next/navigation notFound signal if data requests execute but return empty definitions", async () => {
      // ✅ FIX: Cast 'null as any' to cleanly satisfy the DocumentResponse return signature loop in your test block
      vi.mocked(getGlobalPageData).mockResolvedValueOnce(null as any);

      await expect(RootLayout({ children: <div /> })).rejects.toThrow("NEXT_NOT_FOUND_SIGNAL");
      expect(mockNotFound).toHaveBeenCalledTimes(1);
    });
  });

  describe("Fault Tolerant Exception Handling (Strapi Connection Outages)", () => {
    it("should intercept uncaught fetch crashes inside the try block, suppress blank renders, and serve ErrorPage fallback canvas paths", async () => {
      // Suppress console.error print tracking records from cluttering terminal streams during intentional crash assertions
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      vi.mocked(getGlobalPageData).mockRejectedValueOnce(new Error("Connection Timeout ECONNREFUSED"));

      const LayoutJSX = await RootLayout({ children: <div /> });
      render(LayoutJSX);

      // Verify fallback page elements load completely
      expect(screen.getByTestId("mock-strapi-error-page")).toBeInTheDocument();
      expect(screen.queryByTestId("mock-theme-provider")).not.toBeInTheDocument();
      expect(screen.queryByTestId("mock-header")).not.toBeInTheDocument();

      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });
});