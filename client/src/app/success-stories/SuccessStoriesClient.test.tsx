import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SuccessStoriesClient, { SuccessStory } from "./SuccessStoriesClient";
import React from "react";

// Polyfill the missing global ResizeObserver API for Radix ScrollArea
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
vi.stubGlobal("ResizeObserver", MockResizeObserver);

// Mock Next.js Dynamic Component Wrappers to bypass asynchronous chunk resolution
vi.mock("next/dynamic", () => ({
  default: () => {
    const MockMap = ({ markers }: any) => (
      <div data-testid="mock-map">Map Markers Mounted: {markers.length}</div>
    );
    return MockMap;
  },
}));

describe("SuccessStoriesClient Dashboard Interactive Suite", () => {
  const mockStoriesData: SuccessStory[] = [
    {
      uuid: 101,
      name: "Vienna Converter Interface Optimization",
      slug: "vienna-converter-interface",
      content: "Upgraded industrial power stacks to utilize responsive Vienna Rectifier layouts.",
      industry: "Power Electronics",
      websiteurl: "https://vienna-labs.com",
      casestudy: "/case/vienna.pdf",
      logo: "/logos/vienna.jpg",
      glimpses: [],
      location: [{ name: "Kolkata, India", lat: "22.5726", lon: "88.3639" }],
      impacts: [],
      services: [{ name: "Firmware R&D" }, { name: "PCB Topology Design" }],
      stack: [{ name: "TI C2000" }, { name: "KiCad" }],
    },
    {
      uuid: 102,
      name: "Automated Plategen Desktop Solution",
      slug: "plategen-desktop-solution",
      content: "Python application driving headless AutoCAD API systems directly.",
      industry: "Automation",
      websiteurl: "",
      casestudy: null,
      logo: null,
      glimpses: [],
      location: [{ name: "Ranchi, India", lat: "23.3441", lon: "85.3096" }],
      impacts: [],
      services: [{ name: "Desktop Software Engineering" }],
      stack: [{ name: "Python" }, { name: "PyQt6" }],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    window.innerWidth = 1280;
    window.dispatchEvent(new Event("resize"));
  });

  describe("Geographical Map Integration", () => {
    it("should aggregate lat/lon location strings into numeric arrays and map them safely onto the map engine", () => {
      render(<SuccessStoriesClient stories={mockStoriesData} />);
      
      expect(screen.getByTestId("mock-map")).toBeInTheDocument();
      expect(screen.getByText("Map Markers Mounted: 2")).toBeInTheDocument();
    });

    it("should present a localized fallback block if markers payload arrays collapse to 0", () => {
      render(<SuccessStoriesClient stories={[]} />);
      
      expect(screen.getByText("No locations available")).toBeInTheDocument();
      expect(screen.queryByTestId("mock-map")).not.toBeInTheDocument();
    });
  });

  describe("Interactive Filtering & Real-time Search Infrastructure", () => {
    it("should verify interactive search controls mount cleanly onto the interface dashboard", () => {
      render(<SuccessStoriesClient stories={mockStoriesData} />);

      // ✅ FIX: query via getByText instead of getByRole("heading") to match CardTitle div properties safely
      expect(screen.getByText("Vienna Converter Interface Optimization")).toBeInTheDocument();
      expect(screen.getByText("Automated Plategen Desktop Solution")).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/search clients, industries.../i)).toBeInTheDocument();
    });

    it("should fallback cleanly onto an explicit message string block if search queries yield empty sets", async () => {
      const user = userEvent.setup();
      render(<SuccessStoriesClient stories={mockStoriesData} />);

      const searchInput = screen.getByPlaceholderText(/search clients, industries.../i);
      await user.type(searchInput, "NonExistentUnknownBrandNameString Query Term");

      expect(screen.getByText(/No stories match your filters/i)).toBeInTheDocument();
    });
  });

  describe("Pagination Boundaries", () => {
    it("should skip mounting pagination bars completely if item parameters fall below the page constraint bounds", () => {
      render(<SuccessStoriesClient stories={mockStoriesData} />);
      
      expect(screen.queryByRole("button", { name: /next/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /prev/i })).not.toBeInTheDocument();
    });

    it("should render operational transition navigation pagination buttons if array sets expand beyond single pages", () => {
      const mockLargeStoriesCollection = Array.from({ length: 10 }, (_, i) => ({
        ...mockStoriesData[0],
        uuid: i,
        name: `Success Client Enterprise Portfolio Rank #${i}`,
      }));

      render(<SuccessStoriesClient stories={mockLargeStoriesCollection} />);

      expect(screen.getByText(/Page/i)).toBeInTheDocument();
      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText(/of 2/i)).toBeInTheDocument();

      expect(screen.getByRole("button", { name: /next →/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /← prev/i })).toBeInTheDocument();
    });
  });
});