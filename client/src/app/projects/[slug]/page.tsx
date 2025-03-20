import { fetchProjectBySlug } from "@/data/loaders";
import { notFound } from "next/navigation";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Github, ArrowLeft, ExternalLink } from "lucide-react"; // Import Lucide Icons
import { Badge } from "@/components/ui/badge"; // Use a badge component for category styling
import Link from "next/link";
import { Metadata } from "next";
import RenderMarkdown from "@/components/custom/RenderMarkdown";

interface PageProps {
  params: Promise<{ slug: string }>;
}
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolveParams = await params;
  const slug = resolveParams?.slug;
  const project = await fetchProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found | Bitmutex Technologies",
      description: "The requested project does not exist. Browse more projects by Bitmutex Technologies.",
      robots: "noindex, nofollow", // Avoid indexing non-existent pages
    };
  }

  // Extract first 150 chars from `details` or use `description`
  const shortDescription = project.details
    ? project.details.substring(0, 150) + "..."
    : project.description;

  // Construct SEO title
  const seoTitle = `${project.name} - ${project.category} | Bitmutex Technologies`;

  return {
    title: seoTitle,
    description: shortDescription,
    robots: "index, follow", // Ensure it's indexed properly
    openGraph: {
      title: seoTitle,
      description: shortDescription,
      url: `https://bitmutex.com/projects/${project.slug}`,
      type: "article",
      images: project.imageUrl ? [{ url: project.imageUrl, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: shortDescription,
      images: project.imageUrl ? [project.imageUrl] : [],
    },
    alternates: {
      canonical: `https://bitmutex.com/projects/${project.slug}`, // Ensure correct indexing
    },
  };
}

// Helper function to render Strapi "blocks" or "richtext"
const renderRichText = (content: any) => {
  if (!content) return null;

  if (Array.isArray(content)) {
    return content.map((block, index) => {
      if (block.type === "paragraph") {
        return <p key={index} className="mb-2">{block.children.map((child: any) => child.text).join(" ")}</p>;
      }
      return null;
    });
  }

  return <p>{content}</p>;
};


export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await fetchProjectBySlug(slug);

  if (!project) {
    return notFound();
  }

  return (
    <div className="container mt-20 mb-20 mx-auto p-6">
      {/* Image + Description (Side by Side on Desktop) */}
      <div className="flex flex-col md:flex-row items-start gap-6">
        {project.imageUrl && (
          <img
            src={project.imageUrl}
            alt={project.name}
            className="w-full md:w-1/2 h-auto object-cover rounded-lg"
          />
        )}

        <div className="flex-1">
        <CardHeader className="p-0">
            {/* Keep Title & Button in One Row */}
            <div className="flex flex-row items-center justify-between gap-x-4 flex-wrap">
              <CardTitle className="text-xl sm:text-2xl font-bold">{project.name}</CardTitle>

              {/* Back to Industries Button with Lucide Icon */}
              <Link href="/projects">
                <Button variant="outline" className="flex items-center gap-2 whitespace-nowrap">
                  <ArrowLeft size={18} /> Go Back
                </Button>
              </Link>
            </div>
          </CardHeader>

          <CardContent className="p-0 mt-4">
            <div className="text-gray-600 dark:text-gray-300 text-lg">
              {renderRichText(project.description)}
            </div>

            {/* Buttons for Repo and Hosted URL with Icons */}
            <div className="mt-6 flex gap-4">
              {project.repourl && (
                <Button asChild variant="outline">
                  <a href={project.repourl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <Github size={18} /> View Repository
                  </a>
                </Button>
              )}
              {project.hostedurl && (
                <Button asChild>
                  <a href={project.hostedurl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <ExternalLink size={18} /> Visit Project
                  </a>
                </Button>
              )}
            </div>

            {/* Category Pill */}
            {project.category && (
              <div className="mt-4">
                <Badge variant="secondary" className="px-3 py-1 rounded-full bg-blue-500 text-white">
                  {project.category}
                </Badge>
              </div>
            )}

          </CardContent>
        </div>
      </div>

      {/* Full-width Details Accordion */}
      <div className="mt-8 w-full">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="details">
            <AccordionTrigger>Project Details</AccordionTrigger>
            <AccordionContent>
              <div className="text-gray-600 dark:text-gray-300 text-lg">
              <RenderMarkdown content={project.details} />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>


    </div>
  );
};

