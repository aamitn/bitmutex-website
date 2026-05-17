import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { ThemeToggle } from "../theme-toggle"; 
import React from "react";

// 1. Mock next-themes to spy on the state change hooks
const mockSetTheme = vi.fn();
const mockUseTheme = vi.fn(() => ({
  theme: "light",
  setTheme: mockSetTheme,
  systemTheme: "light",
}));

vi.mock("next-themes", () => ({
  useTheme: () => mockUseTheme(),
}));

// 2. Mock Shadcn UI / Radix Dropdown Menu to render flat elements instantly in JSDOM
vi.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: any) => <div data-testid="dropdown-root">{children}</div>,
  DropdownMenuTrigger: ({ children }: any) => <div data-testid="dropdown-trigger">{children}</div>,
  DropdownMenuPortal: ({ children }: any) => <div data-testid="dropdown-portal">{children}</div>,
  DropdownMenuContent: ({ children, className }: any) => (
    <div data-testid="dropdown-content" className={className}>
      {children}
    </div>
  ),
  DropdownMenuItem: ({ children, onClick, className }: any) => (
    <button data-testid="dropdown-item" className={className} onClick={onClick}>
      {children}
    </button>
  ),
}));

describe("ThemeToggle Dropdown Component Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });


  it("should render an orange Sun icon when the current environment state is light mode", () => {
    mockUseTheme.mockReturnValue({
      theme: "light",
      setTheme: mockSetTheme,
      systemTheme: "light",
    });

    render(<ThemeToggle />);

    const triggerBtn = screen.getByRole("button", { name: /current theme light/i });
    expect(triggerBtn).toBeInTheDocument();
    expect(triggerBtn).toHaveAttribute("title", "Toggle theme");

    const sunIcon = triggerBtn.querySelector(".text-orange-500");
    expect(sunIcon).toBeInTheDocument();
  });

  it("should render a slate Moon icon when the current environment state resolves to dark mode", () => {
    mockUseTheme.mockReturnValue({
      theme: "dark",
      setTheme: mockSetTheme,
      systemTheme: "dark",
    });

    render(<ThemeToggle />);

    const triggerBtn = screen.getByRole("button", { name: /current theme dark/i });
    expect(triggerBtn).toBeInTheDocument();

    const moonIcon = triggerBtn.querySelector(".text-slate-300");
    expect(moonIcon).toBeInTheDocument();
  });

  it("should list all theme choices and call setTheme matching the clicked item target", () => {
    mockUseTheme.mockReturnValue({
      theme: "system",
      setTheme: mockSetTheme,
      systemTheme: "dark",
    });

    render(<ThemeToggle />);

    // ✅ FIX: Target only elements within the explicit menu content view card container block
    const menuContainer = screen.getByTestId("dropdown-content");
    expect(menuContainer).toBeInTheDocument();

    const lightOption = within(menuContainer).getByRole("button", { name: /light/i });
    const darkOption = within(menuContainer).getByRole("button", { name: /dark/i });
    const systemOption = within(menuContainer).getByRole("button", { name: /system/i });

    expect(lightOption).toBeInTheDocument();
    expect(darkOption).toBeInTheDocument();
    expect(systemOption).toBeInTheDocument();

    expect(lightOption).toHaveClass("text-orange-400");

    // Click 'light' item option
    fireEvent.click(lightOption);
    expect(mockSetTheme).toHaveBeenCalledWith("light");

    // Click 'dark' item option
    fireEvent.click(darkOption);
    expect(mockSetTheme).toHaveBeenCalledWith("dark");
  });
});