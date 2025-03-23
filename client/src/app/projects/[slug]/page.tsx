import { fetchProjectBySlug } from "@/data/loaders";
import { notFound } from "next/navigation";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { FaGitAlt,FaExternalLinkAlt} from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";
import { Badge } from "@/components/ui/badge"; // Use a badge component for category styling
import Link from "next/link";
import { Metadata } from "next";
import RenderMarkdown from "@/components/custom/RenderMarkdown";
import { generateMetadataObject } from '@/lib/metadata';
import  fetchContentType  from '@/lib/strapi/fetchContentType';
import { strapiImage } from '@/lib/strapi/strapiImage';
import {extractTextFromRichText} from "@/lib/utils";



interface PageProps {
  params: Promise<{ slug: string }>;
}
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const BASE_URL_NEXT = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const pageData = await fetchContentType('projects', {
    filters: { slug: params.slug }, // Filter by slug
    populate: ["category","seo.metaImage","image"],
  }, true)
  //console.log("Project Data:", pageData); // Debugging output

  if (!pageData) {
    return {
      title: "Project Not Found | Bitmutex Technologies",
      description: "The requested project does not exist. Browse more projects by Bitmutex Technologies.",
      robots: "noindex, nofollow", // Avoid indexing non-existent pages
    };
  }

  const seo = pageData?.seo;
  const metadata = generateMetadataObject(seo);

// Usage example
const richTextString = extractTextFromRichText(pageData.description);


  // ✅ Ensure title fallback to `pageData.title` if `seo.metaTitle` is missing
  const seotitle = seo?.metaTitle 
  ? `${seo.metaTitle} | ${pageData.category?.text || "Uncategorized"} | Bitmutex Projects`
  : `${pageData.name || "Untitled"} |  ${pageData.category?.text || "Uncategorized"}  |Bitmutex Projects`;

  // ✅ use pageData description as fallback if metaDescription is not available
  let seodescription = seo?.metaDescription || richTextString || "";
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
    images: seo?.metaImage 
    ? [{ url: strapiImage(seo?.metaImage.url) }] 
    : pageData?.image 
      ? [{ url: strapiImage(pageData.image.url) }] 
      : [],
    url: `${BASE_URL_NEXT}/projects/${params.slug}`, // Add custom URL field
    site_name: "Bitmutex",
    locale: "en_US",
    type: "article",
  };
  // ✅ Assign canonical URL to `alternates`
  metadata.alternates = {
    canonical: `${BASE_URL_NEXT}/projects/${params.slug}`,
  };
  
  return metadata;
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


export default async function ProjectDetailPage({ params }: PageProps) {
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
                  <FaArrowLeftLong  size={18} /> Go Back
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
                    <FaGitAlt /> View Repository
                  </a>
                </Button>
              )}
              {project.hostedurl && (
                <Button asChild>
                  <a href={project.hostedurl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <FaExternalLinkAlt/> Visit Project
                  </a>
                </Button>
              )}
            </div>

            {/* Category Pill */}
            {project.category && (
              <div className="mt-4">
                <Badge variant="secondary" className="px-3 py-1 rounded-full bg-blue-500 text-white hover:text-slate-800 dark:hover:text-slate-300">
                  {project.category}
                </Badge>
              </div>
            )}

          </CardContent>
        </div>
      </div>

      {/* Full-width Details Accordion */}
      <div className="mt-8 w-full">
        <Accordion type="single" defaultValue="details" collapsible className="w-full">
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

