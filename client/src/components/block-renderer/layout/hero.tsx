"use client";
import { motion, useTransform, useMotionValue } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import type { HeroProps } from "@/types";
import Link from "next/link";
import { ArrowRight,PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { strapiImage } from "@/lib/strapi/strapiImage";
import ParticleShape from "@/components/three/ParticleShape";
import { useEffect, useState } from "react";
import CalBookingModal from "@/components/custom/appointment";
import { NavLink } from "@/types";
import Image from "next/image";

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

  // Function to split the heading and highlight the third word with Tailwind classes
  const splitHeading = (headingText: string, startIndex: number, wordCount: number) => {
    const words = headingText.split(" ");

    if (startIndex < 0 || startIndex >= words.length) return headingText; // Edge case handling

    for (let i = startIndex; i < Math.min(startIndex + wordCount, words.length); i++) {
      words[i] = `<span class="font-bold bg-gradient-to-br from-blue-500 via-indigo-500 to-orange-600 text-transparent bg-clip-text animate-pulse-gradient">${words[i]}</span>`;
    }

    return words.join(" ");
  };




  // 3D Parallax Effect calculation
  const parallaxX = useTransform(mouseX, [-0.5, 0.5], ["-10px", "10px"]);
  const parallaxY = useTransform(mouseY, [-0.5, 0.5], ["-5px", "5px"]);
  const parallaxZ = useTransform(mouseX, [-0.5, 0.5], ["5px", "-5px"]);

  return (
    <section className="relative container max-w flex flex-col items-center gap-20 pb-18 pt-20 sm:gap-214 md:flex-row">
      <motion.div
        className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/40 to-secondary/40 blur-3xl opacity-20 transition-all duration-500"
        animate={{ opacity: 0.6 }}
        style={{
          transform: `translate3d(${parallaxX.get()}, ${parallaxY.get()}, ${parallaxZ.get()})`,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-1 flex-col items-center gap-8 md:items-start md:gap-10"
        style={{
          transform: `translate3d(${parallaxX.get()}, ${parallaxY.get()}, ${parallaxZ.get()})`,
        }}
      >
        <div className="flex flex-wrap gap-3">
          {Array.isArray(topLink) &&
            topLink.map((link: NavLink) => {
              // Get the booking URL from environment variable
              const appointmentUrl = process.env.NEXT_PUBLIC_APPOINTMENT_URL || "https://cal.com/bitmutex";

              // Check if the href contains "appointment" after a space
              const parts = link.href.split(" ");
              const isAppointment = parts.length > 1 && parts[1].toLowerCase() === "appointment";
              const baseHref = parts[0]; // Extract the actual URL

              return (
                <div key={link.text} className="flex flex-col sm:flex-row gap-3">
                  {isAppointment ? (
                    // Wrap inside CalBookingModal if it's an appointment link
                    <CalBookingModal
                      url={appointmentUrl}
                      trigger={
                        <div className="flex w-full sm:w-auto cursor-pointer items-center gap-1 rounded-full border bg-secondary px-3 py-0.5 hover:bg-secondary/60">
                          <span className="flex items-center justify-center gap-1 text-sm text-secondary-foreground">
                            {link.text}
                            <ArrowRight size={16} />
                          </span>
                        </div>
                      }
                    />
                  ) : (
                    // Render normal link if not an appointment
                    <div className="flex w-full sm:w-auto cursor-pointer items-center gap-1 rounded-full border bg-secondary px-3 py-0.5 hover:bg-secondary/60">
                      <Link
                        href={baseHref}
                        target={link.isExternal ? "_blank" : "_self"}
                        className="flex items-center justify-center gap-1 text-sm text-secondary-foreground"
                      >
                        {link.text}
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}

        </div>


        <h1
          className="max-w-2xl text-5xl sm:text-6xl lg:text-6xl font-light font-heading backdrop:font-heading tracking-tight 
                  leading-[1.15] sm:leading-[1.2] lg:leading-[1.15] 
                  text-gray-900 dark:text-gray-100 
                  md:max-w-3xl md:text-left text-center"
          dangerouslySetInnerHTML={{ __html: splitHeading(heading, 2, 2), }}   // Specify NUmber of Words to Animate 
        />


        <p className="pt-4 max-w-lg text-lg md:text-2xl font-light text-gray-800 dark:text-zinc-300 
          font-heading tracking-tight leading-relaxed md:text-justify text-justify  text-muted-foreground 
          transition-all duration-300 ease-in-out 
        hover:text-gray-900 dark:hover:text-gray-100">
          {text}
        </p>


        <div className="grid grid-cols-2 gap-3">
          {buttonLink &&
            buttonLink.map((link) => {
              // Check if the href contains "appointment" at the end
              const parts = link.href.split(" ");
              const isAppointment = parts.length > 1 && parts[1].toLowerCase() === "appointment";
              const baseHref = parts[0]; // Extract the first part as the actual URL

              return isAppointment ? (
                // Wrap inside CalBookingModal if it's an appointment link
                <CalBookingModal
                  key={link.text}
                  url={appointmentUrl}
                  trigger={
                  <Button
                    size="lg"
                    variant={link.isPrimary ? "default" : "outline"}
                    className={`relative h-12 sm:h-14 sm:px-10 cursor-pointer text-base font-semibold flex items-center gap-3 
                      transition-all duration-300 ease-out transform rounded-xl overflow-hidden
                      ${link.isPrimary 
                        ? "border-orange-500 dark:border-orange-400 bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-600 dark:to-indigo-600 text-white shadow-[0px_4px_20px_rgba(59,130,246,0.4)] hover:shadow-[0px_6px_30px_rgba(59,130,246,0.6)] hover:scale-[1.05] active:scale-95" 
                        : "border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-300 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 bg-white/10 dark:bg-gray-900/10 backdrop-blur-lg"}`}
                  >
                    {/* Lucide Icon */}
                    <PhoneCall className="w-5 h-5 text-white dark:text-gray-300 transition-all duration-300" />

                    <span className="relative z-10">{link.text}</span>

                    {/* Soft Glow Pulse Effect */}
                    {link.isPrimary && (
                      <span className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-all duration-500 
                        bg-blue-500/30 blur-xl rounded-xl" 
                      />
                    )}
                  </Button>
                  }
                />
              ) : (
                // Render normal button if not an appointment link
                <Button
                  key={link.text}
                  size="lg"
                  variant={link.isPrimary ? "default" : "outline"}
                  asChild
                  className={`relative h-12 sm:h-14 sm:px-10 cursor-pointer text-base font-medium overflow-hidden 
                    transition-all duration-300 ease-out transform rounded-xl group
                    ${link.isPrimary 
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-[0px_4px_20px_rgba(59,130,246,0.4)] hover:shadow-[0px_6px_30px_rgba(59,130,246,0.6)]" 
                    : "border border-orange-500 dark:border-orange-400 text-gray-800 dark:text-gray-300 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400   bg-orange-300/10 dark:bg-orange-900/20 backdrop-blur-lg"
                    }`}
                   >
                  <Link href={baseHref} target={link.isExternal ? "_blank" : "_self"}>
                    <span className="relative z-10">{link.text} {link.parentName}</span>
                    
                    {/* Subtle Background Animation (Glassmorphism Effect) */}
                    {!link.isPrimary && (
                      <span className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-all duration-300 
                        bg-gradient-to-r from-blue-500/10 to-blue-500/20 dark:from-blue-500/20 dark:to-blue-500/30 
                        rounded-xl blur-md" 
                      />
                    )}
                  </Link>
                </Button>
              );
            })}
        </div>
        
      </motion.div>

      <motion.div
        className="mb-4 relative flex-1 flex flex-col gap-6 items-center justify-center md:justify-start w-full max-w-screen-xl"
      >
        {/* ParticleShape */}
        <Canvas
          style={{
            transform: `translate3d(${parallaxX.get()}, ${parallaxY.get()}, ${parallaxZ.get()})`,
          }}
          className="mb-4 absolute inset-0 w-full h-full"
          camera={{ position: [0, 8, 20], fov: 25 }}
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[5, 5, 5]} />
          <ParticleShape />
        </Canvas>

        {/* Image */}
        <div
          className="relative w-full md:w-4/5 lg:w-3/4 xl:w-4/5 2xl:w-4/5 rounded-xl  overflow-hidden"
          style={{
            transform: `scale(1.1)`,
          }}
        >
          <div className="absolute inset-0" />
          <Image
          src={strapiImage(image.url)}
          alt="Bitmutex Dashboard"
          width={1200}
          height={850}
          priority
          className="rounded-xl object-cover"
        />
        </div>
      </motion.div>

    </section>
  );
}
