import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import LoadingPage from "./loading"; // Adjust relative path if named differently
import React from "react";

describe("LoadingPage Canvas & Active Ellipsis Iteration Suite", () => {
  beforeEach(() => {
    // Enable fake timers to manually control the setInterval loops synchronously
    vi.useFakeTimers();
  });

  afterEach(() => {
    // Restore native real-world clocks clean between isolated test runs
    vi.useRealTimers();
  });


  it("should mount and show the core layout, spinner graphics, and skeleton cards upon mounting", async () => {
    const { container } = render(<LoadingPage />);

    // ✅ FIX 1: Flush the initial microtask queue and trigger useEffect mounting synchronously
    await act(async () => {
      vi.advanceTimersByTime(0);
    });

    // Assert branding loading headers are present
    expect(screen.getByText("Loading")).toBeInTheDocument();

    // ✅ FIX 2: Use standard DOM query selectors instead of non-existent query methods
    const totalSkeletons = container.querySelectorAll(".bg-slate-300");
    expect(totalSkeletons.length).toBeGreaterThan(10);
  });

  it("should incrementally expand text ellipses every 500ms and roll back seamlessly over threshold bounds", async () => {
    render(<LoadingPage />);

    // Fast-forward initial mount cycle
    await act(async () => {
      vi.advanceTimersByTime(0);
    });

    // Step 0: Initial mount state -> Ellipsis string empty
    const ellipsisContainer = screen.getByText("Loading").nextElementSibling;
    expect(ellipsisContainer).toHaveTextContent("");

    // Step 1: Fast-forward 500ms -> Expected single dot "."
    await act(async () => {
      vi.advanceTimersByTime(500);
    });
    expect(ellipsisContainer).toHaveTextContent(".");

    // Step 2: Fast-forward another 500ms -> Expected double dot ".."
    await act(async () => {
      vi.advanceTimersByTime(500);
    });
    expect(ellipsisContainer).toHaveTextContent("..");

    // Step 3: Fast-forward another 500ms -> Expected triple dot "..."
    await act(async () => {
      vi.advanceTimersByTime(500);
    });
    expect(ellipsisContainer).toHaveTextContent("...");

    // Step 4: Fast-forward another 500ms -> Loop resets cleanly back to empty string ""
    await act(async () => {
      vi.advanceTimersByTime(500);
    });
    expect(ellipsisContainer).toHaveTextContent("");
  });

  it("should completely clear internal active interval references when unmounting to eliminate tracking leaks", () => {
    const clearIntervalSpy = vi.spyOn(globalThis, "clearInterval");
    const { unmount } = render(<LoadingPage />);

    // Unmount the component to trigger the cleanup handler inside useEffect
    unmount();

    // Verify the native interval registration block cleared safely
    expect(clearIntervalSpy).toHaveBeenCalledTimes(1);
    clearIntervalSpy.mockRestore();
  });
});