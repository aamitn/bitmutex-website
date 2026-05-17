import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PaginationComponent } from "../pagination"; // Adjust relative path to match your folder tree layout
import React from "react";

// 1. Mock Next.js Navigation Engine layers with reactive parameter targets
const mockPush = vi.fn();
let mockUrlParams = new URLSearchParams("");

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => "/blog",
  // ✅ Returning a true instance removes function serialization leaks inside URLSearchParams constructors
  useSearchParams: () => mockUrlParams,
}));

// 2. Mock custom UI primitives to render plain container envelopes
vi.mock("@/components/ui/pagination", () => ({
  Pagination: ({ children, className }: any) => <nav className={className} data-testid="ui-pagination">{children}</nav>,
  PaginationContent: ({ children }: any) => <div>{children}</div>,
  PaginationItem: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, disabled, className }: any) => (
    <button onClick={onClick} disabled={disabled} className={className}>
      {children}
    </button>
  ),
}));

describe("PaginationComponent Framework Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUrlParams = new URLSearchParams("");
  });

  it("should calculate page 1 baselines defaults when search parameters are omitted from the URL", () => {
    render(<PaginationComponent pageCount={5} />);

    expect(screen.getByText("Page 1")).toBeInTheDocument();

    // Left arrow should be explicitly disabled on page 1 boundary limits
    const leftArrow = screen.getByRole("button", { name: "«" });
    expect(leftArrow).toBeDisabled();

    // Right arrow should be enabled
    const rightArrow = screen.getByRole("button", { name: "»" });
    expect(rightArrow).not.toBeDisabled();
  });

  it("should parse numerical strings out of parameters and forward modified query slugs to the router", () => {
    mockUrlParams = new URLSearchParams("page=3");
    render(<PaginationComponent pageCount={5} />);

    expect(screen.getByText("Page 3")).toBeInTheDocument();

    // Click right arrow to jump to page 4
    const rightArrow = screen.getByRole("button", { name: "»" });
    fireEvent.click(rightArrow);

    expect(mockPush).toHaveBeenCalledWith("/blog?page=4");

    // Click left arrow to drop to page 2
    const leftArrow = screen.getByRole("button", { name: "«" });
    fireEvent.click(leftArrow);

    expect(mockPush).toHaveBeenCalledWith("/blog?page=2");
  });

  it("should preserve pre-existing URL keys when applying page alterations", () => {
    mockUrlParams = new URLSearchParams("q=embedded&category=electronics&page=2");
    render(<PaginationComponent pageCount={5} />);

    const rightArrow = screen.getByRole("button", { name: "»" });
    fireEvent.click(rightArrow);

    // ✅ Verified: Retains peripheral query keys safely across transitions
    expect(mockPush).toHaveBeenCalledWith("/blog?q=embedded&category=electronics&page=3");
  });

  it("should clamp button interactive states when hitting the upper page boundary limits", () => {
    mockUrlParams = new URLSearchParams("page=5");
    render(<PaginationComponent pageCount={5} />);

    expect(screen.getByText("Page 5")).toBeInTheDocument();

    // Left arrow should be usable to slide back down
    expect(screen.getByRole("button", { name: "«" })).not.toBeDisabled();

    // Right arrow should lock down tightly on terminal index
    expect(screen.getByRole("button", { name: "»" })).toBeDisabled();
  });
});