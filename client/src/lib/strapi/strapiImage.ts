import { unstable_noStore as noStore } from 'next/cache';

export function strapiImage(url?: string): string {
  noStore();
  if (!url) return ""; // Handle undefined/null cases

  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_BASE_URL || "http://localhost:1337";

  return url.startsWith("/") ? `${baseUrl}${url}` : url;
}
