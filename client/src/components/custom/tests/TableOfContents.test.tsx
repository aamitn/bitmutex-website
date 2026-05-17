import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import TableOfContents from "../TableOfContents"; // Adjust paths to match your folder tree layout
import React from "react";

// 1. Mock Browser History API endpoints
const mockReplaceState = vi.fn();
vi.stubGlobal("history", { replaceState: mockReplaceState });

// 2. Mock IntersectionObserver to control when headings come into view
let observerCallback: any = null;
const mockObserve = vi.fn();
const mockDisconnect = vi.fn();

vi.stubGlobal("IntersectionObserver", class MockIntersectionObserver {
  constructor(callback: any) {
    observerCallback = callback;
  }
  observe = mockObserve;
  disconnect = mockDisconnect;
});

// 3. Mock Framer Motion layout wrappers
vi.mock("framer-motion", async () => {
  const ReactComponentProxy = (tagName: string) => {
    return React.forwardRef(({ children, style, ...props }: any, ref: any) => {
      return React.createElement(tagName, { ...props, ref, style }, children);
    });
  };
  return {
    motion: new Proxy({}, {
      get(_target, prop: string) {
        return ReactComponentProxy(prop);
      }
    }),
    AnimatePresence: ({ children }: any) => <>{children}</>,
  };
});

// Helper utility to render a simulated article side-by-side with the widget
const renderToCWithContent = (containerClass: string) => {
  const view = render(
    <div>
      <TableOfContents containerClass={containerClass} />
      <article className={containerClass}>
        <h2 id="power-stack-intro">1. Thyristor Power Architectures</h2>
        <h3 id="sic-modernization">1.1. Silicon Carbide Upgrades</h3>
        <h4 id="overcurrent-alarm-latch">1.1.1. Fault Alarm Latches</h4>
      </article>
    </div>
  );

  // Stub scrollIntoView for scratched heading nodes to prevent JSDOM execution crashes
  Array.from(document.querySelectorAll("h2, h3, h4")).forEach((el) => {
    el.scrollIntoView = vi.fn();
  });

  return view;
};

describe("TableOfContents Floating Widget Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default desktop baseline sizing specs
    globalThis.window.innerWidth = 1920;
    globalThis.window.innerHeight = 1080;
  });

  it("should scrape document headings from the container and list them in sequence", () => {
    renderToCWithContent("post-body-wrapper");

    expect(screen.getByText("Contents")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "1. Thyristor Power Architectures" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "1.1. Silicon Carbide Upgrades" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "1.1.1. Fault Alarm Latches" })).toBeInTheDocument();
    
    // Verifies observer registration hooks fired for each identified header
    expect(mockObserve).toHaveBeenCalledWith(document.getElementById("power-stack-intro"));
  });

  it("should calculate header depth and apply indentation offsets cleanly", () => {
    renderToCWithContent("post-body-wrapper");

    const link1 = screen.getByRole("link", { name: "1. Thyristor Power Architectures" }).closest("li");
    const link2 = screen.getByRole("link", { name: "1.1. Silicon Carbide Upgrades" }).closest("li");
    const link3 = screen.getByRole("link", { name: "1.1.1. Fault Alarm Latches" }).closest("li");

    // Padding formula in component: (level - 2) * 12
    expect(link1).toHaveStyle({ paddingLeft: "0px" });  // (2 - 2) * 12
    expect(link2).toHaveStyle({ paddingLeft: "12px" }); // (3 - 2) * 12
    expect(link3).toHaveStyle({ paddingLeft: "24px" }); // (4 - 2) * 12
  });

  it("should update active states and history entries when headings cross the intersection point", () => {
    renderToCWithContent("post-body-wrapper");

    // Manually trigger the intersection observer callback to simulate scrolling past header 2
    act(() => {
      observerCallback([
        { isIntersecting: true, target: { id: "sic-modernization" } }
      ]);
    });

    const targetLink = screen.getByRole("link", { name: "1.1. Silicon Carbide Upgrades" });
    expect(targetLink).toHaveClass("bg-blue-600");
    expect(mockReplaceState).toHaveBeenCalledWith(null, "", "#sic-modernization");
  });

  it("should allow desktop menus to minimize and expand via the control toggle", () => {
    renderToCWithContent("post-body-wrapper");

    const toggleBtn = screen.getByTitle("Minimize Menu");
    
    // Minimize the widget layout list
    fireEvent.click(toggleBtn);
    expect(screen.getByTitle("Expand Menu")).toBeInTheDocument();

    // Re-expand the widget layout list
    fireEvent.click(screen.getByTitle("Expand Menu"));
    expect(screen.getByTitle("Minimize Menu")).toBeInTheDocument();
  });

  it("should dismiss the desktop menu completely and display the sidebar handle shortcut when closed", () => {
    renderToCWithContent("post-body-wrapper");

    const closeBtn = screen.getByTitle("Hide Table of Contents");
    fireEvent.click(closeBtn);

    // Desktop nav container is unmounted
    expect(screen.queryByText("Contents")).toBeNull();

    // Shortcut side-handle slides out onto the view frame boundary
    const reopenTrigger = screen.getByRole("button", { name: /Show Contents/i });
    expect(reopenTrigger).toBeInTheDocument();

    // Reopen menu works smoothly
    fireEvent.click(reopenTrigger);
    expect(screen.getByText("Contents")).toBeInTheDocument();
  });

  it("should open mobile view drawers when triggered via floating book controllers", () => {
    // Force screen resolution limits beneath desktop thresholds
    globalThis.window.innerWidth = 768;
    const { rerender } = renderToCWithContent("post-body-wrapper");

    // Desktop view widget stays unmounted
    expect(screen.queryByText("Contents")).toBeNull();

    // Floating actions launcher asset triggers open states securely
    const mobileBookBtn = screen.getByLabelText("Table of Contents");
    fireEvent.click(mobileBookBtn);

    expect(screen.getByRole("heading", { level: 3, name: "Table of Contents" })).toBeInTheDocument();
    
    // Close button handles cleanup gracefully
    const closeMenuBtn = screen.getByRole("button", { name: "Close Menu" });
    fireEvent.click(closeMenuBtn);
    expect(screen.queryByText("Close Menu")).toBeNull();
  });

  it("should automatically initialize closed on screen boundaries at or under 1366x768 layouts", () => {
    globalThis.window.innerWidth = 1366;
    globalThis.window.innerHeight = 768;
    
    renderToCWithContent("post-body-wrapper");

    // Menu scales closed natively under low window size profiles
    expect(screen.queryByText("Contents")).toBeNull();
    expect(screen.getByRole("button", { name: /Show Contents/i })).toBeInTheDocument();
  });
});