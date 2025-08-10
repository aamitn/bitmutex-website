"use client";

import { useState } from "react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, MapPin, Calendar } from "lucide-react";
import Link from "next/link";

interface Job {
  documentID: string;
  title: string;
  description: string;
  location: string;
  postedAt: string;
  experience: string;
  deadline: string;
}

interface JobBoardClientProps {
  initialJobs: Job[];
}

export default function JobBoardClient({ initialJobs }: JobBoardClientProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [experienceFilter, setExperienceFilter] = useState<Set<string>>(new Set());
  const [locationFilter, setLocationFilter] = useState<Set<string>>(new Set());

  const experienceOptions = Array.from(
    new Set(initialJobs.map((job) => job.experience).filter(Boolean))
  );
  const locationOptions = Array.from(
    new Set(initialJobs.map((job) => job.location).filter(Boolean))
  );

  const filteredJobs = initialJobs.filter((job) => {
    return (
      (!searchTerm ||
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (experienceFilter.size === 0 || experienceFilter.has(job.experience)) &&
      (locationFilter.size === 0 || locationFilter.has(job.location))
    );
  });

  const toggleFilter = (
    filterSet: Set<string>,
    value: string,
    setFilter: (s: Set<string>) => void
  ) => {
    const newSet = new Set(filterSet);
    if (newSet.has(value)) newSet.delete(value);
    else newSet.add(value);
    setFilter(newSet);
  };

  return (
    <div className="container mx-auto p-6 mt-20 mb-20 gap-8 flex flex-col md:flex-row">
      {/* Sidebar with Filters */}
      <aside className="w-full md:w-1/4 lg:w-1/5 p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg sticky top-24 h-fit">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
          Filters
        </h2>

        {/* Search Input */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search jobs..."
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search jobs"
          />
        </div>

        {/* Experience Filter */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
            Experience
          </h3>
          <div className="flex flex-col gap-3 max-h-48 overflow-y-auto pr-2">
            {experienceOptions.map((experience) => (
              <label
                key={experience}
                htmlFor={`experience-${experience}`}
                className="inline-flex items-center cursor-pointer text-gray-700 dark:text-gray-300 select-none"
              >
                <input
                  id={`experience-${experience}`}
                  type="checkbox"
                  value={experience}
                  checked={experienceFilter.has(experience)}
                  onChange={() =>
                    toggleFilter(experienceFilter, experience, setExperienceFilter)
                  }
                  className="form-checkbox h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700"
                />
                <span className="ml-3">{experience}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Location Filter */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
            Location
          </h3>
          <div className="flex flex-col gap-3 max-h-48 overflow-y-auto pr-2">
            {locationOptions.map((location) => (
              <label
                key={location}
                htmlFor={`location-${location}`}
                className="inline-flex items-center cursor-pointer text-gray-700 dark:text-gray-300 select-none"
              >
                <input
                  id={`location-${location}`}
                  type="checkbox"
                  value={location}
                  checked={locationFilter.has(location)}
                  onChange={() =>
                    toggleFilter(locationFilter, location, setLocationFilter)
                  }
                  className="form-checkbox h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700"
                />
                <span className="ml-3">{location}</span>
              </label>
            ))}
          </div>
        </div>
      </aside>

      {/* Job Listings */}
      <main className="flex-1">
        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredJobs.map((job) => (
              <Link
              href={`/jobs/${job.documentID}`}
              key={job.documentID}
              className="block group bg-white dark:bg-gray-900 rounded-2xl shadow-md hover:shadow-xl transition-shadow transform hover:-translate-y-1 hover:scale-[1.02] duration-300 cursor-pointer p-6 flex flex-col min-h-full"
              aria-label={`View details for ${job.title}`}
            >
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-xl font-extrabold text-gray-900 dark:text-white line-clamp-2">
                  {job.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0 flex flex-col flex-grow space-y-4 text-gray-700 dark:text-gray-300">
                <p className="text-sm leading-relaxed line-clamp-3">{job.description}</p>

                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-medium">
                    <MapPin className="h-5 w-5" />
                    <span>{job.location}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>Posted: {job.postedAt}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                    <Briefcase className="h-4 w-4" />
                    <span>{job.experience} exp.</span>
                  </div>
                </div>
              </CardContent>

              <footer className="mt-auto pt-6">
                <div className="bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-400 rounded-xl py-2 px-4 font-semibold text-sm w-max">
                  Application Deadline: {job.deadline}
                </div>

                {/* Button appears only on hover */}
                <div className="mt-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    className="w-full py-3 text-base font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg transition-transform transform group-hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-400"
                  >
                    View Details
                  </Button>
                </div>
              </footer>
            </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 text-lg mt-20">
            No jobs found matching your criteria.
          </p>
        )}
      </main>
    </div>
  );
}
