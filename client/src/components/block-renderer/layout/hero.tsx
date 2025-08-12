"use client";
import { motion, useTransform, useMotionValue } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import type { HeroProps } from "@/types";
import Link from "next/link";
import { ArrowRight,PhoneCall, CalendarCheck2, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import ParticleShape from "@/components/three/ParticleShape";
import { useEffect, useState } from "react";
import CalBookingModal from "@/components/custom/appointment";
import { NavLink } from "@/types";

const appointmentUrl = process.env.NEXT_PUBLIC_APPOINTMENT_URL || "https://cal.com/bitmutexs";

export function Hero(data: Readonly<HeroProps>) {
  if (!data) return null;
  const { heading, text, topLink, buttonLink, image } = data;
  
  // Mouse position tracking for 3D parallax
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Apply mouse position to the motion values (smooth the movement)
  useEffect(() => {
    mouseX.set(mousePos.x / window.innerWidth - 0.5);
    mouseY.set(mousePos.y / window.innerHeight - 0.5);
  }, [mousePos, mouseX, mouseY]);

const splitHeading = (headingText: string, startIndex: number, wordCount: number) => {
  const words = headingText.split(" ");
  if (startIndex < 0 || startIndex >= words.length) return headingText; // Edge case handling

  for (let i = startIndex; i < Math.min(startIndex + wordCount, words.length); i++) {
    words[i] = `<span class="font-bold bg-gradient-to-r from-blue-600  via-cyan-500 to-orange-500 text-transparent bg-clip-text animate-pulse-gradient">${words[i]}</span>`;
  }
  return words.join(" ");
};

  // 3D Parallax Effect calculation
  const parallaxX = useTransform(mouseX, [-0.5, 0.5], ["-10px", "10px"]);
  const parallaxY = useTransform(mouseY, [-0.5, 0.5], ["-5px", "5px"]);
  const parallaxZ = useTransform(mouseX, [-0.5, 0.5], ["5px", "-5px"]);

  return (
    <section className="relative container max-w-8xl mx-auto px-4 py-16 md:py-6 md:mt-24 mt-2">
      {/* Background gradient with parallax */}
      <motion.div
        className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50/80 via-transparent to-purple-50/60 dark:from-blue-950/40 dark:via-transparent dark:to-purple-950/30 blur-3xl opacity-60"
        style={{
          transform: `translate3d(${parallaxX.get()}, ${parallaxY.get()}, ${parallaxZ.get()})`,
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        
        {/* Left Content Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center lg:items-start gap-6 lg:gap-10 order-2 lg:order-1"
          style={{
            transform: `translate3d(${parallaxX.get()}, ${parallaxY.get()}, ${parallaxZ.get()})`,
          }}
        >
          {/* Top Links */}
          <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
            {Array.isArray(topLink) &&
              topLink.map((link: NavLink) => {
                const appointmentUrl = process.env.NEXT_PUBLIC_APPOINTMENT_URL || "https://cal.com/bitmutex";
                const parts = link.href.split(" ");
                const isAppointment = parts.length > 1 && parts[1].toLowerCase() === "appointment";
                const baseHref = parts[0];

                return (
                <div key={link.text}>
                  {isAppointment ? (
                    <CalBookingModal
                      url={appointmentUrl}
                      trigger={
                        // The parent div is now a 'group' and has enhanced styling
                        <div className="group flex cursor-pointer items-center justify-center gap-3 rounded-full border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm px-6 py-3 hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all duration-300 shadow-sm hover:shadow-lg dark:hover:shadow-lg">
                          <span className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                            {/* The icon now has a larger size and thicker stroke */}
                            <CalendarCheck2 size={20} strokeWidth={2.2} />
                            {link.text}
                            {/* The arrow is now larger and has a hover animation */}
                            <ArrowRight size={16} strokeWidth={2.2} className="group-hover:translate-x-1 transition-transform duration-200" />
                          </span>
                        </div>
                      }
                    />
                  ) : (
                    // The styling is mirrored for the regular link
                    <div className="group flex cursor-pointer items-center justify-center gap-3 rounded-full border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm px-6 py-3 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 shadow-sm hover:shadow-lg">
                      <Link
                        href={baseHref}
                        target={link.isExternal ? "_blank" : "_self"}
                        className="flex items-center justify-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        {/* The icon now has a larger size and thicker stroke */}
                        <Rocket size={20} strokeWidth={2.2} />
                        {link.text}
                        {/* The arrow is now larger and has a hover animation */}
                        <ArrowRight size={16} strokeWidth={2.2} className="group-hover:translate-x-1 transition-transform duration-200" />
                      </Link>
                    </div>
                  )}
                </div>

                );
              })}
          </div>

          {/* Heading */}
          <h1
            className="text-4xl leading-snug sm:text-5xl sm:leading-tight lg:text-6xl lg:leading-[1.16]
                      font-bold font-heading tracking-tight
                      text-center lg:text-left
                      text-gray-900 dark:text-gray-100 max-w-2xl"
            dangerouslySetInnerHTML={{ __html: splitHeading(heading, 2, 2) }}
          />

          {/* Description */}
          <p className="text-lg lg:text-xl font-normal text-gray-700 dark:text-gray-300 
            leading-relaxed text-center lg:text-left max-w-xl
            transition-colors duration-300">
            {text}
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            {buttonLink &&
              buttonLink.map((link) => {
                const parts = link.href.split(" ");
                const isAppointment = parts.length > 1 && parts[1].toLowerCase() === "appointment";
                const baseHref = parts[0];

                return isAppointment ? (
                  <CalBookingModal
                    key={link.text}
                    url={appointmentUrl}
                    trigger={
                      <Button
                        size="lg"
                        variant={link.isPrimary ? "default" : "outline"}
                        className={`group relative h-12 px-8 cursor-pointer overflow-hidden rounded-lg text-base font-semibold transition-all duration-300 ease-out ${
                          link.isPrimary
                            ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                            : "border-2 border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-800 dark:text-gray-200 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400"
                        }`}
                      >
                        <PhoneCall className="w-5 h-5 mr-2" />
                        <span className="relative z-10">{link.text}</span>
                      </Button>
                    }
                  />
                ) : (
                  <Button
                    key={link.text}
                    size="lg"
                    variant={link.isPrimary ? "default" : "outline"}
                    asChild
                    className={`relative h-12 px-8 cursor-pointer text-base font-semibold overflow-hidden 
                      transition-all duration-300 ease-out rounded-lg group
                      ${link.isPrimary 
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]" 
                      : "border-2 border-orange-300 dark:border-orange-600 text-gray-800 dark:text-gray-200 hover:border-orange-500 dark:hover:border-orange-400 hover:text-orange-600 dark:hover:text-orange-400 bg-orange-50/80 dark:bg-orange-900/20 backdrop-blur-sm"
                      }`}
                  >
                    <Link href={baseHref} target={link.isExternal ? "_blank" : "_self"}>
                      <span className="relative z-10">{link.text} {link.parentName}</span>
                    </Link>
                  </Button>
                );
              })}
          </div>
        </motion.div>

        {/* Right Visual Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative order-1 lg:order-2"
          style={{
            transform: `translate3d(${parallaxX.get()}, ${parallaxY.get()}, ${parallaxZ.get()})`,
          }}
        >
          <div className="relative h-[250px] md:h-[400px] lg:h-[500px]">
            {/* ParticleShape as Aesthetic Background - Full Coverage */}
            <div className="absolute inset-0 w-full h-full -z-10">
              <Canvas
                className="w-full h-full"
                camera={{ position: [0, 0, 15], fov: 40 }}
              >
                <ambientLight intensity={0.6} />
                <pointLight position={[10, 10, 10]} intensity={1.2} />
                <pointLight position={[-10, -10, 5]} intensity={0.5} color="#3b82f6" />
                <pointLight position={[0, 15, 5]} intensity={0.4} color="#8b5cf6" />
                <directionalLight position={[5, 5, 5]} intensity={0.4} />
                <ParticleShape />
              </Canvas>
            </div>


          </div>
        </motion.div>

      </div>
    </section>
  );
}