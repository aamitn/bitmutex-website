import Link from "next/link";
import { fetchServices } from "@/data/loaders";
import * as LucideIcons from "lucide-react";
import { ElementType } from "react";
import TechStackSlider from "@/components/custom/TechStackSlider";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import React from "react";
import { generateMetadataObject } from '@/lib/metadata';
import  fetchContentType  from '@/lib/strapi/fetchContentType';
import { Metadata } from "next";
import { strapiImage } from "@/lib/strapi/strapiImage";
import { ArrowUpRight, Sparkles } from "lucide-react";

type ServiceItem = {
  name: string;
  description: string;
  icon: string;
};

type Service = {
  uuid: string;
  name: string;
  description: string;
  slug: string;
  techstacklogos: { url: string }[];
  service_items: ServiceItem[];
  icon: string;
};

let heading: string = '', sub_heading: string = '', description: string = '';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const BASE_URL_NEXT = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const pageData = await fetchContentType('services-page', {
    populate: ["seo","seo.metaImage"],
  }, true)
  console.log("Service Page Data:", pageData);

  if (!pageData) {
    return {
      title: "Page Not Found | Bitmutex Technologies",
      description: "The requested page does not exist. Browse more services by Bitmutex Technologies.",
      robots: "noindex, nofollow",
    };
  }

  const seo = pageData?.seo;
  const metadata = generateMetadataObject(seo);

  heading = pageData.heading;
  sub_heading = pageData.sub_heading;
  description = pageData.description;

  const seotitle = seo?.metaTitle 
  ? `${seo.metaTitle}  | Bitmutex`
  : `${pageData.heading || "Untitled"} | Bitmutex`;

  let seodescription = seo?.metaDescription || pageData.description || "";
  if (seodescription.length > 150) {
    seodescription = seodescription.substring(0, seodescription.lastIndexOf(" ", 150)) + "...";
  }

  metadata.title = seotitle;
  metadata.description = seodescription;

  metadata.openGraph = {
    ...(metadata.openGraph as any),
    title: seotitle, 
    description: seodescription,
    images: seo?.metaImage
      ? [{ url: strapiImage(seo.metaImage.url) }]
      : { url: `${BASE_URL_NEXT}/bmserv.png` },
    url: `${BASE_URL_NEXT}/services`,
    site_name: "Bitmutex",
    locale: "en_US",
    type: "website",
  };

  metadata.alternates = {
    canonical: `${BASE_URL_NEXT}/services`,
  };
  
  return metadata;
}

const getLucideIcon = (iconName: string): ElementType => {
  const pascalCaseName = iconName.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join("");
  return (LucideIcons as Record<string, unknown>)[pascalCaseName] as ElementType || LucideIcons.AlertCircle;
};

export default async function ServicesPage() {
  const services: Service[] = await fetchServices();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-emerald-400/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative container mx-auto px-6 py-20">
        {/* Modern Header Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-200/50 dark:border-blue-800/50 mb-6">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-300 tracking-wide uppercase">
              {heading || "Our Services"}
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-br from-slate-900 via-slate-700 to-slate-600 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent leading-tight mb-6">
            {sub_heading || "Premium Solutions"}
          </h1>

          {/* Description */}
          <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
            {description || "Discover our comprehensive suite of cutting-edge services designed to elevate your business."}
          </p>

          {/* Decorative line */}
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto mt-8"></div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Link key={service.uuid} href={`/services/${service.slug}`} passHref>
              <Card 
                className="group relative overflow-hidden bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 hover:border-blue-300/50 dark:hover:border-blue-700/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-400/5 hover:-translate-y-2 h-full"
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Glowing border effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-emerald-600/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10"></div>

                <CardHeader className="relative z-10 p-8">
                  <div className="flex items-start justify-between mb-4">
                    {/* Icon Container */}
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        {service.icon && (
                          React.createElement(getLucideIcon(service.icon), {
                            className: "w-8 h-8 text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300",
                          })
                        )}
                      </div>
                      {/* Floating accent */}
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse"></div>
                    </div>

                    {/* Arrow Icon */}
                    <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </div>

                  {/* Service Title */}
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300">
                    {service.name}
                  </h3>
                </CardHeader>

                <CardContent className="relative z-10 px-8 pb-8 flex-1 flex flex-col">
                  {/* Description */}
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6 flex-1 line-clamp-3">
                    {service.description}
                  </p>

                  {/* Tech Stack */}
                  {service.techstacklogos.length > 0 && (
                    <div className="mt-auto">
                      <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wide">
                        Technology Stack
                      </div>
                      <div className="relative overflow-hidden rounded-lg bg-slate-50/50 dark:bg-slate-800/50 p-3">
                        <TechStackSlider logos={service.techstacklogos} width={40} height={40} />
                      </div>
                    </div>
                  )}

                  {/* Bottom gradient line */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-600/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Call to Action Section */}
        <div className="text-center mt-20 pt-16 border-t border-slate-200/50 dark:border-slate-800/50">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
            <span>Ready to get started?</span>
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
}