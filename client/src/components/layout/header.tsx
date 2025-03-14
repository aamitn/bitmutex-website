"use client";

import type { NavLink } from "@/types";
import { motion, useAnimation, useTransform  } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Menu, ChevronDown } from "lucide-react"; // Menu icons
import { cn } from "@/lib/utils"; // Utility for conditional classnames

interface HeaderProps {
  data: {
    logoText: string;
    logoSrc?: string;
    navItems: NavLink[];
    navItems1: NavLink[];
    navItems2: NavLink[];
    cta?: NavLink;
  };
}

// Process nav items into grouped (dropdowns) and independent items
const processNavItems = (navItems: NavLink[]) => {
  const grouped: Record<string, NavLink[]> = {};
  const independent: NavLink[] = [];

  navItems.forEach((item) => {
    if (!item.parentName?.trim()) {
      independent.push(item);
    } else {
      grouped[item.parentName] = grouped[item.parentName] || [];
      grouped[item.parentName].push(item);
    }
  });

  return { grouped, independent };
};

export function Header({ data }: Readonly<HeaderProps>) {
  const [isSticky, setIsSticky] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsSticky(true);
        controls.start({ height: "64px", backgroundColor: "rgba(255, 255, 255, 0.9)", boxShadow: "0px 4px 6px rgba(0,0,0,0.1)" });
      } else {
        setIsSticky(false);
        controls.start({ height: "80px", backgroundColor: "transparent", boxShadow: "none" });
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [controls]);

  if (!data) return null;
  const { logoText, logoSrc, navItems = [], navItems1 = [], navItems2 = [], cta } = data;

  const { grouped: groupedNavItems, independent: independentNavItems } = processNavItems(navItems);
  const { grouped: groupedNavItems1, independent: independentNavItems1 } = processNavItems(navItems1);
  const { grouped: groupedNavItems2, independent: independentNavItems2 } = processNavItems(navItems2);

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null);
  
  const handleMouseEnter = (parentName: string) => {
    if (hideTimeout) clearTimeout(hideTimeout); // Cancel any pending hide timeout
    setOpenDropdown(parentName);
  };
  
  const handleMouseLeave = (event: React.MouseEvent) => {
    if (!event.relatedTarget) return;
  
    const isMovingToAnotherMenu =
      event.relatedTarget instanceof Node &&
      document.querySelector(`[data-menu-item]`)?.contains(event.relatedTarget);
  
    if (isMovingToAnotherMenu) return; // Prevents closing when moving between parent menus
  
    const timeout = setTimeout(() => {
      setOpenDropdown(null);
    }, 300); // Slight delay to prevent flickering
  
    setHideTimeout(timeout);
  };
  

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      animate={{
        width: isSticky ? "60%" : "100%", // Make it narrower when sticky
        height: isSticky ? "20px" : "40px", // Reduce height
        borderRadius: isSticky ? "9999px" : "0px",
        backgroundColor: isSticky ? "rgba(255, 255, 255, 0.8)" : "transparent",
        boxShadow: isSticky ? "0 4px 10px rgba(0, 0, 0, 0.1)" : "none",
        padding: isSticky ? "25px 20px" : "10px 30px", // Adjust padding dynamically
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center justify-between 
      backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 
      shadow-md dark:shadow-white/90 text-gray-900 dark:text-amber-600"
>

      {/* Logo */}
      <Link href="/" className="flex items-center gap-3">
        {logoSrc ? (
          <Image src={logoSrc} alt={logoText} width={40} height={40} className="h-10 w-auto" />
        ) : (
          <span className="font-heading text-xl font-bold">{logoText}</span>
        )}
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-6">
    {[groupedNavItems, groupedNavItems1, groupedNavItems2].map((group, index) =>
      Object.entries(group).map(([parentName, items]) => (
        <div
          data-menu-item
          key={`${parentName}-${index}`}
          className="relative"
          onMouseEnter={() => handleMouseEnter(parentName)}
          onMouseLeave={handleMouseLeave}
        >
          <Button variant="ghost" className="flex items-center text-lg font-medium hover:text-primary">
            {parentName}
            <ChevronDown className="w-4 h-4 mr-2" />
          </Button>
          {openDropdown === parentName && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute left-0 mt-2 w-56 bg-white dark:bg-gray-800 shadow-lg rounded-md border z-50"
              onMouseEnter={() => handleMouseEnter(parentName)}
              onMouseLeave={handleMouseLeave}
            >
              {items.map((item) => (
                <Link
                  key={item.text}
                  href={item.href}
                  target={item.isExternal ? "_blank" : "_self"}
                  className="flex items-center gap-3 px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition"
                >
                  {item.icon && <item.icon className="w-5 h-5" />}
                  {item.text}
                </Link>
              ))}
            </motion.div>
          )}
        </div>
      ))
    )}
    {/* Independent Nav Items */}
    {[...independentNavItems, ...independentNavItems1, ...independentNavItems2].map((item) => (
      <Link
        key={item.text}
        href={item.href}
        target={item.isExternal ? "_blank" : "_self"}
        className="text-lg font-medium hover:text-primary"
      >
        {item.text}
      </Link>
    ))}
  </nav>

      {/* CTA & Theme Toggle */}
      <div className="hidden md:flex items-center gap-4">
        {cta && (
          <Button asChild>
            <Link href={cta.href} target={cta.isExternal ? "_blank" : "_self"}>
              {cta.text}
            </Link>
          </Button>
        )}
        <ThemeToggle />
      </div>

      {/* Mobile Navbar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-6 h-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle> {/* Hidden but required for accessibility */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
            <nav className="flex flex-col gap-3">
              {/* Grouped Items */}
              {[groupedNavItems, groupedNavItems1, groupedNavItems2].map((group, index) =>
                Object.entries(group).map(([parentName, items]) => (
                  <div key={`${parentName}-${index}`}>
                    <span className="flex items-center gap-2 font-semibold text-lg">
                      <ChevronDown className="w-4 h-4" />
                      {parentName}
                    </span>
                    <motion.div className="flex flex-col gap-2 mt-2">
                      {items.map((item) => (
                        <Link
                          key={item.text}
                          href={item.href}
                          className="flex items-center gap-3 px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition"
                          target={item.isExternal ? "_blank" : "_self"}
                        >
                          {item.icon && <item.icon className="w-5 h-5" />}
                          {item.text}
                        </Link>
                      ))}
                    </motion.div>
                  </div>
                ))
              )}

              {/* Independent Links */}
              {[...independentNavItems, ...independentNavItems1, ...independentNavItems2].map((item) => (
                <Link
                  key={item.text}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition"
                  target={item.isExternal ? "_blank" : "_self"}
                >
                  {item.icon && <item.icon className="w-5 h-5" />}
                  {item.text}
                </Link>
              ))}

              {cta && (
                <Button asChild className="mt-4 w-full">
                  <Link href={cta.href} target={cta.isExternal ? "_blank" : "_self"}>
                    {cta.text}
                  </Link>
                </Button>
              )}
              <ThemeToggle />
            </nav>
          </motion.div>
        </SheetContent>
      </Sheet>
    </motion.header>
  );
}
