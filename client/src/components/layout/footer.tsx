"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import StatusBadge from "@/components/custom/status-badge";
import { GitHubBadge } from "@/components/custom/github-badge";
import  ShapeDivider  from "@/components/custom/ShapeDivider";
import * as CookieConsent from "vanilla-cookieconsent";
import * as LucideIcons from "lucide-react";
import { ElementType } from "react";
import React from "react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import FooterBottom from "@/components/layout/FooterBottom";
import Trustpilot from '@/app/metrics/Trustpilot'

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


const unicode_diamond = "\ud83d\udca0";

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
    <footer className="relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white mt-14">
      {/* Shape Divider */}
      <ShapeDivider />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto grid grid-cols-1 sm:grid-cols-[1fr_2.5fr_1fr] gap-8 px-6 py-16 relative z-10"
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

        

            {/* ✅ GitHub Repository Badge */}
            <div className="flex justify-center sm:justify-start w-full">
              <GitHubBadge repoUrl={"https://github.com/aamitn/bitmutex-website"} />
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 dark:text-orange-500 text-slate-800">
            {Object.entries(groupedNavItems).map(([parent, items]) => (
              <div key={parent} className="space-y-2">
                <h4 className="text-lg font-semibold">{parent}</h4>
                <Separator className="w-12 bg-gray-500 dark:bg-gray-600" />
                <ul className="space-y-1">
                  {items.map((item) => (
                    <li key={item.text}>
                      <Link href={item.href} className="font-heading text-gray-600 hover:text-orange-500 dark:text-gray-400 dark:hover:text-orange-400 transition">
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
            <Button
              className="rounded-r-md text-white
                /* Normal State (dark blue gradient) */
                bg-gradient-to-r from-blue-900 to-blue-700
                hover:from-blue-800 hover:to-blue-600

                /* Dark Mode (orange gradient) */
                dark:bg-gradient-to-r dark:from-orange-600 dark:to-orange-400
                dark:hover:from-amber-500 dark:hover:to-amber-300"
            >
              Subscribe
            </Button>
            </div>
            <h4 className="text-lg font-semibold">Follow Us</h4>
            <Separator className="w-12 bg-gray-500 dark:bg-gray-600" />

            <div className="flex gap-4">
              {socialLinks?.map((link: SocialLink) => {
                const Icon = getLucideIcon(link.text);
                return (
                  <Link
                    key={link.text}
                    href={link.href}
                    target="_blank"
                    className="group relative flex items-center justify-center w-12 h-12 rounded-full
                      bg-white shadow-xl
                      dark:bg-gray-800 dark:shadow-inner dark:shadow-orange-500/20
                      transition-all duration-300 transform hover:scale-110"
                  >
                    <div className="flex items-center justify-center w-full h-full rounded-full
                      bg-gradient-to-br from-blue-800 to-blue-700 text-white
                      group-hover:from-blue-600 group-hover:to-blue-800
                      dark:from-orange-500 dark:to-orange-700 dark:text-white
                      dark:group-hover:from-orange-600 dark:group-hover:to-orange-800
                      transition-all duration-300">
                      {Icon ? (
                        React.createElement(Icon, {
                          className: "w-6 h-6"
                        })
                      ) : (
                        React.createElement(LucideIcons.AlertCircle, {
                          className: "w-6 h-6"
                        })
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>

          {/* Trustpilot Widget Below Social Media */}
          <div className="mt-6 mr-32 w-full flex justify-end">
            <Trustpilot showWidget={true} showIntent={false} />
          </div>
          

          </div>
        </motion.div>
      </motion.div>

          
    {/* Footer Bottom Section */}
     <FooterBottom text="Bitmutex Technologies Pvt. Ltd." />

    </footer>
  );
}
