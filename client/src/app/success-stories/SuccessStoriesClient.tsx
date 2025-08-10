"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Search, MapPin, Eye, Link2, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import dynamic from "next/dynamic";
import Image from 'next/image';

// Dynamic Map (client-only)
const SuccessStoryMap = dynamic(() => import("@/components/custom/SuccessStoryMap"), { ssr: false });

// Constants
const ITEMS_PER_PAGE = 9;

// Types
interface Location {
  name: string;
  lat: string;
  lon: string;
}

interface Impact {
  name: string;
  description: string;
}

interface Solution {
  name: string;
}

interface Service {
  name: string;
}

export interface SuccessStory {
  uuid: number;
  name: string;
  content: string;
  slug: string;
  websiteurl: string;
  industry: string;
  location: Location[];
  logo: string | null;
  glimpses: { url: string }[];
  casestudy: string | null;
  impacts: Impact[];
  stack: Solution[];
  services: Service[];
}

interface PageProps {
  stories: SuccessStory[];
}

export default function SuccessStoriesClient({ stories }: PageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedTechStack, setSelectedTechStack] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false); // For mobile

  // Process markers for map
  const markers = stories
  .flatMap((story) =>
    story.location.map((loc) => {
      const lat = parseFloat(loc.lat);
      const lon = parseFloat(loc.lon);
      return isNaN(lat) || isNaN(lon)
        ? null
        : {
            lat: lat.toString(),  // ← Convert to string
            lon: lon.toString(),  // ← Convert to string
            name: story.name,
          };
    })
  )
  .filter((marker): marker is NonNullable<typeof marker> => marker !== null);

  // Build filter options
  const allServices = [...new Set(stories.flatMap((s) => s.services.map((svc) => svc.name)))]
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }))
  const allTechStacks = [...new Set(stories.flatMap((s) => s.stack.map((t) => t.name)))]
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }))
  const allIndustries = [...new Set(stories.map((s) => s.industry))]
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }))


  // Filter stories
  const filteredStories = stories.filter((story) => {
    const matchesSearch =
      story.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.industry.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesService =
      selectedServices.length === 0 || story.services.some((s) => selectedServices.includes(s.name));

    const matchesTechStack =
      selectedTechStack.length === 0 || story.stack.some((t) => selectedTechStack.includes(t.name));

    const matchesIndustry =
      selectedIndustries.length === 0 || selectedIndustries.includes(story.industry);

    return matchesSearch && matchesService && matchesTechStack && matchesIndustry;
  });

  // Pagination
  const totalPages = Math.ceil(filteredStories.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedStories = filteredStories.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset page on filter change
  const handleFilterChange = (
    value: string,
    selectedArray: string[],
    setSelectedArray: (arr: string[]) => void
  ) => {
    setSelectedArray(
      selectedArray.includes(value)
        ? selectedArray.filter((item) => item !== value)
        : [...selectedArray, value]
    );
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">

      {/* Global Map Section */}
      <section className="mb-16 bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-slate-700 p-6 transition-all duration-300">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 text-center lg:text-left">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">🌍 Global Impact</h2>
            <p className="text-gray-600 dark:text-slate-300 leading-relaxed">
              We’ve delivered transformative software solutions to clients in over 15 countries — from startups to enterprises.
            </p>
            <div className="flex justify-center lg:justify-start gap-4 mt-4">
              <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                {stories.length} Clients
              </Badge>
              <Badge variant="secondary" className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                {markers.length} Countries
              </Badge>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-inner h-80 bg-gray-100 dark:bg-slate-700">
            {markers.length > 0 ? (
              <SuccessStoryMap markers={markers} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-slate-400">
                No locations available
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Search & Filter Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search clients, industries..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10 h-12 rounded-xl border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <Button
          variant="outline"
          className="md:hidden w-full justify-between"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <span>Filters</span>
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside
          className={`xl:col-span-1 transition-all duration-300 ease-in-out ${
            isFilterOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
          } md:max-h-full md:opacity-100`}
        >
          <Card className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">🔍 Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-80 pr-2">
                {[
                  { title: "Industry", options: allIndustries, state: selectedIndustries, setState: setSelectedIndustries },
                  { title: "Services", options: allServices, state: selectedServices, setState: setSelectedServices },
                  { title: "Tech Stack", options: allTechStacks, state: selectedTechStack, setState: setSelectedTechStack },
                ].map(({ title, options, state, setState }) => (
                  <div key={title} className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">{title}</h3>
                    <div className="space-y-2">
                      {options.map((opt) => (
                        <div key={opt} className="flex items-center">
                          <Checkbox
                            id={`${title}-${opt}`}
                            checked={state.includes(opt)}
                            onCheckedChange={() =>
                              handleFilterChange(opt, state, setState)
                            }
                          />
                          <label
                            htmlFor={`${title}-${opt}`}
                            className="text-sm ml-2 text-gray-700 dark:text-slate-300 cursor-pointer"
                          >
                            {opt}
                          </label>
                        </div>
                      ))}
                    </div>
                    <Separator className="my-3 dark:bg-slate-700" />
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </aside>

        {/* Stories Grid */}
        <main className="xl:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedStories.length > 0 ? (
              paginatedStories.map((story) => (
                <Link key={story.uuid} href={`/success-stories/${story.slug}`}>
                  <Card
                    className="group h-full flex flex-col rounded-2xl bg-white dark:bg-slate-800 shadow-md hover:shadow-2xl border border-gray-100 dark:border-slate-700 transition-all duration-300 overflow-hidden"
                  >
                    {/* Logo */}
                    {story.logo && (
                      <div className="relative h-32 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
                        <Image
                          src={story.logo}
                          alt={story.name}
                          width={160}
                          height={160}
                          className="object-contain max-h-16 max-w-xl filter dark:brightness-90 dark:contrast-125 group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-1">
                        {story.name}
                      </CardTitle>
                      <div className="flex items-center text-sm text-gray-500 dark:text-slate-400 gap-2">
                        <Briefcase className="h-3.5 w-3.5" />
                        <span>{story.industry}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-slate-400 gap-2 mt-1">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{story.location[0]?.name || "Global"}</span>
                      </div>
                    </CardHeader>

                    <CardContent className="flex-1 space-y-3">
                      <p className="text-sm text-gray-600 dark:text-slate-300 line-clamp-3">
                        {story.content}
                      </p>

                      {/* Badges */}
                      <div>
                        {story.services.slice(0, 2).map((service) => (
                          <Badge
                            key={service.name}
                            variant="secondary"
                            className="mr-1 mb-1 text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                          >
                            {service.name}
                          </Badge>
                        ))}
                        {story.stack.slice(0, 1).map((tech) => (
                          <Badge
                            key={tech.name}
                            variant="secondary"
                            className="mr-1 mb-1 text-xs bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                          >
                            {tech.name}
                          </Badge>
                        ))}
                      </div>

                      {/* Hover CTA */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2 mt-2">
                        <Button size="sm" variant="outline" className="text-xs px-2 py-1 h-8">
                          <Eye className="h-3 w-3 mr-1" />
                          View Case
                        </Button>
                        {story.websiteurl && (
                          <Button size="sm" variant="secondary" className="text-xs px-2 py-1 h-8">
                            <Link2 className="h-3 w-3 mr-1" />
                            Visit
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <p className="text-center text-gray-500 dark:text-slate-400 col-span-full py-10">
                🕵️ No stories match your filters.
              </p>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-10">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-4"
              >
                ← Prev
              </Button>
              <span className="text-gray-700 dark:text-slate-300 text-sm">
                Page <strong>{currentPage}</strong> of {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-4"
              >
                Next →
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}