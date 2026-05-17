import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import FooterBottom from "../FooterBottom"; // Adjust relative path filename if needed
import React from "react";

// 1. Mock the GitHubVersion component to decouple tests from external network API requests
vi.mock("@/components/custom/GitHubVersion", () => ({
  GitHubVersion: ({ owner, repo }: any) => (
    <span data-testid="mock-github-version">{owner}/{repo}-v1.0.0</span>
  ),
}));

describe("FooterBottom Time-Stamped Meta Infrastructure Suite", () => {
  // Lock down a fixed reference timestamp: May 17, 2026, 23:00:00 (11:00:00 PM)
  const mockSystemDate = new Date(2026, 4, 17, 23, 0, 0);

  beforeEach(() => {
    vi.useFakeTimers();
    // Set system time to a fixed reference point to eliminate locale/date-drift flakiness
    vi.setSystemTime(mockSystemDate);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should mount structural layout anchors, context parameters, and legal notice clauses cleanly", async () => {
    render(<FooterBottom text="Bitmutex Technologies" />);

    // Fast-forward initial frame loop to flush useEffect hooks safely
    await act(async () => {
      vi.advanceTimersByTime(0);
    });

    // Verify company identification title matches incoming prop values
    expect(screen.getByText("Bitmutex Technologies")).toBeInTheDocument();
    
    // Verify static localized documentation descriptors exist in the tree
    expect(screen.getByText("All rights reserved")).toBeInTheDocument();
    
    // Verify policy route endpoints mount accurate navigation hyperlinks
    expect(screen.getByRole("link", { name: /privacy/i })).toHaveAttribute("href", "/privacy-policy");
    expect(screen.getByRole("link", { name: /terms/i })).toHaveAttribute("href", "/terms-and-conditions");
  });

  it("should parse and extract the system clock parameters rendering correct time and date patterns", async () => {
    render(<FooterBottom text="Bitmutex Technologies" />);

    // Advance clock to trigger initial frame assignments
    await act(async () => {
      vi.advanceTimersByTime(0);
    });

    // Check time format based on locked mock reference (11:00:00 PM)
    expect(screen.getByText(/11:00:00/i)).toBeInTheDocument();
    
    // Check short date string format parsing rules (May 17, 2026)
    expect(screen.getByText(/May 17, 2026/i)).toBeInTheDocument();
  });

  it("should update clock counters incrementally every 1000ms loop boundary block accurately", async () => {
    render(<FooterBottom text="Bitmutex Technologies" />);

    await act(async () => {
      vi.advanceTimersByTime(0);
    });

    expect(screen.getByText(/11:00:00/i)).toBeInTheDocument();

    // Fast-forward clock by exactly 2 seconds
    await act(async () => {
      vi.advanceTimersByTime(2000);
    });

    // Verify clock counter has advanced by 2 increments seamlessly
    expect(screen.getByText(/11:00:02/i)).toBeInTheDocument();
  });

  it("should safely evaluate current target year scopes to keep copyright lines updated", async () => {
    render(<FooterBottom text="Bitmutex Technologies" />);

    await act(async () => {
      vi.advanceTimersByTime(0);
    });

    // Confirm range maps perfectly up onto the mock system time year (2026)
    expect(screen.getByText("2018 - 2026")).toBeInTheDocument();
  });

  it("should securely clear interval loops upon unmounting to avoid performance thread tracking leaks", () => {
    const clearIntervalSpy = vi.spyOn(globalThis, "clearInterval");
    const { unmount } = render(<FooterBottom text="Bitmutex Technologies" />);

    // Destroy structural view trees
    unmount();

    // Assert active timer references drop cleanly
    expect(clearIntervalSpy).toHaveBeenCalledTimes(1);
    clearIntervalSpy.mockRestore();
  });
});