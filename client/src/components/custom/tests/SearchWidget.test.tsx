import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SearchWidget from "../SearchWidget"; // Adjust relative path to match your folder tree layout
import React from "react";

// 1. Mock Next.js App Router context layers
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// 2. Mock Framer Motion to bypass animation layout calculations
vi.mock("framer-motion", async () => {
  const ReactComponentProxy = (tagName: string) => {
    return React.forwardRef(({ children, style, whileTap, whileHover, ...props }: any, ref: any) => {
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

describe("SearchWidget Popover Lifecycle Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Clear global local storage states completely before each run step
    window.localStorage.clear();
    vi.spyOn(Storage.prototype, "getItem");
    vi.spyOn(Storage.prototype, "setItem");
    vi.spyOn(Storage.prototype, "removeItem");
  });



  it("should process structural query entries and forward clean search parameter arrays onto the router", () => {
    render(<SearchWidget />);
    
    // Open popover context frame
    fireEvent.click(screen.getByRole("button", { name: "Open search popover" }));
    
    const searchInput = screen.getByPlaceholderText("Search for anything...");
    fireEvent.change(searchInput, { target: { value: "   embedded firmware specialist   " } });
    
    // Click submittal CTA element block
    const submitBtn = screen.getByRole("button", { name: "Search" });
    fireEvent.click(submitBtn);

    // Trims off blank padding spaces and forces clean slug routing paths cleanly
    expect(mockPush).toHaveBeenCalledWith("/search?q=embedded%20firmware%20specialist");
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      "searchHistory",
      JSON.stringify(["embedded firmware specialist"])
    );
  });

  it("should respond cleanly to global document clicks and collapse view boxes if outside targets are hit", () => {
    render(<SearchWidget />);
    
    const triggerBtn = screen.getByRole("button", { name: "Open search popover" });
    fireEvent.click(triggerBtn);
    expect(screen.getByPlaceholderText("Search for anything...")).toBeInTheDocument();

    // Fire generic outside container click trigger profiles directly into the simulated window baseline
    fireEvent.mouseDown(document.body);
    
    expect(screen.queryByPlaceholderText("Search for anything...")).toBeNull();
  });

  it("should retrieve historical query layers from localStorage on initialize and sort lookup hits dynamically", async () => {
    // Populate storage with predefined strings mock histories
    const initialHistory = ["sic mosfet", "vienna rectifier", "stm32 baseline"];
    window.localStorage.setItem("searchHistory", JSON.stringify(initialHistory));

    render(<SearchWidget />);

    // Open text terminal field layers
    fireEvent.click(screen.getByRole("button", { name: "Open search popover" }));

    const searchInput = screen.getByPlaceholderText("Search for anything...");
    // Typing matching strings triggers sub-array visibility loops ("sic...")
    fireEvent.change(searchInput, { target: { value: "sic" } });

    expect(screen.getByText("Recent Searches")).toBeInTheDocument();
    expect(screen.getByText("sic mosfet")).toBeInTheDocument();
    
    // Unmatched history lines stay dropped out of view
    expect(screen.queryByText("vienna rectifier")).toBeNull();
  });


  it("should clear mock local storage records when history purging routines are called", () => {
    const activeHistory = ["fcbc charger"];
    window.localStorage.setItem("searchHistory", JSON.stringify(activeHistory));

    render(<SearchWidget />);
    fireEvent.click(screen.getByRole("button", { name: "Open search popover" }));
    fireEvent.change(screen.getByPlaceholderText("Search for anything..."), { target: { value: "fcbc" } });

    const clearButton = screen.getByRole("button", { name: "Clear" });
    fireEvent.click(clearButton);

    expect(window.localStorage.removeItem).toHaveBeenCalledWith("searchHistory");
    expect(screen.queryByText("Recent Searches")).toBeNull();
  });
});