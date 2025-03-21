"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchSuccessStories } from "@/data/loaders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import dynamic from "next/dynamic";
import { Eye, Link2 } from 'lucide-react'; // Import the icons you need

const SuccessStoryMap = dynamic(() => import("@/components/custom/SuccessStoryMap"), { ssr: false });


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

interface SuccessStory {
  uuid: number;
  name: string;
  content: string;
  slug: string;
  industry: string;
  location: Location[]; 
  logo: string | null;
  glimpses: { url: string }[];
  casestudy: string | null;
  impacts: Impact[];
  stack: Solution[];
  services: Service[];
  websiteurl: string;
}

const ITEMS_PER_PAGE = 9; // Change this as needed

const SuccessStoryPage = () => {
  const [successStories, setSuccessStories] = useState<SuccessStory[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedTechStack, setSelectedTechStack] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadStories = async () => {
      const stories = await fetchSuccessStories();
      setSuccessStories(stories);
    };
    loadStories();
  }, []);

  // Extract markers after data is fetched
  const markers = successStories
    .flatMap((story) =>
      story.location.map((loc) => ({
        lat: loc.lat,
        lon: loc.lon,
        name: story.name,
      }))
    )
    .filter((loc) => loc.lat && loc.lon); // Remove invalid locations

  const allServices = [...new Set(successStories.flatMap((story) => story.services.map((s) => s.name)))];
  const allTechStacks = [...new Set(successStories.flatMap((story) => story.stack.map((s) => s.name)))];
  const allIndustries = [...new Set(successStories.map((story) => story.industry))];

  const handleFilterChange = (value: string, selectedArray: string[], setSelectedArray: Function) => {
    setSelectedArray(
      selectedArray.includes(value)
        ? selectedArray.filter((item) => item !== value)
        : [...selectedArray, value]
    );
  };

  const filteredStories = successStories.filter((story) => {
    const matchesSearch =
      story.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.industry.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesService =
      selectedServices.length === 0 || story.services.some((service) => selectedServices.includes(service.name));

    const matchesTechStack =
      selectedTechStack.length === 0 || story.stack.some((tech) => selectedTechStack.includes(tech.name));

    const matchesIndustry = selectedIndustries.length === 0 || selectedIndustries.includes(story.industry);

    return matchesSearch && matchesService && matchesTechStack && matchesIndustry;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredStories.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedStories = filteredStories.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="container  mx-auto flex flex-col py-20 px-4 gap-8 mt-8 mb-8">


      {/* Flexbox for Side-by-Side Layout */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            
            {/* Writeup Section (1/3 width on desktop) */}
            <div className="w-full md:w-1/3 space-y-4 text-center md:text-left">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-slate-300">Our Global Presence</h2>
              <p className="text-lg text-gray-600 dark:text-slate-400">
                We’ve worked with clients across continents, delivering exceptional 
                software solutions in various industries. From finance to healthcare, 
                our expertise spans the globe.
              </p>
            </div>

            {/* Map Section (2/3 width on desktop) */}
            {markers.length > 0 && (
              <div className="w-full md:w-2/3 bg-white shadow-lg rounded-lg p-4 dark:bg-slate-800 dark:text-slate-300">
                <h3 className="text-xl font-semibold text-gray-700 dark:text-slate-300 mb-4">Where We’ve Worked</h3>
                <div className="w-full h-96 rounded-md overflow-hidden">
                  <SuccessStoryMap markers={markers} />
                </div>
              </div>
            )}

          </div>


      {/* Search Input */}
      <div className="w-full max-w-md mx-auto flex items-center border rounded-lg px-4 py-2 shadow-sm">
        <Search className="w-5 h-5 text-gray-500 " />
        <Input
          type="text"
          placeholder="Search success stories..."
          className="flex-1 px-2 outline-none border-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-1/4 bg-white dark:bg-gray-900 p-4 shadow-md rounded-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Filters</h2>
          <Separator className="mb-4 dark:bg-gray-700" />
          <ScrollArea className="h-[400px] pr-2">
            {[
              { title: "Industry", options: allIndustries, state: selectedIndustries, setState: setSelectedIndustries },
              { title: "Services", options: allServices, state: selectedServices, setState: setSelectedServices },
              { title: "Tech Stack", options: allTechStacks, state: selectedTechStack, setState: setSelectedTechStack },
            ].map(({ title, options, state, setState }) => (
              <div key={title} className="mb-4">
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">{title}</h3>
                {options.map((option) => (
                  <label key={option} className="flex items-center space-x-2 text-gray-800 dark:text-gray-300">
                    <Checkbox
                      checked={state.includes(option)}
                      onCheckedChange={() => handleFilterChange(option, state, setState)}
                    />
                    <span>{option}</span>
                  </label>
                ))}
                <Separator className="mt-4 dark:bg-gray-700" />
              </div>
            ))}
          </ScrollArea>
        </aside>


      {/* Success Stories Grid */}
      <main className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedStories.length > 0 ? (
          paginatedStories.map((story) => (
          <Card
            key={story.uuid}
            onClick={() => window.location.href = `/success-stories/${story.slug}`}
            className="h-full flex flex-col rounded-3xl bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 hover:scale-105 overflow-hidden shadow-lg group transition-all duration-300"
          >
             
              {story.logo && (
                <img src={story.logo} alt={story.name} className="w-full h-32 object-contain p-4" />
              )}
              <CardHeader>
                <CardTitle>{story.name}</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                  <Briefcase className="w-4 h-4" /> {story.industry}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-1">
                <MapPin className="w-4 h-4" /> {story.location?.[0]?.name || "Unknown Location"}         
                </p>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <p className="text-gray-700 dark:text-gray-200 line-clamp-3">{story.content}</p>

              {/* Services Badges */}
              {story.services.length > 0 && (
                <div className="mt-3">
                  <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-300">Services</h4>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {story.services.map((service) => (
                      <Badge key={service.name} className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                        {service.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Tech Stack Badges */}
              {story.stack.length > 0 && (
                <div className="mt-2">
                  <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-300">Tech Stack</h4>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {story.stack.map((tech) => (
                      <Badge key={tech.name} className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                        {tech.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}


            <div className="mt-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
              <Link href={`/success-stories/${story.slug}`}>
                <Button className="mt-4 w-auto flex items-center space-x-1 p-2 text-sm">
                  <Eye size={16} /> {/* Lucide Eye Icon */}
                  <span>Read</span>
                </Button>
              </Link>
              <Link href={`/success-stories/${story.websiteurl}`}>
                <Button className="mt-4 w-auto flex items-center space-x-1 p-2 text-sm">
                  <Link2 size={16} /> {/* Lucide Link Icon */}
                  <span>Visit Url</span> {/* Changed text to reflect the button's action */}
                </Button>
              </Link>
            </div>


              </CardContent>
          
            </Card>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">No success stories found.</p>
        )}
      </main>

      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
      <div className="flex justify-center gap-4 mt-6">
        <Button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
          Previous
        </Button>
        <span className="text-gray-700 dark:text-gray-300">
          Page {currentPage} of {totalPages}
        </span>
        <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
          Next
        </Button>
      </div>
      )}

    </div>
  );
};

export default SuccessStoryPage;
