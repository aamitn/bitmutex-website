"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

export default function ReadingProgress() {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const updateScrollProgress = () => {
      const scrollTop = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", updateScrollProgress);
    return () => window.removeEventListener("scroll", updateScrollProgress);
  }, []);

  // Prevent hydration mismatch by ensuring the component only renders after mounting
  if (!mounted) return null;

  const currentTheme = theme || resolvedTheme;
  const strokeColor = currentTheme === "dark" ? "#FACC15" : "#FF9900"; // Yellow for dark mode, orange for light mode
  const bgStrokeColor = currentTheme === "dark" ? "#4B5563" : "#E5E7EB"; // Dark gray for dark mode, light gray for light mode
  const bgOpacity = currentTheme === "dark" ? "bg-white/30" : "bg-black/40"; // Adjusted opacity for better readability

  return (
    <>
      {/* ✅ Mobile View (Bottom-Left) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`fixed bottom-5 left-5 z-50 flex sm:hidden ${bgOpacity} rounded-full p-1 backdrop-blur-md`}
      >
        <ProgressCircle scrollProgress={scrollProgress} strokeColor={strokeColor} bgStrokeColor={bgStrokeColor} mobile />
      </motion.div>

      {/* ✅ Desktop View (Top-Right) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`fixed top-16 right-5 sm:right-10 z-50 hidden sm:flex ${bgOpacity} rounded-full p-2 backdrop-blur-md`}
      >
        <ProgressCircle scrollProgress={scrollProgress} strokeColor={strokeColor} bgStrokeColor={bgStrokeColor} />
      </motion.div>
    </>
  );
}

// ✅ TypeScript Props
interface ProgressCircleProps {
  scrollProgress: number;
  strokeColor: string;
  bgStrokeColor: string;
  mobile?: boolean;
}

// 🎯 Reusable Circular Progress Component
const ProgressCircle: React.FC<ProgressCircleProps> = ({ scrollProgress, strokeColor, bgStrokeColor, mobile }) => {
  return (
    <div className={`relative ${mobile ? "w-10 h-10" : "w-12 h-12 sm:w-14 sm:h-14"}`}>
      {/* Circular Progress Bar */}
      <svg className="absolute w-full h-full" viewBox="0 0 100 100">
        {/* Background Circle */}
        <circle cx="50" cy="50" r="45" stroke={bgStrokeColor} strokeWidth="6" fill="none" />
        {/* Progress Indicator with Smooth Animation */}
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          stroke={strokeColor}
          strokeWidth="6"
          fill="none"
          strokeDasharray="283"
          strokeDashoffset={283 - (scrollProgress / 100) * 283}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          initial={{ strokeDashoffset: 283 }}
          animate={{ strokeDashoffset: 283 - (scrollProgress / 100) * 283 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        />
      </svg>

      {/* Percentage Display */}
      <span className="absolute inset-0 flex items-center justify-center 
                      text-[10px] sm:text-[12px] font-semibold 
                      text-gray-100 dark:text-gray-900">
        {Math.round(scrollProgress)}%
      </span>
    </div>
  );
};
