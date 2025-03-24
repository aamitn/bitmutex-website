"use client";
import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css"; // Import styles
import { Container } from "./container";
import { Button } from "@/components/ui/button";


const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "amitnandileo@gmail.com";

export const RegisterForm = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    enquirytype: "",
    honeysecretpot: "", // Honeypot field
  });

  const [vcFile, setVcFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (value: string) => {
    setFormData({ ...formData, phone: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];

      if (!allowedTypes.includes(file.type)) {
        alert("Invalid file type. Please upload a PDF or image.");
        return;
      }

      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        alert("File size exceeds 2MB. Please upload a smaller file.");
        return;
      }

      setVcFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.honeysecretpot) {
      console.warn("Spam detected! Submission blocked.");
      return;
    }

    setLoading(true);
    let uploadedFileId = null;

    try {
      // **Step 1: Upload File First (If Exists)**
      if (vcFile) {
        const fileFormData = new FormData();
        fileFormData.append("files", vcFile);

        const fileResponse = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/upload`,
          {
            method: "POST",
            body: fileFormData,
          }
        );

        if (!fileResponse.ok) {
          throw new Error("File upload failed.");
        }

        const fileData = await fileResponse.json();
        uploadedFileId = fileData[0].id; // Get uploaded file ID
        console.log("File uploaded successfully. Media ID:", uploadedFileId);
      }

      // **Step 2: Submit Form Data (with File ID)**
      const submissionData = {
        data: {
          firstname: formData.firstname,
          lastname: formData.lastname,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          service: formData.service,
          enquirytype: formData.enquirytype,
          vcfile: uploadedFileId ? uploadedFileId : null, // Attach uploaded file ID if exists
        },
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/registration-form-submissions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submissionData),
        }
      );

      if (!response.ok) {
        throw new Error("Form submission failed.");
      }

      const responseData = await response.json();
      const submissionId = responseData.data.id;
      console.log("Form submission successful. ID:", submissionId);

      // **Step 3: Send Confirmation Email to User**
      const emailResponse = await fetch(`/api/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: formData.email,
          subject: "Thank You for contacting Bitmutex",
          message: `Hi <b>${formData.firstname}</b>,<br><br>
            Thank you for registering with Bitmutex Technologies! We have received your details, expect a call from us.<br><br>
            In the meantime, feel free to download our brochure <a href="https://bitmutex.com/brochure">here</a>.<br><br>
            Best Regards,<br>
            Team Bitmutex`,
        }),
      });

      if (!emailResponse.ok) {
        throw new Error("Failed to send email to user.");
      }

      // **Step 4: Wait Before Sending Admin Email**
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // **Step 5: Send Email Notification to Admin**
      let attachmentData = null;
      if (vcFile) {
        const reader = new FileReader();
        attachmentData = await new Promise((resolve) => {
          reader.readAsDataURL(vcFile);
          reader.onload = () => resolve(reader.result);
        });
      }

      const emailResponseAdmin = await fetch(`/api/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: adminEmail,
          subject: "New Registration Form Submission (With CV Attachment)",
          message: `🚀 New Registration Form Submission with CV attached PFA. 🚀 <br>
                    📌 **First Name:** ${formData.firstname}<br>
                    📌 **Last Name:** ${formData.lastname}<br>
                    📌 **Email:** ${formData.email}<br>
                    📌 **Phone:** ${formData.phone}<br>
                    📌 **Company:** ${formData.company}<br>
                    📌 **Service Opted:** ${formData.service}<br>
                    📌 **Enquiry Type:** ${formData.enquirytype}<br>
                    🔍 Please review and take necessary action.<br>
                    Best Regards,<br> Bitmutex Bot 🤖`,
          attachments: vcFile
            ? [
              {
                filename: vcFile.name,
                content: attachmentData,
                encoding: "base64",
              },
            ]
            : [],
        }),
      });

      if (!emailResponseAdmin.ok) {
        throw new Error("Failed to send admin email with attachment.");
      }

      setSuccess("Registration Successful!");

      // **Step 6: Reset Form**
      setFormData({
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        company: "",
        service: "",
        enquirytype: "",
        honeysecretpot: "",
      });
      setVcFile(null);
    } catch (error) {
      console.error(error);
      setSuccess("Error submitting form.");
    }

    setLoading(false);
  };

  return (
    <Container className="h-full max-w-lg mx-auto flex flex-col items-center justify-center">
      <h1 className="text-xl font-heading font-bold md:text-4xl font-bold my-4 text-slate-800 dark:text-orange-400">Request a Quote</h1>
      <form className="w-full my-4" onSubmit={handleSubmit}>
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            name="firstname"
            placeholder="First Name"
            value={formData.firstname}
            onChange={handleChange}
            required
            className="h-10 pl-4 w-1/2 rounded-md text-sm bg-white border border-neutral-800 text-black placeholder-gray-500 outline-none focus:ring-2 focus:ring-neutral-800 dark:focus:ring-orange-300"
          />
          <input
            type="text"
            name="lastname"
            placeholder="Last Name"
            value={formData.lastname}
            onChange={handleChange}
            required
            className="h-10 pl-4 w-1/2 rounded-md text-sm bg-white border border-neutral-800 text-black placeholder-gray-500 outline-none focus:ring-2 focus:ring-neutral-800 dark:focus:ring-orange-300"
          />
        </div>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="h-10 pl-4 w-full mb-4 rounded-md text-sm bg-white border border-neutral-800 text-black placeholder-gray-500 outline-none focus:ring-2 focus:ring-neutral-800 dark:focus:ring-orange-300"
        />

        <div className="mb-4">
          <PhoneInput
            country={"in"}
            value={formData.phone}
            onChange={handlePhoneChange}
            inputStyle={{
              width: "100%",
              height: "40px",
              borderRadius: "6px",
              border: "1px solid #333",
              paddingLeft: "50px",
              backgroundColor: "white",
              color: "black",
            }}
            buttonStyle={{
              borderRadius: "6px 0 0 6px",
              borderRight: "1px solid #333",
            }}
          />
        </div>

        <input
          type="text"
          name="company"
          placeholder="Company Name"
          value={formData.company}
          onChange={handleChange}
          required
          className="h-10 pl-4 w-full mb-4 rounded-md text-sm bg-white border border-neutral-800 text-black placeholder-gray-500 outline-none focus:ring-2 focus:ring-neutral-800 dark:focus:ring-orange-300"
        />
        <label htmlFor="service" className="block text-sm font-medium text-gray-700 dark:text-slate-300">
          Service Opted
        </label>
        <select
          id="service"
          name="service"
          value={formData.service}
          onChange={handleChange}
          required
          className="h-10 pl-4 w-full mb-4 rounded-md text-sm bg-white border border-neutral-800 text-black placeholder-gray-500 outline-none focus:ring-2 focus:ring-neutral-800 dark:focus:ring-orange-300"
        >
          <option value="" disabled>
            Select Service
          </option>
          <option value="Web">Web</option>
          <option value="Mobile">Mobile</option>
          <option value="Cross Platform">Cross Platform</option>
          <option value="Mobile">Mobile</option>
          <option value="Backend">Backend</option>
          <option value="Data Driven">Data Driven</option>

        </select>

        <label htmlFor="enquirytype" className="block text-sm font-medium text-gray-700 dark:text-slate-300">
          Enquiry Type
        </label>
        <select
          id="enquirytype"
          name="enquirytype"
          value={formData.enquirytype}
          onChange={handleChange}
          required
          className="h-10 pl-4 w-full mb-4 rounded-md text-sm bg-white border border-neutral-800 text-black placeholder-gray-500 outline-none focus:ring-2 focus:ring-neutral-800 dark:focus:ring-orange-300"
        >
          <option value="" disabled>
            Select Enquiry Type
          </option>

          <option value="New Proposal">New Proposal</option>
          <option value="Existing Project">Existing Project</option>
          <option value="Support">Support</option>
          <option value="Billing">Billing</option>
          <option value="Operations">Operations</option>
        </select>

        <div className="mb-4">
          <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 dark:text-slate-300 ">
            Upload Proposal/ Relevant Files(PDF/IMG)
          </label>
          <span className="sr-only">Upload a CV file</span> {/* Screen reader-friendly label */}
          <div className="relative mt-2">
            <input
              id="file-upload"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex items-center justify-between bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 cursor-pointer hover:bg-gray-200 transition">
              <span className="text-sm text-gray-700">
                {vcFile ? vcFile.name : "Choose a file..."}
              </span>
              <span className="bg-neutral-800 text-white px-3 py-1 rounded-lg text-xs font-semibold">
                Browse
              </span>
            </div>
          </div>
        </div>

        {/* Honeypot Field */}
        <input
          type="text"
          name="honeysecretpot"
          value={formData.honeysecretpot}
          onChange={handleChange}
          className="hidden"
          autoComplete="off"
          aria-hidden="true"
        />


        <Button variant="default" type="submit" className="w-full py-3" disabled={loading}>
          <span className="text-sm">{loading ? "Submitting..." : "Submit"}</span>
        </Button>
      </form>
      {success && <p className="text-sm text-green-500">{success}</p>}
    </Container>
  );
};