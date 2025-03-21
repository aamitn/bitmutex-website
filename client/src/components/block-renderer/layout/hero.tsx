"use client";
import { motion, useTransform, useMotionValue } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import type { HeroProps } from "@/types";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StrapiImage } from "@/components/custom/strapi-image";
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

  // Function to split the heading and highlight the third word with Tailwind classes
  const splitHeading = (headingText: string, startIndex: number, wordCount: number) => {
    const words = headingText.split(" ");
    
    if (startIndex < 0 || startIndex >= words.length) return headingText; // Edge case handling
  
    for (let i = startIndex; i < Math.min(startIndex + wordCount, words.length); i++) {
      words[i] = `<span class="bg-gradient-to-br from-blue-500 via-indigo-500 to-orange-600 text-transparent bg-clip-text animate-pulse-gradient">${words[i]}</span>`;
    }
  
    return words.join(" ");
  };
  
  
  

  // 3D Parallax Effect calculation
  const parallaxX = useTransform(mouseX, [-0.5, 0.5], ["-10px", "10px"]);
  const parallaxY = useTransform(mouseY, [-0.5, 0.5], ["-5px", "5px"]);
  const parallaxZ = useTransform(mouseX, [-0.5, 0.5], ["5px", "-5px"]);

  return (
    <section className="relative container max-w flex flex-col items-center gap-10 pb-28 pt-20 sm:gap-214 md:flex-row">
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
        className="max-w-2xl text-5xl sm:text-6xl lg:text-6xl font-light tracking-tight 
                  leading-[1.15] sm:leading-[1.2] lg:leading-[1.15] 
                  text-gray-900 dark:text-gray-100 
                  md:max-w-3xl"
        dangerouslySetInnerHTML={{  __html: splitHeading(heading, 2, 2), }}
      />


        <p className="max-w-md text-lg text-muted-foreground">{text}</p>

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
                      className="h-12 cursor-pointer border-border text-base sm:h-14 sm:px-10"
                    >
                      {link.text}
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
                  className="h-12 cursor-pointer border-border text-base sm:h-14 sm:px-10"
                >
                  <Link href={baseHref} target={link.isExternal ? "_blank" : "_self"}>
                    {link.text} {link.parentName}
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
          <StrapiImage
            src={image.url}
            alt="Bitmutex Dashboard"
            width={1200}
            height={850}
            priority
            className="rounded-xl  object-cover"
          />
        </div>
    </motion.div>

    </section>
  );
}
