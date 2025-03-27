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

    let timeout = setTimeout(() => {
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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-zinc-100 dark:bg-slate-900 text-white py-16 md:py-24">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.5, delay: 0.5 }} 
        className="absolute inset-0 will-change-opacity"
      >
        <ShootingStars />
      </motion.div>

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
                      bg-gradient-to-r from-blue-600 via-orange-500 to-blue-600 
                      dark:from-blue-600 dark:via-orange-500 dark:to-blue-400 
                      bg-clip-text text-transparent 
                      tracking-tight drop-shadow-lg pb-2"
          >   
             {words.slice(0, highlightIndex).join(" ")}{" "}
              <span className="relative inline-block min-w-[7.5ch] text-blue-600 dark:text-blue-300">
                <motion.span 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  transition={{ duration: 1 }} 
                  className="relative"
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

      <div className="absolute inset-x-0 bottom-0 h-80 w-full bg-gradient-to-t from-black to-transparent" />
    </div>
  )
}
