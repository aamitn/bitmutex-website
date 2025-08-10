import { notFound } from "next/navigation";
import { fetchServices } from "@/data/loaders";
import TechStackSlider from "@/components/custom/TechStackSlider";
import * as LucideIcons from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FC } from "react";
import { Metadata } from "next";
import { generateMetadataObject } from '@/lib/metadata';
import fetchContentType from '@/lib/strapi/fetchContentType';
import { strapiImage } from '@/lib/strapi/strapiImage';
import { ArrowLeft, ArrowUpRight, Sparkles, ChevronRight, Zap, Target, Settings } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

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
  icon: string;
  techstacklogos: { url: string }[];
  service_items: ServiceItem[];
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const BASE_URL_NEXT = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const resolveParams = await params;
  const slug = await resolveParams?.slug;
  const pageData = await fetchContentType('services', {
    filters: { slug },
    populate: ["seo.metaImage"],
  }, true)

  if (!pageData) {
    return {
      title: "Service Not Found | Bitmutex Technologies",
      description: "The requested service page does not exist. Browse more service pages by Bitmutex Technologies.",
      robots: "noindex, nofollow",
    };
  }

  const seo = pageData?.seo;
  const metadata = generateMetadataObject(seo);

  const seotitle = seo?.metaTitle 
  ? `${seo.metaTitle} | Bitmutex`
  : `${pageData.name || "Untitled"} Services | Bitmutex`;

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
    : pageData?.image
      ? [{ url: strapiImage(pageData.image.url) }]
      : [{ url: `${BASE_URL_NEXT}/bmserv.png`}],
    url: `${BASE_URL_NEXT}/services/${slug}`,
    site_name: "Bitmutex",
    locale: "en_US",
    type: "website",
  };

  metadata.alternates = {
    canonical: `${BASE_URL_NEXT}/services/${slug}`,
  };
  
  return metadata;
}

const getLucideIcon = (iconName: string): FC<any> => {
  const pascalCaseName = iconName.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join("");
  const Icon = (LucideIcons as any)[pascalCaseName];
  if (!Icon) {
    return LucideIcons.AlertCircle;
  }
  return Icon;
};

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  const services: Service[] = await fetchServices();
  const service = services.find((s: Service) => s.slug === slug);

  if (!service) {
    return notFound();
  }

  const IconComponent = getLucideIcon(service.icon);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-gradient-to-tr from-emerald-400/10 to-cyan-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative container mx-auto px-6 py-12">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-8">
          <Link href="/services" className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Services
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900 dark:text-white font-medium">{service.name}</span>
        </div>

        {/* Hero Section */}
        <div className="relative mb-16">
          <Card className="overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 shadow-2xl">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-transparent"></div>
            
            <CardHeader className="relative p-12">
              {/* Back Button */}
              <div className="absolute top-8 left-8">
                <Link href="/services">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-white/50 dark:bg-slate-800/50 backdrop-blur border-white/30 dark:border-slate-700/50 hover:bg-white/80 dark:hover:bg-slate-700/80 transition-all duration-300"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Services
                  </Button>
                </Link>
              </div>

              {/* Main Content */}
              <div className="text-center pt-8">
                {/* Service Icon */}
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-3xl mb-8 shadow-lg">
                  <div className="w-16 h-16 bg-white/50 dark:bg-slate-800/50 rounded-2xl flex items-center justify-center backdrop-blur">
                    <IconComponent className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-br from-slate-900 via-slate-700 to-slate-600 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent leading-tight mb-6">
                  {service.name}
                </h1>

                {/* Description */}
                <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl mx-auto mb-8">
                  {service.description}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Get Started
                  </Button>
                  <Button 
                    variant="outline"
                    className="bg-white/50 dark:bg-slate-800/50 backdrop-blur border-white/30 dark:border-slate-700/50 hover:bg-white/80 dark:hover:bg-slate-700/80 px-8 py-3 rounded-xl transition-all duration-300"
                  >
                    Learn More
                    <ArrowUpRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Tech Stack Section */}
        {service.techstacklogos.length > 0 && (
          <div className="mb-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-600/10 to-cyan-600/10 border border-emerald-200/50 dark:border-emerald-800/50 mb-4">
                <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 tracking-wide uppercase">
                  Technology Stack
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Cutting-Edge Technologies
              </h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                We leverage the most advanced tools and frameworks to deliver exceptional results
              </p>
            </div>

            <Card className="overflow-hidden bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 shadow-xl">
              <CardContent className="p-12">
                <TechStackSlider logos={service.techstacklogos} width={80} height={80} />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Service Items Section */}
        {service.service_items.length > 0 && (
          <div>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-200/50 dark:border-purple-800/50 mb-4">
                <Target className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-semibold text-purple-700 dark:text-purple-300 tracking-wide uppercase">
                  What We Offer
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Comprehensive Solutions
              </h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Explore our detailed service offerings designed to meet your specific needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {service.service_items.map((item, index) => {
                const ItemIcon = getLucideIcon(item.icon);
                return (
                  <Card
                    key={index}
                    className="group relative overflow-hidden bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 hover:border-purple-300/50 dark:hover:border-purple-700/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10 dark:hover:shadow-purple-400/5 hover:-translate-y-2"
                    style={{
                      animationDelay: `${index * 100}ms`
                    }}
                  >
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Glowing border */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10"></div>

                    <CardHeader className="relative z-10 p-8">
                      {/* Icon */}
                      <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg mb-4">
                        <ItemIcon className="w-8 h-8 text-slate-700 dark:text-slate-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300" />
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors duration-300">
                        {item.name}
                      </h3>
                    </CardHeader>

                    <CardContent className="relative z-10 px-8 pb-8">
                      {/* Description */}
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Bottom accent line */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-600/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Call to Action Section */}
        <div className="text-center mt-20 pt-16 border-t border-slate-200/50 dark:border-slate-800/50">
          <div className="max-w-2xl mx-auto mb-8">
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Ready to Transform Your Business?
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Let&apos;s discuss how our {service.name.toLowerCase()} solutions can drive your success forward.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <Settings className="w-5 h-5 mr-2" />
              Start Your Project
            </Button>
            <Link href="/contact">
              <Button 
                variant="outline"
                className="bg-white/50 dark:bg-slate-800/50 backdrop-blur border-white/30 dark:border-slate-700/50 hover:bg-white/80 dark:hover:bg-slate-700/80 px-8 py-4 rounded-xl transition-all duration-300"
              >
                Contact Our Team
                <ArrowUpRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}