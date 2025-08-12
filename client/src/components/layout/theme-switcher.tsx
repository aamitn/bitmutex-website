"use client";

import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Sun, Moon, Monitor } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ThemeSwitcherProps {
  variant?: "default" | "toggle";
}

export function ThemeSwitcher({ variant = "default" }: ThemeSwitcherProps) {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle current theme in toggle mode
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  if (!mounted) {
    return variant === "default" ? (
      <div className="flex items-center gap-2 p-1 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse w-[100px] h-8" />
    ) : (
      <div className="w-16 h-8 bg-gray-300 dark:bg-gray-800 rounded-full" />
    );
  }

  // ---------- VARIANT 1: DEFAULT TOOLTIP STYLE ----------
  if (variant === "default") {
    const themes = [
      { mode: "light", icon: <Sun className="w-4 h-4" />, label: "Light" },
      { mode: "dark", icon: <Moon className="w-4 h-4" />, label: "Dark" },
      { mode: "system", icon: <Monitor className="w-4 h-4" />, label: "System" },
    ];

    return (
      <TooltipProvider>
        <div className="flex items-center p-0.5 bg-gray-100 dark:bg-gray-900 rounded-lg">
          {themes.map(({ mode, icon, label }) => (
            <Tooltip key={mode}>
              <TooltipTrigger asChild>
                <motion.button
                  onClick={() => setTheme(mode)}
                  className={`flex items-center justify-center w-8 h-8 rounded-md transition-colors duration-200
                    ${
                      theme === mode
                        ? "bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    }
                  `}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {icon}
                </motion.button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
    );
  }

  // ---------- VARIANT 2: TOGGLE STYLE ----------
  return (
    <div className="flex items-center gap-3">
      <motion.button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className="relative w-16 h-8 rounded-full bg-gray-300 dark:bg-gray-800 flex items-center px-1 shadow-lg border border-gray-400 dark:border-gray-700"
        whileTap={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <motion.div
          className="w-7 h-7 bg-white dark:bg-gray-950 rounded-full shadow-xl flex items-center justify-center"
          initial={{ x: isDark ? 32 : 0 }}
          animate={{ x: isDark ? 32 : 0 }}
          transition={{
            type: "spring",
            stiffness: 250,
            damping: 20,
            mass: 0.5,
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9, rotate: 15 }}
        >
          <motion.div
            key={currentTheme}
            initial={{ rotate: isDark ? -180 : 180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            {isDark ? (
              <Moon className="w-4 h-4 text-gray-300" />
            ) : (
              <Sun className="w-4 h-4 text-orange-500" />
            )}
          </motion.div>
        </motion.div>
      </motion.button>
    </div>
  );
}

export default ThemeSwitcher;
