"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export default function CategoryButton({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const [activeCategory, setActiveCategory] = useState(searchParams.get("category") || "");

  useEffect(() => {
    setActiveCategory(searchParams.get("category") || "");
  }, [searchParams]);

  const isActive = activeCategory === value.toLowerCase();

  const handleSelect = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("category", value.toLowerCase());

    // Update state immediately for instant UI response
    setActiveCategory(value.toLowerCase());

    // Force UI repaint (fixes touch event delay on mobile)
    requestAnimationFrame(() => {
      replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <Button
      variant="ghost"
      onClick={() => handleSelect(value)}
      onTouchEnd={(e) => {
        e.preventDefault(); // Prevents double-click delay
        handleSelect(value);
      }}
      className={cn(
        "relative px-4 py-1 text-sm font-medium rounded-full transition-all duration-300",
        "border border-transparent hover:border-primary/30",
        "hover:text-primary hover:shadow-md hover:bg-primary/10",
        isActive
          ? "bg-primary text-slate-200 dark:text-slate-800 shadow-lg border-primary scale-105"
          : "text-muted-foreground bg-muted"
      )}
    >
      {children}
      {isActive && (
        <div className="absolute inset-0 rounded-full bg-primary/10 blur-lg opacity-50 animate-fadeIn"></div>
      )}
    </Button>
  );
}
