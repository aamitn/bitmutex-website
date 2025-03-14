import type { Block } from "@/types";

import { Hero } from "@/components/block-renderer/layout/hero";
import { SectionHeading } from "@/components/block-renderer/layout/section-heading";
import { ContentWithImage } from "@/components/block-renderer/layout/content-with-image";
import { Pricing } from "@/components/block-renderer/layout/pricing";
import { CkeditorBlock } from "@/components/block-renderer/layout/ckeditor-block";
import { FormNextToSection } from "@/components/block-renderer/layout/form-next-to-section";
import { RegformNextToSection } from "@/components/block-renderer/layout/regform-next-to-section";
import { Brands } from "@/components/block-renderer/layout/brands";
import { FAQ } from "@/components/block-renderer/layout/faq";
import { PostBlock } from "@/components/block-renderer/layout/post-block";
import { ServiceBlock } from "@/components/block-renderer/layout/service-block";
import { Testimonials } from "@/components/block-renderer/layout/testimonials/index";

import { CardCarousel } from "@/components/block-renderer/layout/card-carousel";


import { Video } from "@/components/block-renderer/blocks/video";
import { Text } from "@/components/block-renderer/blocks/text";

function blockRenderer(block: Block, index: number) {
  switch (block.__component) {
    case "layout.hero":
      return <Hero key={index} {...block} />;
    case "layout.card-grid":
      return <CardCarousel key={index} {...block} />;
    case "layout.section-heading":
      return <SectionHeading key={index} {...block} />;
    case "layout.content-with-image":
      return <ContentWithImage key={index} {...block} />;
    case "layout.price-grid":
      return <Pricing key={index} {...block} />;
    case "layout.ckeditor-block":
      return <CkeditorBlock key={index} {...block} />;
    case "layout.form-next-to-section":
      return <FormNextToSection key={index} {...block} />;
    case "layout.regform-next-to-section":
      return <RegformNextToSection key={index} {...block} />;
    case "layout.brands":
      return <Brands key={index} {...block} />;
    case "layout.faq":
      return <FAQ key={index} {...block} />; 
    case "layout.post-block":
      return <PostBlock key={index} {...block} />; 
    case "layout.service-block":
      return <ServiceBlock key={index} {...block} />; 
    case "layout.testimonials":
      return <Testimonials key={index} {...block} />; 
    case "blocks.video":
      return <Video key={index} {...block} />;
    case "blocks.text":
      return <Text key={index} {...block} />;   
    default:
      return null;
  }
}

export function BlockRenderer({ blocks }: { blocks: Block[] }) {

 /* console.log("Blocks received in BlockRenderer:", blocks); // Debug log

  return blocks.map((block, index) => {
    console.log(`Rendering block: ${block.__component}`, block); // Log each block
    return blockRenderer(block, index);
  }); */

  return blocks.map((block, index) => blockRenderer(block, index));
}
