import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getStrapiURL() {
  return process.env.NEXT_PUBLIC_STRAPI_BASE_URL ?? "http://localhost:1337";
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


export function formatLPA(salary: string): string {
  // Handle range like "500000-800000"
  if (salary.includes("-")) {
    const [min, max] = salary.split("-").map((s) => parseFloat(s.trim()) / 100000);
    if (!isNaN(min) && !isNaN(max)) {
      const fmtMin = min < 1 ? `${parseFloat((min * 100000).toLocaleString("en-IN"))}` : `${min}L`;
      const fmtMax = max < 1 ? `${parseFloat((max * 100000).toLocaleString("en-IN"))}` : `${max}L`;
      return `${fmtMin} – ${fmtMax} per annum`;
    }
  }

  const num = parseFloat(salary);
  if (isNaN(num)) return salary; // fallback for "Not disclosed" etc.

  const lpa = num / 100000;

  // Below 1 lakh — show raw value in Indian format (e.g. 75,000)
  if (lpa < 1) {
    return `${num.toLocaleString("en-IN")} per annum`;
  }

  // Avoid trailing zeros: 1200000 → 12, not 12.0
  const formatted = Number.isInteger(lpa) ? lpa : parseFloat(lpa.toFixed(2));
  return `${formatted} LPA`;
}