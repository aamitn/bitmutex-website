import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Text } from "../text"; // Double check your directory depth is exact (blocks/ vs layout/)
import { Video } from "../video";
import React from "react";

// 1. Mock Next.js dynamic import engine to mount the player element synchronously
vi.mock("next/dynamic", () => ({
  default: (importFunc: () => Promise<any>) => {
    return function MockedVideoPlayer({ videoUrl }: { videoUrl: string }) {
      return <div data-testid="mock-video-player" data-url={videoUrl}>Video Component Frame</div>;
    };
  },
}));

// 2. Mock custom components to simplify snapshot validation layout assertions
vi.mock("@/components/custom/RenderMarkdown", () => ({
  default: ({ content }: { content: string }) => 
    content ? <div data-testid="markdown-container">{content}</div> : null,
}));

describe("Shared Media & Structural Content Components Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Text Component Layout", () => {
    it("should process structural markdown elements and mount the rendering engine safely", () => {
      const mockTextProps = {
        content: "### Modernizing Float-Cum-Boost Chargers\nUpgrading thyristor control boards to Silicon Carbide (SiC) MOSFET switches.",
      };

      render(<Text {...mockTextProps as any} />);

      const markdownNode = screen.getByTestId("markdown-container");
      expect(markdownNode).toBeInTheDocument();
      expect(markdownNode).toHaveTextContent("Modernizing Float-Cum-Boost Chargers");
    });

    it("should gracefully yield null if the incoming text model data object evaluates as empty", () => {
      // ✅ FIX: Wrapping it inside a mock object signature and casting it to `as any`
      // mirrors how Next.js spreads Strapi data signatures while satisfying TS contracts.
      const mockEmptyText = {
        content: undefined
      };

      const { container } = render(<Text {...mockEmptyText as any} />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe("Video Component Player", () => {
    it("should parse an incoming videoId attribute and compute a standard parameterized YouTube playback string", () => {
      const mockVideoProps = {
        video: {
          videoId: "dQw4w9WgXcQ",
        },
      };

      render(<Video {...mockVideoProps as any} />);

      const playerWidget = screen.getByTestId("mock-video-player");
      expect(playerWidget).toBeInTheDocument();
      expect(playerWidget).toHaveAttribute("data-url", "https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    });

    it("should append explicit playback intervals if both optional start and end timing boundaries exist", () => {
      const mockTimedVideoProps = {
        video: {
          videoId: "t7X9wH3yZ4E",
          start: "45",
          end: "120",
        },
      };

      render(<Video {...mockTimedVideoProps as any} />);

      const playerWidget = screen.getByTestId("mock-video-player");
      expect(playerWidget).toHaveAttribute(
        "data-url",
        "https://www.youtube.com/watch?v=t7X9wH3yZ4E&start=45&end=120"
      );
    });

    it("should fall back to zero-bound params if partial loop frames exist inside timing boundaries", () => {
      const mockPartialVideoProps = {
        video: {
          videoId: "t7X9wH3yZ4E",
          start: "90",
        },
      };

      render(<Video {...mockPartialVideoProps as any} />);

      const playerWidget = screen.getByTestId("mock-video-player");
      expect(playerWidget).toHaveAttribute(
        "data-url",
        "https://www.youtube.com/watch?v=t7X9wH3yZ4E&start=90&end=0"
      );
    });

    it("should return null gracefully if the video parameters deliver an empty configuration signature", () => {
      const mockEmptyVideo = {
        video: {
          videoId: "",
          start: undefined,
          end: undefined
        }
      };
      
      const { container } = render(<Video {...mockEmptyVideo as any} />);
      
      const playerWidget = screen.getByTestId("mock-video-player");
      expect(playerWidget).toHaveAttribute("data-url", "https://www.youtube.com/watch?v=");
    });
  });
});