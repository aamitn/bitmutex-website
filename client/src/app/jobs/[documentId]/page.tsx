import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, DollarSign, Calendar, Clipboard, Briefcase, ArrowLeft } from 'lucide-react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import RenderMarkdown from "@/components/custom/RenderMarkdown";
import JobApplicationForm from "./JobApplicationForm";
import JobActions from "./JobActions"; // ✅ Client Component for Buttons
import { Metadata } from "next";
import { strapiImage } from "@/lib/strapi/strapiImage";
import fetchContentType from "@/lib/strapi/fetchContentType";
import { generateMetadataObject } from "@/lib/metadata";

interface PageProps {
  params: Promise<{ documentId: string }>;
}

interface Job {
  id: string;
  documentId: string;
  title: string;
  description: string;
  location: string;
  salary: string;
  experience: string;
  deadline: string;
  createdAt: string;
  details: string;
}

export async function generateMetadata({ params }: { params: Promise<{ documentId: string }> }): Promise<Metadata> {
  const BASE_URL_NEXT = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const resolveParams = await params;
  const documentId = resolveParams.documentId;

  const pageData = await fetchContentType("jobs", {
    filters: { documentId },
    populate: ["seo.metaImage"],
  }, true);

  if (!pageData) {
    return {
      title: "Job Not Found | Bitmutex Technologies",
      description: "The requested job does not exist. Browse more job opportunities at Bitmutex Technologies.",
      robots: "noindex, nofollow",
    };
  }

  const seo = pageData?.seo;
  const metadata = generateMetadataObject(seo);

  const seotitle = seo?.metaTitle
    ? `${seo.metaTitle} | Careers at Bitmutex`
    : `${pageData.title || "Untitled Job"} | Careers at Bitmutex`;

  let seodescription = seo?.metaDescription || pageData.description || "";
  if (seodescription.length > 150) {
    seodescription = seodescription.substring(0, seodescription.lastIndexOf(" ", 150)) + "...";
  }
  seodescription += ` - Apply Today! - Deadline on : ${pageData.deadline}`;

  metadata.title = seotitle;
  metadata.description = seodescription;

  metadata.openGraph = {
    ...(metadata.openGraph as any),
    title: seotitle,
    description: seodescription,
    images: seo?.metaImage
      ? [{ url: strapiImage(seo.metaImage.url) }]
      : { url: `${BASE_URL_NEXT}/bmcs.png` },
    url: `${BASE_URL_NEXT}/jobs/${documentId}`,
    site_name: "Bitmutex",
    locale: "en_US",
    type: "article",
  };

  metadata.alternates = {
    canonical: `${BASE_URL_NEXT}/jobs/${documentId}`,
  };

  return metadata;
}

export default async function JobDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const data = await fetchContentType("jobs", {
    filters: { documentId: resolvedParams.documentId },
    populate: "*",
  });

  if (!data || !Array.isArray(data.data) || data.data.length === 0) {
    return (
      <div className="container mx-auto px-6 py-12 mt-20 text-center text-red-500 text-lg">
        🚫 Job not found.
      </div>
    );
  }

  const jobData = data.data[0];

  const job: Job = {
    id: jobData.id,
    documentId: jobData.documentId,
    title: jobData.title || "Untitled Job",
    description: jobData.description || "No description available.",
    location: jobData.location || "Not specified",
    salary: jobData.salary || "Not disclosed",
    experience: jobData.experience || "Not specified",
    deadline: jobData.deadline || "No deadline",
    createdAt: new Date(jobData.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    details: jobData.details || "**No additional details available.**",
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16 mb-12">
      {/* Breadcrumb or Back Button */}
      <div className="mb-6">
        <JobActions />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* Left Column: Job Details */}
        <div className="xl:col-span-2 space-y-6">
          {/* Main Job Card */}
          <Card className="bg-white dark:bg-slate-800 shadow-xl rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-700 transition-all duration-300 hover:shadow-2xl">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 p-6 border-b border-gray-100 dark:border-slate-700">
              <CardHeader className="p-0">
                <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                  {job.title}
                </CardTitle>
              </CardHeader>
              <p className="text-gray-600 dark:text-slate-300 mt-2 text-sm md:text-base">
                {job.description}
              </p>
            </div>

            <CardContent className="p-6 space-y-5">
              {/* Job Info Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 text-gray-700 dark:text-slate-300">
                  <MapPin className="h-5 w-5 text-blue-500 flex-shrink-0" />
                  <span className="text-sm md:text-base"><strong>Location:</strong> {job.location}</span>
                </div>

                <div className="flex items-center space-x-3 text-gray-700 dark:text-slate-300">
                  <DollarSign className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm md:text-base"><strong>Salary:</strong> {job.salary} LPA</span>
                </div>

                <div className="flex items-center space-x-3 text-gray-700 dark:text-slate-300">
                  <Briefcase className="h-5 w-5 text-purple-500 flex-shrink-0" />
                  <span className="text-sm md:text-base"><strong>Experience:</strong> {job.experience}</span>
                </div>

                <div className="flex items-center space-x-3 text-gray-700 dark:text-slate-300">
                  <Calendar className="h-5 w-5 text-orange-500 flex-shrink-0" />
                  <span className="text-sm md:text-base"><strong>Posted:</strong> {job.createdAt}</span>
                </div>

                <div className="flex items-center space-x-3 text-gray-700 dark:text-slate-300">
                  <Clipboard className="h-5 w-5 text-red-500 flex-shrink-0" />
                  <span className="text-sm md:text-base"><strong>Deadline:</strong> {job.deadline}</span>
                </div>
              </div>

              {/* Job Details Accordion */}
              <Accordion type="single" collapsible defaultValue="job-details" className="mt-6">
                <AccordionItem value="job-details" className="border-b border-gray-200 dark:border-slate-700">
                  <AccordionTrigger className="text-lg font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                    📄 Job Details
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 dark:text-slate-300 mt-3 leading-relaxed">
                    <RenderMarkdown content={job.details} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Application Form (Sticky) */}
        <div className="xl:col-span-1">
          <div className="sticky top-24">
            <Card className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden transition-transform duration-300 hover:scale-[1.01]">
              <div className="bg-blue-600 text-white p-4 text-center font-semibold rounded-t-2xl">
                🚀 Apply Now
              </div>
              <CardContent className="p-6">
                <JobApplicationForm jobId={job.documentId} jobName={job.title} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Optional: Add a footer separator or CTA */}
      <div className="mt-12 text-center text-gray-500 dark:text-slate-400 text-sm">
        Thank you for considering a career at <span className="font-semibold text-blue-600 dark:text-blue-400">Bitmutex</span>.
      </div>
    </div>
  );
}