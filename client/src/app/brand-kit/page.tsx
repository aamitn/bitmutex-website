import fetchContentType from "@/lib/strapi/fetchContentType";
import BrandKitClient from "./BrandKitClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import convert from "color-convert";

import { generateMetadataObject } from '@/lib/metadata';
import { Metadata } from "next";
import { strapiImage } from "@/lib/strapi/strapiImage";

  // ✅ Convert HEX to RGB, HSL, CMYK
  const convertColor = (hex: string) => {
    const hexValue = hex.replace("#", "");
    const rgb = convert.hex.rgb(hexValue);
    const hsl = convert.hex.hsl(hexValue);
    const cmyk = convert.hex.cmyk(hexValue);
  
    return {
      rgb: `rgb(${rgb.join(", ")})`,
      hsl: `hsl(${hsl.join(", ")}%)`,
      cmyk: `cmyk(${cmyk.join(", ")})`,
    };
  };

  interface Color {
    id: number;
    name: string;
    hexcode: string;
  }
  
  interface Logo {
    id: number;
    company: string;
    image: {
      url: string;
      name: string;
    };
  }
  
  interface BrandKitData {
    colors: Color[];
    brandlogo: Logo[];
  }


let heading: string = '', sub_heading: string = '', description: string = '';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const BASE_URL_NEXT = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const pageData = await fetchContentType('brand-kit', {
    populate: ["seo","seo.metaImage"],
  }, true)
  //console.log("industry Page Data:", pageData); // Debugging output

  
  if (!pageData) {
    return {
      title: "Page Not Found | Bitmutex Technologies",
      description: "The requested page does not exist.",
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
      : { url: `${BASE_URL_NEXT}/bmbkit.png` },

    url: `${BASE_URL_NEXT}/brand-kit`, // Add custom URL field
    site_name: "Bitmutex",
    locale: "en_US",
    type: "website",
  };
    // ✅ Assign canonical URL to `alternates`
    metadata.alternates = {
      canonical: `${BASE_URL_NEXT}/brand-kit`,
    };
  
  return metadata;
}

  

  export default async function BrandKitPage() {
    const data: { data: BrandKitData } | null = await fetchContentType("brand-kit", {
      populate: {
        colors: "*",
        brandlogo: {
          populate: "image",
        },
      },
    });
  
    if (!data || !data.data) {
      return <p className="text-center text-red-500">Error: Unable to fetch data</p>;
    }
  
    console.log("Fetched BrandKit Data:", data);
  
    // ✅ Extract colors & convert values
    const updatedColors = data.data.colors?.map((color: { id: number; name: string; hexcode: string }) => ({
      id: color.id,
      name: color.name,
      hex: color.hexcode,
      ...convertColor(color.hexcode), // ✅ Add converted color formats
    })) ?? [];
  
    // ✅ Extract logos properly
    const updatedLogos = data.data.brandlogo?.map((logo: any) => ({
      id: logo.id,
      company: logo.company,
      image: {
        url: logo.image?.url
          ? `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${logo.image.url}`
          : "",
        name: logo.image?.name ?? "Unknown Logo",
      },
    })) ?? [];
  
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-neutral-950 text-black dark:text-white transition-all">
        <div className="p-8 max-w-5xl flex-auto min-h-screen mt-16 mb-8">
  
          {/* 🎨 Brand Colors Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">🎨 Brand Colors</h2>
            <div className="flex flex-wrap justify-center gap-6">
              {updatedColors.map((color) => (
                <Card key={color.id} className="border-none shadow-lg bg-white dark:bg-gray-800/40">
                  <CardHeader className="p-0">
                    <div className="w-full h-24 rounded-t-md" style={{ backgroundColor: color.hex }}></div>
                  </CardHeader>
                  <CardContent className="p-4 text-center">
                    <CardTitle className="text-lg font-semibold">{color.name}</CardTitle>
                    <p className="text-sm">HEX: <span className="font-medium">{color.hex}</span></p>
                    <p className="text-sm">RGB: <span className="font-medium">{color.rgb}</span></p>
                    <p className="text-sm">HSL: <span className="font-medium">{color.hsl}</span></p>
                    <p className="text-sm">CMYK: <span className="font-medium">{color.cmyk}</span></p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
  
          {/* 🚀 Brand Logos Section */}
          <h2 className="text-2xl font-semibold mb-6">🚀 Brand Logos</h2>
  
          {/* ✅ Pass Colors & Logos to Client Component */}
          <BrandKitClient logos={updatedLogos} />
        </div>
      </div>
    );
  }
