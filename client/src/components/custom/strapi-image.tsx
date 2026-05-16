import Image from "next/image";
import { getStrapiURL } from "@/lib/utils";

interface StrapiImageProps {
  src: string;
  alt: string | null;
  className?: string;
  [key: string]: string | number | boolean | undefined | null;
}

/**
 * React component wrapper for Next.js Image with Strapi URL resolution.
 * 
 * KEY DIFFERENCES FROM strapiImage() utility:
 * - Renders a Next.js <Image> component (with optimization: resizing, lazy loading, format conversion)
 * - Used in JSX/component code for rendering blog images, product galleries, etc.
 * - Automatically handles responsive images and performance optimization
 * - Returns JSX instead of a string URL
 * 
 * USES NEXT_PUBLIC_STRAPI_BASE_URL (via getStrapiURL):
 * - This is the public domain URL accessible from the browser
 * - Essential for client-side rendering in production
 * - Set to https://strapiadmin.bitmutex.com in production
 */
export function StrapiImage({
  src,
  alt,
  className,
  ...rest
}: Readonly<StrapiImageProps>) {
  const imageUrl = getStrapiMedia(src);
  if (!imageUrl) return null;

  return <Image src={imageUrl} alt={alt || "No alt text provided."} className={className} {...rest} />;
}

/**
 * Helper function to construct image URLs with base URL handling.
 * Used internally by StrapiImage component.
 * 
 * Handles:
 * - Relative Strapi URLs (adds base URL)
 * - Absolute URLs and data URIs (returns as-is)
 * - Null/undefined values (returns null)
 */
export function getStrapiMedia(url: string | null) {
  if (url == null) return null;
  if (url.startsWith("data:")) return url;
  if (url.startsWith("http") || url.startsWith("//")) return url;
  return getStrapiURL() + url;
}