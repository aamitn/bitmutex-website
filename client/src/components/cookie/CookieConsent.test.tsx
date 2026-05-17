import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CookieConsentComponent from "./CookieConsent"; // Adjust relative paths to match your folder structure
import CookieConsentApiBtns from "./CookieConsentApiControls";
import pluginConfig from "./CookieConsentConfig";
import React from "react";

// 1. Mock the next-themes module hook
const mockUseTheme = vi.fn(() => ({
  theme: "light",
  resolvedTheme: "light",
}));

vi.mock("next-themes", () => ({
  useTheme: () => mockUseTheme(),
}));

// 2. Mock vanilla-cookieconsent API surface methods to spy on engine interactions
const mockRun = vi.fn();
const mockReset = vi.fn();
const mockHide = vi.fn();
const mockAcceptCategory = vi.fn();
const mockShowPreferences = vi.fn();

vi.mock("vanilla-cookieconsent", () => ({
  run: (config: any) => mockRun(config),
  reset: (clearAll: boolean) => mockReset(clearAll),
  hide: () => mockHide(),
  acceptCategory: (categories: any) => mockAcceptCategory(categories),
  showPreferences: () => mockShowPreferences(),
}));

describe("Cookie Consent Unified System Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clean window object allocation trackers before each pass
    delete (window as any).__cookieConsentInitialized;
    // Clear dark mode layout hooks out of the DOM document wrapper
    document.documentElement.classList.remove("cc--darkmode");
  });

  describe("File 1: CookieConsentConfig Object Integrity Validation", () => {
    it("should compile configuration properties matching the vanilla-cookieconsent schema structure", () => {
      expect(pluginConfig).toBeDefined();
      expect(pluginConfig.guiOptions?.consentModal?.layout).toBe("box");
      expect(pluginConfig.categories?.necessary).toEqual({ readOnly: true, enabled: true });
      expect(pluginConfig.categories?.analytics?.autoClear?.cookies[0].name.toString()).toContain("_ga|_gid");
      expect(pluginConfig.language?.default).toBe("en");
    });
  });

  describe("File 2: CookieConsentComponent Framework Execution", () => {
    it("should load plugin scripts exactly once on mount and configure global bypass guards", () => {
      render(<CookieConsentComponent />);
      
      // Verifies engine initialization passes configuration file cleanly
      expect(mockRun).toHaveBeenCalledTimes(1);
      expect(mockRun).toHaveBeenCalledWith(pluginConfig);
      expect(window.__cookieConsentInitialized).toBe(true);
    });

    it("should lock double initialization attempts if components remount into the DOM lifecycle tree", () => {
      const { unmount } = render(<CookieConsentComponent />);
      unmount();
      render(<CookieConsentComponent />);

      // Spies ensure the script initializer skips a second execution branch run
      expect(mockRun).toHaveBeenCalledTimes(1);
    });

    it("should append dark mode styling flags onto document elements matching theme context states", () => {
      // Force next-themes hook parameters mock to dark layout values
      mockUseTheme.mockReturnValue({
        theme: "dark",
        resolvedTheme: "dark",
      });

      render(<CookieConsentComponent />);
      expect(document.documentElement.classList.contains("cc--darkmode")).toBe(true);
    });

    it("should remove dark mode styling flags if the next-themes state flips back to light mode variables", () => {
      document.documentElement.classList.add("cc--darkmode");
      mockUseTheme.mockReturnValue({
        theme: "light",
        resolvedTheme: "light",
      });

      render(<CookieConsentComponent />);
      expect(document.documentElement.classList.contains("cc--darkmode")).toBe(false);
    });

    it("should call preference modulators natively when selecting inline preferences hooks", () => {
      render(<CookieConsentComponent />);
      const preferenceAnchor = screen.getByRole("link", { name: /show cookie preferences/i });
      
      fireEvent.click(preferenceAnchor);
      expect(mockShowPreferences).toHaveBeenCalledTimes(1);
    });
  });

  describe("File 3: CookieConsentApiBtns Operational Controls Panel", () => {
    it("should map control elements and fire modal toggle operations smoothly", () => {
      render(<CookieConsentApiBtns />);

      const showPreferencesBtn = screen.getByRole("button", { name: /show preferences/i });
      fireEvent.click(showPreferencesBtn);
      expect(mockShowPreferences).toHaveBeenCalledTimes(1);
    });

    it("should configure category arrays and pass 'all' values upon matching confirmation button selections", () => {
      render(<CookieConsentApiBtns />);

      const acceptAllBtn = screen.getByRole("button", { name: /accept all/i });
      fireEvent.click(acceptAllBtn);
      
      expect(mockAcceptCategory).toHaveBeenCalledWith("all");
      expect(mockHide).toHaveBeenCalledTimes(1);
    });

    it("should register selective parameters when choosing restricted cookie options patterns", () => {
      render(<CookieConsentApiBtns />);

      const acceptNecessaryBtn = screen.getByRole("button", { name: /accept necessary/i });
      fireEvent.click(acceptNecessaryBtn);
      
      expect(mockAcceptCategory).toHaveBeenCalledWith([]);
      expect(mockHide).toHaveBeenCalledTimes(1);
    });

    it("should reset context tracking parameters and clear the core execution engine completely", () => {
      render(<CookieConsentApiBtns />);

      const resetBtn = screen.getByRole("button", { name: /reset plugin/i });
      fireEvent.click(resetBtn);
      
      expect(mockReset).toHaveBeenCalledWith(true);
      expect(mockRun).toHaveBeenCalledWith(pluginConfig);
    });

    it("should provide alternative layout manual toggles to adjust display layouts locally", () => {
      render(<CookieConsentApiBtns />);
      const manualThemeToggleBtn = screen.getByRole("button", { name: /toggle dark mode/i });

      expect(document.documentElement.classList.contains("cc--darkmode")).toBe(false);
      fireEvent.click(manualThemeToggleBtn);
      expect(document.documentElement.classList.contains("cc--darkmode")).toBe(true);
    });
  });
});