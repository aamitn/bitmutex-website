import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { fetchProjects } from "@/data/loaders";

type Project = {
  id: number;
  name: string;
  description: string;
  slug: string;
  imageUrl?: string;
  category?: string;
};

export default async function ProjectsPage({ searchParams }: { searchParams: { category?: string; search?: string } }) {
  // Fetch projects from the data loader
  const projects: Project[] = await fetchProjects();

  // Get categories dynamically from fetched projects
  const categories = ["all", ...new Set(projects.map((p) => p.category ?? "Uncategorized"))];

  // Apply search and filter
  const searchQuery = searchParams?.search?.toLowerCase() || "";
  const selectedCategory = searchParams?.category || "all";

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery) || p.description.toLowerCase().includes(searchQuery);
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto p-6 flex mt-20 mb-20 flex-col md:flex-row gap-6">
      {/* Sidebar */}
      <div className="md:w-1/4 w-full p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Filters</h2>

        {/* Search Input */}
        <form method="GET">
          <Input type="text" name="search" placeholder="Search projects..." className="mb-4 bg-white dark:bg-gray-700" defaultValue={searchQuery} />
          <Select name="category" defaultValue={selectedCategory}>
            <SelectTrigger className="bg-white dark:bg-gray-700">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-700">
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="submit" className="mt-4 w-full">Apply Filters</Button>
        </form>
      </div>

      {/* Projects List */}
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-center mb-6">Our Projects</h1>

        {filteredProjects.length > 0 ? (
          <div className="space-y-4">
            {filteredProjects.map((project) => (
              <Link key={project.id} href={`/projects/${project.slug}`} className="block">
                <Card className="relative flex flex-col sm:flex-row items-start gap-4 p-4 hover:shadow-md transition-shadow rounded-xl cursor-pointer group">
                  {project.imageUrl && <img src={project.imageUrl} alt={project.name} className="w-24 h-24 object-cover rounded-lg" />}

                  {/* Category Pills - Positioned Top-Right */}
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-1 text-xs font-semibold text-white bg-blue-500 rounded-full">
                      {project.category || "N/A"}
                    </span>
                  </div>

                  <div className="flex-1">
                    <CardHeader className="p-0">
                      <CardTitle className="text-lg font-semibold">{project.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 mt-2">
                      <p className="text-gray-600 dark:text-gray-300 text-sm">{project.description}</p>

                      {/* View Project Button (Visible Only on Hover) */}
                      <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button asChild>
                          <span>View Project</span>
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No projects found.</p>
        )}
      </div>
    </div>
  );
}
