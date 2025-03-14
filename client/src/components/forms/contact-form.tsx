"use client";
import React, { useState } from "react";
import { Container } from "./container";

import { Button } from "@/components/ui/button";

const adminEmail = "amitnandileo@gmail.com";

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    referralSource: "",
    honeypot: "", // Honeypot field
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check honeypot field
    if (formData.honeypot) {
      console.warn("Spam detected! Submission blocked.");
      return; // Stop form submission
    }

    setLoading(true);

    try {
        console.log(process.env.NEXT_PUBLIC_STRAPI_BASE_URL);
      // Save form data to backend
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/contact-form-submissions`, 
        {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            referralSource: formData.referralSource,
            message: formData.message,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save message");
      }

      // Send confirmation email to user
      const emailResponse = await fetch(`/api/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: formData.email,
          subject: "Thank You for contacting Bitmutex",
          message: `Hi <b>${formData.name}</b>,<br><br>
          Thank you for reaching out to Bitmutex Technologies! We have received your message and will get back to you as soon as possible.<br><br>
          In the meantime, feel free to download our brochure <a href="https://bitmutex.in/brochure">here</a>.<br><br>
          Best Regards,<br>
          Team Bitmutex `,
        }),
      });

      if (!emailResponse.ok) {
        throw new Error("Failed to send email to user");
      }

      // Delay before sending admin email
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Send email notification to admin
      const emailResponseAdmin = await fetch(`/api/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: adminEmail,
          subject: "New Contact Form Submission",
          message: `🚀 New Contact Form Submission 🚀 <br>
          📌 **Name:** ${formData.name}<br>
          📌 **Email:** ${formData.email}<br>
          📌 **Phone:** ${formData.phone}<br>
          📌 **Referral Source:** ${formData.referralSource}<br>
          📌 **Message:**<br>${formData.message}<br>
          🔍 Please review and take necessary action.<br>
          Best Regards,<br> BitMutex Bot 🤖`,
        }),
      });

      if (!emailResponseAdmin.ok) {
        throw new Error("Failed to send email to admin");
      }

      setSuccess("Your submission is successful!");
      setFormData({ name: "", email: "", phone: "", referralSource: "", message: "", honeypot: "" });

    } catch (error) {
      console.error(error);
      setSuccess("Oops! Something went wrong");
    }

    setLoading(false);
  };

  return (
    <Container className="h-screen max-w-lg mx-auto flex flex-col ">
      <h1 className="text-lg md:text-xl my-4 text-gray-600">We won’t spam you.</h1>
      <form className="w-full my-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="h-10 pl-4 w-full mb-4 rounded-md text-sm bg-charcoal border border-neutral-800 text-white placeholder-neutral-500 outline-none focus:ring-2 focus:ring-neutral-800"
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="h-10 pl-4 w-full mb-4 rounded-md text-sm bg-charcoal border border-neutral-800 text-white placeholder-neutral-500 outline-none focus:ring-2 focus:ring-neutral-800"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Your Contact Number"
          value={formData.phone}
          onChange={(e) => {
            const numericValue = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
            setFormData({ ...formData, phone: numericValue });
          }}
          required
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={10}
          className="h-10 pl-4 w-full mb-4 rounded-md text-sm bg-charcoal border border-neutral-800 text-white placeholder-neutral-500 outline-none focus:ring-2 focus:ring-neutral-800"
        />

        <label htmlFor="referralSource" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Where did you hear about us?</label>
        <select
          id="referralSource"
          name="referralSource"
          value={formData.referralSource}
          onChange={handleChange}
          required
          className="h-10 pl-4 w-full mb-4 rounded-md text-sm bg-charcoal border border-neutral-800 text-white placeholder-neutral-500 outline-none focus:ring-2 focus:ring-neutral-800"
        >
          <option value="" disabled>
            Where did you hear about us?
          </option>
          <option value="google">Google</option>
          <option value="social_media">Social Media</option>
          <option value="friend">Friend</option>
          <option value="advertisement">Advertisement</option>
          <option value="other">Other</option>
        </select>
        <textarea
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          required
          className="h-28 pl-4 pt-2 w-full mb-4 rounded-md text-sm bg-charcoal border border-neutral-800 text-white placeholder-neutral-500 outline-none focus:ring-2 focus:ring-neutral-800"
        />
        
        {/* Honeypot Field */}
        <input
          type="text"
          name="honeypot"
          value={formData.honeypot}
          onChange={handleChange}
          className="hidden"
          autoComplete="off"
          aria-hidden="true"
        />

        <Button variant="default" type="submit" className="w-full py-3" disabled={loading}>
          <span className="text-sm">{loading ? "Sending..." : "Send Message"}</span>
        </Button>
      </form>
      {success && <p className="text-sm text-green-500">{success}</p>}
    </Container>
  );
};