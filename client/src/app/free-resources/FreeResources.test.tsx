import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import FreeResources, { generateMetadata } from "./page"; // Adjust path if named page.tsx

// 1. Mock child client components to isolate server rendering paths
vi.mock("@/components/custom/FreeResourceClient", () => ({
  default: ({ resources }: any) => (
    <div data-testid="mock-resource-client">
      Resources Present: {resources.length}
    </div>
  ),
}));

// Setup a clean global fetch mock handler tracking spy
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("FreeResources Page & SEO Metadata Suite", () => {
  beforeEach(() => {
    mockFetch.mockReset();
    vi.clearAllMocks();
    
    // Silence intentional console.error logs inside catch blocks during testing
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  describe("FreeResources Server Component Rendering", () => {
    it("should successfully fetch data, parse JSON, and render the components cleanly", async () => {
      // Mock successful fetch sequence response payload format
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [
            { id: 1, url: "NextJS-Performance-Guide.pdf" },
            { id: 2, url: "Strapi-V5-Starter-Kit.zip" },
          ],
        }),
      });

      const PageJSX = await FreeResources();
      render(PageJSX);

      expect(screen.getByRole("heading", { name: "Free Resources" })).toBeInTheDocument();
      expect(screen.getByTestId("mock-resource-client")).toBeInTheDocument();
      expect(screen.getByText("Resources Present: 2")).toBeInTheDocument();
    });

    it("should fall back to an empty collection array if the data layer holds no items", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: null }),
      });

      const PageJSX = await FreeResources();
      render(PageJSX);

      expect(screen.getByText("Resources Present: 0")).toBeInTheDocument();
    });

    it("should display a descriptive destructive alert card if the API endpoint throws an error", async () => {
      // Mock an operational API HTTP error response tracking channel
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const PageJSX = await FreeResources();
      render(PageJSX);

      expect(screen.getByText("Error")).toBeInTheDocument();
      expect(screen.getByText(/Unable to load Free Resources. Please try again later./i)).toBeInTheDocument();
      expect(screen.queryByTestId("mock-resource-client")).not.toBeInTheDocument();
    });
  });

  describe("generateMetadata Generator Context", () => {
    it("should build dynamic description blocks based on matching fetched dataset names", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [{ id: 1, url: "E2E-Testing-Playbook.pdf" }],
        }),
      });

      const metadata = await generateMetadata();

      expect(metadata.title).toBe("Free Resources | Bitmutex");
      expect(metadata.description).toContain("Explore free resources like E2E-Testing-Playbook.pdf and more");
      expect(metadata.openGraph?.url).toContain("/free-resources");
    });

    it("should utilize standard layout defaults if the metadata fetching array handles are empty", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] }),
      });

      const metadata = await generateMetadata();

      expect(metadata.description).toBe("Access a collection of free resources to enhance your skills and knowledge.");
    });

it("should step smoothly into the catch block error structure and map static fallbacks if fetch crashes", async () => {
      // Simulate network level failure rejection mapping tracks
      mockFetch.mockRejectedValueOnce(new Error("Network Timeout Connection Failure"));

      const metadata = await generateMetadata();

      expect(metadata.title).toBe("Free Resources | Bitmutex");
      expect(metadata.description).toBe("Access a collection of free resources to enhance your skills and knowledge.");
      
      // ✅ FIX: Cast the images property to an array to resolve the indexing type clash
      const ogImages = metadata.openGraph?.images as any[];
      expect(ogImages?.[0]?.url).toContain("free-resources-og.jpg");
    });
  });
});