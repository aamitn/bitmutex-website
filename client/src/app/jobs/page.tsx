import fetchContentType from "@/lib/strapi/fetchContentType";
import JobBoardClient from "./JobBoardClient"; // ✅ Client component
import { generateMetadataObject } from '@/lib/metadata';
import { Metadata } from "next";
import { strapiImage } from "@/lib/strapi/strapiImage";


let heading: string = '', sub_heading: string = '', description: string = '';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const BASE_URL_NEXT = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const pageData = await fetchContentType('jobs-page', {
    populate: ["seo","seo.metaImage"],
  }, true)
  //console.log("Job Page Data:", pageData); // Debugging output

  
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
  ? `${seo.metaTitle}  | Careers at Bitmutex`
  : `${pageData.subheading || "Openings"} | Careers at Bitmutex`;

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
      : { url: `${BASE_URL_NEXT}/bmcs.png` },
    
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

export default async function JobBoardPage() {
  // Fetch jobs from Strapi (SSR)
  const data = await fetchContentType("jobs", { populate: "*" });

  // Handle errors
  if (!data || !data.data) {
    return <p className="text-center text-red-500">Error: Unable to fetch job data.</p>;
  }

  console.log("Fetched Jobs Data:", data);

  // ✅ Map job data for rendering
  const jobs = data.data.map((job: any) => ({
    documentID: job.documentId,
    title: job.title || "Untitled Job",
    description: job.description || "No description available.",
    location: job.location || "Not specified",
    postedAt: job.createdAt || "Unknown date",
    experience: job.experience || "Not specified",
    deadline: job.deadline || "No deadline specified",
  }));

  return(
    

  <div className="text-center pt-20 mt-10">
      <span className="font-bold uppercase text-primary tracking-wide">{heading}</span>
      <h2 className="font-heading text-4xl font-bold text-gray-900 dark:text-white mt-2">{sub_heading}</h2>
      <p className="text-lg text-muted-foreground mt-3 max-w-xl mx-auto pb-4">
      {description}
      </p>
      <JobBoardClient initialJobs={jobs} />
  </div>

); 
}
