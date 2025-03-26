import fetchContentType from "@/lib/strapi/fetchContentType";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, DollarSign, Calendar, Clipboard, Briefcase } from 'lucide-react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import RenderMarkdown from "@/components/custom/RenderMarkdown";
import JobApplicationForm from "./JobApplicationForm";
import JobActions from "./JobActions";  // ✅ Client Component for Buttons


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


export default async function JobDetailPage( { params }: PageProps ) {
  const resolvedParams = await params;
  // ✅ Fetch job details via SSR
  const data = await fetchContentType("jobs", {
    filters: { documentId: resolvedParams.documentId },
    populate: "*",
  });
  console.log("your data");
  console.log(data);

  // ✅ Ensure data exists & extract the first job object
  if (!data || !Array.isArray(data.data) || data.data.length === 0) {
    return <div className="container mx-auto p-6 mt-20 mb-20 text-red-500">Job not found.</div>;
  }

  // ✅ Extract the first job from the array
  const jobData = data.data[0];

  // ✅ Map job details properly
  const job: Job = {
    id: jobData.id,
    documentId: jobData.documentId,
    title: jobData.title || "Untitled Job",
    description: jobData.description || "No description available.",
    location: jobData.location || "Not specified",
    salary: jobData.salary || "Not disclosed",
    experience: jobData.experience || "Not specified",
    deadline: jobData.deadline || "No deadline",
    createdAt: new Date(jobData.createdAt).toLocaleDateString(),
    details: jobData.details || "**No additional details available.**",  // ✅ Ensure `details` is always valid
  };

  return (
    <div className="container mx-auto p-6 mt-20 mb-20">
      <Card className="p-4 flex flex-col sm:flex-row gap-6 bg-white dark:bg-slate-900 shadow-lg rounded-lg">
        <div className="flex-1">
          <CardHeader className="p-0">
            <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-slate-200">
              {job.title}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0 mt-2 space-y-4">
            <p className="text-gray-600 text-sm dark:text-slate-300">{job.description}</p>

            <div className="flex items-center text-gray-500 text-sm dark:text-orange-500">
              <MapPin className="mr-2 text-gray-600 dark:text-orange-500" />
              {job.location}
            </div>

            <div className="flex items-center text-gray-500 text-sm">
              <DollarSign className="mr-2 text-gray-600 dark:text-orange-500" />
              {job.salary} (in INR LPA)
            </div>

            <div className="flex items-center text-gray-500 text-sm dark:text-slate-300">
              <Briefcase className="mr-2 text-gray-600 dark:text-orange-500" />
              {job.experience}
            </div>

            <div className="flex items-center text-gray-500 text-xs dark:text-slate-300">
              <Calendar className="mr-2 text-gray-600 dark:text-orange-500" />
              Posted on: {job.createdAt}
            </div>

            <div className="flex items-center text-gray-500 text-xs dark:text-slate-300">
              <Clipboard className="mr-2 text-gray-600 dark:text-orange-500" />
              Deadline: {job.deadline}
            </div>

            {/* ✅ Job Details Accordion with Markdown Rendering */}
            <Accordion type="single" collapsible defaultValue="job-details">
              <AccordionItem value="job-details">
                <AccordionTrigger className="flex items-center text-sm text-blue-600 mt-2">
                  Job Details
                </AccordionTrigger>
                <AccordionContent className="text-gray-500 text-sm mt-2">
                  <div className="rich-text markdown-content">
                    <RenderMarkdown content={job.details} />  {/* ✅ Properly Render Markdown */}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </div>
      </Card>

      {/* ✅ Job Actions (Apply & Go Back Buttons) */}
      <JobActions />

      {/* ✅ Job Application Form (Client Component) */}
      <JobApplicationForm jobId={job.documentId} jobName={job.title}  />
    </div>
  );
}
