"use client";  // ✅ Ensure it's a Client Component

import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';


export default function JobActions() {
  return (
    <div className="flex gap-4 mt-4">

      {/* Go Back Button */}
      <Button
        onClick={() => globalThis.location.href = '/jobs'}
        className="px-6 py-3 bg-orange-600 text-white font-medium rounded-md shadow-lg hover:bg-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-300 transform hover:scale-105 transition-all duration-200 ease-in-out w-full sm:w-auto"
      >
    <ArrowLeft className="h-5 w-5 text-slate-200 shrink-0" />

        Go Back to All Jobs
      </Button>
    </div>
  );
}