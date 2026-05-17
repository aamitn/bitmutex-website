import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BrandKitClient from "./BrandKitClient";
import { saveAs } from "file-saver";
import JSZip from "jszip";

// 1. Mock Next.js image primitives and layout plugins
vi.mock("next/image", () => ({
  default: ({ src, alt, className }: any) => (
    <img src={src} alt={alt} className={className} data-testid="mock-img" />
  ),
}));

// Mock next-themes hook values
vi.mock("next-themes", () => ({
  useTheme: vi.fn(() => ({ theme: "dark" })),
}));

// 2. Mock file-saver download capabilities
vi.mock("file-saver", () => ({
  saveAs: vi.fn(),
}));

// 3. ✅ FIX: Use a regular function keyword instead of an arrow function so "new JSZip()" works
vi.mock("jszip", () => {
  return {
    default: function (this: any) {
      this.folder = vi.fn().mockImplementation(() => ({
        file: vi.fn(),
      }));
      this.generateAsync = vi.fn().mockResolvedValue("mock-zip-blob-content");
    },
  };
});

// Mock deep global fetch streams returning dummy binary components
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("BrandKitClient Component Suite", () => {
  const mockLogos = [
    {
      id: 1,
      company: "Bitmutex Corp",
      image: { url: "/logos/bitmutex.png", name: "bitmutex.png" },
    },
    {
      id: 2,
      company: "Acme Labs",
      image: { url: "/logos/acme.png", name: "acme.png" },
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockReset();
    vi.useFakeTimers(); // Intercept timers controlling download state intervals cleanly
  });

  it("should render grid components, imagery parameters, and macro actions accurately", () => {
    render(<BrandKitClient logos={mockLogos} />);

    expect(screen.getByRole("button", { name: /download all logos/i })).toBeInTheDocument();
    expect(screen.getByText("Bitmutex Corp")).toBeInTheDocument();
    expect(screen.getByText("Acme Labs")).toBeInTheDocument();

    const images = screen.getAllByTestId("mock-img");
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute("src", "/logos/bitmutex.png");
  });


});