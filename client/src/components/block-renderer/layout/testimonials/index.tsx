"use client";
import { memo } from "react";
import Marquee from "react-fast-marquee";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Heading } from "../../../elements/heading";
import { Subheading } from "../../../elements/subheading";
import { TestimonialsProps } from "@/types";
import { cn } from "@/lib/utils";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
import { useTheme } from "next-themes"; // Light/Dark Mode Handling
import { SparklesCore } from "./sparkles";
import Image from "next/image";

const baseUrl = process.env.NEXT_PUBLIC_STRAPI_BASE_URL || "http://localhost:1337";

export function Testimonials(data: Readonly<TestimonialsProps>) {
    if (!data) return null;
    const { heading, sub_heading, testimonials } = data;
    const { theme } = useTheme(); // Get the current theme

    return (
        <div className="relative py-20 overflow-hidden">
            {/* Background Particles Animation */}
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

            {/* Header Section */}
            <div className="text-center mb-10 relative z-10">
                <Heading className="font-heading text-4xl font-bold text-primary">{heading}</Heading>
                <Subheading className="text-muted-foreground">{sub_heading}</Subheading>
            </div>

            {testimonials && Array.isArray(testimonials) ? (
                <Marquee gradient={false} speed={150}>
                    {testimonials.map((testimonial) => (
                        <motion.div
                            key={testimonial.id}
                            whileHover={{ scale: 1.07, rotate: "1deg" }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="mx-6"
                        >
                        <Card
                            className={cn(
                                "relative w-96 p-6 rounded-2xl shadow-xl transition-all border backdrop-blur-lg overflow-hidden mb-2",
                                theme === "dark"
                                    ? "bg-white/10 border-gray-800 text-white"
                                    : "bg-gray-50 border-gray-200 text-black"
                            )}
                            >
                                {/* Inner Glow Animation */}
                                <div className="absolute inset-0 opacity-20 pointer-events-none animate-pulse bg-gradient-to-br from-transparent via-primary/10 to-transparent"></div>

                                <CardContent className="flex flex-col gap-6 relative z-10 w-3xl">
                                    {/* Testimonial Text with Animated Quotes */}
                                    <p className="relative text-center font-heading [text-wrap:pretty] text-lg font-medium leading-relaxed">
                                        <FaQuoteLeft className="absolute -left-4 top-0 text-muted-foreground text-xl opacity-50" />
                                        <span className="px-6 ">{testimonial.text}</span>
                                        <FaQuoteRight className="absolute -right-4 bottom-0 text-muted-foreground text-xl opacity-50" />
                                    </p>

                                    {/* Profile Section */}
                                    <div className="flex items-center gap-4">
                                        {/* Testimonial Image with Glow */}
                                        {testimonial.image?.url && (
           
                                            <motion.div 
                                            whileHover={{ scale: 1.1, boxShadow: "0px 0px 15px rgba(255, 255, 255, 0.4)" }}
                                            className="inline-block"  // ensures proper layout for motion effects
                                            >
                                            <Image 
                                                src={`${baseUrl}${testimonial.image.url}`}
                                                alt={testimonial.firstname}
                                                width={64} // Equivalent to w-16 (16 * 4)
                                                height={64} // Equivalent to h-16
                                                className="rounded-full object-cover border-2 shadow-lg"
                                            />
                                            </motion.div>
                                        )}
                                        
                                        {/* Name & Job Title */}
                                        <div>
                                        <p className="text-xl font-semibold">
                                            {testimonial.firstname} {testimonial.lastname}
                                        </p>
                                        <span className="w-auto px-3 py-1 text-sm rounded-full font-semibold shadow-md transition-all 
                                            bg-gradient-to-r from-blue-600 to-orange-600 text-white
                                            dark:from-indigo-600 dark:to-orange-500 dark:text-gray-200 
                                            whitespace-nowrap overflow-hidden text-ellipsis">
                                            {testimonial.job}
                                        </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </Marquee>
            ) : (
                <p className="text-center text-muted-foreground">No testimonials available</p>
            )}
        </div>
    );
};

const MemoizedSparklesCore = memo(SparklesCore);
