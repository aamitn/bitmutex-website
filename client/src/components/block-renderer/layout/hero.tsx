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
  const splitHeading = (headingText: string) => {
    const words = headingText.split(" ");
    if (words.length >= 3) {
      // Wrap the third word in a span with Tailwind classes for highlight
      words[2] = `<span class="bg-gradient-to-br from-blue-500 via-indigo-500 to-amber-600 text-transparent bg-clip-text animate-glow-highlight">${words[2]}</span>`;
    }
    return words.join(" ");
  };

  // 3D Parallax Effect calculation
  const parallaxX = useTransform(mouseX, [-0.5, 0.5], ["-10px", "10px"]);
  const parallaxY = useTransform(mouseY, [-0.5, 0.5], ["-5px", "5px"]);
  const parallaxZ = useTransform(mouseX, [-0.5, 0.5], ["5px", "-5px"]);

  return (
    <section className="relative container flex flex-col items-center gap-10 pb-28 pt-20 sm:gap-14 md:flex-row">
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
        {topLink && (
          <div className="flex cursor-pointer items-center gap-1 rounded-full border bg-secondary px-3 py-0.5 hover:bg-secondary/60">
            <Link
              href={topLink.href}
              target={topLink.isExternal ? "_blank" : "_self"}
              className="flex items-center justify-center gap-1 text-sm text-secondary-foreground"
            >
              {topLink.text}
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
        <h1
          className="max-w-2xl text-4xl font-semibold sm:text-5xl"
          dangerouslySetInnerHTML={{
            __html: splitHeading(heading),
          }}
        />
        <p className="max-w-md text-lg text-muted-foreground">{text}</p>
        <div className="grid grid-cols-2 gap-3">
          {buttonLink &&
            buttonLink.map((link) => (
              <Button
                key={link.text}
                size="lg"
                variant={link.isPrimary ? "default" : "outline"}
                asChild
                className="h-12 cursor-pointer border-border text-base sm:h-14 sm:px-10"
              >
                <Link href={link.href} target={link.isExternal ? "_blank" : "_self"}>
                  {link.text}
                </Link>
              </Button>
            ))}
        </div>
      </motion.div>

      <motion.div
        style={{
          transform: `translate3d(${parallaxX.get()}, ${parallaxY.get()}, ${parallaxZ.get()})`,
        }}
        className="relative flex-1 flex flex-col gap-6 items-center justify-center md:justify-start"
      >
        {/* ParticleShape */}
        <Canvas
          className="absolute inset-0 w-full h-full"
          camera={{ position: [0, 8, 20], fov: 25 }}
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[5, 5, 5]} />
          <ParticleShape />
        </Canvas>

        {/* Image */}
        <div
          className="relative w-full md:w-3/4 lg:w-1/2 xl:w-2/3 rounded-xl shadow-lg border mt-2 border-gray-300 overflow-hidden"
          style={{
            transform: `translate3d(${parallaxX.get()}, ${parallaxY.get()}, ${parallaxZ.get()})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-40" />
          <StrapiImage
            src={image.url}
            alt="SaaS Dashboard"
            width={1000}
            height={698}
            priority
            className="rounded-xl shadow-lg border border-gray-300 object-cover"
          />
        </div>
      </motion.div>
    </section>
  );
}
