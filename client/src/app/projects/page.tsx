// @ts-nocheck
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { fetchProjects } from "@/data/loaders";
import { generateMetadataObject } from '@/lib/metadata';
import  fetchContentType  from '@/lib/strapi/fetchContentType';
import { Metadata } from "next";

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
  // console.log("BLOG Page Data:", pageData); // Debugging output

  
  if (!pageData) {
    return {
      title: "Blog Not Found | Bitmutex Technologies",
      description: "The requested blog/article does not exist. Browse more blogs by Bitmutex Technologies.",
      robots: "noindex, nofollow", // Avoid indexing non-existent pages
    };
  }

  
  const seo = pageData?.seo;
  const metadata = generateMetadataObject(seo);

  heading = pageData.heading;
  sub_heading = pageData.sub_heading;
  description = pageData.description;

  // ✅ Ensure title fallback to `pageData.title` if `seo.metaTitle` is missing
  const seotitle = seo?.metaTitle 
  ? `${seo.metaTitle}  | Bitmutex`
  : `${pageData.heading || "Untitled"} | Bitmutex`;

  // ✅ use pageData description as fallback if metaDescription is not available
  let seodescription = seo?.metaDescription || pageData.description || "";
  if (seodescription.length > 150) {
    seodescription = seodescription.substring(0, seodescription.lastIndexOf(" ", 150)) + "...";
  }

  // ✅ Override normal title field
  metadata.title = seotitle;
  metadata.description = seodescription;

  // ✅ Override OG fields
  metadata.openGraph = {
    ...(metadata.openGraph as any), // Cast to 'any' to allow unknown properties
    title: seotitle, 
    description: seodescription,
    url: `${BASE_URL_NEXT}/projects`, // Add custom URL field
    site_name: "Bitmutex",
    locale: "en_US",
    type: "website",
  };
    // ✅ Assign canonical URL to `alternates`
    metadata.alternates = {
      canonical: `${BASE_URL_NEXT}/projects`,
    };
  
  return metadata;
}

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<{ category?: string; search?: string }> }) {
  const resolvedSearchParams = await searchParams; // Await the Promise

  // Fetch projects from the data loader
  const projects: Project[] = await fetchProjects();

  // Get categories dynamically from fetched projects
  const categories = ["all", ...new Set(projects.map((p) => p.category ?? "Uncategorized"))];

  // Apply search and filter
  const searchQuery = resolvedSearchParams?.search?.toLowerCase() || "";
  const selectedCategory = resolvedSearchParams?.category || "all";

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

        {/* Header */}
        <div className="text-center">
          <span className="font-bold uppercase text-primary tracking-wide">{heading}</span>
          <h2 className="font-heading text-4xl font-bold text-gray-900 dark:text-white mt-2">{sub_heading}</h2>
          <p className="text-lg text-muted-foreground mt-3 max-w-xl mx-auto pb-4">
          {description}
          </p>
       </div>

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
