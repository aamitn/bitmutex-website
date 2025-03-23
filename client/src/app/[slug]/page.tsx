import { draftMode } from "next/headers";
import { getAllPagesSlugs, getPageBySlug } from "@/data/loaders";
import { BlockRenderer } from "@/components/block-renderer";
import { generateMetadataObject } from "@/lib/metadata"; // ✅ SEO Helper
import { Metadata } from "next";
import { strapiImage } from '@/lib/strapi/strapiImage';

export async function generateStaticParams() {
  const pages = await getAllPagesSlugs();
  return pages.data.map((page) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const { slug } = params;

  // ✅ Fetch page data for the given slug
  const { isEnabled: isDraftMode } = await draftMode();
  const status = isDraftMode ? "draft" : "published";
  const data = await getPageBySlug(slug, status);

  if (!data?.data?.length) {
    return {
      title: "Page Not Found | Bitmutex Technologies",
      description: "The requested page does not exist. Browse more content by Bitmutex Technologies.",
      robots: "noindex, nofollow",
    };
  }

  const pageData = data.data[0]; // Extract the page data
  const seo = pageData?.seo;

  // ✅ Generate metadata using the helper function
  const metadata = generateMetadataObject(seo);

  // ✅ Ensure fallback values if SEO fields are missing
  const title = seo?.metaTitle
    ? `${seo.metaTitle} | Bitmutex`
    : `${pageData.title || "Untitled"} | Bitmutex`;

  let description = seo?.metaDescription || pageData?.description || "Explore insightful content on Bitmutex.";
  if (description.length > 150) {
    description = description.substring(0, description.lastIndexOf(" ", 150)) + "...";
  }

  metadata.title = title;
  metadata.description = description;

  metadata.openGraph = {
    ...(metadata.openGraph as any),
    title,
    description,
    images: seo?.metaImage 
    ? [{ url: strapiImage(seo?.metaImage.url) }] 
    : [{ url: `${BASE_URL}/pages-fallback.png`}],
    url: `${BASE_URL}/${slug}`, // ✅ Dynamic URL
    site_name: "Bitmutex",
    locale: "en_US",
    type: "website",
  };

  metadata.alternates = {
    canonical: `${BASE_URL}/${slug}`,
  };

  return metadata;
}

interface PageProps {
  params: { slug: string };
}

export default async function PageBySlugRoute({ params }: PageProps) {
  const { slug } = params;
  const { isEnabled: isDraftMode } = await draftMode();
  const status = isDraftMode ? "draft" : "published";

  const data = await getPageBySlug(slug, status);
  const blocks = data?.data[0]?.blocks;

  if (!blocks) return null;

  return <div>{blocks ? <BlockRenderer blocks={blocks} /> : null}</div>;
}
