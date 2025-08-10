import { fetchIndustries } from "@/data/loaders";
import * as LucideIcons from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FC } from "react";
import { generateMetadataObject } from '@/lib/metadata';
import fetchContentType from '@/lib/strapi/fetchContentType';
import { Metadata } from "next";
import { strapiImage } from "@/lib/strapi/strapiImage";
import { ArrowRight, Sparkles } from "lucide-react";

type Industry = {
  uuid: string;
  name: string;
  description: string;
  details: string;
  icon: string;
  slug: string;
  challenges: string[];
  opportunities: string[];
  solutions: string[];
};

let heading: string = '', sub_heading: string = '', description: string = '';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const BASE_URL_NEXT = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const pageData = await fetchContentType('industries-page', {
    populate: ["seo", "seo.metaImage"],
  }, true)

  if (!pageData) {
    return {
      title: "Page Not Found | Bitmutex Technologies",
      description: "The requested page does not exist.",
      robots: "noindex, nofollow",
    };
  }

  const seo = pageData?.seo;
  const metadata = generateMetadataObject(seo);

  heading = pageData.heading;
  sub_heading = pageData.sub_heading;
  description = pageData.description;

  const seotitle = seo?.metaTitle 
    ? `${seo.metaTitle} | Bitmutex`
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
      : { url: `${BASE_URL_NEXT}/bmind.png` },
    url: `${BASE_URL_NEXT}/industries`,
    site_name: "Bitmutex",
    locale: "en_US",
    type: "website",
  };

  metadata.alternates = {
    canonical: `${BASE_URL_NEXT}/industries`,
  };
  
  return metadata;
}

// Get the correct Lucide icon
const getLucideIcon = (iconName: string): FC<any> => {
  const pascalCaseName = iconName.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join("");
  const Icon = (LucideIcons as any)[pascalCaseName];
  
  if (!Icon) {
    return LucideIcons.AlertCircle;
  }
  
  return Icon;
};

export default async function IndustryPage() {
  const industries: Industry[] = await fetchIndustries();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative container mx-auto px-6 py-24">
        {/* Enhanced Header Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200/30 dark:border-blue-700/30 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="font-semibold uppercase text-blue-600 dark:text-blue-400 tracking-wide text-sm">
              {heading}
            </span>
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 dark:from-white dark:via-blue-100 dark:to-white bg-clip-text text-transparent leading-tight">
              {sub_heading}
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">
            {description}
          </p>
          
          {/* Decorative line */}
          <div className="flex items-center justify-center mt-8">
            <div className="h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent w-64"></div>
          </div>
        </div>

        {/* Industries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {industries.map((industry, index) => {
            const IconComponent = getLucideIcon(industry.icon);
            return (
              <Link key={industry.uuid} href={`/industries/${industry.slug}`} passHref>
                <Card 
                  className="group relative h-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 rounded-2xl overflow-hidden hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 cursor-pointer"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  {/* Gradient overlay that appears on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-cyan-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-cyan-500/5 transition-all duration-500"></div>
                  
                  {/* Animated border gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-sm"></div>
                  
                  {/* Content */}
                  <div className="relative p-8">
                    <CardHeader className="p-0 mb-6">
                      <div className="flex items-start gap-4">
                        {/* Enhanced Icon Container */}
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                          <div className="relative p-4 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-2xl group-hover:from-blue-50 group-hover:to-purple-50 dark:group-hover:from-slate-600 dark:group-hover:to-slate-500 transition-all duration-500">
                            <IconComponent className="w-8 h-8 text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:scale-110 transition-all duration-500" />
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-900 dark:group-hover:text-blue-100 transition-colors duration-300">
                            {industry.name}
                          </h2>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-0">
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg line-clamp-3 mb-6">
                        {industry.description}
                      </p>
                      
                      {/* Enhanced CTA Button */}
                      <div className="flex items-center justify-between">
                        <Button
                          variant="ghost"
                          className="group/btn p-0 h-auto bg-transparent hover:bg-transparent text-blue-600 dark:text-blue-400 font-semibold opacity-60 group-hover:opacity-100 transition-all duration-300"
                        >
                          <span className="mr-2">Explore Solutions</span>
                          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                        </Button>
                        
                        {/* Status indicator */}
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                          <span className="text-sm text-slate-500 dark:text-slate-400">Available</span>
                        </div>
                      </div>
                    </CardContent>
                  </div>

                  {/* Animated bottom accent */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Enhanced Footer CTA Section */}
        <div className="mt-24 text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-cyan-600/10 rounded-3xl blur-xl"></div>
            <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 rounded-3xl p-12">
              <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Don&apos;t See Your Industry?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
                We work across various sectors and can customize our solutions for your specific industry needs. Let&apos;s discuss how we can help transform your business.
              </p>
              <Button 
                size="lg"
                className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 px-8 py-4 text-lg hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300"
              >
                Get in Touch
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}