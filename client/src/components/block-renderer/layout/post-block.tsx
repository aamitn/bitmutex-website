"use client"; // Required for Swiper

import { Container } from "@/components/forms/container";
import { Heading } from "@/components/elements/heading";
import { Subheading } from "@/components/elements/subheading";
import { FeatureIconContainer } from "@/components/block-renderer/layout/features/feature-icon-container";
import { IconArticle } from "@tabler/icons-react";
import type { PostBlockProps } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Import Framer Motion for animations
import { motion } from "framer-motion";

// Custom navigation buttons

const CustomPrevButton = () => (
  <button
    aria-label="Previous Slide"
    className="swiper-button-prev-custom absolute left-[-35px] top-1/2 transform -translate-y-1/2 bg-primary text-white dark:text-gray-900 rounded-full w-12 h-12 flex items-center justify-center shadow-xl transition-all duration-300 ease-in-out hover:scale-105 hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-primary"
  >
    <ChevronLeft size={24} strokeWidth={2} />
  </button>
);

const CustomNextButton = () => (
  <button
    aria-label="Next Slide"
    className="swiper-button-next-custom absolute right-[-35px] top-1/2 transform -translate-y-1/2 bg-primary text-white dark:text-gray-900 rounded-full w-12 h-12 flex items-center justify-center shadow-xl transition-all duration-300 ease-in-out hover:scale-105 hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-primary"
  >
    <ChevronRight size={24} strokeWidth={2} />
  </button>
);

export function PostBlock(data: Readonly<PostBlockProps>) {
  if (!data) return null; // Handle cases where data might be undefined

  const { heading, sub_heading, posts } = data;

  // Function to truncate text
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <Container className="flex flex-col items-center justify-between pb-20">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-20 py-10 md:pt-40 text-center mb-10"
      >
        <FeatureIconContainer className="flex justify-center items-center overflow-hidden">
          <IconArticle className="h-12 w-12 text-primary text-slate-200 dark:text-white" />
        </FeatureIconContainer>
        <Heading as="h1" className="mt-4 font-heading text-primary dark:text-white">
          {heading}
        </Heading>
        <Subheading as="h2" className="mt-2 font-sans text-muted-foreground">
          {sub_heading}
        </Subheading>
      </motion.div>

      {/* Swiper Slider Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="w-full max-w-6xl mt-10 relative"
      >
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        navigation={{
          prevEl: ".swiper-button-prev-custom",
          nextEl: ".swiper-button-next-custom",
        }}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        loop
        className="w-full"
      >
        {posts && posts.length > 0 ? (
          posts.map((post) => (
          <SwiperSlide key={post.id} className="h-full flex flex-col">
              {/* Clickable Card */}
              <Link href={`/blog/${post.slug}`} passHref>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                  className="h-full flex flex-col bg-white dark:bg-gray-900 bg-opacity-90 dark:bg-opacity-90 backdrop-blur-lg border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 min-h-[450px]] md:min-h-[450px]] lg:min-h-[450px]"
                >
                  {/* Post Image */}
                  {post.image && (
                    <div className="w-full h-48 relative">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${post.image.url}`}
                        alt={post.title}
                        fill
                        style={{ objectFit: "cover" }}
                        className="rounded-t-lg"
                      />
                    </div>
                  )}

                  {/* Post Content - Flex column for equal height */}
                  <div className="p-6 flex flex-col flex-grow">
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-xl font-heading font-bold text-gray-900 dark:text-white line-clamp-2"
                  >
                    {post.title}
                  </motion.h3>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      className="text-gray-600 font-sans dark:text-gray-400 mt-2 flex-grow"
                    >
                      {truncateText(post.description, 120)}
                    </motion.p>

                    {/* Read More Button - Stays at Bottom */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                      className="mt-auto text-primary dark:text-primary-light font-semibold hover:underline"
                    >
                      Read More →
                    </motion.div>
                  </div>
                </motion.div>
              </Link>
            </SwiperSlide>
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-400 text-center">
            No posts available.
          </p>
        )}
      </Swiper>


        {/* Custom Navigation Buttons */}
        <CustomPrevButton />
        <CustomNextButton />
      </motion.div>

      {/* View All Blogs Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="mt-10"
      >
        <Link href="/blogs">
          <button className="font-heading font-bold px-6 py-3 text-white dark:text-slate-800 bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-400 rounded-lg shadow-md hover:bg-opacity-90 transition transform hover:scale-105">
            View All Blogs
          </button>
        </Link>
      </motion.div>
    </Container>
  );
}
