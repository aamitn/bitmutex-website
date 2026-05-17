import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route"; // Adjust path if your handler file is named route.ts or page.tsx
import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";

// 1. Mock Iron Session middleware framework hooks
const mockSessionSave = vi.fn();
let sessionStore: { viewedPosts?: string[] } = {};

vi.mock("iron-session", () => ({
  getIronSession: vi.fn(async () => {
    return {
      ...sessionStore,
      save: mockSessionSave,
    };
  }),
}));

// 2. Mock downstream fetch network queries
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("Blog View Tracker API Route Handler Suite", () => {
  const baseRequestUrl = "http://localhost:3000/api/views";

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockReset();
    sessionStore = {}; // Clean session mock database before every test block runs
    process.env.NEXT_PUBLIC_STRAPI_BASE_URL = "http://localhost:1337";
  });

  it("should return a 400 Bad Request status if postId is missing from the payload", async () => {
    const request = new NextRequest(baseRequestUrl, {
      method: "POST",
      body: JSON.stringify({}), // Missing postId
    });

    const response = await POST(request);
    expect(response.status).toBe(400);

    const json = await response.json();
    expect(json.message).toBe("Missing postId");
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("should increment views via Strapi and persist the post ID to the session cookie on a first-time view", async () => {
    const request = new NextRequest(baseRequestUrl, {
      method: "POST",
      body: JSON.stringify({ postId: "post-888" }),
    });

    sessionStore = { viewedPosts: [] };
    mockFetch.mockResolvedValueOnce({ ok: true });

    const response = await POST(request);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.message).toBe("View counted");

    // Verify proxy update endpoint transmission variables
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith("http://localhost:1337/api/posts/post-888", {
      method: "GET",
    });

    // Verify session data updates and cookie sync triggers executed properly
    expect(mockSessionSave).toHaveBeenCalledTimes(1);
  });

  it("should skip downstream network fetches if the session indicates the post was already viewed", async () => {
    const request = new NextRequest(baseRequestUrl, {
      method: "POST",
      body: JSON.stringify({ postId: "post-888" }),
    });

    // Simulate pre-existing cookie payload history matches target identifier
    sessionStore = { viewedPosts: ["post-101", "post-888", "post-202"] };

    const response = await POST(request);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.message).toBe("Already viewed");

    // Verify view protection guards skipped operations successfully
    expect(mockFetch).not.toHaveBeenCalled();
    expect(mockSessionSave).not.toHaveBeenCalled();
  });

  it("should gracefully respond with a 500 status code if the downstream fetch operation fails", async () => {
    const request = new NextRequest(baseRequestUrl, {
      method: "POST",
      body: JSON.stringify({ postId: "post-999" }),
    });

    sessionStore = { viewedPosts: [] };
    mockFetch.mockRejectedValueOnce(new Error("Network connection dropped or database timeout"));

    const response = await POST(request);
    expect(response.status).toBe(500);

    const json = await response.json();
    expect(json.message).toBe("Error incrementing views");
    expect(mockSessionSave).not.toHaveBeenCalled();
  });
});