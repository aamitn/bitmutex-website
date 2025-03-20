import { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import  RenderMarkdown  from "@/components/custom/RenderMarkdown";
import { StrapiImage } from "@/components/custom/strapi-image";
import { getBlogPostBySlug } from "@/data/loaders";
import { BlockRenderer } from "@/components/block-renderer";
import sanitizeHtml from "sanitize-html";
import ReadingProgress from "@/components/ui/ReadingProgress";
import { Facebook, Twitter, Linkedin, Eye } from "lucide-react"; // Importing Lucide icons
import { CkeditorBlock } from "@/components/block-renderer/layout/ckeditor-block";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Function to calculate estimated reading time
const calculateReadingTime = (text: string): number => {
  const wordsPerMinute = 225; 
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolveParams = await params;
  const slug = resolveParams?.slug;
  const { isEnabled: isDraftMode } = await draftMode();
  const status = isDraftMode ? "draft" : "published";

  const data = await getBlogPostBySlug(slug, status);

  if (!data?.data?.[0]) {
    return {
      title: "Blog Post - Not Found",
      description: "This blog post does not exist.",
    };
  }

  const post = data.data[0];

  return {
    title: post.title,
    description: post.description,
  };
}

export default async function SinglePost({ params }: PageProps) {
  const resolveParams = await params;
  const slug = resolveParams?.slug;
  const { isEnabled: isDraftMode } = await draftMode();
  const status = isDraftMode ? "draft" : "published";
  const data = await getBlogPostBySlug(slug, status);
  const post = data?.data[0];

  if (!post) notFound();

  const blocks = post?.blocks || [];
  const readingTime = post.content ? calculateReadingTime(post.content) : 1;
  const viewCount = post.views || 0; // Assuming views are coming from API

  // Sanitize content to prevent XSS attacks
  const sanitizedContent = post.content1
    ? sanitizeHtml(post.content1, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "iframe"]),
        allowedAttributes: {
          a: ["href", "target"],
          img: ["src", "alt", "width", "height"],
          iframe: ["src", "width", "height", "allowfullscreen", "frameborder"],
        },
      })
    : "";

  // Social share URLs
  const shareUrl = encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL}/blog/${slug}`);
  const twitterShare = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${encodeURIComponent(post.title)}`;
  const facebookShare = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
  const linkedinShare = `https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}`;

  return (
    <article className="pt-10 pb-16">
      <ReadingProgress />
      <div className="container  max-w-6xl px-4">
        <header className="my-10 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4">
            {post.title}
          </h1>
          <p className="text-gray-500 text-sm">
            Posted on {formatDate(post.publishedAt)} - {post.category.text} •{" "}
            <span className="font-semibold">{readingTime} min read</span>
          </p>

          {/* View Count */}
          <div className="flex items-center justify-center gap-2 mt-3 text-gray-600">
            <Eye size={18} />
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
              <Twitter className="w-5 h-5 text-blue-500" />
            </a>
            <a
              href={facebookShare}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-blue-100 transition"
            >
              <Facebook className="w-5 h-5 text-blue-600" />
            </a>
            <a
              href={linkedinShare}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-blue-100 transition"
            >
              <Linkedin className="w-5 h-5 text-blue-700" />
            </a>
          </div>

          <StrapiImage
            src={post.image.url}
            alt={post.image.alternativeText}
            width={800}
            height={600}
            priority
            className="w-full rounded-lg mt-8 shadow-lg"
          />
        </header>

        {/* Main Blog Content */}
        {post.content && (
          <div className="text-lg leading-relaxed text-gray-800">
            <RenderMarkdown content={post.content} />
          </div>
        )}

        {/* Render sanitized HTML safely */}
        {post.content1 && (
          <div
            className="mt-6 text-lg leading-relaxed text-gray-800"
          >
             <RenderMarkdown content={post.content1} />
          </div>
        )}

          {/* Render sanitized HTML safely */}
          {post.content2 && (
          <div
            className="mt-6 text-lg leading-relaxed text-gray-800"
          >
             <CkeditorBlock content={post.content2} />
          </div>
        )}

        {/* Dynamic Content Blocks */}
        {blocks && (
          <div className="mt-6">
            <BlockRenderer blocks={blocks} />
          </div>
        )}
      </div>
    </article>
  );
}
