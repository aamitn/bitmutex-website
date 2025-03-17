"use client";

import { useEffect } from "react";
import * as CookieConsent from "vanilla-cookieconsent";
import { useTheme } from "next-themes";
import pluginConfig from "./CookieConsentConfig";

// Extend the window object to define our custom property
declare global {
  interface Window {
    __cookieConsentInitialized?: boolean;
  }
}

const CookieConsentComponent = () => {
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    if (!window.__cookieConsentInitialized) {
      CookieConsent.run(pluginConfig);
      window.__cookieConsentInitialized = true; // Prevent multiple initializations
    }
  }, []);

  useEffect(() => {
    const currentTheme = theme || resolvedTheme;
    if (currentTheme === "dark") {
      document.documentElement.classList.add("cc--darkmode");
    } else {
      document.documentElement.classList.remove("cc--darkmode");
    }
  }, [theme, resolvedTheme]); // Sync with Next.js theme

  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        CookieConsent.showPreferences();
      }}
      className="text-sm text-blue-500 underline cursor-pointer"
    >
      Show Cookie Preferences
    </a>
  );
};

export default CookieConsentComponent;
