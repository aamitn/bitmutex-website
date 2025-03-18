"use client";

import Link from "next/link";
import Image from "next/image";
import { Twitter, Github, Youtube } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import StatusBadge from "@/components/custom/status-badge";
import * as CookieConsent from "vanilla-cookieconsent";

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
    socialLinks: SocialLink[];
    navItems: NavItem[];
    logoWideSrc?: string;
  };
}

function renderIcon(text: string) {
  switch (text.toLowerCase()) {
    case "twitter":
      return <Twitter className="size-5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition" />;
    case "github":
      return <Github className="size-5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition" />;
    case "youtube":
      return <Youtube className="size-5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition" />;
    default:
      return null;
  }
}

export function Footer({ data }: Readonly<FooterProps>) {
  if (!data) return null;
  const { text, socialLinks, navItems, logoWideSrc } = data;

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

          {/* ✅ Status Badge */}
          <div className="flex justify-center sm:justify-start w-full">
            <StatusBadge />
          </div>

          {/* ✅ Cookie Preferences Link */}
          <div className="flex justify-center sm:justify-start w-full">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                CookieConsent.showPreferences();
              }}
              className="text-sm font-semibold text-blue-600 dark:text-orange-400 transition-all duration-300 ease-in-out 
              hover:text-blue-700 dark:hover:text-blue-300 hover:scale-105 focus:outline-none focus:ring-2 
              focus:ring-blue-400 dark:focus:ring-blue-500 rounded-md px-2 py-1"
 >
              ⚙️ Cookie Preferences
            </a>
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
                className="flex-1 rounded-l-md bg-gray-300 text-gray-900 dark:bg-gray-700 dark:text-white border-none placeholder-gray-600 dark:placeholder-gray-400 focus:ring-2 focus:ring-gray-500"
              />
              <Button className="rounded-r-md bg-gray-700 hover:bg-gray-600 text-white dark:bg-gray-400 dark:hover:bg-gray-500">
                Subscribe
              </Button>
            </div>
            <h4 className="text-lg font-semibold">Follow Us</h4>
            <Separator className="w-12 bg-gray-500 dark:bg-gray-600" />
            <div className="flex gap-4">
              {socialLinks?.map((link) => (
                <Link key={link.text} href={link.href} target="_blank" className="p-2 rounded-full bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 transition">
                  {renderIcon(link.text)}
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Copyright Section */}
      <div className="border-t border-gray-500 dark:border-gray-700 mt-10 pt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        &copy; {new Date().getFullYear()} {text}. All rights reserved.
      </div>
    </footer>
  );
}
