import Link from "next/link";
import { StrapiImage } from "@/components/custom/strapi-image";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "@/components/custom/search";
import { PaginationComponent } from "@/components/custom/pagination";
import { CategorySelect } from "@/components/custom/category-select";
import { formatDate } from "@/lib/utils";
import { getBlogPosts } from "@/data/loaders";
import { Button } from "@/components/ui/button";
import { List, Grid } from "lucide-react"; // Icons for toggle button
import { generateMetadataObject } from '@/lib/metadata';
import  fetchContentType  from '@/lib/strapi/fetchContentType';
import { Metadata } from "next";
import { calculateReadingTime } from "@/lib/utils";
import { strapiImage } from "@/lib/strapi/strapiImage";

interface PageProps {
  searchParams: Promise<{ page?: string; query?: string; category?: string; view?: string }>;
}

interface PostProps {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  content1: string;
  content2: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  image: {
    id: number;
    documentId: string;
    url: string;
    alternativeText: null | string;
    name: string;
  };
  category: {
    id: number;
    documentId: string;
    text: string;
  };
}

let heading: string = '', sub_heading: string = '', description: string = '';


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const BASE_URL_NEXT = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const pageData = await fetchContentType('blog-page', {
    populate: ["seo","seo.metaImage"],
  }, true)
  // console.log("BLOG Page Data:", pageData); // Debugging output

  
  if (!pageData) {
    return {
      title: "Blog Not Found | Bitmutex Technologies",
      description: "The requested blog/article does not exist. Browse more blogs by Bitmutex Technologies.",
      robots: "noindex, nofollow", // Avoid indexing non-existent pages
    };
  }

  
  const seo = pageData?.seo;
  const metadata = generateMetadataObject(seo);

  heading = pageData.heading;
  sub_heading = pageData.sub_heading;
  description = pageData.description;

  // ✅ Ensure title fallback to `pageData.title` if `seo.metaTitle` is missing
  const seotitle = seo?.metaTitle 
  ? `${seo.metaTitle}  | Bitmutex`
  : `${pageData.heading || "Untitled"} | Bitmutex`;

  // ✅ use pageData description as fallback if metaDescription is not available
  let seodescription = seo?.metaDescription || pageData.description || "";
  if (seodescription.length > 150) {
    seodescription = seodescription.substring(0, seodescription.lastIndexOf(" ", 150)) + "...";
  }

  // ✅ Override normal title field
  metadata.title = seotitle;
  metadata.description = seodescription;

  // ✅ Override OG fields
  metadata.openGraph = {
    ...(metadata.openGraph as any), // Cast to 'any' to allow unknown properties
    title: seotitle, 
    description: seodescription,

    images: seo?.metaImage
    ? [{ url: strapiImage(seo.metaImage.url) }]
    : { url: `${BASE_URL_NEXT}/bmblog.png` },

    url: `${BASE_URL_NEXT}/blog`, // Add custom URL field
    site_name: "Bitmutex",
    locale: "en_US",
    type: "website",
  };
    // ✅ Assign canonical URL to `alternates`
    metadata.alternates = {
      canonical: `${BASE_URL_NEXT}/blog`,
    };
  
  return metadata;
}

export default async function BlogRoute({ searchParams }: PageProps) {
  const resolveParams = await searchParams;
  const currentPage = Number(resolveParams?.page) || 1;
  const query = resolveParams?.query ?? "";
  const category = resolveParams?.category ?? "";
  const viewMode = resolveParams?.view === "list" ? "list" : "grid"; // Default to grid view

  const { data, meta } = await getBlogPosts(currentPage, query, category);
  const total = Number(meta?.pagination?.pageCount);
  const posts = data as PostProps[];

  return (
    <section className="container flex flex-col items-center gap-8 py-24">
      
      {/* Header */}
      <div className="text-center">
        <span className="font-bold uppercase text-primary tracking-wide">{heading}</span>
        <h2 className="font-heading text-4xl font-bold text-gray-900 dark:text-white mt-2">{sub_heading}</h2>
        <p className="text-lg text-muted-foreground mt-3 max-w-xl mx-auto">
          {description}
        </p>
      </div>

      {/* Filters and View Toggle */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-7xl">
        <CategorySelect />
        <Search />
        <Link href={`?page=${currentPage}&query=${query}&category=${category}&view=${viewMode === "grid" ? "list" : "grid"}`}>
          <Button variant="outline">
            {viewMode === "grid" ? <List className="h-5 w-5" /> : <Grid className="h-5 w-5" />}
            <span className="ml-2">{viewMode === "grid" ? "List View" : "Grid View"}</span>
          </Button>
        </Link>
      </div>

      {/* Blog Layout (Grid or List) */}
      <div
        className={`mt-8 grid gap-8 ${
          viewMode === "grid" ? "auto-rows-fr grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
        }`}
      >
        {posts?.map((item: PostProps) => {
          const fullContent = `${item.content || ""} ${item.content1 || ""} ${item.content2 || ""}`;
          const readingTime = fullContent.trim() ? calculateReadingTime(fullContent) : 1;

          return (
            <Link href={`/blog/${item.slug}`} key={item.documentId} className="group">
              <Card
                className={`h-full flex flex-col border-none overflow-hidden transition-transform duration-300 transform group-hover:scale-105 
                  shadow-lg shadow-gray-300 dark:shadow-slate-900 group-hover:shadow-xl dark:group-hover:shadow-slate-800 dark:bg-neutral-900 
                  ${viewMode === "list" ? "flex flex-row items-center gap-4 sm:gap-6" : ""}`}
              >
                {/* Blog Image */}
                <div
                  className={`relative ${
                    viewMode === "list" ? "h-24 w-24 sm:h-32 sm:w-32 flex-shrink-0" : "h-52 w-full"
                  } overflow-hidden rounded-t-lg`}
                >
                  <StrapiImage
                    alt={item.image.alternativeText || item.title}
                    src={item.image.url}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                {/* Blog Details */}
                <CardContent
                  className={`flex ${
                    viewMode === "list"
                      ? "flex-col justify-between  sm:flex-row sm:items-center sm:gap-8 px-4 sm:px-6 py-3 sm:py-5"
                      : "flex-col flex-grow items-start gap-6 px-6 pb-6 pt-2"
                  }`}
                >
                  <div className="flex flex-1 flex-col gap-1 sm:gap-3 mt-4">
                    <h4 className="text-md sm:text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h4>
                    <p className="text-sm sm:text-base text-muted-foreground mb-2 sm:mb-4 line-clamp-4">{item.description}</p>

                    {/* Meta Information */}
                    <div className="flex items-center gap-2 sm:gap-3 mt-auto">
                      <span className="rounded-full bg-primary/10 text-primary px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-medium">
                        {item.category?.text || "No Category"}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(item.publishedAt)}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">⏳ {readingTime} min read</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Pagination */}
      <PaginationComponent pageCount={total} />
    </section>
  );
}
