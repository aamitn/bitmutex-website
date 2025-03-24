"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/forms/container";
import { Heading } from "@/components/elements/heading";
import { Subheading } from "@/components/elements/subheading";
import * as LucideIcons from "lucide-react";
import { FC } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { motion, useAnimation } from "framer-motion";
import type { ServiceBlockProps } from "@/types";

// Helper function to convert kebab-case to PascalCase// ✅ Convert kebab-case to PascalCase for Lucide icons
const toPascalCase = (str: string): string =>
  str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");

// ✅ Get the correct Lucide icon
const getLucideIcon = (iconName: string): FC<any> => {
  const pascalCaseName = toPascalCase(iconName);

  // Check if the icon exists in the imported LucideIcons and return it
  const Icon = (LucideIcons as any)[pascalCaseName];

  // Fallback to a default icon if the requested icon does not exist
  if (!Icon) {
    return LucideIcons.AlertCircle; // Replace this with a valid fallback icon if needed
  }

  return Icon;
};

export function ServiceBlock(data: Readonly<ServiceBlockProps>) {
  if (!data) return null;
  const { heading, sub_heading, services } = data;

  // State to track scroll position for fade-in/out effects
  const controls = useAnimation();
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    controls.start({
      opacity: scrollY > 100 ? 1 : 0.2,
      scale: scrollY > 200 ? 1 : 0.95,
      transition: { duration: 0.5, ease: "easeOut" },
    });
  }, [scrollY, controls]);

  return (
    <Container className="flex flex-col items-center justify-between pb-20 mt-4 mb-4">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-20 py-10 md:pt-40 text-center mb-10"
      >
        <Heading as="h1" className="font-heading text-3xl font-semibold sm:text-4xl mb-2 text-slate-800 dark:text-slate-200">
          {heading}
        </Heading>
        <Subheading as="h2" className="text-lg text-muted-foreground max-w-2xl">
          {sub_heading}
        </Subheading>



      </motion.div>

{/* Services Grid with Scroll-based Fade & Scale Effects */}
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={controls}
  transition={{ duration: 1, ease: "easeOut" }}
  className="w-full max-w-7xl mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
>
  {services && services.length > 0 ? (
    services.map((service, index) => {
      const ServiceIcon = getLucideIcon(service.icon);

      // Dynamic sizing for Bento layout
      const isLarge = index % 6 === 0 || index % 7 === 0; // Create more variety
      const gridSpan = isLarge ? "lg:col-span-2 lg:row-span-2" : "lg:col-span-1";

      // Vibrant, balanced gradient backgrounds
      const bgGradients = [
        "bg-gradient-to-br from-indigo-500 via-blue-600 to-purple-700",
        "bg-gradient-to-br from-green-500 via-teal-600 to-blue-700",
        "bg-gradient-to-br from-pink-500 via-red-500 to-orange-500",
        "bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600",
      ];
      const bgGradient = bgGradients[index % bgGradients.length];

      return (
        <motion.div
          key={service.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5 }}
          className={`relative flex flex-col ${gridSpan} cursor-pointer transition-all duration-300`}
        >
          <Card className="h-full flex flex-col shadow-lg hover:shadow-2xl backdrop-blur-xl bg-opacity-90 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden transform hover:-translate-y-1 hover:scale-[1.02] transition">
            {/* Icon and Title */}
            <CardHeader className="relative flex items-center justify-center py-6">
              <div className={`${bgGradient} p-5 rounded-xl shadow-md`}>
                {ServiceIcon && <ServiceIcon className="h-14 w-14 text-white" />}
              </div>
            </CardHeader>

            <Separator className="opacity-30" />

            {/* Content */}
            <CardContent className="p-6 flex flex-col flex-grow justify-between">
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-2xl font-semibold font-heading text-gray-900 dark:text-white tracking-tight"
              >
                {service.name}
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-gray-600 font-sans dark:text-gray-400 mt-3 flex-grow text-sm md:text-base leading-relaxed line-clamp-3
                 flex-grow mt-3 transition-all duration-300 ease-in-out  hover:drop-shadow-md"
              >
                {service.description}
              </motion.p>

              {/* Learn More Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="mt-auto"
              >
                <Button
                  variant="outline"
                  className="mt-4 w-full border border-primary text-primary dark:text-white hover:bg-primary hover:text-white transition-all"
                >
                  <Link href={`/services/${service.slug}`}>Learn More →</Link>
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      );
    })
  ) : (
    <p className="text-gray-600 dark:text-gray-400 text-center col-span-full">
      No services available.
    </p>
  )}
</motion.div>
    </Container>
  );
}
