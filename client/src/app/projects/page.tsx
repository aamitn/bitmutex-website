import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { fetchProjects } from "@/data/loaders";
import { generateMetadataObject } from '@/lib/metadata';
import fetchContentType from '@/lib/strapi/fetchContentType';
import { Metadata } from "next";
import Image from "next/image";
import { strapiImage } from "@/lib/strapi/strapiImage";
import { Search, Filter, ArrowUpRight, Sparkles, FolderOpen, ExternalLink, Eye, Calendar, Tag } from "lucide-react";

type Project = {
  id: number;
  name: string;
  description: string;
  slug: string;
  imageUrl?: string;
  category?: string;
};

let heading: string = '', sub_heading: string = '', description: string = '';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const BASE_URL_NEXT = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const pageData = await fetchContentType('projects-page', {
    populate: ["seo","seo.metaImage"],
  }, true)

  if (!pageData) {
    return {
      title: "Projects Not Found | Bitmutex Technologies",
      description: "The requested projects page does not exist. Browse more projects by Bitmutex Technologies.",
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
      : { url: `${BASE_URL_NEXT}/bmproj.png` },
    url: `${BASE_URL_NEXT}/projects`,
    site_name: "Bitmutex",
    locale: "en_US",
    type: "website",
  };

  metadata.alternates = {
    canonical: `${BASE_URL_NEXT}/projects`,
  };
  
  return metadata;
}

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<{ category?: string; search?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const projects: Project[] = await fetchProjects();
  const categories = ["all", ...new Set(projects.map((p) => p.category ?? "Uncategorized"))];

  const searchQuery = resolvedSearchParams?.search?.toLowerCase() || "";
  const selectedCategory = resolvedSearchParams?.category || "all";

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery) || p.description.toLowerCase().includes(searchQuery);
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-gradient-to-tr from-orange-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-gradient-to-tl from-blue-500/10 to-orange-600/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative container mx-auto px-6 py-24">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-600/10 to-orange-600/10 border border-blue-200/30 dark:border-orange-800/30 mb-4">
            <FolderOpen className="w-3 h-3 text-blue-600 dark:text-orange-400" />
            <span className="text-xs font-medium text-blue-700 dark:text-orange-300 tracking-wide uppercase">
              {heading || "Portfolio"}
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight mb-3">
            {sub_heading || "Featured Projects"}
          </h1>

          {/* Description */}
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg mx-auto">
            {description || "Explore our collection of innovative projects."}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Enhanced Sidebar */}
          <div className="lg:w-80 w-full">
            <Card className="sticky top-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 shadow-xl">
              <CardHeader className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="w-5 h-5 text-blue-600 dark:text-orange-400" />
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Filters</h2>
                </div>
              </CardHeader>

              <CardContent className="p-6 pt-0 space-y-6">
                <form method="GET" className="space-y-6">
                  {/* Search Input */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input 
                      type="text" 
                      name="search" 
                      placeholder="Search projects..." 
                      className="pl-10 bg-slate-50/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-700/50 focus:border-blue-300 dark:focus:border-orange-700 rounded-xl" 
                      defaultValue={searchQuery} 
                    />
                  </div>

                  {/* Category Select */}
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                      Category
                    </label>
                    <Select name="category" defaultValue={selectedCategory}>
                      <SelectTrigger className="bg-slate-50/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-700/50 focus:border-blue-300 dark:focus:border-orange-700 rounded-xl">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-slate-200/50 dark:border-slate-800/50 rounded-xl">
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat} className="capitalize">
                            {cat === "all" ? "All Categories" : cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Apply Button */}
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white rounded-xl py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Apply Filters
                  </Button>
                </form>

                {/* Quick Stats */}
                <div className="pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    Showing {filteredProjects.length} of {projects.length} projects
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(filteredProjects.length / projects.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Projects Grid */}
          <div className="flex-1">
            {filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredProjects.map((project, index) => (
                  <Link key={project.id} href={`/projects/${project.slug}`} className="block">
                    <Card 
                      className="group relative overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border-0 shadow-lg hover:shadow-2xl transition-all duration-700 hover:-translate-y-1 h-full"
                      style={{
                        animationDelay: `${index * 100}ms`
                      }}
                    >
                      {/* Sleek gradient border */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-orange-500 to-blue-500 rounded-2xl p-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="w-full h-full bg-white dark:bg-slate-900 rounded-2xl"></div>
                      </div>

                      {/* Subtle gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-orange-50/30 dark:from-blue-950/20 dark:to-orange-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                      
                      {/* Category Badge */}
                      <div className="absolute top-2 right-2 z-20">
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-blue-500/90 to-orange-500/90 backdrop-blur-sm rounded-full text-white shadow-sm">
                          <span className="text-[10px] font-medium capitalize">
                            {project.category || "N/A"}
                          </span>
                        </div>
                      </div>

                      {/* Image Section */}
                      {project.imageUrl && (
                        <div className="relative h-32 overflow-hidden rounded-t-xl">
                          <Image
                            src={project.imageUrl}
                            alt={project.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}

                      <div className="relative z-10 p-4">
                        {/* Title and Arrow */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <CardTitle className="text-base font-semibold text-slate-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-orange-400 transition-colors duration-300">
                            {project.name}
                          </CardTitle>
                          <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 dark:group-hover:text-orange-400 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 flex-shrink-0 mt-0.5" />
                        </div>

                        {/* Description */}
                        <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed line-clamp-2">
                          {project.description}
                        </p>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-orange-100 dark:from-blue-900/20 dark:to-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-blue-600 dark:text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No projects found</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 max-w-xs mx-auto">
                  Try adjusting your filters.
                </p>
                <Button 
                  onClick={() => window.location.href = '/projects'}
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Minimal CTA */}
        <div className="text-center mt-16 pt-12 border-t border-slate-200/30 dark:border-slate-800/30">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            Start Your Project
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 max-w-md mx-auto">
            Let&apos;s collaborate and bring your vision to life.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/connect">
            <Button className="bg-gradient-to-r from-blue-600 to-orange-400 hover:from-blue-700 hover:to-orange-600 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
              Get Started
            </Button>
            </Link>
            <Link href="/contact">
              <Button 
                variant="outline"
                size="sm"
                className="bg-white/50 dark:bg-slate-800/50 backdrop-blur border-white/20 dark:border-slate-700/20 hover:bg-white/80 dark:hover:bg-slate-700/80 px-6 py-2 rounded-lg transition-all duration-300"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}