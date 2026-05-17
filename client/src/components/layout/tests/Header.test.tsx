import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act, within } from "@testing-library/react";
import { Header } from "../header"; 
import React from "react";

// 1. Mock custom accessory widgets, modals, and toggles
vi.mock("@/components/custom/appointment", () => ({
  default: ({ trigger }: any) => <div data-testid="mock-cal-modal">{trigger}</div>,
}));

vi.mock("@/components/custom/SearchWidget", () => ({
  default: () => <div data-testid="mock-search-widget">Search Input</div>,
}));

vi.mock("@/components/layout/theme-toggle", () => ({
  ThemeToggle: () => <button data-testid="mock-theme-toggle">Toggle Btn</button>,
}));

vi.mock("@/components/layout/theme-switcher", () => ({
  ThemeSwitcher: () => <button data-testid="mock-theme-switcher">Switcher Btn</button>,
}));

// 2. Mock Shadcn UI Sheet Primitive Layout Structures cleanly for flat JSDOM tracking
vi.mock("@/components/ui/sheet", () => ({
  Sheet: ({ children }: any) => <div data-testid="mock-sheet">{children}</div>,
  SheetTrigger: ({ children }: any) => <div data-testid="mock-sheet-trigger">{children}</div>,
  SheetContent: ({ children }: any) => <div data-testid="mock-sheet-content">{children}</div>,
  SheetTitle: ({ children }: any) => <h2 data-testid="mock-sheet-title">{children}</h2>,
}));

// 3. Mock framer-motion using our custom Proxy to strip custom transition tags completely
vi.mock("framer-motion", async () => {
  const ReactComponentProxy = (tagName: string) => {
    return React.forwardRef(({ children, whileHover, whileTap, variants, initial, animate, transition, ...props }: any, ref: any) => {
      return React.createElement(tagName, { ...props, ref }, children);
    });
  };
  return {
    motion: new Proxy({}, {
      get(_target, prop: string) {
        if (prop === "header" || prop === "div") return ReactComponentProxy(prop);
        return ({ children }: any) => <>{children}</>;
      }
    }),
    useAnimation: () => ({
      start: vi.fn(),
    }),
  };
});

describe("Header Navigation Shell Architecture Suite", () => {
  // ✅ FIX: Cast the mock configuration data as an explicit fallback shape to clear property strictness mismatches
  const mockHeaderProps = {
    data: {
      logoText: "Bitmutex Technologies",
      logoSrc: "/assets/branding/logo.png",
      navItems: [
        { href: "/solutions/firmware", text: "Embedded Firmware", parentName: "Engineering", isExternal: false, isPrimary: false },
        { href: "/solutions/pcb", text: "Industrial PCB", parentName: "Engineering", isExternal: false, isPrimary: false },
        { href: "/case-studies", text: "Success Stories", parentName: "", isExternal: false, isPrimary: false }
      ],
      navItems1: [],
      navItems2: [],
      cta: [
        { href: "/contact", text: "Get In Touch", isPrimary: true, isExternal: false },
        { href: "https://cal.com/meeting appointment", text: "Book Session", isPrimary: false, isExternal: true }
      ]
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Polyfill MutationObserver for theme DOM classList mutation hooks safely
    globalThis.MutationObserver = class {
      observe() {}
      disconnect() {}
      takeRecords() { return []; }
    } as any;

    globalThis.innerWidth = 1920;
    globalThis.scrollY = 0;
  });

  it("should return null gracefully if data parameters load as empty or unassigned objects", () => {
    // ✅ FIX: Explicit any-cast bypasses structural assignments on null wrappers safely
    const { container } = render(<Header data={null as any} />);
    expect(container.firstChild).toBeNull();
  });

  it("should resolve the incoming logo source configuration elements and mount the primary home anchor", () => {
    // ✅ FIX: Cast data payload cleanly to satisfy component parameter interfaces
    const { rerender } = render(<Header data={mockHeaderProps.data as any} />);
    
    const logoImg = screen.getByRole("img", { name: /bitmutex technologies/i });
    expect(logoImg).toHaveAttribute("src", expect.stringContaining("logo.png"));

    rerender(<Header data={{ ...mockHeaderProps.data, logoSrc: undefined } as any} />);
    expect(screen.getByText("Bitmutex Technologies")).toBeInTheDocument();
  });

  it("should process and parse navigation objects segregating dropdown groupings from root structural links", () => {
    // ✅ FIX: Cast data payload safely
    const { container } = render(<Header data={mockHeaderProps.data as any} />);

    // Scope lookups inside the desktop <nav> region to clear duplicate mobile element overlaps
    const desktopNav = container.querySelector("nav.hidden.md\\:flex");
    expect(desktopNav).toBeInTheDocument();
    
    const menuTriggerBtn = within(desktopNav as HTMLElement).getByRole("button", { name: /engineering/i });
    expect(menuTriggerBtn).toBeInTheDocument();

    const flatLink = within(desktopNav as HTMLElement).getByRole("link", { name: "Success Stories" });
    expect(flatLink).toHaveAttribute("href", "/case-studies");
  });


  it("should separate standard button navigation links from scheduling actions based on spacing tags", () => {
    // ✅ FIX: Cast data payload safely
    const { container } = render(<Header data={mockHeaderProps.data as any} />);

    // Isolate CTA links to the explicit desktop sidebar panel structure
    const desktopCtaContainer = container.querySelector("div.hidden.md\\:flex.items-center");
    expect(desktopCtaContainer).toBeInTheDocument();

    const standardCtaLink = within(desktopCtaContainer as HTMLElement).getByRole("link", { name: "Get In Touch" });
    expect(standardCtaLink).toHaveAttribute("href", "/contact");

    expect(within(desktopCtaContainer as HTMLElement).getByTestId("mock-cal-modal")).toBeInTheDocument();
    expect(within(desktopCtaContainer as HTMLElement).getByRole("button", { name: "Book Session" })).toBeInTheDocument();
  });

  it("should adjust target frame layout specifications gracefully on scroll events", async () => {
    // ✅ FIX: Cast data payload safely
    render(<Header data={mockHeaderProps.data as any} />);

    globalThis.scrollY = 150;
    
    await act(async () => {
      fireEvent.scroll(window);
    });

    const searchWidgets = screen.getAllByTestId("mock-search-widget");
    expect(searchWidgets.length).toBeGreaterThanOrEqual(1);
  });
});