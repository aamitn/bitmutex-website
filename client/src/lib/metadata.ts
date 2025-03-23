import { strapiImage } from '@/lib/strapi/strapiImage';

export function generateMetadataObject(seo: any) {
  return {
    title: seo?.metaTitle || 'Default Title', // Fallback to 'Default Title' if title is not provided
    description: seo?.metaDescription || 'Default Description', // Fallback to 'Default Description'
    robots: seo?.metaRobots || 'index, follow', // Ensure it's indexed properly
    openGraph: {
      title: seo?.ogTitle || seo?.metaTitle || 'Default OG Title',
      description: seo?.ogDescription || seo?.metaDescription || 'Default OG Description',
      images: seo?.metaImage ? [{ url: strapiImage(seo?.metaImage.url) }] : [],
      type: seo?.ogType || 'website',
    },
    twitter: {
      card: seo?.twitterCard || 'summary_large_image',
      title: seo?.twitterTitle || seo?.metaTitle || 'Default Twitter Title',
      description: seo?.twitterDescription || seo?.metaDescription || 'Default Twitter Description',
    // images: seo?.twitterImage ? [{ url: seo.twitterImage }] : [],
      images: seo?.metaImage ? [{ url: strapiImage(seo.metaImage.url) }] : [],
    },
    alternates: {
        canonical: ``, // Ensure correct indexing
    },
  }
}