import { fetchIndustries } from "@/data/loaders";
import * as LucideIcons from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { FC } from "react";
import { generateMetadataObject } from '@/lib/metadata';
import  fetchContentType  from '@/lib/strapi/fetchContentType';
import { Metadata } from "next";
import { strapiImage } from "@/lib/strapi/strapiImage";

type Industry = {
  uuid: string;
  name: string;
  description: string;
  details: string;
  icon: string;
  slug: string;
  challenges: string[];
  opportunities: string[];
  solutions: string[];
};

let heading: string = '', sub_heading: string = '', description: string = '';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const BASE_URL_NEXT = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const pageData = await fetchContentType('industries-page', {
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
      : { url: `${BASE_URL_NEXT}/bmind.png` },

    url: `${BASE_URL_NEXT}/industries`, // Add custom URL field
    site_name: "Bitmutex",
    locale: "en_US",
    type: "website",
  };
    // ✅ Assign canonical URL to `alternates`
    metadata.alternates = {
      canonical: `${BASE_URL_NEXT}/industries`,
    };
  
  return metadata;
}

// ✅ Get the correct Lucide icon
const getLucideIcon = (iconName: string): FC<any> => {
  //Convert incon descriptor name to pascal case
  const pascalCaseName = iconName.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join("");;

  // Check if the icon exists in the imported LucideIcons and return it
  const Icon = (LucideIcons as any)[pascalCaseName];

  // Fallback to a default icon if the requested icon does not exist
  if (!Icon) {
    return LucideIcons.AlertCircle; // Replace this with a valid fallback icon if needed
  }

  return Icon;
};


export default async function IndustryPage() {
  const industries: Industry[] = await fetchIndustries();

  return (
    <div className="container mx-auto py-12 mt-8 mb-8">

        {/* Header */}
        <div className="text-center">
          <span className="font-bold uppercase text-primary tracking-wide">{heading}</span>
          <h2 className="font-heading text-4xl font-bold text-gray-900 dark:text-white mt-2">{sub_heading}</h2>
          <p className="text-lg text-muted-foreground mt-3 max-w-xl mx-auto pb-4">
          {description}
          </p>
       </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-4">
        {industries.map((industry) => {
          const IconComponent = getLucideIcon(industry.icon);
          return (
            <Link key={industry.uuid} href={`/industries/${industry.slug}`} passHref>
              <Card className="group h-full flex flex-col p-6 bg-slate-50 dark:bg-slate-800 shadow-lg rounded-xl border border-gray-200 dark:border-slate-700 hover:shadow-2xl hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer relative overflow-hidden">
                {/* Card Header */}
                <CardHeader className="flex items-center space-x-4">
                  <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full">
                    <IconComponent className="w-8 h-8 text-gray-700 dark:text-gray-300" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-300">
                    {industry.name}
                  </h2>
                </CardHeader>

              {/* Card Content */}
              <CardContent className="flex-grow overflow-hidden">
                <p className="mb-4 text-gray-600 dark:text-gray-400 line-clamp-3">
                  {industry.description}
                </p>
              </CardContent>


                {/* Learn More Button - Initially Hidden, Shows on Hover */}
                <div className="absolute inset-x-0 bottom-4 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="bg-slate-800 dark:bg-orange-500 text-white px-4 py-2 rounded-3xl text-center">
                    Learn More →
                  </button>
                </div>
              </Card>
            </Link>

          );
        })}
      </div>
    </div>
  );
}
