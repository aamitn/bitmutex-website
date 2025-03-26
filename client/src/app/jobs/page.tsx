import fetchContentType from "@/lib/strapi/fetchContentType";
import JobBoardClient from "./JobBoardClient"; // ✅ Client component

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

  return <JobBoardClient initialJobs={jobs} />;
}
