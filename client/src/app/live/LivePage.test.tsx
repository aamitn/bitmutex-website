import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LivePage from "./page"; // Adjust path if component file is named page.tsx
import videojs from "video.js";

// 1. Mock video.js player instantiation loops and hooks
const mockPlayerOn = vi.fn();
const mockPlayerReady = vi.fn((callback) => callback());
const mockPlayerDispose = vi.fn();
const mockPlayerPause = vi.fn();

vi.mock("video.js", () => {
  const videojsMock = vi.fn(() => ({
    ready: mockPlayerReady,
    on: mockPlayerOn,
    dispose: mockPlayerDispose,
    pause: mockPlayerPause,
    error: vi.fn(() => ({ message: "Mock Player Error String" })),
  }));
  
  (videojsMock as any).addLanguage = vi.fn();
  
  return {
    default: videojsMock,
  };
});

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/live"),
}));

describe("LivePage Streaming Client Component Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // ✅ FIX 1: Safely mock window.location.reload using a clean temporary assignment function
    vi.stubGlobal("location", { reload: vi.fn() });
  });

  it("should render component layouts, stream metrics, and default options correctly", () => {
    render(<LivePage />);

    expect(screen.getByRole("heading", { name: "Bitmutex Live" })).toBeInTheDocument();
    expect(screen.getByText("Live Broadcasting")).toBeInTheDocument();
    
    expect(screen.getByRole("button", { name: /hls stream/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /dash stream/i })).toBeInTheDocument();

    expect(screen.getAllByText("Quality")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Latency")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Bitrate")[0]).toBeInTheDocument();
  });

  it("should dynamically toggle display frames when switching streaming protocols tabs", async () => {
    const user = userEvent.setup();
    render(<LivePage />);

    const dashTabButton = screen.getByRole("button", { name: /dash stream/i });
    await user.click(dashTabButton);

    expect(videojs).toHaveBeenCalledWith(
      expect.any(HTMLVideoElement),
      expect.objectContaining({
        sources: [{ src: expect.stringContaining(".mpd"), type: "application/dash+xml" }],
      })
    );
  });


  it("should transition status tags from live to offline if videoJS fires an error listener", async () => {
    let errorCallback: () => void = () => {};
    mockPlayerOn.mockImplementation((event: string, callback: () => void) => {
      if (event === "error") {
        errorCallback = callback;
      }
    });

    render(<LivePage />);

    // ✅ FIX 3: Wrap synchronous event triggers inside act() to isolate state modification transactions
    act(() => {
      errorCallback();
    });

    await waitFor(() => {
      expect(screen.getAllByText("OFFLINE")[0]).toBeInTheDocument();
    });
  });
});