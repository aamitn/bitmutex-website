"use client"
import ShootingStars from "@/components/decorations/shooting-star";
import { Heading } from "../../elements/heading"
import { Subheading } from "../../elements/subheading"
import { motion } from "framer-motion"
import { useState, useEffect, useMemo } from "react"
import { RegisterForm } from "@/components/forms/register-form"
import type { RegformNextToSectionProps } from "@/types";

const useTypewriter = (words: string[], speed: number = 100, eraseSpeed: number = 50, delay: number = 1000) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const currentWord = words[currentWordIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (charIndex < currentWord.length) {
          setDisplayedText((prev) => currentWord.slice(0, prev.length + 1));
          setCharIndex((prev) => prev + 1);
        } else {
          setTimeout(() => setIsDeleting(true), delay);
        }
      } else {
        if (charIndex > 0) {
          setDisplayedText((prev) => currentWord.slice(0, prev.length - 1));
          setCharIndex((prev) => prev - 1);
        } else {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? eraseSpeed : speed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, words, currentWordIndex, speed, eraseSpeed, delay]);

  return displayedText;
};


//export const RegformNextToSection = ({heading, sub_heading,}: { heading: string sub_heading: string }) => {
export function RegformNextToSection(data: Readonly<RegformNextToSectionProps>) {
  const { heading, sub_heading } = data;

  const words = heading.split(" ")
  const highlightIndex = Math.max(0, words.length - 2)
  const highlightedText = words[highlightIndex]

  const typewriterWords = useMemo(() => [highlightedText, "Operations", "Marketing", "Growth", "IT Infra"], [highlightedText])
  const typewriterText = useTypewriter(typewriterWords)

  return (
  <div className="relative min-h-screen flex items-center justify-center overflow-hidden text-white dark:text-white py-16 md:py-24">   <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.5, delay: 0.5 }} 
        className="absolute inset-0 will-change-opacity"
      >
        <ShootingStars />
      </motion.div>

      {/* Light mode grain background */}
      <div className="absolute inset-0 -z-20 dark:hidden" style={{
        background: "radial-gradient(ellipse at 60% 30%, #c7d2fe 0%, #e0e7ff 40%, #f1f5f9 100%)"
      }} />

      {/* Dark mode grain background */}
      <div className="absolute inset-0 -z-20 hidden dark:block" style={{
        background: "radial-gradient(ellipse at 60% 30%, #2d1b69 0%, #0d0d1a 55%, #000000 100%)"
      }} />

      {/* Grain overlay — works on both */}
      <svg className="absolute inset-0 -z-10 w-full h-full opacity-[0.25] dark:opacity-[0.35] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feBlend in="SourceGraphic" mode="overlay" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>

      <div className="relative z-10 container mx-auto px-6 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.3 }} 
            className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6"
          >
          <Heading 
            as="h1" 
            className="text-7xl md:text-4xl lg:text-7xl font-heading font-semibold max-w-2xl
                      bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900
                      dark:from-white dark:via-slate-200 dark:to-slate-400
                      bg-clip-text text-transparent 
                      tracking-tight pb-2"
          >   
            {words.slice(0, highlightIndex).join(" ")}{" "}
              <span
                className="
                  relative inline-block min-w-[7.5ch] whitespace-nowrap
                  bg-gradient-to-r from-blue-700 to-indigo-600
                  dark:from-blue-400 dark:to-indigo-300
                  bg-clip-text text-transparent
                  [-webkit-background-clip:text]
                  [-webkit-text-fill-color:transparent]
                  will-change-transform
                  transform-gpu
                "
              >
              <motion.span 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ duration: 1 }} 
              >
                {typewriterText}
              </motion.span>
            </span>{" "}
            {words.slice(highlightIndex + 1).join(" ")}
          </Heading>
        <Subheading className="text-lg md:text-xl text-slate-700 dark:text-slate-300 max-w-lg">{sub_heading}</Subheading>

            
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.5, delay: 0.5 }} 
            className="w-full lg:justify-self-end"
          >
            <div className="w-full max-w-md mx-auto lg:mx-20 bg-white/5 backdrop-blur-3xl p-6 rounded-2xl shadow-lg border border-white/20 transform hover:scale-105 transition-transform duration-300">
              <RegisterForm />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-80 w-full bg-linear-to-t from-black to-transparent" />
    </div>
  )
}
