"use client";

import type { NavLink } from "@/types";
import { motion, useAnimation } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { ThemeSwitcher } from "@/components/layout/theme-switcher";
import { ChevronDown } from "lucide-react"; // Menu icons
import CalBookingModal from "@/components/custom/appointment";

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
  const [theme, setTheme] = useState("light"); // Default to light
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isOpen, setIsOpen] = useState(false); // Menu open state

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

  useEffect(() => {
    if (typeof window === "undefined") return; // Ensure this runs only on the client

    const detectTheme = () => {
      return document.documentElement.classList.contains("dark") ? "dark" : "light";
    };

    setTheme(detectTheme()); // Set initial theme

    // Listen for theme changes
    const observer = new MutationObserver(() => {
      setTheme(detectTheme());
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect(); // Cleanup
  }, []);

  if (!data) return null;
  const { logoText, logoSrc, navItems = [], navItems1 = [], navItems2 = [], cta } = data;

  const { grouped: groupedNavItems, independent: independentNavItems } = processNavItems(navItems);
  const { grouped: groupedNavItems1, independent: independentNavItems1 } = processNavItems(navItems1);
  const { grouped: groupedNavItems2, independent: independentNavItems2 } = processNavItems(navItems2);


  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      animate={{
        width: isSticky ? "65%" : "100%",
        height: isSticky ? "24px" : "48px",
        borderRadius: isSticky ? "120px" : "0px",
        backgroundColor: isSticky
          ? theme === "dark"
            ? "rgba(30, 30, 50, 0.75)" // Dark mode Navbar color
            : "rgba(245, 255, 255, 0.65)" // Light mode Navbar color
          : "transparent",
        boxShadow: isSticky
          ? "0px 8px 20px rgba(0, 0, 0, 0.15)"
          : "0px 0px 0px rgba(0, 0, 0, 0)",
        padding: isSticky ? "25px 20px" : "10px 30px",
      }}
      transition={{ duration: 0.4, ease: [0.25, 0.2, 0.25, 1] }}
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center justify-between 
      backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 
      shadow-md dark:shadow-white/90 dark:text-slate-300 text-slate-800 transition-colors duration-300"
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
      <nav className="hidden md:flex items-center gap-8">
        {[groupedNavItems, groupedNavItems1, groupedNavItems2].map((group, index) =>
          Object.entries(group).map(([parentName, items]) => (
            <div key={`${parentName}-${index}`} className="relative group">

              {/* Parent Menu Button */}
              <Button
                variant="ghost"
                className="font-heading flex items-center text-lg font-bold transition-all duration-300 
              hover:text-blue-500 dark:hover:text-blue-400 group-hover:scale-105 
                hover:shadow-[0px_4px_12px_rgba(59,130,246,0.8)]"
                onMouseEnter={() => setOpenDropdown(parentName)}
              >
                {parentName}
                <ChevronDown className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:rotate-180" />
              </Button>

              {/* Dropdown Menu with Stunning Animations */}
              {openDropdown === parentName && (
                <motion.div
                  initial={{ opacity: 0, y: -15, scale: 0.9, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, scale: 0.98, filter: "blur(10px)" }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="absolute left-0 top-full mt-2 w-64 bg-white dark:bg-neutral-800 shadow-xl rounded-xl border border-gray-300 dark:border-gray-700 z-[9999]
                backdrop-blur-md bg-opacity-80 dark:bg-opacity-75 transform-gpu"
                  onMouseEnter={() => setOpenDropdown(parentName)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  {items.map((item, idx) => (
                    <motion.div
                      key={item.text}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05, duration: 0.06, ease: "easeOut" }}
                      whileHover={{ scale: 1.02 }}
                      className="transition-transform"
                    >
                      <Link
                        href={item.href}
                        target={item.isExternal ? "_blank" : "_self"}
                        className="block px-6 py-3 text-lg font-medium transition-all duration-300 
                      text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-slate-700 
                      hover:text-blue-600 dark:hover:text-blue-400 rounded-xl
                      hover:shadow-lg"
                      >
                        {item.text}
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          ))
        )}

        {/* Independent Nav Items */}
        {[...independentNavItems, ...independentNavItems1, ...independentNavItems2].map((item) => (
          <motion.div
            key={item.text}
            whileHover={{ scale: 1.08, textShadow: "0px 0px 8px rgba(59, 130, 246, 0.5)" }}
            transition={{ duration: 0.2 }}
          >
            <Link
              href={item.href}
              target={item.isExternal ? "_blank" : "_self"}
              className="text-lg font-heading font-bold transition-all duration-300 
            text-gray-800  dark:text-slate-200 dark:shadow-white/90 hover:text-blue-500 dark:hover:text-blue-400"
            >
              {item.text}
            </Link>
          </motion.div>
        ))}
      </nav>


      {/* CTA & Theme Toggle */}
      <div className="hidden md:flex items-center gap-4">
      <div className="flex flex-wrap gap-3">
        {Array.isArray(cta) &&
          cta.map((item, index) => {
            // Get the booking URL from environment variable or default to Cal.com
            const appointmentUrl = process.env.NEXT_PUBLIC_APPOINTMENT_URL || "https://cal.com/bitmutex";

            // Check if the href contains "appointment" as the second word
            const parts = item.href.split(" ");
            const isAppointment = parts.length > 1 && parts[1].toLowerCase() === "appointment";
            const baseHref = parts[0]; // Extract the actual URL

            // The button component (WITHOUT href for appointments)
            const button = (
              <Button
                asChild
                className={`relative h-12 sm:h-9 sm:px-5 flex items-center gap-2 text-base font-medium rounded-lg
                  transition-all duration-300 ease-out border shadow-sm
                  ${item.isPrimary 
                    ? "bg-gray-900 text-white border-gray-900 hover:bg-gray-700 hover:border-gray-800 \
                    dark:bg-gray-100 dark:text-gray-900 dark:border-gray-300 dark:hover:bg-gray-400  dark:hover:text-slate-800 "
                    : "border-gray-600 dark:border-gray-600 text-gray-800 dark:text-gray-200 bg-transparent\
                      hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
              >
                {isAppointment ? (
                  <span>{item.text}</span> // No <Link> for appointment
                ) : (
                  <Link href={baseHref} target={item.isExternal ? "_blank" : "_self"}>
                    {item.text}
                  </Link>
                )}
              </Button>
            );

            return (
              <div key={index} className="flex flex-col sm:flex-row gap-3">
                {isAppointment ? <CalBookingModal url={appointmentUrl} trigger={button} /> : button}
              </div>
            );
          })}
       </div>
      <ThemeSwitcher />
    </div>


      {/* Mobile Navbar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          {/* Mobile Menu Button (Animated Hamburger) */}
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className={`md:hidden flex flex-col items-center justify-center w-12 h-12 rounded-lg p-2 transition-all duration-300 
          ${isSticky
                ? "bg-transparent hover:bg-gray-300 dark:hover:bg-gray-800 opacity-85 scale-95"
                : "bg-neutral-400/60 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-gray-700 opacity-100 scale-100 shadow-lg"}`}
            aria-label="Toggle Menu"
          >
            {/* Animated Bars */}
            <motion.div
              className={`w-6 h-[2px] rounded-full transition-all 
              ${isSticky ? "bg-gray-500 dark:bg-gray-400" : "bg-gray-700 dark:bg-gray-300"}`}
              animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 6 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
            <motion.div
              className={`w-6 h-[2px] rounded-full my-1 transition-all 
              ${isSticky ? "bg-gray-500 dark:bg-gray-400" : "bg-gray-700 dark:bg-gray-300"}`}
              animate={{ opacity: isOpen ? 0 : 1 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            />
            <motion.div
              className={`w-6 h-[2px] rounded-full transition-all 
              ${isSticky ? "bg-gray-500 dark:bg-gray-400" : "bg-gray-700 dark:bg-gray-300"}`}
              animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -6 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
          </button>

        </SheetTrigger>



        <SheetContent
          side="left"
          className="font-heading w-72 bg-white dark:bg-gray-900 backdrop-blur-md bg-opacity-90 dark:bg-opacity-75 
          border-r border-orange-400 dark:border-gray-700 shadow-lg dark:shadow-xl 
          transition-all duration-300 ease-in-out overflow-y-auto"
        >



          <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle> {/* Accessibility */}

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col gap-4 mt-4"
          >

            {/* Expandable Dropdowns */}
            {[
              { group: groupedNavItems, id: "group1" },
              { group: groupedNavItems1, id: "group2" },
              { group: groupedNavItems2, id: "group3" }
            ].map(({ group, id }) => {
              const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
                Object.fromEntries(Object.keys(group).map((key) => [key, true]))
              );

              const toggleGroup = (groupName: string) => {
                setOpenGroups((prev) => ({ ...prev, [groupName]: !prev[groupName] }));
              };

              return Object.entries(group).map(([parentName, items]) => (
                <div key={`${parentName}-${id}`} className="border-b border-gray-300 dark:border-gray-700 pb-2">
                  <button
                    onClick={() => toggleGroup(parentName)}
                    className="flex justify-between items-center w-full text-left text-lg font-semibold 
                    dark:text-slate-400 text-orange-400  px-4 py-2 rounded-md transition-all duration-300 
                    hover:text-blue-500 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    {parentName}
                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-300 ${openGroups[parentName] ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Animated Dropdown Content */}
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: openGroups[parentName] ? "auto" : 0, opacity: openGroups[parentName] ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="flex flex-col mt-2 pl-6 overflow-hidden"
                  >
                    {items.map((item) => (
                      <Link
                        key={item.text}
                        href={item.href}
                        onClick={() => setIsOpen((prev) => !prev)}
                        className="block px-4 py-2 text-neutral-300 rounded-md transition-all duration-300 
                  hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-blue-500 dark:hover:text-blue-400"
                        target={item.isExternal ? "_blank" : "_self"}
                      >
                        {item.text}
                      </Link>
                    ))}
                  </motion.div>
                </div>
              ));
            })}

            {/* Independent Links */}
            {[...independentNavItems, ...independentNavItems1, ...independentNavItems2].map((item) => (
              <motion.div
                key={item.text}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href={item.href}
                  onClick={() => setIsOpen((prev) => !prev)}
                  className="block px-4 py-2 text-lg font-medium  dark:text-slate-400 text-orange-400 
            transition-all duration-300 hover:bg-gray-200 dark:hover:bg-gray-700 
            hover:text-blue-500 dark:hover:text-blue-400 rounded-md"
                  target={item.isExternal ? "_blank" : "_self"}
                >
                  {item.text}
                </Link>
              </motion.div>
            ))}

            {/* CTA Buttons */}
            {Array.isArray(cta) &&
              cta.map((item, index) => {
                const appointmentUrl = process.env.NEXT_PUBLIC_APPOINTMENT_URL || "https://cal.com/bitmutex";
                const parts = item.href.split(" ");
                const isAppointment = parts.length > 1 && parts[1].toLowerCase() === "appointment";
                const baseHref = parts[0];

                const button = (
                  <Button
                    className="font-heading w-full text-center text-lg font-medium rounded-lg px-4 py-2 
                  bg-neutral-600/80 dark:bg-gray-700/70 text-neutral-300 dark:text-gray-100 
                  transition-all duration-300 ease-in-out 
                  hover:bg-gray-200 hover:text-neutral-800 dark:hover:bg-gray-300 dark:hover:text-neutral-800
                  active:scale-95 active:shadow-inner"
                    asChild
                  >
                    {isAppointment ? (
                      <span>{item.text}</span>
                    ) : (
                      <Link 
                      href={baseHref} 
                      target={item.isExternal ? "_blank" : "_self"}
                      onClick={() => setIsOpen((prev) => !prev)}
                      >
                        {item.text}
                      </Link>
                    )}
                  </Button>
                );

                return (
                  <div key={index} className="w-full">
                    {isAppointment ? <CalBookingModal url={appointmentUrl} trigger={button} /> : button}
                  </div>
                );
              })}

            {/* Theme Toggle */}
            <div className="flex items-center justify-center gap-4 border-t border-gray-300 dark:border-gray-700 pt-4 mt-4">
              <ThemeSwitcher />
              <ThemeToggle />
            </div>

          </motion.div>
        </SheetContent>
      </Sheet>

    </motion.header>
  );
}
