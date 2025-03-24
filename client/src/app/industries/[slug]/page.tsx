import { fetchIndustryBySlug } from "@/data/loaders";
import { notFound } from "next/navigation";
import * as LucideIcons from "lucide-react";
import { FC } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import sanitizeHtml from "sanitize-html";
import Link from "next/link";
import { Metadata } from "next";
import { generateMetadataObject } from '@/lib/metadata';
import  fetchContentType  from '@/lib/strapi/fetchContentType';
import { strapiImage } from '@/lib/strapi/strapiImage';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const BASE_URL_NEXT = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const resolveParams = await params;
  const slug = await resolveParams?.slug;

  const pageData = await fetchContentType('industries', {
    filters: { slug: slug}, // Filter by slug
    populate: ["seo.metaImage"],
  }, true)
  //console.log("Page Data:", pageData); // Debugging output

  if (!pageData) {
    return {
      title: "Page Not Found | Bitmutex Technologies",
      description: "The requested page does not exist. Browse more industry pages by Bitmutex Technologies.",
      robots: "noindex, nofollow", // Avoid indexing non-existent pages
    };
  }

  const seo = pageData?.seo;
  const metadata = generateMetadataObject(seo);

  // ✅ Ensure title fallback to `pageData.title` if `seo.metaTitle` is missing
  const seotitle = seo?.metaTitle 
  ? `${seo.metaTitle} | Bitmutex`
  : `${pageData.name   || "Untitled"} Industry | Bitmutex`;

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

    images: seo?.metaImage
    ? [{ url: strapiImage(seo.metaImage.url) }]
    : pageData?.image
      ? [{ url: strapiImage(pageData.image.url) }]
      : [{ url: `${BASE_URL_NEXT}/bmind.png`}], // Fallback to predefined placeholder

    url: `${BASE_URL_NEXT}/industries/${slug}`, // Add custom URL field
    site_name: "Bitmutex",
    locale: "en_US",
    type: "website",
  };
  // ✅ Assign canonical URL to `alternates`
  metadata.alternates = {
    canonical: `${BASE_URL_NEXT}/industries/${slug}`,
  };
  
  return metadata;
}



// ✅ Get the correct Lucide icon
const getLucideIcon = (iconName: string): FC<any> => {
  // ✅ Convert kebab-case to PascalCase for Lucide icons
  const pascalCaseName = iconName.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join("");;

  // Check if the icon exists in the imported LucideIcons and return it
  const Icon = (LucideIcons as any)[pascalCaseName];

  // Fallback to a default icon if the requested icon does not exist
  if (!Icon) {
    return LucideIcons.AlertCircle; // Replace this with a valid fallback icon if needed
  }

  return Icon;
};

export default async function IndustryDetailPage({ params }: PageProps) {
  // Resolve the params to get the slug
  const { slug } = await params;

  const industry = await fetchIndustryBySlug(slug);

  if (!industry) {
    return notFound();
  }

  const IconComponent = getLucideIcon(industry.icon);

  // Sanitize HTML content
  const sanitizedDetails = sanitizeHtml(industry.details, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      "img", "iframe", "h1", "h2", "h3", "h4", "h5", "h6", "a"
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      iframe: ["src", "width", "height", "frameborder", "allow", "allowfullscreen"],
      img: ["src", "alt", "width", "height", "style"],
      a: ["href", "target", "rel"],
    },
  });

  return (
    <div className="container mx-auto py-12 px-6 mt-8 mb-8">
      {/* Industry Title Section */}
      <div className="flex items-center space-x-6 bg-gradient-to-r from-blue-500 to-purple-500 p-6 rounded-xl shadow-xl mb-8">
        <div className="p-4 bg-white bg-opacity-20 backdrop-blur-lg rounded-full">
          <IconComponent className="w-14 h-14 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-white">{industry.name}</h1>
      </div>

      <div className="flex justify-center mt-8 mb-4">
        <Link href="/industries">
          <Button variant="outline">Go Back to Industries</Button>
        </Link>
      </div>

      {/* Industry Description */}
      <p className="text-lg text-gray-800 dark:text-gray-300 mb-8 p-6 bg-white dark:bg-gray-900 bg-opacity-80 backdrop-blur-md rounded-lg shadow-md border-l-4 border-blue-500 dark:border-blue-400">
        {industry.description}
      </p>

      {/* Accordion for Details */}
      <Accordion type="single" collapsible defaultValue="details" className="mb-10">
        <AccordionItem value="details">
          <AccordionTrigger className="text-2xl font-semibold text-gray-900 dark:text-gray-300">
          
          <p className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white text-center mt-6 mb-8">
            The State of  
            <span className="relative px-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-amber-500">
                {industry.name}
            </span> 
            Industry
            </p>
            
          </AccordionTrigger>
          <AccordionContent>
            {/* Render sanitized HTML safely */}
            <div
                className="ckeditor-content prose prose-lg dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 leading-relaxed ckeditor-content"
                dangerouslySetInnerHTML={{ __html: sanitizedDetails }}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Challenges & Opportunities Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Challenges */}
        <div className="p-8 bg-white dark:bg-gray-900 bg-opacity-80 backdrop-blur-md shadow-2xl rounded-lg border border-gray-300 dark:border-gray-700 transition-transform duration-300 hover:scale-105">
          <h2 className="text-3xl font-bold text-red-500 mb-5">Challenges</h2>
          <ul className="space-y-4">
            {industry.challenges.map((challenge: { name: string }, index: number) => (
              <li
                key={index}
                className="flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 bg-gray-100 dark:bg-gray-800 hover:bg-red-100 dark:hover:bg-red-900"
              >
                <LucideIcons.AlertCircle className="w-6 h-6 text-red-500" />
                <span className="text-gray-700 dark:text-gray-300">{challenge.name}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Opportunities */}
        <div className="p-8 bg-white dark:bg-gray-900 bg-opacity-80 backdrop-blur-md shadow-2xl rounded-lg border border-gray-300 dark:border-gray-700 transition-transform duration-300 hover:scale-105">
          <h2 className="text-3xl font-bold text-green-500 mb-5">Opportunities</h2>
          <ul className="space-y-4">
            {industry.opportunities.map((opportunity: { name: string }, index: number) => (
              <li
                key={index}
                className="flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 bg-gray-100 dark:bg-gray-800 hover:bg-green-100 dark:hover:bg-green-900"
              >
                <LucideIcons.Star className="w-6 h-6 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300">{opportunity.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Solutions Grid */}
      <h2 className="text-3xl font-bold text-center text-blue-500 mt-12 mb-6">
        Granular Solutions
      </h2>
      <div className="mb-2 grid grid-cols-1 md:grid-cols-3 gap-6">
        {industry.solutions.map((solution: { name: string }, index: number) => (
          <Card
            key={index}
            className="p-6 flex items-center space-x-4 bg-white dark:bg-gray-900 bg-opacity-80 backdrop-blur-md shadow-xl rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:scale-105"
          >
            <LucideIcons.CheckCircle className="w-6 h-6 text-blue-500" />
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300">{solution.name}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
