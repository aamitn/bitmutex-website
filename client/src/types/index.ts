import { LucideIcon } from "lucide-react"; // Import icon type

type Image = {
  id: string;
  documentId: string;
  url: string;
  alternativeText: string | null;
  name: string;
}   

type ComponentType =
  | "layout.hero"
  | "layout.card-grid"
  | "layout.section-heading"
  | "layout.content-with-image"   
  | "layout.price-grid"
  | "layout.ckeditor-block"
  | "layout.ckeditor-block-markdown"
  | "layout.form-next-to-section"
  | "layout.regform-next-to-section"
  | "layout.brands"
  | "layout.faq"
  | "layout.post-block"
  | "layout.service-block"
  | "layout.testimonials"
  | "blocks.video"
  | "blocks.text";

interface Base<T extends ComponentType, D extends object = Record<string, never>> {
  __component: T;
  id: string;
  createdAt: string;
  updatedAt: string;
  data: D;
}

export interface NavLink {
  href: string;
  text: string;
  isExternal: boolean;
  isPrimary: boolean;
  parentName?: string;
  icon?: LucideIcon; 
}
 
export type Block = HeroProps | CardGridProps | SectionHeadingProps | ContentWithImageProps | PriceGridProps | CkeditorBlockProps| CkeditorBlockMarkdownProps | FormNextToSectionProps | RegformNextToSectionProps| BrandsProps | FAQProps | PostBlockProps | ServiceBlockProps | TestimonialsProps | VideoProps | TextProps;

export interface HeroProps extends Base<"layout.hero"> {
  heading: string;
  text: string;
  topLink?: NavLink;
  buttonLink?: NavLink[];
  image: {
    url: string;
    alternativeText: string | null;
    name: string;
  };
}

export interface CardGridProps extends Base<"layout.card-grid"> {
  cardItems: {
    id: string;
    heading: string;
    text: string;
    icon: string;
    link: string;
    isExternal: boolean;
  }[];
}

export interface SectionHeadingProps extends Base<"layout.section-heading"> {
  heading: string;
  subHeading: string;
  text: string;
  centered?: boolean;
}

export interface ContentWithImageProps extends Base<"layout.content-with-image"> {
  reverse: boolean;
  image: {
    url: string;
    name: string;
  };
  heading: string;
  subHeading: string;
  text: string;
}

export interface PriceGridProps extends Base<"layout.price-grid"> {
  priceCard: {
    id: string;
    heading: string;
    description: string;
    price: string;
    selected: boolean;
    feature: {
      id: string;
      description: string;
    }[];
    link: NavLink;
  }[];
}

export interface VideoProps extends Base<"blocks.video"> {
  title: string;
  description: string;
  videoUrl: string;
  video: {
    videoId: string;
    start: string;
    end: string;
  },
  image: Image;
}

export interface TextProps extends Base<"blocks.text"> {
  content: string;
}



export interface CkeditorBlockProps extends Base<"layout.ckeditor-block"> {
  content:string
}

export interface CkeditorBlockMarkdownProps extends Base<"layout.ckeditor-block-markdown"> {
  content:string
}


export interface FormNextToSectionProps extends Base<"layout.form-next-to-section"> {
  heading:string
  sub_heading:string
  section:any
  }

export interface RegformNextToSectionProps extends Base<"layout.regform-next-to-section"> {
    heading:string
    sub_heading:string
    }

export interface BrandsProps extends Base<"layout.brands"> {
      heading:string
      sub_heading:string
      logos:any[]
      }

export interface FAQProps extends Base<"layout.faq"> {
        heading:string
        sub_heading:string
        faqs:any[]
        }
      
  
        export interface Post {
          id: number;
          title: string;
          description: string;
          slug: string;
          image?: {
            url: string;
          };
        }
        
        export interface PostBlockProps extends Base<"layout.post-block"> {
          heading: string;
          sub_heading: string;
          posts: Post[];
        }
    

        export interface ServiceBlockProps extends Base<"layout.service-block"> {
          heading: string;
          sub_heading: string;
          services: any[];
        }

        export interface TestimonialsProps extends Base<"layout.testimonials"> {
          heading: string;
          sub_heading: string;
          testimonials: any[];
          testimonial: any[];
        }
    




