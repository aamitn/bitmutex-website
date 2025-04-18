import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getStrapiURL() {
  return process.env.STRAPI_BASE_URL ?? "http://localhost:1337";
}

export function getStrapiMedia(url: string | null) {
  if (url == null) return null;
  if (url.startsWith("data:")) return url;
  if (url.startsWith("http") || url.startsWith("//")) return url;
  return `${getStrapiURL()}${url}`;
}

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}


export const truncate = (text: string, length: number) => {
  return text.length > length ? text.slice(0, length) + "..." : text;
};

export const formatNumber = (
  number: number,
  locale: string = "en-US"
): string => {
  return new Intl.NumberFormat(locale, {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(number);
};

export const extractTextFromRichText = (content: any): string => {
  if (!content) return "";

  if (Array.isArray(content)) {
    return content
      .map((block) => (block.type === "paragraph" ? block.children.map((child: any) => child.text).join(" ") : ""))
      .join("\n"); // Join paragraphs with newlines
  }

  return String(content);
};

export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 225;
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}


export function isValidUrl(url?: string): boolean {
  if (!url) return false;
  
  const urlPattern = /^(\/[\w-./?%&=]*)$|^(https?:\/\/(localhost|\d{1,3}(\.\d{1,3}){3}|[\w.-]+)(:\d+)?(\/[\w-./?%&=]*)?)$/;  
  return urlPattern.test(url);
}