import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import StatusBadge from "../status-badge"; // Adjust path
import React from "react";

const mockUseTheme = vi.fn(() => ({ theme: "dark" }));
vi.mock("next-themes", () => ({
  useTheme: () => mockUseTheme(),
}));

describe("StatusBadge Client Hydration Sync Module", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("NEXT_PUBLIC_STATUS_PAGE_URL", "https://status.bitmutex.com");
  });

  it("should dynamically synchronize iframe query links when switching themes", () => {
    mockUseTheme.mockReturnValue({ theme: "dark" });
    const { rerender } = render(<StatusBadge />);
    
    let inlineIframe = screen.getByTitle("Bitmutex Status Badge");
    expect(inlineIframe).toHaveAttribute("src", "https://status.bitmutex.com/badge?theme=dark");

    // Modify active design scheme contexts
    mockUseTheme.mockReturnValue({ theme: "light" });
    rerender(<StatusBadge />);
    
    inlineIframe = screen.getByTitle("Bitmutex Status Badge");
    expect(inlineIframe).toHaveAttribute("src", "https://status.bitmutex.com/badge?theme=light");
  });
});