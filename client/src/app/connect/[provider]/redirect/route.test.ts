import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "./route"; // Adjust path if needed
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getStrapiURL } from "@/lib/utils";

// 1. Mock Next.js header/cookie storage layers
const mockCookieSet = vi.fn();
vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => ({
    set: mockCookieSet,
  })),
}));

// 2. Mock project utility paths
vi.mock("@/lib/utils", () => ({
  getStrapiURL: vi.fn(() => "http://localhost:1337"),
}));

// 3. Spy on global fetch requests
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("OAuth Callback Route Handler Suite", () => {
  const mockParams = Promise.resolve({ provider: "google" });
  const baseRequestUrl = "http://localhost:3000/api/auth/callback";

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockReset();
  });

  it("should bounce requests instantly back to root if no access_token param is attached", async () => {
    // Fire request missing the search params token
    const request = new Request(baseRequestUrl);

    const response = await GET(request, { params: mockParams });

    // Assert a 307/302 Redirect payload wrapper was delivered matching root destination
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost:3000/");
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("should securely save the JWT cookie and redirect to the user dashboard on a valid Strapi handshake", async () => {
    const request = new Request(`${baseRequestUrl}?access_token=mock-social-token-xyz`);

    // Mock successful Strapi v5 callback token exchange pass-through response
    mockFetch.mockResolvedValueOnce({
      json: async () => ({
        jwt: "secure-app-jwt-token-string",
        user: { id: 1, username: "testuser" },
      }),
    });

    const response = await GET(request, { params: mockParams });

    // 1. Verify outward upstream fetch structure parameters to Strapi backend
    expect(mockFetch).toHaveBeenCalledTimes(1);
    const fetchUrlArg = mockFetch.mock.calls[0][0];
    expect(fetchUrlArg).toContain("http://localhost:1337/api/auth/google/callback");
    expect(fetchUrlArg).toContain("access_token=mock-social-token-xyz");

    // 2. Verify NextJS cookie manager intercepted and deposited token safely with security flags
    expect(mockCookieSet).toHaveBeenCalledWith(
      "jwt",
      "secure-app-jwt-token-string",
      expect.objectContaining({
        httpOnly: true,
        path: "/",
      })
    );

    // 3. Verify downstream redirect lands user safely inside dashboard route parameters
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost:3000/dashboard");
  });
});