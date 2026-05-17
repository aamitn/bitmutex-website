import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
// ✅ FIXED: Added the correct relative path separator and matched file naming
import { ThemeSwitcher } from "../theme-switcher"; 
import React from "react";

// 1. Mock next-themes hook parameters explicitly
const mockSetTheme = vi.fn();
const mockUseTheme = vi.fn(() => ({
  theme: "system",
  setTheme: mockSetTheme,
  systemTheme: "dark",
}));

vi.mock("next-themes", () => ({
  useTheme: () => mockUseTheme(),
}));

// 2. Mock Shadcn UI Tooltip elements for immediate rendering inside JSDOM paths
vi.mock("@/components/ui/tooltip", () => ({
  TooltipProvider: ({ children }: any) => <div data-testid="tooltip-provider">{children}</div>,
  Tooltip: ({ children }: any) => <div data-testid="tooltip-root">{children}</div>,
  TooltipTrigger: ({ children }: any) => <div data-testid="tooltip-trigger">{children}</div>,
  TooltipContent: ({ children }: any) => <div data-testid="tooltip-content">{children}</div>,
}));

// 3. Mock framer-motion via Proxy wrappers to safely isolate layout attributes from JSDOM
vi.mock("framer-motion", async () => {
  const ReactComponentProxy = (tagName: string) => {
    return React.forwardRef(({ children, whileHover, whileTap, variants, initial, animate, transition, ...props }: any, ref: any) => {
      return React.createElement(tagName, { ...props, ref }, children);
    });
  };
  return {
    motion: new Proxy({}, {
      get(_target, prop: string) {
        return ReactComponentProxy(prop);
      }
    }),
  };
});

describe("ThemeSwitcher UI State Architecture Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });


  describe("Variant 1: Default Button Segmented Selection Matrix", () => {
    it("should compile option buttons and switch themes when explicit option targets are clicked", async () => {
      mockUseTheme.mockReturnValue({
        theme: "light",
        setTheme: mockSetTheme,
        systemTheme: "light",
      });

      render(<ThemeSwitcher variant="default" />);

      const lightBtn = screen.getByRole("button", { name: /switch to light theme/i });
      const darkBtn = screen.getByRole("button", { name: /switch to dark theme/i });
      const systemBtn = screen.getByRole("button", { name: /switch to system theme/i });

      expect(lightBtn).toBeInTheDocument();
      expect(darkBtn).toBeInTheDocument();
      expect(systemBtn).toBeInTheDocument();

      expect(lightBtn).toHaveClass("bg-gray-300");

      await act(async () => {
        fireEvent.click(darkBtn);
      });
      expect(mockSetTheme).toHaveBeenCalledWith("dark");
    });
  });

  describe("Variant 2: Spring Switch Toggle Slide Control", () => {
    it("should alternate switch values dynamically when tracking dark mode toggle parameters", async () => {
      mockUseTheme.mockReturnValue({
        theme: "dark",
        setTheme: mockSetTheme,
        systemTheme: "dark",
      });

      render(<ThemeSwitcher variant="toggle" />);

      const toggleActionBtn = screen.getByRole("button", { name: /switch to light theme/i });
      expect(toggleActionBtn).toBeInTheDocument();

      await act(async () => {
        fireEvent.click(toggleActionBtn);
      });
      expect(mockSetTheme).toHaveBeenCalledWith("light");
    });

    it("should toggle to dark mode parameters if clicked while light mode environment values are present", async () => {
      mockUseTheme.mockReturnValue({
        theme: "light",
        setTheme: mockSetTheme,
        systemTheme: "light",
      });

      render(<ThemeSwitcher variant="toggle" />);

      const toggleActionBtn = screen.getByRole("button", { name: /switch to dark theme/i });
      expect(toggleActionBtn).toBeInTheDocument();

      await act(async () => {
        fireEvent.click(toggleActionBtn);
      });
      expect(mockSetTheme).toHaveBeenCalledWith("dark");
    });
  });
});