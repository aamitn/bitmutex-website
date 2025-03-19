"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import StatusBadge from "@/components/custom/status-badge";
import * as CookieConsent from "vanilla-cookieconsent";
import * as LucideIcons from "lucide-react";
import { ElementType } from "react";
import React from "react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
interface SocialLink {
  href: string;
  text: string;
}

interface NavItem {
  href: string;
  text: string;
  parentName: string;
}

interface FooterProps {
  data: {
    text: string;
    ins: string;
    socialLinks: SocialLink[];
    navItems: NavItem[];
    logoWideSrc?: string;
  };
}




// ✅ Get the correct Lucide icon
const getLucideIcon = (iconName: string): ElementType => {
  const pascalCaseName = iconName.split("-")
                                  .map((word) => word
                                  .charAt(0).toUpperCase() + word
                                  .slice(1)).join("");;
  return (LucideIcons as Record<string, unknown>)[pascalCaseName] as ElementType || LucideIcons.AlertCircle;
};


export function Footer({ data }: Readonly<FooterProps>) {
  if (!data) return null;
  const { text, ins, socialLinks, navItems, logoWideSrc } = data;

  // Group navItems by parentName
  const groupedNavItems = navItems.reduce<Record<string, NavItem[]>>((acc, item) => {
    if (!acc[item.parentName]) {
      acc[item.parentName] = [];
    }
    acc[item.parentName].push(item);
    return acc;
  }, {});

  return (
    <footer className="relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white">
      {/* ✅ Shape Divider (Wavy Effect) placed inside footer at the correct level */}
      <div className="absolute top-[-80px] left-0 w-full overflow-hidden leading-none backdrop-blur-md opacity-90 drop-shadow-lg">
        <svg
          className="relative block w-full h-28"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,60 C300,180 600,-40 900,60 C1200,160 1500,-40 1800,60 L1800,120 L0,120 Z"
            fill="url(#grad1)"
          ></path>
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: "#007bff", stopOpacity: 0.9 }} />
              <stop offset="100%" style={{ stopColor: "#ff8d00", stopOpacity: 0.9 }} />
            </linearGradient>
          </defs>
        </svg>
      </div>



      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 px-6 py-16 relative z-10"
      >
        {/* Left Section: Logo & Text */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <div className="flex flex-col items-center sm:items-start space-y-4">

            {/* ✅ Company Logo (or Placeholder) */}
            <div className="w-[180px] h-[60px] flex items-center justify-center">
              {logoWideSrc ? (
                <Image
                  src={logoWideSrc}
                  alt="Company Logo"
                  width={180}
                  height={60}
                  className="h-auto"
                />
              ) : (
                <div className="w-full h-full bg-gray-300 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400">
                  No Logo
                </div>
              )}
            </div>

            {/* ✅ Company Description */}
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left">
              {text}
            </p>

          {/* ✅ CIN / GSTIN */}
          <div className="flex justify-center sm:justify-start w-full text-xs text-gray-500 dark:text-gray-400 tracking-wide">
            {ins.split(" ").map((part, index) =>
              index === 0 ? (
                <span key={index} className="mr-1">{part}</span> // Normal text for the word
              ) : (
                <span key={index} className="font-semibold text-gray-600 dark:text-gray-300">{part}</span> // Bold for the number
              )
            )}
          </div>

            {/* ✅ Status Badge */}
            <div className="flex justify-center sm:justify-start w-full">
              <StatusBadge />
            </div>


{/* ✅ Cookie Preferences Link and theme toggle*/}
<div className="flex items-center justify-center sm:justify-start w-full gap-3">
  <a
    href="#"
    onClick={(e) => {
      e.preventDefault();
      CookieConsent.showPreferences();
    }}
    className="text-sm font-normal text-slate-800 dark:text-orange-400 transition-all duration-300 ease-in-out 
    hover:text-orange-500 dark:hover:text-blue-300 hover:font-bold focus:outline-none focus:ring-2 
    focus:ring-orange-400 dark:focus:ring-orange-500 rounded-md px-2 py-1 flex items-center"
  >
    ⚙️ Cookie Preferences
  </a>
  <ThemeToggle />
</div>

          </div>
        </motion.div>


        {/* Center Section: Navigation */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {Object.entries(groupedNavItems).map(([parent, items]) => (
              <div key={parent} className="space-y-2">
                <h4 className="text-lg font-semibold">{parent}</h4>
                <Separator className="w-12 bg-gray-500 dark:bg-gray-600" />
                <ul className="space-y-1">
                  {items.map((item) => (
                    <li key={item.text}>
                      <Link href={item.href} className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition">
                        {item.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Section: Newsletter & Social Links */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <div className="flex flex-col items-center sm:items-end space-y-4">
            <h4 className="text-lg font-semibold">Subscribe to our Newsletter</h4>
            <Separator className="w-12 bg-gray-500 dark:bg-gray-600" />
            <div className="flex w-full">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-l-md bg-gray-300 text-gray-900 dark:bg-gray-700 dark:text-white border-none placeholder-gray-600 dark:placeholder-slate-300 focus:ring-2 focus:ring-orange-500"
              />
              <Button className="rounded-r-md bg-gray-700 hover:bg-gray-500 text-white dark:bg-orange-500 dark:hover:bg-amber-500">
                Subscribe
              </Button>
            </div>
            <h4 className="text-lg font-semibold">Follow Us</h4>
            <Separator className="w-12 bg-gray-500 dark:bg-gray-600" />

            <div className="flex gap-3">
              {socialLinks?.map((link: SocialLink) => {
                const Icon = getLucideIcon(link.text); // Get the correct icon dynamically
                return (
                  <Link
                    key={link.text}
                    href={link.href}
                    target="_blank"
                    className="group relative p-2 rounded-full bg-slate-300 dark:bg-orange-600 
                              hover:bg-indigo-200 dark:hover:bg-amber-500 
                              transition-all duration-300 shadow-md hover:shadow-lg dark:shadow-gray-700"
                  >
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br 
                                from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 
                                shadow-sm group-hover:shadow-md transition-all duration-300 
                                group-hover:scale-105 group-hover:bg-opacity-90">

                      {Icon
                        ? React.createElement(Icon, {
                            className:
                              "w-5 h-5 text-orange-600 dark:text-amber-200\
                              group-hover:text-orange-400 dark:group-hover:text-blue-800 transition-all duration-300",
                          })
                        : React.createElement(LucideIcons.AlertCircle, {
                            className:
                              "w-5 h-5 text-blue-600 dark:text-orange-400\
                              group-hover:text-blue-700 dark:group-hover:text-orange-300 transition-all duration-300",
                          })}
                    </div>

                  </Link>
                );
              })}
            </div>

          </div>
        </motion.div>
      </motion.div>

    {/* Copyright Section */}
    <div className="border-t border-gray-500 dark:border-gray-700 mt-10 pt-6 text-center text-sm text-gray-600 dark:text-gray-400">
     &copy; 2018 - {new Date().getFullYear()} {text}. All rights reserved.
    </div>
    </footer>
  );
}
