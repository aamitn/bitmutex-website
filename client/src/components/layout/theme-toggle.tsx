"use client";

import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Moon, Sun, Laptop } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle initial hydration issue
  if (!mounted) return null;

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9, rotate: 15 }}
        >
          <Button variant="outline" size="icon">
            <motion.div
              key={currentTheme}
              initial={{ rotate: isDark ? -180 : 180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              {isDark ? (
                <Moon className="h-[1.2rem] w-[1.2rem] text-slate-300" />
              ) : (
                <Sun className="h-[1.2rem] w-[1.2rem] text-orange-500" />
              )}
            </motion.div>
          </Button>
        </motion.div>
      </DropdownMenuTrigger>
      
      <AnimatePresence>
        <DropdownMenuContent
          as={motion.div}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ type: "spring", stiffness: 150, damping: 12 }}
        >
          <DropdownMenuItem 
            onClick={() => setTheme("light")}
            className={theme === "light" ? "bg-accent" : ""}
          >
            <Sun className="mr-2 h-4 w-4" />
            Light
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setTheme("dark")}
            className={theme === "dark" ? "bg-accent" : ""}
          >
            <Moon className="mr-2 h-4 w-4" />
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setTheme("system")}
            className={theme === "system" ? "bg-accent" : ""}
          >
            <Laptop className="mr-2 h-4 w-4" />
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </AnimatePresence>
    </DropdownMenu>
  );
}
