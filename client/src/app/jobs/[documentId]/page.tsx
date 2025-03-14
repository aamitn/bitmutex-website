"use client"
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, DollarSign, Calendar, Clipboard, Briefcase } from 'lucide-react'; // Importing Lucide icons
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';  // For GitHub-flavored markdown (tables, strikethroughs, etc.)
import rehypeRaw from 'rehype-raw';  // For rendering HTML tags if needed



// Form submission API URL
const API_URL = process.env.STRAPI_BASE_URL || "http://localhost:1337";

const JobApplicationForm = ({ jobId }: { jobId: string }) => {
  const [applicationData, setApplicationData] = useState({
    name: "",
    email: "",
    phone: "",
    coverLetter: "",
    resume: null as File | null,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setApplicationData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
  
    if (file) {
      const validFileTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      const maxFileSize = 5 * 1024 * 1024; // 5MB in bytes
  
      // Check file type
      if (!validFileTypes.includes(file.type)) {
        setMessage("Please upload a valid PDF or DOCX file.");
        return;
      }
  
      // Check file size
      if (file.size > maxFileSize) {
        setMessage("File size exceeds the 5MB limit. Please upload a smaller file.");
        return;
      }
  
      // If file is valid, update the state
      setApplicationData((prev) => ({ ...prev, resume: file }));
      setMessage("");  // Clear any previous messages
    }
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("files", file); // Attach file to FormData
  
    const response = await fetch(`${API_URL}/api/upload`, {
      method: "POST",
      body: formData, // Send the FormData as the body
    });
  
    if (response.ok) {
      const responseData = await response.json();
      return responseData[0].id; // Get the file ID from the response
    } else {
      throw new Error("Failed to upload file");
    }
  };
  
  const validateForm = () => {
    const { name, email, phone, coverLetter, resume } = applicationData;
    if (!name || !email || !phone || !coverLetter) {
      setMessage("Please fill in all the required fields.");
      return false;
    }
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    
    if (!validateForm()) {
      setLoading(false);
      return;
    }
  
    let resumeId = null;
  
    try {
      if (applicationData.resume) {
        // Upload the resume first if it's present
        resumeId = await uploadFile(applicationData.resume);
      }
  
      const requestBody = {
        data: {
          name: applicationData.name,
          email: applicationData.email,
          phone: applicationData.phone,
          coverLetter: applicationData.coverLetter,
          job: jobId,  // The job ID this application is associated with
          resume: resumeId,  // Attach the resume ID (null if no file uploaded)
        },
      };
  
      const response = await fetch(`${API_URL}/api/job-applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody), // Send the application data
      });
  
      if (response.ok) {
        setMessage("Application submitted successfully!");
      } else {
        const errorDetails = await response.json();
        setMessage("There was an error submitting your application.");
        console.error("Error details:", errorDetails);
      }
    } catch (error) {
      setMessage("There was an error submitting your application.");
      console.error("Error submitting application:", error);
    } finally {
      setLoading(false);
    }
  };
  

  
  

  return (
    <div className="container mx-auto p-6 mt-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-xl font-semibold">Apply for this Job</h3>

        {message && (
          <div className="mt-4 text-center text-red-500">
            <p>{message}</p>
          </div>
        )}

        <Input
          type="text"
          name="name"
          placeholder="Your Name"
          value={applicationData.name}
          onChange={handleInputChange}
          required
        />
        <Input
          type="email"
          name="email"
          placeholder="Your Email"
          value={applicationData.email}
          onChange={handleInputChange}
          required
        />
        <Input
          type="text"
          name="phone"
          placeholder="Your Phone Number"
          value={applicationData.phone}
          onChange={handleInputChange}
          required
        />
        <Textarea
          name="coverLetter"
          placeholder="Cover Letter"
          value={applicationData.coverLetter}
          onChange={handleInputChange}
          required
        />

        {/* Modern File Upload Input */}
        <div className="space-y-2">
          <Label htmlFor="resume" className="text-sm text-gray-700 font-medium">
            Upload Resume
          </Label>
          <div className="flex items-center justify-center w-full">
            {/* File Upload Button */}
            <label
              htmlFor="resume"
              className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 border-2 border-dashed border-gray-300 rounded-lg py-4 px-6 cursor-pointer transition duration-200 ease-in-out"
            >
              <span className="text-sm text-gray-700 font-medium">Choose a File</span>
              <input
                type="file"
                id="resume"
                name="resume"
                accept=".pdf,.docx"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            {/* Display file name if a file is selected */}
            {applicationData.resume && (
              <div className="flex items-center ml-4 text-sm text-gray-600">
                <span>{applicationData.resume.name}</span>
              </div>
            )}
          </div>
        </div>

        <Button type="submit" className="w-full mt-4" disabled={loading}>
          {loading ? "Submitting..." : "Submit Application"}
        </Button>
      </form>
    </div>
  );
};


// The `params` prop contains the route parameters
const JobDetailPage = ({ params }: { params: Promise<{ documentId: string }> }) => {
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Unwrap the params object using React.use() to get the documentId
  const [unwrappedParams, setUnwrappedParams] = useState<{ documentId: string } | null>(null);

  useEffect(() => {
    // Since params is a Promise, use React.use() to unwrap it
    const getParams = async () => {
      const resolvedParams = await params;
      setUnwrappedParams(resolvedParams);
    };

    getParams();
  }, [params]);

  useEffect(() => {
    if (unwrappedParams && unwrappedParams.documentId) {
      const fetchJob = async () => {
        try {
          const url = `${API_URL}/api/jobs/${unwrappedParams.documentId}?populate=*`;
          console.log("Fetching job data from URL:", url);

          const response = await fetch(url);
          const result = await response.json();

          if (result.data) {
            setJob(result.data);
          } else {
            console.error("Job not found.");
          }
        } catch (error) {
          console.error("Error fetching job details:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchJob();
    }
  }, [unwrappedParams]);

  if (loading) {
    return (
      <div className="container mx-auto p-6 mt-20 mb-20">
        <Skeleton className="h-32 w-full rounded-lg" />
      </div>
    );
  }

  if (!job) {
    return <div className="container mx-auto p-6 mt-20 mb-20">Job not found.</div>;
  }

  return (
    <div className="container mx-auto p-6 mt-20 mb-20">
<Card className="p-4 flex flex-col sm:flex-row gap-6 bg-white shadow-lg rounded-lg">
  <div className="flex-1">
    <CardHeader className="p-0">
      <CardTitle className="text-2xl font-semibold text-gray-800">{job.title}</CardTitle>
    </CardHeader>
    <CardContent className="p-0 mt-2 space-y-4">
      
      {/* Job Description */}
      <p className="text-gray-600 text-sm">{job.description}</p>

      {/* Location */}
      <div className="flex items-center text-gray-500 text-sm">
        <MapPin className="mr-2 text-gray-600" />
        {job.location}
      </div>

      {/* Salary */}
      <div className="flex items-center text-gray-500 text-sm">
        <DollarSign className="mr-2 text-gray-600" />
        {job.salary}
      </div>

      {/* Experience */}
      <div className="flex items-center text-gray-500 text-sm">
        <Briefcase className="mr-2 text-gray-600" />
        {job.experience ? job.experience : "Not Specified"}
      </div>

      {/* Posted On */}
      <div className="flex items-center text-gray-500 text-xs">
        <Calendar className="mr-2 text-gray-600" />
        Posted on: {job.createdAt}
      </div>

      {/* Deadline */}
      <div className="flex items-center text-gray-500 text-xs">
        <Clipboard className="mr-2 text-gray-600" />
        Deadline: {job.deadline}
      </div>
     
      {/* ShadCN Accordion for Job Details with React Markdown Rendering */}
      <Accordion type="single" collapsible defaultValue="job-details">
        <AccordionItem value="job-details">
          <AccordionTrigger className="flex items-center text-sm text-blue-600 mt-2">
            Job Details
          </AccordionTrigger>
          <AccordionContent className="text-gray-500 text-sm mt-2">
            <div className="markdown-content">  
            <ReactMarkdown
              components={{
                p: ({ node, ...props }) => <p className="mb-2 text-gray-600 dark:text-gray-300" {...props} />,
                h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mt-4" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-xl font-semibold mt-3" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc pl-5" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal pl-5" {...props} />,
                blockquote: ({ node, ...props }) => <blockquote className="border-l-4 pl-4 italic text-gray-500" {...props} />,
                code: ({ node, ...props }) => <code className="bg-gray-100 dark:bg-gray-800 p-1 rounded" {...props} />,
              }}
              remarkPlugins={[remarkGfm]} // Enables GitHub-flavored markdown
              rehypePlugins={[rehypeRaw]} // Allow HTML content if included in markdown
              children={job.details} // Markdown content
            />
            </div>            
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Buttons */}
      <CardContent className="p-0 mt-2 flex gap-4">
        {/* Apply Button */}
        <Button 
          asChild 
          className="bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300 w-full sm:w-auto"
        >
          <a href={`/apply/${job.id}`} className="block w-full text-center py-3">
            Apply Now
          </a>
        </Button>

        {/* Go Back Button Inline */}
        <Button 
          onClick={() => window.location.href = '/jobs'} 
          className="px-6 py-3 bg-orange-600 text-white font-medium rounded-md shadow-lg hover:bg-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-300 transform hover:scale-105 transition-all duration-200 ease-in-out w-full sm:w-auto"
        >
          Go Back to All Jobs
        </Button>
      </CardContent>

    </CardContent>
  </div>
</Card>
      
      {/* Include the job application form here */}
      <JobApplicationForm jobId={job.id} />
    </div>
  );
};

export default JobDetailPage;
