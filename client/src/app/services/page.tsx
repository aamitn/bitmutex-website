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
  console.log("Service Page Data:", pageData); // Debugging output

  
  if (!pageData) {
    return {
      title: "Blog Not Found | Bitmutex Technologies",
      description: "The requested blog/article does not exist. Browse more blogs by Bitmutex Technologies.",
      robots: "noindex, nofollow", // Avoid indexing non-existent pages
    };
  }

  
  const seo = pageData?.seo;
  const metadata = generateMetadataObject(seo);

  heading = pageData.heading;
  sub_heading = pageData.sub_heading;
  description = pageData.description;

  // ✅ Ensure title fallback to `pageData.title` if `seo.metaTitle` is missing
  const seotitle = seo?.metaTitle 
  ? `${seo.metaTitle}  | Bitmutex`
  : `${pageData.heading || "Untitled"} | Bitmutex`;

  // ✅ use pageData description as fallback if metaDescription is not available
  let seodescription = seo?.metaDescription || pageData.description || "";
  if (seodescription.length > 150) {
    seodescription = seodescription.substring(0, seodescription.lastIndexOf(" ", 150)) + "...";
  }

  // ✅ Override normal title field
  metadata.title = seotitle;
  metadata.description = seodescription;

  // ✅ Override OG fields
  metadata.openGraph = {
    ...(metadata.openGraph as any), // Cast to 'any' to allow unknown properties
    title: seotitle, 
    description: seodescription,
    url: `${BASE_URL_NEXT}/services`, // Add custom URL field
    site_name: "Bitmutex",
    locale: "en_US",
    type: "website",
  };
    // ✅ Assign canonical URL to `alternates`
    metadata.alternates = {
      canonical: `${BASE_URL_NEXT}/services`,
    };
  
  return metadata;
}


// ✅ Get the correct Lucide icon
const getLucideIcon = (iconName: string): ElementType => {
  // ✅ Convert kebab-case to PascalCase for Lucide icons
  const pascalCaseName = iconName.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join("");;
  return (LucideIcons as Record<string, unknown>)[pascalCaseName] as ElementType || LucideIcons.AlertCircle;
};


export default async function ServicesPage() {
  const services: Service[] = await fetchServices();

  return (
    <div className="container mx-auto py-12 mt-8 mb-8">

      {/* Header */}
      <div className="text-center">
        <span className="font-bold uppercase text-primary tracking-wide">{heading}</span>
        <h2 className="font-heading text-4xl font-bold text-gray-900 dark:text-white mt-2">{sub_heading}</h2>
        <p className="text-lg text-muted-foreground mt-3 max-w-xl mx-auto mb-8">
          {description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <Link key={service.uuid} href={`/services/${service.slug}`} passHref>
            <Card className="group relative p-6 bg-slate-50 dark:bg-slate-800 shadow-lg rounded-xl border border-gray-200 dark:border-slate-700 hover:shadow-xl transition-all h-full flex flex-col">              {/* Icon and Title */}
              <CardHeader className="flex items-center space-x-4">
                <div className="p-3 bg-gray-100 rounded-full">
                  {service.icon && (
                    React.createElement(getLucideIcon(service.icon), {
                      className: "w-8 h-8 text-gray-700",
                    })
                  )}
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-300">
                  {service.name}
                </h2>
              </CardHeader>

              {/* Description */}
              <CardContent className="flex-grow h-full flex flex-col overflow-hidden">
                <p className="text-gray-600 dark:text-amber-500 line-clamp-3">
                  {service.description}
                </p>

                {/* Tech Stack Logos */}
                {service.techstacklogos.length > 0 && (
                  <div className="mt-4">
                    <TechStackSlider logos={service.techstacklogos} width={60} height={80} />
                  </div>
                )}

                {/* View More */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm text-blue-600 dark:text-blue-200 font-medium">
                    View Details →
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
