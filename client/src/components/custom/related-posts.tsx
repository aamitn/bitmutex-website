import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import fetchContentType from "@/lib/strapi/fetchContentType";
import { StrapiImage } from "@/components/custom/strapi-image";
import DraggableSidebar from "./DraggableSidebar"; // <-- Adjust path as needed

interface Category {
  id: number;
  documentId: string;
  text: string;
}

interface Post {
  id: number;
  title: string;
  slug: string;
  documentId: string;
  thumbnail?: { url: string };
  category: Category;
  excerpt?: string;
  publishedAt?: string;
}

interface RelatedPostsProps {
  category: Category;
}

export default async function RelatedPosts({ category }: RelatedPostsProps) {
  try {
    const response = await fetchContentType("posts", {
      filters: { category },
      populate: ["category", "image"],
      pagination: { pageSize: 4 },
      sort: { publishedAt: "desc" },
    });

    const posts: Post[] =
      response?.data?.map((post: any) => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        documentId: post.documentId,
        thumbnail: post.image ? { url: post.image.url } : undefined,
        excerpt: post.excerpt || "",
        publishedAt: post.publishedAt,
        category: post.category,
      })) || [];

    if (posts.length === 0) {
      return (
        <div className="text-center py-6">
          <p className="text-gray-500">No related posts found.</p>
        </div>
      );
    }

    return (
      <div className="w-full mx-auto px-4 py-4 relative">
        {/* Default View (Full Width) */}
        <div className="block flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-3">
            Related Posts
            <Badge
              variant="secondary"
              className={cn(
                "bg-linear-to-r from-primary/10 to-primary/20",
                "text-primary border-primary/20 shadow-sm",
                "px-3 py-1 rounded-full"
              )}
            >
              {category.text}
            </Badge>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 2xl:hidden gap-6">
          {posts.map((post) => (
            <Card
              key={post.id}
              className={cn(
                "group overflow-hidden transition-all duration-300",
                "border-2 border-transparent",
                "hover:border-primary/30",
                "bg-white dark:bg-black/40",
                "hover:shadow-2xl hover:scale-[1.02]",
                "rounded-2xl p-0 overflow-hidden"
              )}
            >
              <Link href={`/blog/${post.slug}`} className="block">
                {post.thumbnail && (
                  <div className="relative overflow-hidden">
                    <StrapiImage
                      src={post.thumbnail.url}
                      alt={post.title}
                      width={800}
                      height={600}
                      className={cn(
                        "w-full h-48 object-cover",
                        "transition-transform duration-500",
                        "group-hover:scale-110",
                        "brightness-90 group-hover:brightness-100"
                      )}
                    />
                  </div>
                )}

                <CardContent className="p-6 space-y-3 relative">
                  <h3
                    className={cn(
                      "text-lg font-semibold",
                      "group-hover:text-primary",
                      "transition-colors",
                      "line-clamp-2 min-h-[3rem]"
                    )}
                  >
                    {post.title}
                  </h3>

                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-muted-foreground">
                      {new Date(post.publishedAt || "").toLocaleDateString()}
                    </span>

                    <ArrowUpRight
                      className={cn(
                        "w-5 h-5 text-muted-foreground",
                        "group-hover:text-primary",
                        "group-hover:translate-x-1 group-hover:-translate-y-1",
                        "transition-all duration-300"
                      )}
                    />
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>

        {/* Floating, Draggable, Minimizable Client Sidebar */}
        <DraggableSidebar posts={posts} category={category} />
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch related posts:", error);
    return null;
  }
}