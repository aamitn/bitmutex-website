"use client";

import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="flex items-center gap-3">
      {/* Toggle Button */}
      <motion.button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className="relative w-16 h-8 rounded-full bg-gray-300 dark:bg-gray-800 flex items-center px-1 shadow-lg border border-gray-400 dark:border-gray-700"
        whileTap={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Sliding Knob */}
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
          {/* Rotating Icon */}
          <motion.div
            key={theme}
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
