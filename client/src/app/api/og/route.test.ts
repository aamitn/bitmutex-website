import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "./route"; // Adjust path if named route.ts
import { NextResponse } from "next/server";
import { Innertube } from "youtubei.js";
import ogs from "open-graph-scraper";

// 1. Mock youtubei.js engine structures
const mockGetPlaylist = vi.fn();
const mockGetBasicInfo = vi.fn();
vi.mock("youtubei.js", () => {
  return {
    Innertube: {
      create: vi.fn(async () => ({
        getPlaylist: mockGetPlaylist,
        getBasicInfo: mockGetBasicInfo,
      })),
    },
  };
});

// 2. Mock Open Graph Scraper
vi.mock("open-graph-scraper", () => ({
  default: vi.fn(),
}));

describe("Metadata Unfurling API Route Handler Suite", () => {
  const baseRequestUrl = "http://localhost:3000/api/unfurl";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fail with a 400 Bad Request status code if the url parameter is missing", async () => {
    const request = new Request(baseRequestUrl); // Missing query params
    const response = await GET(request);

    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.error).toBe("URL parameter is required");
  });

  it("should parse video-only YouTube URLs using Innertube and map basic information nodes", async () => {
    const targetUrl = "https://www.youtube.com/watch?v=vid123";
    const request = new Request(`${baseRequestUrl}?url=${encodeURIComponent(targetUrl)}`);

    // Setup Innertube basic info payload resolution mapping criteria
    mockGetBasicInfo.mockResolvedValueOnce({
      basic_info: {
        title: "Mastering TypeScript Generics",
        short_description: "A deep dive look into types.",
        thumbnail: [{ url: "https://yt-img.com/vid123.jpg" }],
      },
    });

    const response = await GET(request);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.title).toBe("Mastering TypeScript Generics");
    expect(json.description).toBe("A deep dive look into types.");
    expect(json.image).toBe("https://yt-img.com/vid123.jpg");
    expect(json.url).toBe("https://www.youtube.com/watch?v=vid123");
    expect(mockGetPlaylist).not.toHaveBeenCalled();
  });

  it("should parse combined Video + Playlist items, calculate list indices, and merge metadata nodes", async () => {
    const targetUrl = "https://www.youtube.com/watch?v=vid456&list=list789";
    const request = new Request(`${baseRequestUrl}?url=${encodeURIComponent(targetUrl)}`);

    // Mock Playlist array mapping matching data
    mockGetPlaylist.mockResolvedValueOnce({
      info: {
        title: "Fullstack Engineering Series",
        total_items: 25,
        subtitle: { text: "By Bitmutex Tech" },
        thumbnails: [{ url: "https://yt-img.com/list789.jpg" }],
      },
      videos: [
        { id: "vid111" },
        { id: "vid456" }, // Current target video sits at 0-based Index 1 (1-based position 2)
        { id: "vid222" },
      ],
    });

    // Mock Video sub-record resolution
    mockGetBasicInfo.mockResolvedValueOnce({
      basic_info: {
        title: "Dockerizing Next.js Layouts",
        short_description: "Production container environments.",
      },
    });

    const response = await GET(request);
    expect(response.status).toBe(200);

    const json = await response.json();
    // Confirm combined bracket titles match expected generation schemas
    expect(json.title).toBe("[Playlist : Fullstack Engineering Series] ❂ Dockerizing Next.js Layouts");
    // Verify 1-based index calculation mapping loops evaluated precisely
    expect(json.description).toContain("🎬 #2 out of 25 🎬 By Bitmutex Tech");
    expect(json.description).toContain("Production container environments.");
    expect(json.image).toBe("https://yt-img.com/list789.jpg"); // Prefers playlist thumbnail
    expect(json.url).toBe("https://www.youtube.com/playlist?list=list789&v=vid456");
  });

  it("should process standard third-party URLs using the open-graph-scraper module as a fallback flow", async () => {
    const targetUrl = "https://bitmutex.com/about";
    const request = new Request(`${baseRequestUrl}?url=${encodeURIComponent(targetUrl)}`);

    vi.mocked(ogs).mockResolvedValueOnce({
      error: false,
      html: "",
      response: {} as any,
      result: {
        ogTitle: "About Bitmutex Technologies",
        ogDescription: "Enterprise Software Design Engineering Firm.",
        ogImage: [{ url: "https://bitmutex.com/og.jpg", width: 1200, height: 630, type: "jpg" }],
        ogUrl: "https://bitmutex.com/about",
        success: true,
      },
    });

    const response = await GET(request);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.title).toBe("About Bitmutex Technologies");
    expect(json.description).toBe("Enterprise Software Design Engineering Firm.");
    expect(json.image).toBe("https://bitmutex.com/og.jpg");
    expect(json.url).toBe("https://bitmutex.com/about");
    expect(mockGetBasicInfo).not.toHaveBeenCalled();
  });

  it("should handle operational failures gracefully, returning a 500 status code upon library crash", async () => {
    const targetUrl = "https://badurl.com";
    const request = new Request(`${baseRequestUrl}?url=${encodeURIComponent(targetUrl)}`);

    // Force Open Graph module to reject/throw an internal error
    vi.mocked(ogs).mockRejectedValueOnce(new Error("Network Scrape Timeout Error"));

    const response = await GET(request);
    expect(response.status).toBe(500);

    const json = await response.json();
    expect(json.error).toBe("Failed to fetch metadata");
  });
});