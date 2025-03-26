import { fetchSuccessStoryBySlug } from "@/data/loaders";
import SuccessStoryClient from "./SuccessStoryClient";
import { generateMetadataObject } from '@/lib/metadata';
import  fetchContentType  from '@/lib/strapi/fetchContentType';
import { strapiImage } from '@/lib/strapi/strapiImage';
import { Metadata } from "next";
import { generateCombinedOgImage } from '@/lib/strapi/generateOgImage';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const BASE_URL_NEXT = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const resolveParams = await params;
  const slug = await resolveParams?.slug;

  const pageData = await fetchContentType('success-stories', {
    filters: { slug: slug }, // Filter by slug
    populate: ["seo.metaImage","logo"],
  }, true)
  //console.log("Page Data:", pageData); // Debugging output

  if (!pageData) {
    return {
      title: "Story Not Found | Bitmutex Technologies",
      description: "The requested story does not exist. Browse more stories by Bitmutex Technologies.",
      robots: "noindex, nofollow", // Avoid indexing non-existent pages
    };
  }

  const seo = pageData?.seo;
  const metadata = generateMetadataObject(seo);

  // ✅ Ensure title fallback to `pageData.title` if `seo.metaTitle` is missing
  const seotitle = seo?.metaTitle 
  ? `${seo.metaTitle}  | Success Stories with Bitmutex`
  : `${pageData.name || "Untitled"}  | Success Stories with Bitmutex`;

  // ✅ Use pageData description as fallback if metaDescription is not available
  let seodescription = seo?.metaDescription || `How ${pageData.name} succeeded with Bitmutex - ${pageData.content || ""}`;
  if (seodescription.length > 150) {
    seodescription = seodescription.substring(0, seodescription.lastIndexOf(" ", 150)) + "...";
  }

  // ✅ Override normal title field
  metadata.title = seotitle;
  metadata.description = seodescription;

    // If seo.metaImage exists, use it. Otherwise, if logo exists, generate a combined image.
    let ogImages: { url: string }[] = [];
    if (seo?.metaImage) {
      ogImages = [{ url: strapiImage(seo.metaImage.url) }];
    } else if (pageData?.logo) {
      // Generate a combined image using our utility function.
      const generatedImageUrl = await generateCombinedOgImage(strapiImage(pageData.logo.url), slug, BASE_URL_NEXT);
      ogImages = [{ url: generatedImageUrl }];
    } else {
      ogImages = [];
    }

  // ✅ Override OG fields
  metadata.openGraph = {
    ...(metadata.openGraph as any), // Cast to 'any' to allow unknown properties
    title: seotitle, 
    description: seodescription,
    images: ogImages,
    url: `${BASE_URL_NEXT}/success-stories/${slug}`, // Add custom URL field
    site_name: "Bitmutex",
    locale: "en_US",
    type: "article",
  };
  // ✅ Assign canonical URL to `alternates`
  metadata.alternates = {
    canonical: `${BASE_URL_NEXT}/success-stories/${slug}`,
  };
  
  return metadata;
}


// Fetch data on the server
const fetchData = async (slug: string) => {
  return await fetchSuccessStoryBySlug(slug);
};

export default async function SuccessStoryDetails({ params }: PageProps) {
  const resolveParams = await params;
  const slug = resolveParams?.slug;

  const story = await fetchData(slug);

  if (!story) {
    return <p className="text-center text-gray-500 mt-10">Success story not found.</p>;
  }

  return <SuccessStoryClient story={story} />;
}
