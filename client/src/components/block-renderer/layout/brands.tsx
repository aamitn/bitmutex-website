"use client";

import Image from "next/image";
import Marquee from "react-fast-marquee";
import { Card, CardContent } from "@/components/ui/card";
import { Heading } from "../../elements/heading";
import { Subheading } from "../../elements/subheading";
import { BrandsProps } from "@/types";
import { strapiImage } from "@/lib/strapi/strapiImage";
import { useState } from "react";

export function Brands(data: Readonly<BrandsProps>) {
  const { heading, sub_heading, logos } = data;
  const [speed] = useState(180); // Default speed

  return (
    <div className="relative py-10 md:py-40 overflow-hidden bg-transparent">
      {/* Section Heading */}
      <Heading className="pt-4 text-slate-950 dark:text-gray-200 font-heading">{heading}</Heading>
      <Subheading className="max-w-3xl mx-auto text-cyan-950 dark:text-slate-300">{sub_heading}</Subheading>

      {/* Wrap Marquee in a div to handle hover events */}
      <div
        className="mt-10"
      >
        <Marquee
          gradient={true} // Enable smooth fade effect
          gradientColor={`#D3D3D3`} // Hex representation of cyan
          gradientWidth={70} // Smooth transition
          speed={speed} // Dynamic speed control
          pauseOnHover={false} // Stop scrolling when hovered
          direction="left" // Change to "right" if needed
          loop={0} // Infinite loop
        >
          {logos.map((logo, idx) => (
            <div key={idx} className="h-28 md:h-32 flex items-center justify-center mx-8">
              <Card className="border-none bg-transparent shadow-none">
                <CardContent className="p-2 flex items-center">

                <Image
                src={strapiImage(logo.image.url)}
                alt={logo.company}
                width={140}
                height={140}
                className=" object-scale-down filter grayscale contrast-25 dark:invert"
              />

                </CardContent>
              </Card>
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  );
}
