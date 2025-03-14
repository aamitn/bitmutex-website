"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Copy, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Resource {
  id: number;
  url: string;
}

interface Metadata {
  title: string;
  description: string;
  image: string;
  url: string;
}

export default function FreeResourceClient({ resources }: { resources: Resource[] }) {
  const { theme } = useTheme(); // Detect theme
  const [metadata, setMetadata] = useState<Record<number, Metadata>>({});
  const [isClient, setIsClient] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    async function fetchMetadata() {
      const fetchedMetadata: Record<number, Metadata> = {};
      for (const resource of resources) {
        try {
          const response = await fetch(`/api/og?url=${encodeURIComponent(resource.url)}`);
          const data = await response.json();
          fetchedMetadata[resource.id] = data;
        } catch (error) {
          console.error("Error fetching metadata:", error);
        }
      }
      setMetadata(fetchedMetadata);
    }

    if (resources.length) fetchMetadata();
  }, [resources]);

  const handleCopy = (url: string, id: number) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredResources = resources.filter(resource => {
    const meta = metadata[resource.id];
    return meta?.title?.toLowerCase().includes(searchQuery.toLowerCase()) || resource.url.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const totalPages = Math.ceil(filteredResources.length / pageSize);
  const paginatedResources = filteredResources.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (!isClient) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <TooltipProvider>
      <section className="space-y-6">
        {/* Search Input */}
        <div className="flex items-center gap-3">
          <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <Input
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full max-w-lg bg-gray-100 dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-4 py-2 transition-all"
          />
        </div>

        {/* Resource Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-gray-100 dark:bg-gray-900 text-black dark:text-white p-4 rounded-2xl">
          {paginatedResources.length > 0 ? (
            paginatedResources.map((resource) => {
              const meta = metadata[resource.id];

              return (
                <Card key={resource.id} className="h-full flex flex-col shadow-lg bg-white dark:bg-gray-950 text-black dark:text-white border-gray-300 dark:border-gray-700 rounded-2xl">
                  {meta ? (
                    <img src={meta.image} alt={meta.title} className="w-full h-40 object-cover rounded-t-2xl" />
                  ) : (
                    <Skeleton className="w-full h-40" />
                  )}
                  <CardHeader>
                    <CardTitle className="text-lg font-medium">
                      {meta ? meta.title : <Skeleton className="w-3/4 h-6" />}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-grow">
                    <p className="text-gray-600 dark:text-gray-400 text-sm flex-grow">
                      {meta ? meta.description : <Skeleton className="w-full h-4" />}
                    </p>
                    {meta ? (
                      <div className="flex gap-2 mt-3">
                        {/* Visit Resource Button */}
                        <Button asChild variant="outline" className="flex-1 flex items-center justify-center gap-2 border-gray-400 dark:border-gray-500 text-black dark:text-white bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-all">
                          <a href={meta.url} target="_blank" rel="noopener noreferrer">
                            Visit Resource
                            <ArrowUpRight className="w-4 h-4" />
                          </a>
                        </Button>

                        {/* Copy Button */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleCopy(meta.url, resource.id)}
                              className="border-gray-400 dark:border-gray-500 text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-all"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="bg-gray-100 dark:bg-gray-900 text-black dark:text-white border border-gray-300 dark:border-gray-700 shadow-lg">
                            {copiedId === resource.id ? "Copied!" : "Copy URL"}
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    ) : (
                      <Skeleton className="w-full h-10 mt-3" />
                    )}
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <p className="text-gray-600 dark:text-gray-400 text-center col-span-full">No resources found.</p>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <Button variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>
              <ChevronLeft className="w-5 h-5" />
              Previous
            </Button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(page => (
                <Button key={page} variant={page === currentPage ? "default" : "outline"} onClick={() => setCurrentPage(page)} className="px-3 py-1">
                  {page}
                </Button>
              ))}
            </div>

            <Button variant="outline" disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>
              Next
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        )}
      </section>
    </TooltipProvider>
  );
}
