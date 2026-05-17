import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "./route"; // Adjust path if needed

// 1. Mock Next.js state mutating headers
const mockEnable = vi.fn();
const mockDisable = vi.fn();
vi.mock("next/headers", () => ({
  draftMode: vi.fn(async () => ({
    enable: mockEnable,
    disable: mockDisable,
  })),
}));

// 2. Mock Next.js native navigation redirects to throw an interceptable token signal
vi.mock("next/navigation", () => ({
  redirect: (path: string) => {
    throw new Error(`REDIRECT_SIGNAL:${path}`);
  },
}));

describe("Preview Draft Mode Route Handler Suite", () => {
  const baseRequestUrl = "http://localhost:3000/api/preview";
  const ORIGINAL_ENV = process.env.PREVIEW_SECRET;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.PREVIEW_SECRET = "super-secret-token-123";
  });

  it("should fail with 401 Unauthorized if the incoming secret string is missing or invalid", async () => {
    const request = new Request(`${baseRequestUrl}?secret=wrong-token&slug=hello`);
    const response = await GET(request);

    expect(response.status).toBe(401);
    const bodyText = await response.text();
    expect(bodyText).toBe("Invalid token");
    expect(mockEnable).not.toHaveBeenCalled();
  });

  it("should parse post collection layouts, enable draft mode cookies, and redirect to the slug target path", async () => {
    const request = new Request(
      `${baseRequestUrl}?secret=super-secret-token-123&slug=scaling-nextjs&uid=api.posts&status=draft`
    );

    // Assert that the thrown Next.js redirect signal matches the expected path
    await expect(GET(request)).rejects.toThrow("REDIRECT_SIGNAL:/blog/scaling-nextjs?status=draft");

    // Verify Draft mode cookie assignment sequence fired successfully
    expect(mockEnable).toHaveBeenCalledTimes(1);
    expect(mockDisable).not.toHaveBeenCalled();
  });

  it("should parse standard localized pages configurations safely and disable draft mode if status isn't draft", async () => {
    const request = new Request(
      `${baseRequestUrl}?secret=super-secret-token-123&slug=about-us&locale=fr&uid=api.pages&status=published`
    );

    // Expecting local prefix routing paths: /fr/about-us
    await expect(GET(request)).rejects.toThrow("REDIRECT_SIGNAL:/fr/about-us");

    // Verify system disables draft mode cleanups safely
    expect(mockDisable).toHaveBeenCalledTimes(1);
    expect(mockEnable).not.toHaveBeenCalled();
  });

  it("should route fallback edge cases back safely to the root matching paths if structural query parameters are empty", async () => {
    const request = new Request(`${baseRequestUrl}?secret=super-secret-token-123`);

    await expect(GET(request)).rejects.toThrow("REDIRECT_SIGNAL:/");
    expect(mockDisable).toHaveBeenCalledTimes(1);
  });
});