"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import Marquee from "react-fast-marquee";
import { useTheme } from "next-themes";

const baseUrl = process.env.NEXT_PUBLIC_STRAPI_BASE_URL || "http://localhost:1337";

function StarRating() {
  return (
    <div className="flex gap-0.5 mb-3">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="w-3 h-3 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export const TestimonialsMarquee = ({ testimonials }: { testimonials: any }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const levelOne = testimonials.slice(0, 8);
  const levelTwo = testimonials.slice(8, 16);

  const fadeClass = isDark
    ? "from-background"
    : "from-gray-50";

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Row 1 */}
      <div className="flex h-full relative items-stretch">
        <div className={cn("h-full absolute w-24 left-0 inset-y-0 z-30 bg-gradient-to-r to-transparent pointer-events-none", fadeClass)} />
        <div className={cn("h-full absolute w-24 right-0 inset-y-0 z-30 bg-gradient-to-l to-transparent pointer-events-none", fadeClass)} />
        <Marquee speed={40} pauseOnHover className="items-stretch">
          {levelOne.map((testimonial: any, index: any) => (
            <div key={`testimonial-${testimonial.id}-${index}`} className="flex self-stretch mx-3">
              <Card isDark={isDark}>
                <StarRating />
                <Quote className="font-heading">{testimonial?.text}</Quote>
                <ProfileRow testimonial={testimonial} isDark={isDark} />
              </Card>
            </div>
          ))}
        </Marquee>
      </div>

      {/* Row 2 — reversed */}
      <div className="flex h-full relative items-stretch">
        <div className={cn("h-full absolute w-24 left-0 inset-y-0 z-30 bg-gradient-to-r to-transparent pointer-events-none", fadeClass)} />
        <div className={cn("h-full absolute w-24 right-0 inset-y-0 z-30 bg-gradient-to-l to-transparent pointer-events-none", fadeClass)} />
        <Marquee direction="right" speed={30} pauseOnHover className="items-stretch">
          {levelTwo.map((testimonial: any, index: any) => (
            <div key={`testimonial-${testimonial.id}-${index}`} className="flex self-stretch mx-3">
              <Card isDark={isDark}>
                <StarRating />
                <Quote>{testimonial?.text}</Quote>
                <ProfileRow testimonial={testimonial} isDark={isDark} />
              </Card>
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  );
};

/* ── Card ─────────────────────────────────────────────── */
export const Card = ({
  className,
  children,
  isDark,
}: {
  className?: string;
  children: React.ReactNode;
  isDark?: boolean;
}) => {
  return (
    /* Gradient border wrapper */
    <div
      className={cn(
        "rounded-2xl overflow-hidden h-full flex",
        isDark
          ? "p-px bg-gradient-to-br from-white/20 via-white/5 to-white/10"
          : "p-[1.5px] bg-gradient-to-br from-blue-400 via-blue-200 to-orange-300 shadow-[0_8px_32px_-4px_rgba(59,130,246,0.25),0_2px_8px_-2px_rgba(0,0,0,0.08)]",
        className
      )}
    >
      {/* Inner card */}
      <div
        className={cn(
          "relative rounded-[13px] p-6 w-80 flex flex-col overflow-hidden",
          isDark
            ? "bg-[#0d0d12]"
            : "bg-white shadow-[inset_0_1px_0_rgba(255,255,255,1)]"
        )}
      >
        {/* Ambient blobs */}
        <div className={cn(
          "absolute -top-8 -right-8 w-32 h-32 rounded-full blur-2xl opacity-20 pointer-events-none",
          isDark ? "bg-blue-500" : "bg-blue-300"
        )} />
        <div className={cn(
          "absolute -bottom-6 -left-6 w-24 h-24 rounded-full blur-2xl opacity-15 pointer-events-none",
          isDark ? "bg-orange-500" : "bg-orange-200"
        )} />

        {/* Large faint quote mark */}
        <svg
          className={cn("absolute top-3 right-4 w-10 h-10 opacity-10 pointer-events-none", isDark ? "text-white" : "text-gray-400")}
          fill="currentColor" viewBox="0 0 32 32"
        >
          <path d="M10 8C6.7 8 4 10.7 4 14v10h10V14H7c0-1.7 1.3-3 3-3V8zm14 0c-3.3 0-6 2.7-6 6v10h10V14h-7c0-1.7 1.3-3 3-3V8z" />
        </svg>

        <div className="relative z-10 flex flex-col flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};

/* ── Quote ────────────────────────────────────────────── */
export const Quote = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <p className={cn(
      "text-sm font-light leading-relaxed tracking-wide flex-1",
      "text-white/60 dark:text-white/60 text-gray-500",
      className
    )}>
      {children}
    </p>
  );
};

/* ── Profile row ──────────────────────────────────────── */
function ProfileRow({ testimonial, isDark }: { testimonial: any; isDark: boolean }) {
  return (
    <>
      {/* Divider */}
      <div className={cn(
        "h-px w-full my-4",
        isDark
          ? "bg-gradient-to-r from-transparent via-white/10 to-transparent"
          : "bg-gradient-to-r from-transparent via-gray-200 to-transparent"
      )} />

      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-orange-500 blur-[2px] scale-110 opacity-50" />
          {testimonial.image?.url ? (
            <Image
              src={`${baseUrl}${testimonial.image.url}`}
              alt={`${testimonial.firstname} ${testimonial.lastname}`}
              width={36}
              height={36}
              className="relative rounded-full object-cover ring-2 ring-white/20"
            />
          ) : (
            <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-orange-500 flex items-center justify-center ring-2 ring-white/20">
              <span className="text-xs font-semibold text-white">
                {testimonial.firstname?.[0]}{testimonial.lastname?.[0]}
              </span>
            </div>
          )}
        </div>

        {/* Name + job */}
        <div className="flex flex-col gap-0.5 min-w-0">
          <QuoteDescription className={cn(
            "text-sm font-medium leading-tight truncate",
            isDark ? "text-white/85" : "text-gray-800"
          )}>
            {`${testimonial.firstname} ${testimonial.lastname}`}
          </QuoteDescription>
          <QuoteDescription className={cn(
            "text-[10px] font-light tracking-wider uppercase truncate",
            isDark ? "text-white/35" : "text-gray-400"
          )}>
            {testimonial.job}
          </QuoteDescription>
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
    </>
  );
}

/* ── QuoteDescription ─────────────────────────────────── */
export const QuoteDescription = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <p className={cn("text-sm font-normal text-neutral-400 max-w-sm", className)}>
      {children}
    </p>
  );
};