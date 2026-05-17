import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import DraggableSidebar from "../DraggableSidebar"; // Adjust path to match your folder tree layout
import React from "react";

// 1. Mock Next.js Link component to render as a plain anchor element
vi.mock("next/link", () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

// 2. Mock StrapiImage subcomponent atom
vi.mock("@/components/custom/strapi-image", () => ({
  StrapiImage: ({ src, alt, className }: any) => (
    <img src={src} alt={alt} className={className} data-testid="mock-strapi-img" />
  ),
}));

// 3. Mock Framer Motion to bypass animation timing layouts
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

// --- SAMPLE DATA CONFIGURATIONS FOR SIMULATION ---
const mockCategory = { id: 3, documentId: "cat-embedded", text: "Embedded Systems" };
const mockPosts = [
  {
    id: 1,
    title: "Overcurrent Fault Latch Logic Blueprint",
    slug: "overcurrent-fault-latch-logic",
    documentId: "doc-p1",
    publishedAt: "2026-05-12T00:00:00.000Z",
    category: mockCategory,
    thumbnail: { url: "/uploads/latch_circuit.png" },
  }
];

describe("DraggableSidebar Component Layout Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default desktop baseline sizing specs
    globalThis.window.innerWidth = 1920;
    globalThis.window.innerHeight = 1080;
  });

  it("should mount the sidebar title header and render post collection cards on desktop views", () => {
    render(<DraggableSidebar posts={mockPosts} category={mockCategory} />);

    expect(screen.getByText("Related")).toBeInTheDocument();
    expect(screen.getByText("Embedded Systems")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Overcurrent Fault Latch Logic Blueprint" })).toBeInTheDocument();
    expect(screen.getByTestId("mock-strapi-img")).toHaveAttribute("src", "/uploads/latch_circuit.png");
  });

  it("should collapse the links menu block when firing the minimize action button", () => {
    render(<DraggableSidebar posts={mockPosts} category={mockCategory} />);

    const minimizeBtn = screen.getByLabelText("Minimize");
    expect(minimizeBtn).toBeInTheDocument();

    // Fire toggle action to minimize
    fireEvent.click(minimizeBtn);
    expect(screen.getByLabelText("Maximize")).toBeInTheDocument();

    // Fire toggle action to expand back
    fireEvent.click(screen.getByLabelText("Maximize"));
    expect(screen.getByLabelText("Minimize")).toBeInTheDocument();
  });

  it("should hide the drawer completely and display the sidebar handle trigger when dismissed", () => {
    render(<DraggableSidebar posts={mockPosts} category={mockCategory} />);

    const closeBtn = screen.getByLabelText("Close Sidebar");
    fireEvent.click(closeBtn);

    // Sidebar drawer panel unmounts from view
    expect(screen.queryByText("Related")).toBeNull();

    // Floating reopening trigger handle mounts smoothly onto the boundary margin
    const reopenTrigger = screen.getByRole("button", { name: /Related Posts/i });
    expect(reopenTrigger).toBeInTheDocument();

    // Verify reopening function restores structural panels instantly
    fireEvent.click(reopenTrigger);
    expect(screen.getByText("Related")).toBeInTheDocument();
  });

  it("should automatically initialize invisible on low laptop screen boundaries at or under 1366x768", () => {
    globalThis.window.innerWidth = 1366;
    globalThis.window.innerHeight = 768;

    render(<DraggableSidebar posts={mockPosts} category={mockCategory} />);

    // Screen constraint effect runs natively on mount to unmount the primary drawer container
    expect(screen.queryByText("Related")).toBeNull();
    expect(screen.getByRole("button", { name: /Related Posts/i })).toBeInTheDocument();
  });

  it("should safely return null markup blocks if the incoming posts array list evaluates empty", () => {
    const { container } = render(<DraggableSidebar posts={[]} category={mockCategory} />);
    expect(container.firstChild).toBeNull();
  });
});