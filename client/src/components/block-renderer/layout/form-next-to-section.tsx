"use client";

import { useEffect, useState } from "react";
import ShootingStars from "@/components/decorations/shooting-star";
import { ContactForm } from "@/components/forms/contact-form";
import type { FormNextToSectionProps } from "@/types";
import Link from "next/link";
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandX,
  IconMapPin,
  IconPhone,
  IconMail,
  IconBrandWhatsapp,
} from "@tabler/icons-react";

export function FormNextToSection(data: Readonly<FormNextToSectionProps>) {
  const { heading, sub_heading, section } = data;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    setIsVisible(true);
  }, []);

  const socials = [
    {
      title: "twitter",
      href: "https://twitter.com/strapijs",
      icon: (
        <IconBrandX className="h-6 w-6 text-gray-600 dark:text-gray-300 transition-colors duration-300 hover:text-blue-500 dark:hover:text-blue-400" />
      ),
    },
    {
      title: "github",
      href: "https://github.com/strapi",
      icon: (
        <IconBrandGithub className="h-6 w-6 text-gray-600 dark:text-gray-300 transition-colors duration-300 hover:text-gray-900 dark:hover:text-white" />
      ),
    },
    {
      title: "linkedin",
      href: "https://linkedin.com/strapi",
      icon: (
        <IconBrandLinkedin className="h-6 w-6 text-gray-600 dark:text-gray-300 transition-colors duration-300 hover:text-blue-700 dark:hover:text-blue-400" />
      ),
    },
  ];

  return (
    <div className="w-full min-h-screen grid grid-cols-1 md:grid-cols-12 relative overflow-hidden bg-white dark:bg-gray-950">
      {/* Left Section: Contact Form */}
      <div className="md:col-span-7 flex relative z-20 items-center w-full justify-center px-4 py-16 lg:py-20 sm:px-10  pt-20 md:pt-5 lg:px-12 xl:px-16">
        <div className={`w-full max-w-lg transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="mb-10">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-slate-800 dark:text-slate-100 mb-2 text-center md:text-left">
            {heading}
          </h1>
          <div className="h-1 w-20 bg-orange-600 dark:bg-orange-500 rounded mb-6 mx-auto md:mx-0"></div>
            <p className="text-slate-600 dark:text-slate-300 text-lg max-w-md">
              {sub_heading}
            </p>
          </div>

          {/* Contact Form with subtle shadow */}
          <div className="w-full bg-white dark:bg-gray-900 rounded-xl shadow-xl dark:shadow-gray-800/30 p-6 transition-all duration-300 hover:shadow-2xl dark:hover:shadow-gray-800/50">
            <ContactForm />
          </div>

          {/* Social Icons with improved spacing and animations */}
          <div className="flex items-center justify-center space-x-8 mt-8">
            {socials.map((social) => (
              <Link 
                href={social.href} 
                target="_blank" 
                key={social.title} 
                className="hover:scale-110 transition-all duration-300 ease-in-out"
                aria-label={`Connect on ${social.title}`}
              >
                {social.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Right Section: Contact Info + Decorative Panel */}
      <div className="md:col-span-5 relative w-full flex border-l border-blue-900/20 dark:border-blue-700/20 overflow-hidden bg-gradient-to-br from-blue-900 via-blue-700 to-blue-800 dark:from-gray-900 dark:via-blue-950 dark:to-blue-900 items-center justify-center px-6 py-16 md:py-0">
        <div className="absolute inset-0 z-0 opacity-70">
          <ShootingStars />
        </div>

        {/* Subtle mesh gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent mix-blend-overlay"></div>

        {/* Content Container with Glass Effect */}
        <div className={`relative z-20 max-w-md w-full bg-white/10 dark:bg-gray-900/20 backdrop-blur-sm rounded-2xl p-8 border border-white/20 transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Section Heading & Subheading */}
          <div className="text-center mb-8">
            <h2 className="font-bold text-2xl text-white">{section.heading}</h2>
            <div className="h-1 w-16 bg-amber-500 mx-auto rounded my-4"></div>
            <p className="font-medium text-amber-400 mb-2">{section.sub_heading}</p>
          </div>

          {/* Contact Information with improved icons */}
          <div className="space-y-6 text-gray-100">
            <div className="flex items-start space-x-4">
              <div className="bg-white/20 p-3 rounded-full">
                <IconMapPin className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <p className="font-semibold text-lg text-white mb-1">Our Location</p>
                <p className="text-gray-200">11A Eastern Park, First Road, Kolkata</p>
                <Link 
                  href="https://maps.app.goo.gl/8JSMb8m5VJRqG8Xx5" 
                  target="_blank" 
                  className="text-amber-400 hover:text-amber-300 transition-colors inline-flex items-center mt-1 text-sm"
                >
                  View on Google Maps
                </Link>
              </div>
            </div>

            {/* Google Maps Embed with better formatting */}
            <div className="w-full mt-4 overflow-hidden rounded-lg border border-white/20 shadow-lg transform transition-transform duration-300 hover:scale-[1.02]">
              <iframe
                title="Google Maps"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3686.2084185023164!2d88.3911952!3d22.496362200000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0271a7fe48bfcf%3A0xb768d06fb061fa86!2sBitmutex%20Technologies!5e0!3m2!1sen!2sin!4v1743445144291!5m2!1sen!2sin"
                width="100%"
                height="180"
                allowFullScreen
                loading="lazy"
                className="rounded-lg"
              ></iframe>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-white/20 p-3 rounded-full">
                <IconPhone className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <p className="font-semibold text-lg text-white mb-1">Phone</p>
                <Link 
                  href="tel:+1234567890" 
                  className="text-gray-200 hover:text-amber-400 transition-colors"
                >
                  +91 9038556097
                </Link>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-white/20 p-3 rounded-full">
                <IconMail className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <p className="font-semibold text-lg text-white mb-1">Email</p>
                <Link 
                  href="mailto:support@bitmutex.com" 
                  className="text-gray-200 hover:text-amber-400 transition-colors"
                >
                  support@bitmutex.com
                </Link>
              </div>
            </div>
            
            {/* WhatsApp Chat Button with improved styling */}
            <div className="pt-2">
              <Link 
                href="https://wa.me/919038556097" 
                target="_blank" 
                className="inline-flex items-center justify-center w-full px-5 py-3 text-base font-medium text-white bg-green-600 rounded-lg shadow-lg hover:bg-green-700 transition-all duration-300 transform hover:-translate-y-1"
              >
                <IconBrandWhatsapp className="h-5 w-5 mr-2" /> Chat on WhatsApp
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
