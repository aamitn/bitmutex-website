"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, MapPin, Calendar } from 'lucide-react';
import Link from 'next/link'

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

  // Extract filter options
  const experienceOptions = Array.from(new Set(initialJobs.map(job => job.experience).filter(Boolean)));
  const locationOptions = Array.from(new Set(initialJobs.map(job => job.location).filter(Boolean)));

  // Filtering logic
  const filteredJobs = initialJobs.filter((job) => {
    return (
      (!searchTerm ||
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (experienceFilter.size === 0 || experienceFilter.has(job.experience)) &&
      (locationFilter.size === 0 || locationFilter.has(job.location))
    );
  });
  const toggleFilter = (filterSet: Set<string>, value: string, setFilter: (s: Set<string>) => void) => {
    const newSet = new Set(filterSet);
    
    if (newSet.has(value)) {
      newSet.delete(value);
    } else {
      newSet.add(value);
    }
    
    setFilter(newSet);
  };

  return (
    <div className="container mx-auto p-6 mt-20 mb-20 gap-6 flex flex-col md:flex-row">
      {/* Sidebar with Filters */}
      <div className="w-full md:w-1/4 lg:w-1/5 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mb-6 md:mb-0">
        <h2 className="text-xl font-semibold mb-4">Filters</h2>

        {/* Search Input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search Jobs"
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Experience Filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium">Experience</label>
          {experienceOptions.map((experience) => (
            <div key={experience} className="flex items-center mb-2">
              <input
                type="checkbox"
                value={experience}
                checked={experienceFilter.has(experience)}
                onChange={() => toggleFilter(experienceFilter, experience, setExperienceFilter)}
                id={`experience-${experience}`}
                className="mr-2"
              />
              <label htmlFor={`experience-${experience}`} className="text-sm text-gray-700 dark:text-slate-300/80">
                {experience}
              </label>
            </div>
          ))}
        </div>

        {/* Location Filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium">Location</label>
          {locationOptions.map((location) => (
            <div key={location} className="flex items-center mb-2">
              <input
                type="checkbox"
                value={location}
                checked={locationFilter.has(location)}
                onChange={() => toggleFilter(locationFilter, location, setLocationFilter)}
                id={`location-${location}`}
                className="mr-2"
              />
              <label htmlFor={`location-${location}`} className="text-sm text-gray-700 dark:text-slate-300/80">
                {location}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Job Listings */}
      <div className="flex-1">

        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <Link href={`/jobs/${job.documentID}`} passHref key={job.documentID} className="block">
              <Card 
                className="group relative flex flex-col p-4 hover:shadow-lg transition-all rounded-xl cursor-pointer 
                          hover:scale-[1.02] active:scale-[0.98] transform-gpu 
                          bg-white dark:bg-gray-900 dark:hover:bg-gray-800 min-h-full"
              >
                <div className="flex flex-col flex-grow">
                  <CardHeader className="p-0">
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">{job.title}</CardTitle>
                  </CardHeader>

                  <CardContent className="p-0 mt-2 flex flex-col flex-grow space-y-2">
                    <p className="text-gray-600 dark:text-gray-400 text-sm break-words">{job.description}</p>

                    <div className="flex items-center text-gray-500 text-sm dark:text-gray-400">
                      <MapPin className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-300" />
                      <span>{job.location}</span>
                    </div>

                    <div className="flex items-center text-gray-500 text-xs dark:text-gray-400">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-300" />
                      <span>Posted on: {job.postedAt}</span>
                    </div>

                    <div className="flex items-center text-gray-500 text-xs dark:text-gray-400">
                      <Briefcase className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-300" />
                      <span>Experience: {job.experience}</span>
                    </div>
                  </CardContent>

                  <div className="flex flex-col mt-auto space-y-2 pt-5">
                    <div className="p-2 bg-red-100 text-red-700 rounded-lg text-sm font-semibold">
                      <span>Application Deadline: {job.deadline}</span>
                    </div>

                    {/* ✅ Button Appears Only on Hover */}
                    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        className="px-5 py-2 text-sm font-medium rounded-lg transition-all duration-300 
                                  bg-gradient-to-r from-blue-600 to-indigo-600 text-white 
                                  hover:from-indigo-700 hover:to-blue-700 shadow-md 
                                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                                  dark:from-gray-600 dark:to-gray-700 dark:hover:from-gray-700 dark:hover:to-gray-600 
                                  dark:text-gray-200 dark:shadow-lg"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
        ) : (
          <p className="text-center text-gray-500">No jobs found.</p>
        )}
      </div>
    </div>
  );
}
