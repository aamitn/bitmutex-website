"use client";
import { memo } from "react";
import Marquee from "react-fast-marquee";
import { motion } from "framer-motion";
import { Heading } from "../../../elements/heading";
import { Subheading } from "../../../elements/subheading";
import { TestimonialsProps } from "@/types";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { SparklesCore } from "./sparkles";
import Image from "next/image";

const baseUrl = process.env.NEXT_PUBLIC_STRAPI_BASE_URL || "http://localhost:1337";

function StarRating() {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="w-3 h-3 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial, theme }: { testimonial: any; theme: string | undefined }) {
  const isDark = theme === "dark";

  return (
    <motion.div
      className="mx-3 shrink-0 w-72 sm:w-80 h-full"
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div
        className={cn(
          "relative rounded-2xl overflow-hidden h-full",
          isDark
            ? "p-px bg-gradient-to-br from-white/20 via-white/5 to-white/10"
            : "p-[1.5px] bg-gradient-to-br from-blue-400 via-blue-200 to-orange-300 shadow-[0_8px_32px_-4px_rgba(59,130,246,0.25),0_2px_8px_-2px_rgba(0,0,0,0.08)]"
        )}
      >
        {/* Card inner */}
        <div
          className={cn(
            "relative rounded-[13px] p-5 flex flex-col gap-4 h-full",
            isDark
              ? "bg-[#0d0d12]"
              : "bg-white shadow-[inset_0_1px_0_rgba(255,255,255,1)]"
          )}
        >
          {/* Ambient glow blob */}
          <div
            className={cn(
              "absolute -top-8 -right-8 w-32 h-32 rounded-full blur-2xl opacity-30 pointer-events-none",
              isDark ? "bg-blue-500" : "bg-blue-300"
            )}
          />
          <div
            className={cn(
              "absolute -bottom-6 -left-6 w-24 h-24 rounded-full blur-2xl opacity-20 pointer-events-none",
              isDark ? "bg-orange-500" : "bg-orange-300"
            )}
          />

          {/* Top row: stars + quote mark */}
          <div className="flex items-center justify-between relative z-10">
            <StarRating />
            <svg
              className={cn("w-8 h-8 opacity-15", isDark ? "text-white" : "text-gray-400")}
              fill="currentColor"
              viewBox="0 0 32 32"
            >
              <path d="M10 8C6.7 8 4 10.7 4 14v10h10V14H7c0-1.7 1.3-3 3-3V8zm14 0c-3.3 0-6 2.7-6 6v10h10V14h-7c0-1.7 1.3-3 3-3V8z" />
            </svg>
          </div>

          {/* Testimonial text */}
          <p
            className={cn(
              "text-sm leading-relaxed font-light tracking-wide relative z-10",
              isDark ? "text-white/60" : "text-gray-500"
            )}
          >
            {testimonial.text}
          </p>

          {/* Divider */}
          <div
            className={cn(
              "h-px w-full relative z-10",
              isDark
                ? "bg-gradient-to-r from-transparent via-white/10 to-transparent"
                : "bg-gradient-to-r from-transparent via-gray-200 to-transparent"
            )}
          />

          {/* Profile */}
          <div className="flex items-center gap-3 relative z-10">
            {testimonial.image?.url ? (
              <div className="relative shrink-0">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-orange-500 blur-[2px] scale-110 opacity-60" />
                <Image
                  src={`${baseUrl}${testimonial.image.url}`}
                  alt={testimonial.firstname}
                  width={40}
                  height={40}
                  className="relative rounded-full object-cover ring-2 ring-white/20"
                />
              </div>
            ) : (
              /* Fallback avatar with initials */
              <div className="relative shrink-0">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-orange-500 blur-[2px] scale-110 opacity-60" />
                <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-orange-500 flex items-center justify-center ring-2 ring-white/20">
                  <span className="text-xs font-semibold text-white">
                    {testimonial.firstname?.[0]}{testimonial.lastname?.[0]}
                  </span>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-0.5 min-w-0">
              <p
                className={cn(
                  "text-sm font-medium leading-tight truncate",
                  isDark ? "text-white/90" : "text-gray-900"
                )}
              >
                {testimonial.firstname} {testimonial.lastname}
              </p>

              <span
                className={cn(
                  "text-xs font-medium tracking-wide uppercase truncate",
                  isDark ? "text-white/70" : "text-gray-700"
                )}
              >
                {testimonial.job}
              </span>
            </div>

            {/* Verified badge */}
            <div className="ml-auto shrink-0">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Testimonials(data: Readonly<TestimonialsProps>) {
  if (!data) return null;

  const { heading, sub_heading, testimonials } = data;
  const { theme } = useTheme();

  return (
    <div className="relative py-20 overflow-hidden">
      {/* Background sparkles */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <MemoizedSparklesCore
          id="background-sparkles"
          background="transparent"
          minSize={0.6}
          maxSize={1.2}
          particleDensity={120}
          className="w-full h-full"
          particleColor={theme === "dark" ? "#FFFFFF" : "#000000"}
        />
      </div>

      {/* Subtle gradient wash */}
      <div className="absolute inset-0 -z-10 pointer-events-none bg-gradient-to-b from-transparent via-blue-500/[0.03] to-transparent" />

      {/* Header */}
      <motion.div
        className="text-center mb-12 relative z-10 px-4"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Heading className="text-3xl sm:text-4xl font-bold text-primary">
          {heading}
        </Heading>
        <Subheading className="text-sm sm:text-base font-light text-muted-foreground/70 mt-2">
          {sub_heading}
        </Subheading>
      </motion.div>

      {testimonials && Array.isArray(testimonials) ? (
        <div className="relative">
          {/* Left fade */}
          <div className="pointer-events-none absolute left-0 top-0 h-full w-24 z-10 bg-gradient-to-r from-background to-transparent" />
          {/* Right fade */}
          <div className="pointer-events-none absolute right-0 top-0 h-full w-24 z-10 bg-gradient-to-l from-background to-transparent" />

          <Marquee gradient={false} speed={50} pauseOnHover className="items-stretch">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="flex self-stretch">
                <TestimonialCard
                  testimonial={testimonial}
                  theme={theme}
                />
              </div>
            ))}
          </Marquee>
        </div>
      ) : (
        <p className="text-center text-muted-foreground/60 font-light">
          No testimonials available
        </p>
      )}
    </div>
  );
}

const MemoizedSparklesCore = memo(SparklesCore);