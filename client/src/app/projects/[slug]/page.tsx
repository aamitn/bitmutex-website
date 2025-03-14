"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import ReactMarkdown from "react-markdown";

// API Base URL (update as needed)
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";


const renderMarkdown = (content: string) => {
  if (!content) return null;
  return (
    <ReactMarkdown
      components={{
        p: ({ node, ...props }) => <p className="mb-2 text-gray-600 dark:text-gray-300" {...props} />,
        h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mt-4" {...props} />,
        h2: ({ node, ...props }) => <h2 className="text-xl font-semibold mt-3" {...props} />,
        ul: ({ node, ...props }) => <ul className="list-disc pl-5" {...props} />,
        ol: ({ node, ...props }) => <ol className="list-decimal pl-5" {...props} />,
        blockquote: ({ node, ...props }) => <blockquote className="border-l-4 pl-4 italic text-gray-500" {...props} />,
        code: ({ node, ...props }) => <code className="bg-gray-100 dark:bg-gray-800 p-1 rounded" {...props} />,
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

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

const ProjectPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProject = async () => {
      if (!slug) return;

      try {
        const response = await fetch(`${API_URL}/api/projects?filters[slug]=${slug}&populate=*`);
        const result = await response.json();

        if (!result.data || result.data.length === 0) {
          throw new Error("Project not found");
        }

        const projectData = result.data[0];

        setProject({
          id: projectData.id,
          name: projectData.name || "Untitled Project",
          description: projectData.description || [],
          imageUrl: projectData.image?.url ? `${API_URL}${projectData.image.url}` : null,
          category: projectData.category?.name || "Uncategorized",
          repourl: projectData.repourl || null,
          hostedurl: projectData.hostedurl || null,
          details: projectData.details || [],
        });
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p className="text-gray-500">Project not found.</p>
        <Button onClick={() => router.push("/projects")}>Back to Projects</Button>
      </div>
    );
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
            <CardTitle className="text-2xl font-bold">{project.name}</CardTitle>
          </CardHeader>
          <CardContent className="p-0 mt-4">
            <div className="text-gray-600 dark:text-gray-300 text-lg">
              {renderRichText(project.description)}
            </div>

            {/* Buttons for Repo and Hosted URL */}
            <div className="mt-6 flex gap-4">
              {project.repourl && (
                <Button asChild variant="outline">
                  <a href={project.repourl} target="_blank" rel="noopener noreferrer">
                    View Repository
                  </a>
                </Button>
              )}
              {project.hostedurl && (
                <Button asChild>
                  <a href={project.hostedurl} target="_blank" rel="noopener noreferrer">
                    Visit Project
                  </a>
                </Button>
              )}
            </div>
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
              {renderMarkdown(project.details)}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Back Button */}
      <div className="mt-6">
        <Button onClick={() => router.push("/projects")}>Back to Projects</Button>
      </div>
    </div>
  );
};

export default ProjectPage;
