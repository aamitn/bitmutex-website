import { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import  RenderMarkdown  from "@/components/custom/RenderMarkdown";
import { StrapiImage } from "@/components/custom/strapi-image";
import { getBlogPostBySlug } from "@/data/loaders";
import { BlockRenderer } from "@/components/block-renderer";
import ReadingProgress from "@/components/ui/ReadingProgress";
import { CkeditorBlock } from "@/components/block-renderer/layout/ckeditor-block";
import TableOfContents from "@/components/custom/TableOfContents";
import { FaSquareXTwitter,FaSquareFacebook, FaLinkedin } from "react-icons/fa6";
import {FiEye } from "react-icons/fi";
import { FaRedditSquare } from "react-icons/fa";
import { generateMetadataObject } from '@/lib/metadata';
import  fetchContentType  from '@/lib/strapi/fetchContentType';
import { strapiImage } from '@/lib/strapi/strapiImage';
import { calculateReadingTime } from "@/lib/utils";
import RelatedPosts from "@/components/custom/related-posts";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const BASE_URL_NEXT = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const resolveParams = await params;
  const slug = await resolveParams?.slug;

  const pageData = await fetchContentType('posts', {
    filters: { slug: slug }, // Filter by slug
    populate: ["category","seo.metaImage","image"],
  }, true)
  //console.log("Page Data:", pageData); // Debugging output

  if (!pageData) {
    return {
      title: "Blog Not Found | Bitmutex Technologies",
      description: "The requested blog/article does not exist. Browse more blogs by Bitmutex Technologies.",
      robots: "noindex, nofollow", // Avoid indexing non-existent pages
    };
  }

  const seo = pageData?.seo;
  const metadata = generateMetadataObject(seo);

  // ✅ Ensure title fallback to `pageData.title` if `seo.metaTitle` is missing
  const seotitle = seo?.metaTitle 
  ? `${seo.metaTitle} | ${pageData.category?.text || "Uncategorized"} | Bitmutex Blogs`
  : `${pageData.title || "Untitled"} |  ${pageData.category?.text || "Uncategorized"}  |Bitmutex Blogs`;

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
    ? [{ url: strapiImage(seo?.metaImage.url) }] 
    : pageData?.image 
      ? [{ url: strapiImage(pageData.image.url) }] 
      : [],
    url: `${BASE_URL_NEXT}/blog/${slug}`, // Add custom URL field
    site_name: "Bitmutex",
    locale: "en_US",
    type: "article",
  };
  // ✅ Assign canonical URL to `alternates`
  metadata.alternates = {
    canonical: `${BASE_URL_NEXT}/blog/${slug}`,
  };
  
  return metadata;
}




export default async function SinglePost({ params }: PageProps) {
  const resolveParams = await params;
  const slug = resolveParams?.slug;
  const { isEnabled: isDraftMode } = await draftMode();
  const status = isDraftMode ? "draft" : "published";
  const data = await getBlogPostBySlug(slug, status);
  const post = data?.data[0];
  console.log('post data is ', post);
  if (!post) notFound();

    
 
  
  const blocks = post?.blocks || [];
  const fullContent = `${post.content || ""} ${post.content1 || ""} ${post.content2 || ""}`;
  const readingTime = fullContent.trim() ? calculateReadingTime(fullContent) : 1;
  const viewCount = post.views || 0; // Assuming views are coming from API

  // Social share URLs
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:1337"; // Fallback URL
  const shareUrl = encodeURIComponent(`${baseUrl}/blog/${slug}`);
  const twitterShare = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${encodeURIComponent(post.title)}`;
  const facebookShare = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
  const linkedinShare = `https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}`;
  const redditShare = `https://www.reddit.com/submit?url=${shareUrl}&title=${encodeURIComponent(post.title)}`;
  

  return (
    <article className="pt-10 pb-16">
      <ReadingProgress />
      <TableOfContents  containerClass="post-content" />
      <div className="container  max-w-6xl px-4">
        <header className="my-10 text-center">
          <h1 className="font-heading text-4xl font-extrabold tracking-tight sm:text-5xl mb-4">
            {post.title} 
          </h1>


        {/* Author Info Section */}
        {post.author && (
          <div className="mt-6 mb-4 flex items-center justify-center space-x-4 border-t pt-4">
            {/* Author Image (if available) */}
            {post.author.image?.url ? (
              <img
              src={post.author.image.url}
              alt={post.author.image.alternativeText || post.author.firstname}
              className="w-14 h-14 rounded-full object-cover border border-gray-300 dark:border-gray-700 shadow-sm"
            />
            ) : (
              <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 text-lg font-semibold">
                {post.author.firstname.charAt(0)}
                {post.author.lastname.charAt(0)}
              </div>
            )}

            {/* Author Details */}
            <div>
            <p className="text-gray-900 dark:text-gray-100 font-semibold text-lg">
              {post.author.firstname} {post.author.lastname}
            </p>
              {post.author.email && (
                  <a
                  href={`mailto:${post.author.email}`}
                  className="text-blue-600 dark:text-orange-400 text-sm hover:underline transition duration-200"
                >
                  {post.author.email}
                  
                </a>
              )}
            </div>
          </div>
        )}

          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Posted on {formatDate(post.publishedAt)} • {post.category.text} • {" "}
            <span className="font-semibold">{readingTime} min read</span>
          </p>

          {/* View Count */}
          <div className="flex items-center justify-center gap-2 mt-3 text-gray-600 dark:text-gray-400">
            <FiEye  size={18} />
            <span>{viewCount} views</span>
          </div>

          {/* Share Buttons */}
          <div className="flex justify-center gap-4 mt-4">
            <a
              href={twitterShare}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-blue-100 transition"
            >
            <FaSquareXTwitter className="w-5 h-5 text-orange-500"/>
            </a>
            <a
              href={facebookShare}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-blue-100 transition"
            >
              <FaSquareFacebook className="w-5 h-5 text-orange-500" />
            </a>
            <a
              href={linkedinShare}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-blue-100 transition"
            >
              <FaLinkedin className="w-5 h-5 text-orange-500" />
            </a>

            <a
              href={redditShare}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-blue-100 transition"
            >
              <FaRedditSquare  className="w-5 h-5 text-orange-500" />
            </a>
          </div>

          <StrapiImage
            src={post.image.url}
            alt={post.image?.alternativeText || "Bitmutex Blog Post Image"}
            width={800}
            height={600}
            priority
            className="w-full rounded-lg mt-8 shadow-lg"
          />
        </header>

        <div className="post-content">

        {/* Main Blog Content */}
        {post.content && (
          <div className="text-lg leading-relaxed text-gray-800">
            <RenderMarkdown content={post.content} />
          </div>
        )}

        {/* Render ckeditor content1 markdown  */}
        {post.content1 && (

              <section className="flex items-center justify-center px-1 py-1">
                <div className="w-full max-w-7xl bg-white dark:bg-neutral-950 rounded-2xl shadow-lg p-6 md:p-10 transition-all border dark:border-gray-700">
                  <div className="rich-text text-gray-800 dark:text-gray-200 leading-relaxed">
                  <RenderMarkdown content={post.content1} />
                  </div>
                </div>
              </section>
        )}

        

        {/* Render ckeditor content2 markdown  */}
          {post.content2 && (
          <div
            className="mt-6 text-lg leading-relaxed text-gray-800"
          >
             <CkeditorBlock content={post.content2} />
          </div>
        )}

        </div>




        {/* Dynamic Content Blocks */}
        {blocks && (
          <div className="mt-6">
            <BlockRenderer blocks={blocks} />
          </div>
        )}
      </div>

    {/*Related Posts */}
    <RelatedPosts category={post.category}/>


    </article>
  );
}
