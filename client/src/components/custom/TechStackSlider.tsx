"use client";

import React, { useState } from "react";
import Image from "next/image";
import Marquee from "react-fast-marquee";

const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_BASE_URL || "http://localhost:1337";

interface TechStackSliderProps {
  logos: { url: string }[];
  width?: number;  // Optional width prop
  height?: number; // Optional height prop
}

export default function TechStackSlider({ logos, width = 60, height = 50 }: TechStackSliderProps) {
  const [speed] = useState(120); // Default scroll speed

  return (
    <div className="relative py-10 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Logo Marquee */}
      <div className="overflow-hidden px-4">
        <Marquee gradient={false} speed={speed} pauseOnHover={false} direction="left">
          {logos.map((logo, i) => (
            <div
              key={i}
              className="max-w-prose max-h-prose flex items-center justify-center mx-2
                         backdrop-blur-lg shadow-md rounded-lg
                         border border-gray-200 dark:border-gray-700 hover:scale-105 transition-transform"
            >
              <Image
                src={`${STRAPI_BASE_URL}${logo.url}`}
                alt={`Tech logo ${i}`}
                width={width}
                height={height}
                className="object-contain h-[50px]"
              />
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  );
}
