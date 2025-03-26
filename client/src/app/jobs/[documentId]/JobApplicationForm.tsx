"use client";
import {  useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
// Form submission API URL
const API_URL = process.env.STRAPI_BASE_URL || "http://localhost:1337";

interface JobApplicationFormProps {
    jobId: string;
    jobName: string; // New prop for job name
  }

  const JobApplicationForm = ({ jobId, jobName }: JobApplicationFormProps) => {
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
            job: String(jobId) + " - " + jobName,  // The job ID this application is associated with
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


  export default JobApplicationForm;
  