"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { Canvas } from "@react-three/fiber";
import type { HeroProps, NavLink } from "@/types";
import Link from "next/link";
import {
  ArrowRight,
  PhoneCall,
  CalendarCheck2,
  Rocket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ParticleShape from "@/components/three/ParticleShape";
import { useEffect } from "react";
import CalBookingModal from "@/components/custom/appointment";

const appointmentUrl =
  process.env.NEXT_PUBLIC_APPOINTMENT_URL ||
  "https://cal.com/bitmutexs";

export function Hero(data: Readonly<HeroProps>) {
  if (!data) return null;

  const { heading, text, topLink, buttonLink } = data;

  /*
   |--------------------------------------------------------------------------
   | Mouse Motion Values
   |--------------------------------------------------------------------------
   */

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;

      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY]);

  /*
   |--------------------------------------------------------------------------
   | Parallax Layers
   |--------------------------------------------------------------------------
   */

  const bgX = useTransform(mouseX, [-0.5, 0.5], [-40, 40]);
  const bgY = useTransform(mouseY, [-0.5, 0.5], [-30, 30]);

  const contentX = useTransform(mouseX, [-0.5, 0.5], [-18, 18]);
  const contentY = useTransform(mouseY, [-0.5, 0.5], [-12, 12]);

  const visualX = useTransform(mouseX, [-0.5, 0.5], [25, -25]);
  const visualY = useTransform(mouseY, [-0.5, 0.5], [18, -18]);

  /*
   |--------------------------------------------------------------------------
   | Smooth Springs
   |--------------------------------------------------------------------------
   */

  const smoothBgX = useSpring(bgX, {
    stiffness: 90,
    damping: 30,
  });

  const smoothBgY = useSpring(bgY, {
    stiffness: 90,
    damping: 30,
  });


  const smoothVisualX = useSpring(visualX, {
    stiffness: 100,
    damping: 20,
  });

  const smoothVisualY = useSpring(visualY, {
    stiffness: 100,
    damping: 20,
  });

  /*
   |--------------------------------------------------------------------------
   | Highlight Heading Words
   |--------------------------------------------------------------------------
   */

  const splitHeading = (
    headingText: string,
    startIndex: number,
    wordCount: number
  ) => {
    const words = headingText.split(" ");

    if (startIndex < 0 || startIndex >= words.length)
      return headingText;

    for (
      let i = startIndex;
      i < Math.min(startIndex + wordCount, words.length);
      i++
    ) {
      words[
        i
      ] = `<span class="font-black bg-gradient-to-r from-blue-900 via-orange-500 via-40% to-blue-900 dark:from-sky-400 dark:via-orange-400 dark:to-sky-400 text-transparent bg-clip-text bg-[length:200%_auto] animate-pulse-gradient drop-shadow-[0_0_25px_theme(colors.orange.500/70%)] dark:drop-shadow-[0_2px_30px_theme(colors.sky.400/60%)]">${words[i]}</span>`;
    }

    return words.join(" ");
  };

  const glassClasses =
    "group flex cursor-pointer items-center justify-center gap-3 rounded-full border border-gray-200/60 dark:border-gray-700/60 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md px-6 py-3 hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all duration-300 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.15)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.5)]";

  return (
    <section className="grain-hero relative flex min-h-[70vh] w-full max-w-[100vw] items-center justify-center overflow-hidden px-4 py-16 md:py-24">
      
      {/* Background Glow */}
      <motion.div
        className="absolute inset-0 -z-10 opacity-90 blur-3xl
        [background:radial-gradient(ellipse_at_15%_60%,theme(colors.blue.300)_0%,transparent_45%),radial-gradient(ellipse_at_85%_15%,theme(colors.violet.300)_0%,transparent_40%),radial-gradient(ellipse_at_55%_85%,theme(colors.red.200)_0%,transparent_35%)]
        dark:[background:radial-gradient(ellipse_at_15%_60%,theme(colors.blue.600)_0%,transparent_45%),radial-gradient(ellipse_at_85%_15%,theme(colors.violet.600)_0%,transparent_40%),radial-gradient(ellipse_at_55%_85%,theme(colors.indigo.600)_0%,transparent_35%)]"
      />

      <div className="mx-auto grid max-w-8xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        
        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
          className="order-2 flex flex-col items-center gap-6 lg:order-1 lg:items-start lg:gap-10"
          style={{
           // x: smoothContentX,
           // y: smoothContentY,
          }}
        >
          {/* Top Links */}
          <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
            {Array.isArray(topLink) &&
              topLink.map((link: NavLink) => {
                const parts = link.href.split(" ");

                const isAppointment =
                  parts.length > 1 &&
                  parts[1].toLowerCase() === "appointment";

                const baseHref = parts[0];

                return (
                  <div key={link.text}>
                    {isAppointment ? (
                      <CalBookingModal
                        url={appointmentUrl}
                        trigger={
                          <div className={glassClasses}>
                            <span className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                              <CalendarCheck2
                                size={20}
                                strokeWidth={2.2}
                              />

                              {link.text}

                              <ArrowRight
                                size={16}
                                strokeWidth={2.2}
                                className="transition-transform duration-200 group-hover:translate-x-1"
                              />
                            </span>
                          </div>
                        }
                      />
                    ) : (
                      <div className={glassClasses}>
                        <Link
                          href={baseHref}
                          target={
                            link.isExternal ? "_blank" : "_self"
                          }
                          className="flex items-center justify-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          <Rocket
                            size={20}
                            strokeWidth={2.2}
                          />

                          {link.text}

                          <ArrowRight
                            size={16}
                            strokeWidth={2.2}
                            className="transition-transform duration-200 group-hover:translate-x-1"
                          />
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>

          {/* Heading */}
          <h1
            className="max-w-2xl text-center font-heading text-4xl font-bold leading-snug tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl sm:leading-tight lg:text-left lg:text-6xl lg:leading-[1.16]"
            dangerouslySetInnerHTML={{
              __html: splitHeading(heading, 2, 2),
            }}
          />

          {/* Description */}
          <p className="max-w-xl text-center font-sans text-lg leading-relaxed text-gray-700 transition-colors duration-300 dark:text-gray-300 lg:text-left lg:text-xl">
            {text}
          </p>

          {/* CTA Buttons */}
          <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
            {buttonLink &&
              buttonLink.map((link) => {
                const parts = link.href.split(" ");

                const isAppointment =
                  parts.length > 1 &&
                  parts[1].toLowerCase() === "appointment";

                const baseHref = parts[0];

                return isAppointment ? (
                  <CalBookingModal
                    key={link.text}
                    url={appointmentUrl}
                    trigger={
                      <Button
                        size="lg"
                        variant={
                          link.isPrimary
                            ? "default"
                            : "outline"
                        }
                        className={`group relative h-12 overflow-hidden rounded-lg px-8 text-base font-semibold transition-all duration-300 ease-out ${
                          link.isPrimary
                            ? "bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:scale-[1.02] hover:from-blue-700 hover:to-blue-800 hover:shadow-xl active:scale-[0.98]"
                            : "border-2 border-gray-200 bg-white/80 text-gray-800 backdrop-blur-sm hover:border-blue-500 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-800/80 dark:text-gray-200 dark:hover:border-blue-400 dark:hover:text-blue-400"
                        }`}
                      >
                        <PhoneCall className="mr-2 h-5 w-5" />

                        <span className="relative z-10">
                          {link.text}
                        </span>
                      </Button>
                    }
                  />
                ) : (
                  <Button
                    key={link.text}
                    size="lg"
                    variant={
                      link.isPrimary
                        ? "default"
                        : "outline"
                    }
                    asChild
                    className={`group relative h-12 overflow-hidden rounded-lg px-8 text-base font-semibold transition-all duration-300 ease-out ${
                      link.isPrimary
                        ? "bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:scale-[1.02] hover:from-blue-700 hover:to-blue-800 hover:shadow-xl active:scale-[0.98]"
                        : "border-2 border-orange-300 bg-orange-50/80 text-gray-800 backdrop-blur-sm hover:border-orange-500 hover:text-orange-600 dark:border-orange-600 dark:bg-orange-900/20 dark:text-gray-200 dark:hover:border-orange-400 dark:hover:text-orange-400"
                    }`}
                  >
                    <Link
                      href={baseHref}
                      target={
                        link.isExternal ? "_blank" : "_self"
                      }
                    >
                      <span className="relative z-10">
                        {link.text} {link.parentName}
                      </span>
                    </Link>
                  </Button>
                );
              })}
          </div>
        </motion.div>

        {/* RIGHT VISUAL */}
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.9,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 1,
            ease: "easeOut",
          }}
          className="relative order-1 lg:order-2"
          style={{
            x: smoothVisualX,
            y: smoothVisualY,
          }}
        >
          <div className="relative h-[260px] md:h-[420px] lg:h-[520px] rounded-2xl">
            
            {/* Glow Orb */}
            <div className="absolute inset-0 -z-20 rounded-full bg-blue-500/10 blur-3xl" />

            {/* Canvas */}
            <div className="absolute inset-0 h-full w-full -z-10">
              <Canvas
                dpr={[1, 1.5]}
                className="h-full w-full"
                camera={{
                  position: [0, 0, 15],
                  fov: 40,
                }}
              >
                <ambientLight intensity={0.6} />

                <pointLight
                  position={[10, 10, 10]}
                  intensity={1.2}
                />

                <pointLight
                  position={[-10, -10, 5]}
                  intensity={0.5}
                  color="#3b82f6"
                />

                <pointLight
                  position={[0, 15, 5]}
                  intensity={0.4}
                  color="#8b5cf6"
                />

                <directionalLight
                  position={[5, 5, 5]}
                  intensity={0.4}
                />

                <ParticleShape />
              </Canvas>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}