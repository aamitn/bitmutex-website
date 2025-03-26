import { Metadata } from "next";
import { fetchSuccessStories } from "@/data/loaders";
import SuccessStoriesClient from "./SuccessStoriesClient";
import  fetchContentType  from '@/lib/strapi/fetchContentType';
import { generateMetadataObject } from '@/lib/metadata';
import { strapiImage } from '@/lib/strapi/strapiImage';

let heading: string = '', sub_heading: string = '', description: string = '';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const BASE_URL_NEXT = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const pageData = await fetchContentType('stories-page', {
    populate: ["seo","seo.metaImage"],
  }, true)
  
  // console.log("Stories Page Data:", pageData); // Debugging output

  
  if (!pageData) {
    return {
      title: "Story Not Found | Bitmutex Technologies",
      description: "The requested story does not exist. Browse more stories by Bitmutex Technologies.",
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
    
    images: seo?.metaImage
    ? [{ url: strapiImage(seo.metaImage.url) }]
    : pageData?.image
      ? [{ url: strapiImage(pageData.image.url) }]
      : [{ url: `${BASE_URL_NEXT}/bmss.png`}], // Fallback to predefined placeholder
    

    url: `${BASE_URL_NEXT}/success-stories`, // Add custom URL field
    site_name: "Bitmutex",
    locale: "en_US",
    type: "website",
  };
    // ✅ Assign canonical URL to `alternates`
    metadata.alternates = {
      canonical: `${BASE_URL_NEXT}/success-stories`,
    };
  
  return metadata;
}


  export default async function SuccessStoryPage() {
  const successStories = await fetchSuccessStories();

  return (
    <div className="container mx-auto py-20 px-4 gap-8">
      {/* Header */}
      <div className="text-center">
        <span className="font-bold uppercase text-primary tracking-wide">{heading}</span>
        <h2 className="font-heading text-4xl font-bold text-gray-900 dark:text-white mt-2">{sub_heading}</h2>
        <p className="text-lg text-muted-foreground mt-3 max-w-xl mx-auto">
          {description}
        </p>
      </div>

      {/* ✅ Pass data to the Client Component */}
      <SuccessStoriesClient stories={successStories} />
    </div>
  );
}
