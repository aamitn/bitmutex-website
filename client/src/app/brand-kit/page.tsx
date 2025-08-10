import fetchContentType from "@/lib/strapi/fetchContentType";
import BrandKitClient from "./BrandKitClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import convert from "color-convert";

import { generateMetadataObject } from '@/lib/metadata';
import { Metadata } from "next";
import { strapiImage } from "@/lib/strapi/strapiImage";

// Convert HEX to RGB, HSL, CMYK
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

  if (!pageData) {
    return {
      title: "Page Not Found | Bitmutex Technologies",
      description: "The requested page does not exist.",
      robots: "noindex, nofollow",
    };
  }

  const seo = pageData?.seo;
  const metadata = generateMetadataObject(seo);

  heading = pageData.heading;
  sub_heading = pageData.sub_heading;
  description = pageData.description;

  const seotitle = seo?.metaTitle 
    ? `${seo.metaTitle}  | Bitmutex`
    : `${pageData.heading || "Untitled"} | Bitmutex`;

  let seodescription = seo?.metaDescription || pageData.description || "";
  if (seodescription.length > 150) {
    seodescription = seodescription.substring(0, seodescription.lastIndexOf(" ", 150)) + "...";
  }

  metadata.title = seotitle;
  metadata.description = seodescription;

  metadata.openGraph = {
    ...(metadata.openGraph as any),
    title: seotitle, 
    description: seodescription,
    images: seo?.metaImage
      ? [{ url: strapiImage(seo.metaImage.url) }]
      : { url: `${BASE_URL_NEXT}/bmbkit.png` },
    url: `${BASE_URL_NEXT}/brand-kit`,
    site_name: "Bitmutex",
    locale: "en_US",
    type: "website",
  };
  
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
    return <p className="text-center text-red-600 font-semibold mt-12">Error: Unable to fetch data</p>;
  }

  const updatedColors = data.data.colors?.map((color) => ({
    id: color.id,
    name: color.name,
    hex: color.hexcode,
    ...convertColor(color.hexcode),
  })) ?? [];

  const updatedLogos = data.data.brandlogo?.map((logo) => ({
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
    <main className="min-h-screen bg-gradient-to-tr from-indigo-50 to-white dark:from-neutral-900 dark:to-neutral-950 text-gray-900 dark:text-gray-100 transition-colors py-24 px-6 md:px-12 flex justify-center">
      <section className="max-w-7xl w-full">

        {/* Page Header */}
        <header className="mb-16 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-800 via-blue-600 to-blue-700 dark:from-sky-600 dark:via-blue-600 dark:to-pink-400">
            {heading || "Brand Kit"}
          </h1>
          {sub_heading && (
            <p className="mt-4 text-lg md:text-xl text-gray-700 dark:text-gray-300">
              {sub_heading}
            </p>
          )}
          {description && (
            <p className="mt-3 max-w-2xl mx-auto text-gray-600 dark:text-gray-400 leading-relaxed">
              {description}
            </p>
          )}
        </header>

        {/* Brand Colors */}
        <section className="mb-20">
          <h2 className="text-3xl font-semibold mb-8 flex items-center gap-3 justify-center text-sky-700 dark:text-indigo-400">
            <span className="text-2xl">🎨</span> Brand Colors
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {updatedColors.map((color) => (
              <Card
                key={color.id}
                className="overflow-hidden rounded-xl shadow-md bg-white dark:bg-gray-800 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                aria-label={`Color swatch for ${color.name}`}
              >
                <CardHeader className="p-0">
                  <div
                    className="h-28 w-full rounded-t-xl"
                    style={{ backgroundColor: color.hex }}
                  />
                </CardHeader>
                <CardContent className="p-5 text-center space-y-2">
                  <CardTitle className="text-xl font-semibold truncate">{color.name}</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-300"><strong>HEX:</strong> {color.hex}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300"><strong>RGB:</strong> {color.rgb}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300"><strong>HSL:</strong> {color.hsl}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300"><strong>CMYK:</strong> {color.cmyk}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Brand Logos */}
        <section>
          <h2 className="text-3xl font-semibold mb-8 flex items-center gap-3 justify-center text-sky-700 dark:text-indigo-400">
            <span className="text-2xl">🚀</span> Brand Logos
          </h2>
          <BrandKitClient logos={updatedLogos} />
        </section>

      </section>
    </main>
  );
}
