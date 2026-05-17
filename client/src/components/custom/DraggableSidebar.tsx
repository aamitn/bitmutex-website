"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ArrowUpRight, GripHorizontal, Minus, Plus, X, Library } from "lucide-react";
import { StrapiImage } from "@/components/custom/strapi-image";
import { motion, AnimatePresence } from "framer-motion";

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

interface DraggableSidebarProps {
  posts: Post[];
  category: Category;
}

export default function DraggableSidebar({ posts, category }: DraggableSidebarProps) {
  const [isMinimized, setIsMinimized] = useState(false); 
  const [isVisible, setIsVisible] = useState(true);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // 1. Detect screen size on mount and CLOSE the widget if <= 1366x768
  useEffect(() => {
    if (typeof window !== "undefined") {
      // If screen width is 1366 or lower, OR height is 768 or lower, start closed
      if (window.innerWidth <= 1366 || window.innerHeight <= 768) {
        setIsVisible(false); // <--- Changed from setIsMinimized(true)
      }
    }
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button")) return;
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  if (posts.length === 0) return null;

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "hidden xl:flex flex-col", // Changed from 2xl to xl so it shows on 1366px screens
            "fixed top-40 right-10 w-72 min-w-[220px] max-w-[450px] z-50",
            "bg-white dark:bg-black/80 backdrop-blur-xl",
            "border border-gray-200 dark:border-gray-800",
            "rounded-2xl shadow-2xl overflow-hidden",
            "resize-x" 
          )}
          style={{
            x: position.x,
            y: position.y,
            touchAction: "none",
          }}
        >
          {/* Draggable Header */}
          <div
            className={cn(
              "flex items-center justify-between p-4 bg-white/90 dark:bg-black/90 border-b shrink-0",
              "cursor-grab active:cursor-grabbing select-none hover:bg-gray-50 dark:hover:bg-gray-900/50"
            )}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <div className="flex items-center gap-2 text-muted-foreground pointer-events-none">
              <GripHorizontal className="w-4 h-4" />
              <h2 className="font-heading text-sm font-bold tracking-tight text-foreground flex items-center gap-2">
                Related
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary border-primary/20 px-2 py-0.5 text-[10px]"
                >
                  {category.text}
                </Badge>
              </h2>
            </div>

            <div className="flex items-center gap-1 z-10">
              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMinimized(!isMinimized);
                }}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md transition-colors text-muted-foreground hover:text-foreground"
                aria-label={isMinimized ? "Maximize" : "Minimize"}
              >
                {isMinimized ? <Plus className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
              </button>
              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsVisible(false);
                }}
                className="p-1 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-md transition-colors text-muted-foreground hover:text-red-500"
                aria-label="Close Sidebar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Smooth Collapsible Content */}
          <motion.div
            animate={{ 
              height: isMinimized ? 0 : "auto",
              opacity: isMinimized ? 0 : 1 
            }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className={cn(
              "overflow-y-auto w-full",
              "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600"
            )}
          >
            <div className="p-4 space-y-4 max-h-[calc(100vh-14rem)]">
              {posts.map((post) => (
                <Card
                  key={post.id}
                  className={cn(
                    "group overflow-hidden transition-all duration-300",
                    "border-2 border-transparent hover:border-primary/30",
                    "bg-white/50 dark:bg-black/40",
                    "hover:shadow-lg hover:scale-[1.02]",
                    "rounded-xl p-0",
                    "ring-1 ring-gray-950/5 dark:ring-white/10"
                  )}
                >
                  <Link href={`/blog/${post.slug}`} className="block pointer-events-auto">
                    {post.thumbnail && (
                      <div className="relative overflow-hidden h-24">
                        <StrapiImage
                          src={post.thumbnail.url}
                          alt={post.title}
                          width={400}
                          height={300}
                          className={cn(
                            "w-full h-full object-cover",
                            "transition-transform duration-500",
                            "group-hover:scale-110",
                            "brightness-90 group-hover:brightness-100"
                          )}
                        />
                      </div>
                    )}

                    <CardContent className="p-4 space-y-2 relative">
                      <h3
                        className={cn(
                          "text-sm font-semibold group-hover:text-primary transition-colors line-clamp-2"
                        )}
                      >
                        {post.title}
                      </h3>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          {new Date(post.publishedAt || "").toLocaleDateString()}
                        </span>
                        <ArrowUpRight
                          className={cn(
                            "w-4 h-4 text-muted-foreground",
                            "group-hover:text-primary",
                            "group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300"
                          )}
                        />
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </motion.div>
        </motion.div>
      ) : (
        /* Floating Slide-out Reopen Trigger */
        <motion.button
          key="related-posts-reopen-trigger"
          onClick={() => {
            setIsVisible(true);
          }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="
            hidden xl:flex items-center flex-row-reverse 
            fixed bottom-32 right-0 z-50 
            bg-blue-600 text-white 
            rounded-l-xl shadow-md 
            hover:bg-blue-700 transition-colors duration-300 group
          "
        >
          {/* Persistent Icon on Right Edge */}
          <div className="py-2.5 pr-3 pl-2">
            <Library size={16} className="shrink-0" />
          </div>
          
          {/* Hidden text that slides out to the LEFT on hover */}
          <span className="
            max-w-0 opacity-0 overflow-hidden whitespace-nowrap 
            group-hover:max-w-[130px] group-hover:opacity-100 group-hover:pl-4 
            transition-all duration-300 ease-in-out 
            text-xs font-medium
          ">
            Related Posts
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}