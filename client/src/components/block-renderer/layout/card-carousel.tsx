"use client"; 

import type { CardGridProps } from "@/types";
import * as LucideIcons from "lucide-react";
import Link from "next/link";
import {
  Carousel,
  CarouselPrevious,
  CarouselContent,
  CarouselItem,
  CarouselNext,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

const NEXT_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://localhost:3000";

// Get the correct Lucide icon dynamically
const getLucideIcon = (iconName: string) => {
  if (!iconName) return LucideIcons.AlertCircle; // Default fallback icon

  // Convert kebab-case to PascalCase (e.g., "layout-panel-left" → "LayoutPanelLeft")
  const pascalCaseName = iconName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");

  return (LucideIcons as any)[pascalCaseName] || LucideIcons.AlertCircle;
};

export function CardCarousel({ cardItems }: Readonly<CardGridProps>) {
  if (!cardItems?.length) return null;

  return (
    <section className="container flex flex-col items-center gap-8 py-24">
      <Carousel opts={{ loop: true, align: "start" }} className="mt-6 w-full px-4 xl:px-0">
        <CarouselPrevious className="absolute -left-6 size-8 xl:-left-12 xl:size-10 opacity-80 hover:opacity-100 transition-all" />
        <CarouselContent className="pb-4">
          {cardItems.map(({ id, heading, text, icon, link, isExternal }) => {
            const href = link ? (isExternal ? link : `${NEXT_BASE_URL}${link}`) : null;
            const IconComponent = getLucideIcon(icon);

            const CardContentWrapper = (
              <div className="h-full p-1 relative group">
                <Card className="glassmorphic-card h-full transition-transform duration-300 hover:scale-[1.02]">
                  <CardContent className="flex flex-col items-start gap-5 p-7 h-full">
                    <div className="inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-orange-500 p-3 shadow-md">
                      <IconComponent size={32} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="mb-2 text-lg font-bold font-heading  hover:drop-shadow-md text-foreground">{heading}</h4>
                      <p className="text-muted-foreground text-sm">{text}</p>
                    </div>
            
                    {/* Learn More Button - Appears on hover only if link exists */}
                    {href && (
                      <button
                        onClick={() => window.open(href, isExternal ? "_blank" : "_self")}
                        className="absolute bottom-4 right-4 bg-indigo-600 text-white px-3 py-1 text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        Go →
                      </button>
                    )}
                  </CardContent>
                </Card>
              </div>
            );
            
            return (
              <CarouselItem className="md:basis-1/2 lg:basis-1/3" key={id}>
                {href ? (
                  <Link href={href} target={isExternal ? "_blank" : "_self"} rel={isExternal ? "noopener noreferrer" : undefined}>
                    {CardContentWrapper}
                  </Link>
                ) : (
                  CardContentWrapper
                )}
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselNext className="absolute -right-6 size-8 xl:-right-12 xl:size-10 opacity-80 hover:opacity-100 transition-all" />
      </Carousel>
    </section>
  );
}
