import { getLandingPage } from "@/data/loaders";
import { generateMetadataObject } from "@/lib/metadata";
import { strapiImage } from "@/lib/strapi/strapiImage";
import type { Viewport } from 'next'


export const viewport: Viewport = {
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
//interactiveWidget: 'resizes-visual',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '0A192F' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}   

export async function generateHomeMetadata() {
  const data = await getLandingPage();
  const seo = data?.data?.seo;

  // ✅ Define BASE URL and Fallbacks
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://bitmutex.com";
  const FALLBACK_TITLE = "Bitmutex | Leading Software Consultancy";
  const FALLBACK_DESCRIPTION = "Bitmutex Technologies specializes in scalable software solutions, enterprise applications, and digital transformation services.";
  const FALLBACK_IMAGE = `${BASE_URL}/landing-page-fallback-og.png`;

  // ✅ Generate base metadata using helper
  const metadata = generateMetadataObject(seo);

  // ✅ Structured Data (JSON-LD for Rich Snippets)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Bitmutex Technologies",
    "url": BASE_URL,
    "logo": `${BASE_URL}/logo.png`,
    "description": seo?.metaDescription || FALLBACK_DESCRIPTION,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-7980228197",
      "contactType": "Customer Support",
      "areaServed": "Global",
      "availableLanguage": ["English"]
    },
    "sameAs": [
      "https://www.linkedin.com/company/bitmutex",
      "https://twitter.com/bitmutex",
      "https://github.com/bitmutex",
      "https://www.instagram.com/bitmutex"
    ]
  };

  return {
    ...metadata, // ✅ Spread existing metadata properties
    title: seo?.metaTitle || FALLBACK_TITLE,
    description: seo?.metaDescription || FALLBACK_DESCRIPTION,
    alternates: {
      canonical: seo?.canonicalURL || `${BASE_URL}/`,
    },
    keywords: seo?.keywords
      ? seo.keywords.split(",").map((kw: string) => kw.trim())
      : ["software consultancy", "enterprise solutions", "cloud computing", "custom software development", "Bitmutex Technologies"], // ✅ Improved fallback keywords
    openGraph: {
      ...metadata.openGraph,
      title: seo?.openGraph?.ogTitle || seo?.metaTitle || FALLBACK_TITLE,
      description: seo?.openGraph?.ogDescription || seo?.metaDescription || FALLBACK_DESCRIPTION,
      url: BASE_URL,
      site_name: "Bitmutex Technologies",
      type: "website", // ✅ Optimized OG type
      images: seo?.metaImage
        ? [{ url: strapiImage(seo.metaImage.url) }]
        : [{ url: FALLBACK_IMAGE }],
    },
    twitter: {
      ...metadata.twitter,
      card: "summary_large_image",
      title: seo?.twitter?.twitterTitle || seo?.metaTitle || FALLBACK_TITLE,
      description: seo?.twitter?.twitterDescription || seo?.metaDescription || FALLBACK_DESCRIPTION,
      images: seo?.metaImage
        ? [{ url: strapiImage(seo.metaImage.url) }]
        : [{ url: FALLBACK_IMAGE }],
    },
    icons: {
      icon: [
        { url: `${BASE_URL}/favicon.ico`, type: "image/x-icon" },
        { url: `${BASE_URL}/favicon-32x32.png`, sizes: "32x32", type: "image/png" },
        { url: `${BASE_URL}/favicon-16x16.png`, sizes: "16x16", type: "image/png" },
      ],
      apple: [
        { url: `${BASE_URL}/apple-touch-icon.png`, sizes: "180x180" },
      ],
      manifest: `${BASE_URL}/site.webmanifest`,
    },
    author: "Bitmutex Technologies",
    publisher: "Bitmutex Technologies",
    other: {
      structuredData: JSON.stringify(structuredData),
    },
  };
}
