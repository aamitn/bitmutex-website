import { fetchProjectBySlug } from "@/data/loaders";
import { notFound } from "next/navigation";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { FaGitAlt, FaExternalLinkAlt } from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Metadata } from "next";
import RenderMarkdown from "@/components/custom/RenderMarkdown";
import { generateMetadataObject } from '@/lib/metadata';
import fetchContentType from '@/lib/strapi/fetchContentType';
import { strapiImage } from '@/lib/strapi/strapiImage';
import { extractTextFromRichText } from "@/lib/utils";
import Image from "next/image";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const BASE_URL_NEXT = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const resolveParams = await params;
  const slug = await resolveParams?.slug;

  const pageData = await fetchContentType('projects', {
    filters: { slug: slug },
    populate: ["category", "seo.metaImage", "image"],
  }, true)

  if (!pageData) {
    return {
      title: "Project Not Found | Bitmutex Technologies",
      description: "The requested project does not exist. Browse more projects by Bitmutex Technologies.",
      robots: "noindex, nofollow",
    };
  }

  const seo = pageData?.seo;
  const metadata = generateMetadataObject(seo);
  const richTextString = extractTextFromRichText(pageData.description);

  const seotitle = seo?.metaTitle 
    ? `${seo.metaTitle} | ${pageData.category?.text || "Uncategorized"} | Bitmutex Projects`
    : `${pageData.name || "Untitled"} | ${pageData.category?.text || "Uncategorized"} | Bitmutex Projects`;

  let seodescription = seo?.metaDescription || richTextString || "";
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
      ? [{ url: strapiImage(seo?.metaImage.url) }] 
      : pageData?.image 
        ? [{ url: strapiImage(pageData.image.url) }] 
        : [],
    url: `${BASE_URL_NEXT}/projects/${slug}`,
    site_name: "Bitmutex",
    locale: "en_US",
    type: "article",
  };

  metadata.alternates = {
    canonical: `${BASE_URL_NEXT}/projects/${slug}`,
  };
  
  return metadata;
}

const renderRichText = (content: any) => {
  if (!content) return null;

  if (Array.isArray(content)) {
    return content.map((block, index) => {
      if (block.type === "paragraph") {
        return <p key={index} className="mb-3 leading-relaxed">{block.children.map((child: any) => child.text).join(" ")}</p>;
      }
      return null;
    });
  }

  return <p className="leading-relaxed">{content}</p>;
};

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await fetchProjectBySlug(slug);

  if (!project) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Hero Section with Gradient Background */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-cyan-600/10 dark:from-blue-500/20 dark:via-purple-500/20 dark:to-cyan-500/20"></div>
        
        <div className="relative container mx-auto px-6 pt-24 pb-12">
          {/* Navigation */}
          <div className="mb-8">
            <Link href="/projects">
              <Button 
                variant="ghost" 
                className="group hover:bg-white/80 dark:hover:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <FaArrowLeftLong className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to Projects
              </Button>
            </Link>
          </div>

          {/* Project Header */}
          <div className="mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-4xl py-1 md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 dark:from-white dark:via-blue-100 dark:to-white bg-clip-text text-transparent leading-tight">
                  {project.name}
                </h1>
                {project.category && (
                  <div className="mt-4">
                    <Badge 
                      variant="default" 
                      className="px-3 py-2 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500 to-sky-600 text-white border-0 hover:from-blue-600 hover:to-sky-700 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    >
                      {project.category}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                {project.repourl && (
                  <Button 
                    asChild 
                    variant="outline"
                    className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 hover:scale-105 hover:shadow-lg transition-all duration-300"
                  >
                    <a href={project.repourl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                      <FaGitAlt className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                      Repository
                    </a>
                  </Button>
                )}
                {project.hostedurl && (
                  <Button 
                    asChild
                    className="group bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white border-0 hover:scale-105 hover:shadow-lg transition-all duration-300"
                  >
                    <a href={project.hostedurl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                      <FaExternalLinkAlt className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      Live Demo
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 pb-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Project Image */}
          {project.imageUrl && (
            <div className="lg:col-span-2">
              <div className="relative group overflow-hidden rounded-2xl bg-white dark:bg-slate-800 p-2 shadow-xl hover:shadow-2xl transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl"></div>
                <Image
                  src={project.imageUrl}
                  alt={project.name}
                  width={800}
                  height={600}
                  className="relative w-full max-w-5xl h-96 min-h-40 object-contain rounded-xl group-hover:scale-[1.02] transition-transform duration-700"
                />
              </div>
            </div>
          )}

          {/* Project Description */}
          <div className={`${project.imageUrl ? 'lg:col-span-1' : 'lg:col-span-3'}`}>
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 dark:border-slate-700/30 hover:shadow-2xl transition-all duration-500">
              <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
                Project Overview
              </h2>
              <div className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed space-y-4">
                {renderRichText(project.description)}
              </div>
            </div>
          </div>
        </div>

        {/* Project Details Section */}
        <div className="mt-16">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/30 overflow-hidden hover:shadow-2xl transition-all duration-500">
            <Accordion type="single" defaultValue="details" collapsible className="w-full">
              <AccordionItem value="details" className="border-none">
                <AccordionTrigger className="px-8 py-6 text-xl font-semibold text-slate-900 dark:text-white hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors duration-300 [&[data-state=open]]:bg-slate-50/50 dark:[&[data-state=open]]:bg-slate-700/30">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                    Technical Details & Implementation
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-8 pb-8">
                  <div className="pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
                    <div className="prose prose-slate dark:prose-invert max-w-none prose-lg">
                      <RenderMarkdown content={project.details} />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Enhanced Call-to-Action Section */}
        {(project.repourl || project.hostedurl) && (
          <div className="mt-16">
            <div className="bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-600 rounded-2xl p-1 shadow-xl hover:shadow-2xl transition-all duration-500">
              <div className="bg-white dark:bg-slate-900 rounded-[calc(1rem-2px)] p-8 text-center">
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">
                  Ready to Explore?
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6 text-lg">
                  Check out the live demo or dive into the source code to see how it&apos;s built.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  {project.hostedurl && (
                    <Button 
                      asChild
                      size="lg"
                      className="group bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white border-0 hover:scale-105 hover:shadow-lg transition-all duration-300 px-8 py-3"
                    >
                      <a href={project.hostedurl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
                        <FaExternalLinkAlt className="h-5 w-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        View Live Demo
                      </a>
                    </Button>
                  )}
                  {project.repourl && (
                    <Button 
                      asChild 
                      variant="outline"
                      size="lg"
                      className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 hover:scale-105 hover:shadow-lg transition-all duration-300 px-8 py-3"
                    >
                      <a href={project.repourl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
                        <FaGitAlt className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                        View Source Code
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}