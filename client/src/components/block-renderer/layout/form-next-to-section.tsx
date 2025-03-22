"use client";

import ShootingStars from "@/components/decorations/shooting-star";
import { ContactForm } from "@/components/forms/contact-form";
import type { FormNextToSectionProps } from "@/types";
import Link from "next/link";
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandX,
} from "@tabler/icons-react";

export function FormNextToSection(data: Readonly<FormNextToSectionProps>) {
  const { heading, sub_heading, section } = data;

  const socials = [
    {
      title: "twitter",
      href: "https://twitter.com/strapijs",
      icon: (
        <IconBrandX className="h-5 w-5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" />
      ),
    },
    {
      title: "github",
      href: "https://github.com/strapi",
      icon: (
        <IconBrandGithub className="h-5 w-5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" />
      ),
    },
    {
      title: "linkedin",
      href: "https://linkedin.com/strapi",
      icon: (
        <IconBrandLinkedin className="h-5 w-5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" />
      ),
    },
  ];
  

  return (
    <div className="w-full min-h-screen grid grid-cols-1 md:grid-cols-2 relative overflow-hidden">
      {/* Left Section: Contact Form */}
      <div className="flex relative z-20 items-center w-full justify-center px-4 py-4 lg:py-40 sm:px-6 lg:flex-none lg:px-20 xl:px-24 mt-10 sm:mt-0">
        <div className="mx-auto w-full max-w-md">
          <div>
            <h1 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-slate-800 dark:text-slate-200">
              {heading}
            </h1>
            <p className="mt-4 text-muted text-sm max-w-sm text-slate-600 dark:text-slate-400">{sub_heading}</p>
          </div>


        {/* Wrapper for full-width layout */}
        <div className="w-full flex flex-col items-center justify-center">
          
          {/* Full-width Contact Form */}
          <div className="w-full max-w-3xl">
            <ContactForm />
          </div>

          {/* Social Icons below the form with reduced vertical gap */}
          <div className="flex items-center justify-center space-x-6 mt-2">
            {socials.map((social) => (
              <Link href={social.href} target="_blank" key={social.title} className="hover:scale-110 transition-transform">
                {social.icon}
              </Link>
            ))}
          </div>
        </div>

        </div>
        
      </div>

      {/* Right Section: Contact Info + Decorative Panel */}
      <div className="relative w-full flex border-l border-charcoal overflow-hidden bg-gradient-to-r from-[#1e3a8a] via-[#2563eb] to-[#1e40af] dark:from-[#0f172a] dark:via-[#1e3a8a] dark:to-[#2563eb] items-center justify flex-col px-6 py-8 md:py-80">
        
        <div className="absolute inset-0 z-0">
          <ShootingStars />
        </div>

        {/* Section Heading & Subheading */}
        <div className="max-w-sm text-center">
          <p className="font-semibold text-xl text-gray-300 dark:text-gray-100">{section.heading}</p>
          <p className="font-normal text-base text-amber-500 mt-4 mb-4">{section.sub_heading}</p>
        </div>

        {/* Contact Information */}
        <div className="relative z-20 mb-8 text-center text-sm text-gray-300">
          <p className="font-semibold text-lg">\ud83d\udccd Our Location</p>
          <p>123 Business Street, Tech City, 560001</p>
          <p>
            <Link href="https://maps.google.com/?q=123 Business Street, Tech City, 560001" target="_blank" className="text-amber-500">
              View on Google Maps
            </Link>
          </p>

          {/* Google Maps Embed */}
          <div className="mt-4 w-full max-w-sm">
            <iframe
              title="Google Maps"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509366!2d144.95565161531664!3d-37.81732797975179!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d5df1f70d3b%3A0x1f37f8e6d8bfb3fd!2s123%20Business%20Street%2C%20Tech%20City%2C%20560001!5e0!3m2!1sen!2sus!4v1633012345678"
              width="100%"
              height="200"
              allowFullScreen
              loading="lazy"
              className="rounded-lg shadow-lg border border-gray-600"
            ></iframe>
          </div>

          <p className="mt-3 font-semibold text-lg">\ud83d\udcde Contact Us</p>
          <p>
            <Link href="tel:+1234567890" className="text-amber-500">
              +1 (234) 567-890
            </Link>
          </p>
          <p>
            <Link href="mailto:contact@example.com" className="text-amber-500">
              contact@example.com
            </Link>
          </p>
          
          {/* WhatsApp Chat Button */}
          <div className="mt-4">
            <Link href="https://wa.me/1234567890" target="_blank" className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-green-500 rounded-lg shadow hover:bg-green-600">
              \ud83d\udc8c Chat on WhatsApp
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
