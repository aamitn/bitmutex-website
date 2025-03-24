"use client";

import React, { useState, useEffect, ReactNode } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils"; // Utility for merging Tailwind classes

interface CalBookingModalProps {
  url: string;
  trigger: ReactNode; // Accepts any button or UI element
}

const CalBookingModal: React.FC<CalBookingModalProps> = ({ url, trigger }) => {
  const [iframeHeight, setIframeHeight] = useState("600px");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setIframeHeight("500px"); // Mobile
      } else if (window.innerWidth < 1024) {
        setIframeHeight("700px"); // Tablet
      } else {
        setIframeHeight("850px"); // Desktop
      }
    };

    handleResize(); // Set on initial render
    window.addEventListener("resize", handleResize); // Listen for screen size changes

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Dialog>
      {/* User-defined Button or Trigger */}
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      {/* Magic UI Modal with Framer Motion */}
      <DialogContent
        className={cn(
          "w-full max-w-5xl p-6 rounded-xl shadow-2xl overflow-hidden",
          "backdrop-blur-lg bg-white/20 border border-white/30",
          "transition-all duration-300 ease-in-out"
        )}
      >
        {/* Hidden Title for Accessibility */}
        <DialogTitle>
          Schedule an Appointment
        </DialogTitle>

        {/* Framer Motion Animated Iframe Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative overflow-hidden rounded-md"
        >
          <iframe
            src={url}
            className="w-full rounded-md transition-all duration-300"
            style={{ height: iframeHeight, border: "none" }}
            title="Cal.com Booking"
          />
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default CalBookingModal;
