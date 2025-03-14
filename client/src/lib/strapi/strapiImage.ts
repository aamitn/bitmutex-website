import { unstable_noStore as noStore } from 'next/cache';

export function strapiImage(url: string): string {
  noStore();
  if (url.startsWith("/")) {

    return process.env.NEXT_PUBLIC_STRAPI_BASE_URL + url
  }
  return url
}