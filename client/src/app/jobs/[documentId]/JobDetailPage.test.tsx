import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import JobDetailPage, { generateMetadata } from "./page"; // Adjust path if named page.tsx
import fetchContentType from "@/lib/strapi/fetchContentType";
import { formatLPA } from "@/lib/utils";

// 1. Mock the Data Fetching and Formatting Utilities
vi.mock("@/lib/strapi/fetchContentType", () => ({
  default: vi.fn(),
}));

vi.mock("@/lib/strapi/strapiImage", () => ({
  strapiImage: (url: string) => `https://strapi-cdn.com${url}`,
}));

vi.mock("@/lib/metadata", () => ({
  generateMetadataObject: vi.fn(() => ({})),
}));

// ✅ FIX: Partially mock the module to keep the real "cn" utility intact
vi.mock("@/lib/utils", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/utils")>();
  return {
    ...actual, // Retains your real cn implementation for shadcn/ui components
    formatLPA: vi.fn((val) => `₹${val} LPA`), // Mocks only formatLPA
  };
});

// 2. Mock Dependent Sub-Components to Isolate the Server Page Tests
vi.mock("./JobApplicationForm", () => ({
  default: ({ jobId, jobName }: any) => (
    <div data-testid="mock-form">
      Form for {jobName} ({jobId})
    </div>
  ),
}));

vi.mock("./JobActions", () => ({
  default: () => <div data-testid="mock-actions">Job Actions</div>,
}));

vi.mock("@/components/custom/RenderMarkdown", () => ({
  default: ({ content }: { content: string }) => <div data-testid="mock-markdown">{content}</div>,
}));

// Mock Radix Accordion parts so they render flatly in our JSDOM tree
vi.mock("@/components/ui/accordion", () => ({
  Accordion: ({ children }: any) => <div>{children}</div>,
  AccordionItem: ({ children }: any) => <div>{children}</div>,
  AccordionTrigger: ({ children }: any) => <button>{children}</button>,
  AccordionContent: ({ children }: any) => <div>{children}</div>,
}));

describe("JobDetailPage Server Component & SEO Suite", () => {
  const mockParams = { documentId: "job-123" };
  const mockPageProps = { params: Promise.resolve(mockParams) };

  beforeEach(() => {
    vi.clearAllMocks();
  });

describe("JobDetailPage Rendering Contexts", () => {
    it("should map and render job criteria specifications correctly on success", async () => {
      vi.mocked(fetchContentType).mockResolvedValueOnce({
        data: [
          {
            id: "1",
            documentId: "job-123",
            title: "Staff Security Architect",
            description: "Lead enterprise infosec protocols.",
            location: "Bangalore, India",
            salary: "24",
            experience: "8+ years",
            deadline: "2026-08-30",
            createdAt: "2026-05-17T00:00:00.000Z",
            details: "### Key Requirements\n- CISSP Certified",
          },
        ],
      });

      // Resolve async component call tree
      const PageJSX = await JobDetailPage(mockPageProps);
      render(PageJSX);

      // Verify textual representations are properly calculated and displayed
      expect(screen.getByText("Staff Security Architect")).toBeInTheDocument();
      expect(screen.getByText("Lead enterprise infosec protocols.")).toBeInTheDocument();
      expect(screen.getByText(/Bangalore, India/)).toBeInTheDocument();
      expect(screen.getByText(/8\+ years/)).toBeInTheDocument();
      expect(screen.getByText(/May 17, 2026/)).toBeInTheDocument();
      expect(screen.getByText("2026-08-30")).toBeInTheDocument();

      // Ensure utility format functions were utilized safely
      expect(formatLPA).toHaveBeenCalledWith("24");
      expect(screen.getByText(/24 LPA/)).toBeInTheDocument();

      // Verify structural component placeholders mounted successfully
      expect(screen.getByTestId("mock-actions")).toBeInTheDocument();
      expect(screen.getByTestId("mock-form")).toBeInTheDocument();
      
      // ✅ FIX: Use a regex matcher to accommodate collapsed whitespace/newlines in JSDOM
      expect(screen.getByTestId("mock-markdown")).toHaveTextContent(/### Key Requirements.*- CISSP Certified/);
    });

    it("should render a clean fallback UI notice if the jobs record array yields empty parameters", async () => {
      vi.mocked(fetchContentType).mockResolvedValueOnce({ data: [] });

      const PageJSX = await JobDetailPage(mockPageProps);
      render(PageJSX);

      expect(screen.getByText(/🚫 Job not found./i)).toBeInTheDocument();
    });

    it("should fall back to standard fallback text configurations if non-mandatory string fields are missing", async () => {
      vi.mocked(fetchContentType).mockResolvedValueOnce({
        data: [
          {
            id: "2",
            documentId: "job-empty",
            createdAt: "2026-05-17T00:00:00.000Z",
          },
        ],
      });

      const PageJSX = await JobDetailPage({ params: Promise.resolve({ documentId: "job-empty" }) });
      render(PageJSX);

      expect(screen.getByText("Untitled Job")).toBeInTheDocument();
      expect(screen.getByText("No description available.")).toBeInTheDocument();
      expect(screen.getByText("**No additional details available.**")).toBeInTheDocument();
    });
  });

  describe("generateMetadata Generator Core", () => {
    it("should build error fallback parameters if requested dynamic page lookup yields null", async () => {
      vi.mocked(fetchContentType).mockResolvedValueOnce(null);

      const meta = await generateMetadata(mockPageProps);

      expect(meta.title).toBe("Job Not Found | Bitmutex Technologies");
      expect(meta.robots).toBe("noindex, nofollow");
    });

    it("should properly structure composite tags appending dynamic fallback configurations", async () => {
      vi.mocked(fetchContentType).mockResolvedValueOnce({
        title: "Cloud Consultant",
        description: "Scale Kubernetes topologies.",
        deadline: "2026-12-01",
        seo: null, // Test automated generation fallback tracking mechanics
      });

      const meta = await generateMetadata(mockPageProps);

      expect(meta.title).toBe("Cloud Consultant | Careers at Bitmutex");
      expect(meta.description).toContain("Scale Kubernetes topologies. - Apply Today! - Deadline on : 2026-12-01");
      expect(meta.openGraph?.url).toBe("http://localhost:3000/jobs/job-123");
      expect(meta.alternates?.canonical).toBe("http://localhost:3000/jobs/job-123");
    });

    it("should process custom nested Strapi v5 seo fields when explicitly present", async () => {
      vi.mocked(fetchContentType).mockResolvedValueOnce({
        title: "Cloud Consultant",
        description: "Scale Kubernetes topologies.",
        deadline: "2026-12-01",
        seo: {
          metaTitle: "Custom Title Overwrite",
          metaDescription: "Custom description overwrite rule.",
          metaImage: { url: "/media/banner.jpg" },
        },
      });

      const meta = await generateMetadata(mockPageProps);

      expect(meta.title).toBe("Custom Title Overwrite | Careers at Bitmutex");
      expect(meta.description).toContain("Custom description overwrite rule.");
      expect((meta.openGraph?.images as any)[0].url).toBe("https://strapi-cdn.com/media/banner.jpg");
    });
  });
});