"use client"; // ✅ Make it a client component

import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";

export default function ErrorPage() {
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    const checkStrapiStatus = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL || "http://localhost:1337"}/_health`, {
          method: "GET",
          cache: "no-store",
        });

        if (response.ok) {
          window.location.reload(); // ✅ Reload when Strapi is back online
        }
      } catch (error) {
        console.error("Strapi is still down:", error);
      }
    };

    const interval = setInterval(checkStrapiStatus, 2000); // ✅ Poll every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-6">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8 max-w-md text-center border border-red-300 dark:border-red-700">
        {/* Pulsating Warning Icon */}
        <div className="animate-pulse">
          <AlertCircle className="w-14 h-14 text-red-500 mx-auto" />
        </div>

        <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-gray-100">
          Backend Unavailable
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Our servers are currently down. We are actively working to resolve the issue.
        </p>

        <div className="mt-4 p-4 bg-red-100 dark:bg-red-900 rounded-lg text-sm text-red-700 dark:text-red-300 border border-red-300 dark:border-red-700">
          <p>⚠️ For Admins: Ensure Strapi is running on port <strong>1337</strong>.</p>
        </div>

        {/* Subtle Loading Indicator */}
        <div className="mt-6 flex justify-center">
          <span className="w-5 h-5 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></span>
        </div>

        <p className="text-gray-500 text-sm mt-2">
          Checking server status...
        </p>
      </div>
    </div>
  );
}
