import { fetchIndustryBySlug } from "@/data/loaders";
import { notFound } from "next/navigation";
import * as LucideIcons from "lucide-react";
import { FC } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import sanitizeHtml from "sanitize-html";
import Link from "next/link";
import { Metadata } from "next";
import { generateMetadataObject } from '@/lib/metadata';
import fetchContentType from '@/lib/strapi/fetchContentType';
import { strapiImage } from '@/lib/strapi/strapiImage';
import { ArrowLeft, TrendingUp, Target, Lightbulb, CheckCircle2, AlertTriangle, Sparkles } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const BASE_URL_NEXT = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const resolveParams = await params;
  const slug = await resolveParams?.slug;

  const pageData = await fetchContentType('industries', {
    filters: { slug: slug},
    populate: ["seo.metaImage"],
  }, true)

  if (!pageData) {
    return {
      title: "Page Not Found | Bitmutex Technologies",
      description: "The requested page does not exist. Browse more industry pages by Bitmutex Technologies.",
      robots: "noindex, nofollow",
    };
  }

  const seo = pageData?.seo;
  const metadata = generateMetadataObject(seo);

  const seotitle = seo?.metaTitle 
    ? `${seo.metaTitle} | Bitmutex`
    : `${pageData.name || "Untitled"} Industry | Bitmutex`;

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
        : [{ url: `${BASE_URL_NEXT}/bmind.png`}],
    url: `${BASE_URL_NEXT}/industries/${slug}`,
    site_name: "Bitmutex",
    locale: "en_US",
    type: "website",
  };

  metadata.alternates = {
    canonical: `${BASE_URL_NEXT}/industries/${slug}`,
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

export default async function IndustryDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const industry = await fetchIndustryBySlug(slug);

  if (!industry) {
    return notFound();
  }

  const IconComponent = getLucideIcon(industry.icon);

  // Sanitize HTML content
  const sanitizedDetails = sanitizeHtml(industry.details, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      "img", "iframe", "h1", "h2", "h3", "h4", "h5", "h6", "a"
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      iframe: ["src", "width", "height", "frameborder", "allow", "allowfullscreen"],
      img: ["src", "alt", "width", "height", "style"],
      a: ["href", "target", "rel"],
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-r from-blue-400/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-cyan-600/20"></div>
          
          <div className="relative container mx-auto px-6 pt-24 pb-16">
            {/* Navigation */}
            <div className="mb-8">
              <Link href="/industries">
                <Button 
                  variant="ghost" 
                  className="group hover:bg-white/80 dark:hover:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  Back to Industries
                </Button>
              </Link>
            </div>

            {/* Industry Header */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 mb-12">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                <div className="relative p-8 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-slate-700/30 group-hover:scale-105 transition-transform duration-500">
                  <IconComponent className="w-16 h-16 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200/30 dark:border-blue-700/30 rounded-full mb-4">
                  <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="font-semibold text-blue-600 dark:text-blue-400 text-sm">
                    Industry Focus
                  </span>
                </div>
                
                <h1 className="text-5xl lg:text-6xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 dark:from-white dark:via-blue-100 dark:to-white bg-clip-text text-transparent">
                    {industry.name}
                  </span>
                </h1>
              </div>
            </div>

            {/* Industry Description */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 dark:border-slate-700/30 hover:shadow-2xl transition-all duration-500">
              <div className="flex items-start gap-4">
                <div className="w-1 h-16 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full flex-shrink-0"></div>
                <p className="text-xl text-slate-700 dark:text-slate-300 leading-relaxed">
                  {industry.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6 pb-16">
          {/* Industry State Section */}
          <div className="mb-16">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/30 overflow-hidden hover:shadow-2xl transition-all duration-500">
              <Accordion type="single" collapsible defaultValue="details" className="w-full">
                <AccordionItem value="details" className="border-none">
                  <AccordionTrigger className="px-8 py-6 hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors duration-300 [&[data-state=open]]:bg-slate-50/50 dark:[&[data-state=open]]:bg-slate-700/30">
                    <div className="text-left">
                      <h2 className="text-3xl font-bold mb-2">
                        The State of{" "}
                        <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
                          {industry.name}
                        </span>{" "}
                        Industry
                      </h2>
                      <p className="text-slate-600 dark:text-slate-400 text-lg">
                        Comprehensive analysis and insights
                      </p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-8 pb-8">
                    <div className="pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
                      <div
                        className="prose prose-slate dark:prose-invert max-w-none prose-lg ckeditor-content"
                        dangerouslySetInnerHTML={{ __html: sanitizedDetails }}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          {/* Challenges & Opportunities Section */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* Challenges */}
            <div className="group">
              <Card className="h-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 hover:shadow-2xl hover:scale-[1.02] transition-all duration-500">
                <CardHeader className="pb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-2xl">
                      <AlertTriangle className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-red-600 dark:text-red-400">
                      Key Challenges
                    </h3>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {industry.challenges.map((challenge: { name: string }, index: number) => (
                      <div
                        key={index}
                        className="group/item flex items-start gap-4 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-700/30 hover:bg-red-50/50 dark:hover:bg-red-900/10 transition-all duration-300 hover:scale-[1.02]"
                      >
                        <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 mt-3 group-hover/item:scale-125 transition-transform duration-300"></div>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                          {challenge.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Opportunities */}
            <div className="group">
              <Card className="h-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 hover:shadow-2xl hover:scale-[1.02] transition-all duration-500">
                <CardHeader className="pb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-2xl">
                      <TrendingUp className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">
                      Growth Opportunities
                    </h3>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {industry.opportunities.map((opportunity: { name: string }, index: number) => (
                      <div
                        key={index}
                        className="group/item flex items-start gap-4 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-700/30 hover:bg-green-50/50 dark:hover:bg-green-900/10 transition-all duration-300 hover:scale-[1.02]"
                      >
                        <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0 mt-3 group-hover/item:scale-125 transition-transform duration-300"></div>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                          {opportunity.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Solutions Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200/30 dark:border-blue-700/30 rounded-full mb-6">
                <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="font-semibold text-blue-600 dark:text-blue-400 text-sm">
                  Our Solutions
                </span>
              </div>
              <h2 className="text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                  Tailored Solutions
                </span>
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Comprehensive approaches designed specifically for the {industry.name} industry
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {industry.solutions.map((solution: { name: string }, index: number) => (
                <Card
                  key={index}
                  className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 hover:shadow-2xl hover:scale-105 transition-all duration-500 cursor-pointer"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                        <div className="relative p-3 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-700 dark:to-slate-600 rounded-xl group-hover:from-blue-100 group-hover:to-purple-100 dark:group-hover:from-slate-600 dark:group-hover:to-slate-500 transition-all duration-500">
                          <CheckCircle2 className="w-6 h-6 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-500" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors duration-300">
                          {solution.name}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  
                  {/* Hover accent */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-cyan-600/10 rounded-3xl blur-xl"></div>
              <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 rounded-3xl p-12">
                <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Ready to Transform Your {industry.name} Business?
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
                  Let&apos;s discuss how our tailored solutions can address your specific challenges and unlock new opportunities in the {industry.name} sector.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button 
                    size="lg"
                    className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 px-8 py-4 text-lg hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300"
                  >
                    <Lightbulb className="mr-2 w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                    Get Consultation
                  </Button>
                  <Button 
                    variant="outline"
                    size="lg"
                    className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 px-8 py-4 text-lg hover:scale-105 hover:shadow-lg transition-all duration-300"
                  >
                    View Case Studies
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}