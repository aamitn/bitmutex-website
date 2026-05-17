"use client";  // ✅ Ensure it's a Client Component

import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import Link from "next/link";

export default function JobActions() {
  return (
    <div className="flex gap-4 mt-4">
      {/* asChild allows the Button to act stylistically while rendering an semantic <a> tag */}
      <Button asChild className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white w-full sm:w-auto">
        <Link href="/jobs">
          <ArrowLeft className="h-5 w-5 text-slate-200 shrink-0 mr-2" />
          Go Back to All Jobs
        </Link>
      </Button>
    </div>
  );
}