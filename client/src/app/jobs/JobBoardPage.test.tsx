import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import JobBoardPage, { generateMetadata } from "./page"; // Adjust path if this is named page.tsx
import fetchContentType from "@/lib/strapi/fetchContentType";

// 1. Mock external utility files and components
vi.mock("@/lib/strapi/fetchContentType", () => ({
  default: vi.fn(),
}));

vi.mock("@/lib/strapi/strapiImage", () => ({
  strapiImage: (url: string) => `https://strapi-host.com${url}`,
}));

vi.mock("@/lib/metadata", () => ({
  generateMetadataObject: vi.fn(() => ({})),
}));

// Mock the child client component to keep this unit test isolated to the server component logic
vi.mock("./JobBoardClient", () => ({
  default: ({ initialJobs }: any) => (
    <div data-testid="mock-job-board-client">
      Jobs Count: {initialJobs.length}
    </div>
  ),
}));

describe("JobBoardPage Server Stack & Metadata Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("JobBoardPage Component Rendering", () => {
    it("should map and render jobs successfully when fetchContentType returns data", async () => {
      // Setup mock data from Strapi backend format
      vi.mocked(fetchContentType).mockResolvedValueOnce({
        data: [
          {
            documentId: "job-abc",
            title: "DevOps Engineer",
            description: "Manage AWS infrastructure.",
            location: "Remote",
            createdAt: "2026-05-17",
            experience: "Senior",
            deadline: "2026-07-01",
          },
        ],
      });

      // Asserting an Async Server Component requires executing it like a normal promise function
      const ResultComponent = await JobBoardPage();
      render(ResultComponent);

      // Verify child layout hydration integration mounted and received variables cleanly
      expect(screen.getByTestId("mock-job-board-client")).toBeInTheDocument();
      expect(screen.getByText("Jobs Count: 1")).toBeInTheDocument();
    });

    it("should display an error UI message if fetching logic returns null parameters", async () => {
      vi.mocked(fetchContentType).mockResolvedValueOnce(null);

      const ResultComponent = await JobBoardPage();
      render(ResultComponent);

      expect(screen.getByText(/Error: Unable to fetch job data./i)).toBeInTheDocument();
    });
  });

  describe("generateMetadata Generator Function", () => {
    const defaultParams = { params: Promise.resolve({ slug: "jobs" }) };

    it("should handle error fallback meta block gracefully if page content type structure fails", async () => {
      vi.mocked(fetchContentType).mockResolvedValueOnce(null);

      const metadata = await generateMetadata(defaultParams);

      expect(metadata.title).toBe("Page Not Found | Bitmutex Technologies");
      expect(metadata.robots).toBe("noindex, nofollow");
    });

    it("should build custom SEO fields matching fallback states when meta variables are incomplete", async () => {
      vi.mocked(fetchContentType).mockResolvedValueOnce({
        heading: "Careers",
        sub_heading: "Join our team",
        description: "Great perks and salary structure layout.",
        seo: {
          metaTitle: "Bitmutex Openings",
          metaDescription: "Explore career choices.",
          metaImage: { url: "/uploads/og-banner.png" },
        },
      });

      const metadata = await generateMetadata(defaultParams);

      // Verify custom title formatting matches internal strings logic criteria
      expect(metadata.title).toBe("Bitmutex Openings  | Careers at Bitmutex");
      expect(metadata.description).toBe("Explore career choices.");
      
      // Check OpenGraph properties array evaluation values
      expect(metadata.openGraph).toBeDefined();
      expect((metadata.openGraph as any).images[0].url).toBe(
        "https://strapi-host.com/uploads/og-banner.png"
      );
      expect(metadata.alternates?.canonical).toContain("/industries");
    });

    it("should slice down excessively long description fields to meet standard character constraints", async () => {
      const longDescription = "This is a super long description sentence string block crafted to test if your internal truncation calculation splits words evenly on white spaces before hitting the strict maximum limit boundary thresholds of exactly 150 indices.";
      
      vi.mocked(fetchContentType).mockResolvedValueOnce({
        heading: "Careers",
        sub_heading: "Join our team",
        description: "Short fallback.",
        seo: {
          metaTitle: "",
          metaDescription: longDescription,
        },
      });

      const metadata = await generateMetadata(defaultParams);
      
      // Expect trailing punctuation token normalization match configurations
      expect(metadata.description?.endsWith("...")).toBe(true);
      expect(metadata.description?.length).toBeLessThanOrEqual(153); // 150 + trailing dots
    });
  });
});