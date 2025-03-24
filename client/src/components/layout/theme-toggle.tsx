"use client";

import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
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

  if (!mounted) return null;

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          {isDark ? (
            <Moon className="h-[1.2rem] w-[1.2rem] text-slate-300" />
          ) : (
            <Sun className="h-[1.2rem] w-[1.2rem] text-orange-500" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuPortal>
        <DropdownMenuContent className="z-50 border border-gray-200 dark:border-gray-700 bg-white dark:bg-neutral-900">
          <DropdownMenuItem
            onClick={() => setTheme("light")}
            className={`hover:bg-orange-200 dark:hover:bg-gray-600 ${
              isDark ? "text-orange-400" : "text-slate-700"
            }`}
          >
            <Sun className="mr-2 h-4 w-4" />
            Light
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setTheme("dark")}
            className={`hover:bg-orange-200 dark:hover:bg-gray-600 ${
              isDark ? "text-orange-400" : "text-slate-700"
            }`}
          >
            <Moon className="mr-2 h-4 w-4" />
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setTheme("system")}
            className={`hover:bg-orange-200 dark:hover:bg-gray-600 ${
              isDark ? "text-orange-400" : "text-slate-700"
            }`}
          >
            <Laptop className="mr-2 h-4 w-4" />
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
}
