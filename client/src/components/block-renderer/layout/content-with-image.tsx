"use client";

import React, { useEffect } from "react";
import type { ContentWithImageProps } from "@/types";
import { cn } from "@/lib/utils";
import { StrapiImage } from "@/components/custom/strapi-image";
import { motion, useAnimation, useInView } from "framer-motion";
import { useTheme } from "next-themes";

export function ContentWithImage(data: Readonly<ContentWithImageProps>) {
  if (!data) return null;
  const { reverse, image, heading, subHeading, text } = data;
  const reverseStyle = reverse ? "md:flex-row-reverse" : "md:flex-row";
  const { theme } = useTheme();

  const glowBackground = theme === "light"
  ? "radial-gradient(circle closest-side, rgba(255, 255, 255, 0.4) 50%, rgba(0, 0, 0, 0.1) 90%)"
  : "radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, rgba(0, 0, 0, 0) 60%)";


  // Animation controls and refs for scroll triggering
  const controls = useAnimation();
  const imageControls = useAnimation();
  const textRef = React.useRef(null);
  const imageRef = React.useRef(null);
  const isTextInView = useInView(textRef, { once: false, amount: 0.3 });
  const isImageInView = useInView(imageRef, { once: false, amount: 0.3 });

  // Define different animations based on `reverse`
  const imageVariants = reverse
    ? {
        hidden: { opacity: 0, rotate: 5, scale: 0.9 },
        visible: {
          opacity: 1,
          rotate: 0,
          scale: 1,
          transition: {
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1]
          }
        }
      }
    : {
        hidden: { opacity: 0, scale: 0.9, y: 30 },
        visible: {
          opacity: 1,
          scale: 1,
          y: 0,
          transition: {
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1]
          }
        }
      };

  const textContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const textItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  // Trigger animations when elements come into view
  useEffect(() => {
    if (isTextInView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, isTextInView]);

  useEffect(() => {
    if (isImageInView) {
      imageControls.start("visible");
    } else {
      imageControls.start("hidden");
    }
  }, [imageControls, isImageInView]);

  return (
    <section
      className={cn("container flex flex-col gap-10 py-24 md:items-center md:gap-24", reverseStyle)}
    >
      <div className="relative flex-1" ref={imageRef}>
        {/* Conditional Background Effect */}
        {reverse ? (
          // Radial Glow Background for Transparent Images
          <motion.div
            className="absolute -z-10 h-full w-full rounded-xl backdrop-blur-lg"
            style={{
              background: glowBackground,
              top: "10",
              left: "10"
            }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { duration: 0.6, delay: 0.3 } }
            }}
            initial="hidden"
            animate={imageControls}
          />
        ) : (
          // Standard Background Overlay when not reversed
          <motion.div 
            className="absolute -z-10 h-full w-full bg-primary/10 rounded-xl"
            style={{ top: "15", left: "15" }}
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.3 } }
            }}
            initial="hidden"
            animate={imageControls}
          />
        )}

        {/* Main image animation */}
        <motion.div
          variants={imageVariants}
          initial="hidden"
          animate={imageControls}
        >
          <StrapiImage
            src={image.url}
            alt={image.name}
            width={713}
            height={497.7}
            className="rounded-xl border border-border shadow-lg relative z-10"
          />
        </motion.div>
      </div>
      
      <motion.div 
        className="flex flex-1 flex-col items-start gap-5"
        ref={textRef}
        variants={textContainerVariants}
        initial="hidden"
        animate={controls}
      >
        <div className="flex flex-col gap-3">
          <motion.span 
            className="font-bold uppercase text-primary text-left"
            variants={textItemVariants}
          >
            {subHeading}
          </motion.span>
          <motion.h2 
            className="font-heading text-3xl font-semibold sm:text-4xl text-left"
            variants={textItemVariants}
          >
            {heading}
          </motion.h2>
        </div>
        <motion.p 
          className="text-lg text-muted-foreground max-w-lg text-left"
          variants={textItemVariants}
        >
          {text}
        </motion.p>
        <motion.div
          className="h-1 w-16 bg-primary mt-2"
          variants={{
            hidden: { width: 0 },
            visible: { 
              width: 64,
              transition: { duration: 0.8, delay: 0.5 }
            }
          }}
        />
      </motion.div>
    </section>
  );
}
