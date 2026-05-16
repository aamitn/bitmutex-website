import { unstable_noStore as noStore } from 'next/cache';

/**
 * Utility function to construct Strapi image URLs for SEO metadata and data transformation.
 * 
 * KEY DIFFERENCES FROM strapi-image.tsx/StrapiImage component:
 * - Returns a string URL instead of rendering a React component
 * - Does NOT wrap in Next.js Image component (no optimization)
 * - Used for metadata, OG images, and API response transformations
 * - Used in server-side data loaders and SEO functions
 * 
 * USES NEXT_PUBLIC_STRAPI_BASE_URL:
 * - This is the public domain URL accessible from the browser
 * - Essential for client-side rendering and metadata in production
 * - Set to https://strapiadmin.bitmutex.com in production
 * 
 * @param url - Relative URL from Strapi (e.g., "/uploads/image.png") or full URL
 * @returns Full image URL ready for use in metadata or API responses
 */
export function strapiImage(url?: string): string {
  noStore();
  if (!url) return ""; // Handle undefined/null cases

  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_BASE_URL || "http://localhost:1337";

  return url.startsWith("/") ? `${baseUrl}${url}` : url;
}
