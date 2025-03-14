"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Project {
  id: number;
  name: string;
  description: string;
  slug: string;
  imageUrl?: string;
  category?: string;
}

const API_URL = process.env.NEXT_PUBLIC_STRAPI_BASE_URL || "http://localhost:1337";

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${API_URL}/api/projects?populate=*`);
        const result = await response.json();

        if (!result.data || !Array.isArray(result.data)) {
          throw new Error("Invalid response format");
        }

        const projectsData: Project[] = result.data.map((project: any) => ({
          id: project.id,
          name: project.name || "Untitled Project",
          description: project.description?.[0]?.children?.[0]?.text || "No description available.",
          slug: project.slug || "",
          imageUrl: project.image?.formats?.medium?.url
            ? `${API_URL}${project.image.formats.medium.url}`
            : `${API_URL}${project.image?.url || ""}`,
          category: project.category?.text || "Uncategorized",
        }));

        const categoryList: string[] = [
          "all",
          ...new Set(projectsData.map((p: Project) => p.category ?? "Uncategorized"))
        ];
        

        setProjects(projectsData);
        setFilteredProjects(projectsData);
        setCategories(categoryList);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    let filtered = projects;

    if (searchQuery) {
      filtered = filtered.filter((p: Project) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((p: Project) => p.category === selectedCategory);
    }

    setFilteredProjects(filtered);
  }, [searchQuery, selectedCategory, projects]);

  return (
    <div className="container mx-auto p-6 flex mt-20 mb-20 flex-col md:flex-row gap-6">
      {/* Sidebar */}
      <div className="md:w-1/4 w-full p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Filters
        </h2>

        {/* Search Input */}
        <Input
          type="text"
          placeholder="Search projects..."
          className="mb-4 bg-white dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Category Filter */}
        <Select onValueChange={setSelectedCategory} defaultValue="all">
          <SelectTrigger className="bg-white dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-700 dark:text-gray-100">
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat} className="dark:hover:bg-gray-600">
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>


      {/* Projects List */}
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-center mb-6">Our Projects</h1>

        {loading ? (
          <div className="space-y-4">
            {Array(6)
              .fill(null)
              .map((_, index) => (
                <Skeleton key={index} className="h-32 w-full rounded-lg" />
              ))}
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="space-y-4">
            {filteredProjects.map((project: Project) => (
              <Card key={project.id} className="relative flex flex-col sm:flex-row items-start gap-4 p-4 hover:shadow-md transition-shadow rounded-xl">
            {project.imageUrl && (
              <img
                src={project.imageUrl}
                alt={project.name}
                className="w-24 h-24 object-cover rounded-lg"
              />
            )}

            {/* Category Pills - Positioned Top-Right */}
            <div className="absolute top-2 right-2">
              <span className="px-2 py-1 text-xs font-semibold text-white bg-blue-500 dark:bg-blue-600 rounded-full">
                {project.category}
              </span>
            </div>

            <div className="flex-1">
              <CardHeader className="p-0">
                <CardTitle className="text-lg font-semibold">{project.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-0 mt-2">
                <p className="text-gray-600 dark:text-gray-300 text-sm">{project.description}</p>

                <Button asChild className="mt-2">
                  <a href={`/projects/${project.slug}`}>View Project</a>
                </Button>
              </CardContent>
            </div>
          </Card>

            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No projects found.</p>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
