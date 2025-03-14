"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Briefcase, MapPin, Calendar } from 'lucide-react';


interface Job {
  documentID: string;
  title: string;
  description: string;
  location: string;
  postedAt: string;
  experience: string;
  deadline: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

const JobBoardPage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);

  // States for filters
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [experienceFilter, setExperienceFilter] = useState<Set<string>>(new Set());
  const [locationFilter, setLocationFilter] = useState<Set<string>>(new Set());

  // Dynamic filters options based on job data
  const [experienceOptions, setExperienceOptions] = useState<string[]>([]);
  const [locationOptions, setLocationOptions] = useState<string[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(`${API_URL}/api/jobs?populate=*`);
        const result = await response.json();

        if (!result.data || !Array.isArray(result.data)) {
          throw new Error("Invalid response format");
        }

        // Mapping the result data to match the job structure.
        const jobData: Job[] = result.data.map((job: any) => ({
          documentID: job.documentId,
          title: job.title || "Untitled Job",
          description: job.description || "No description available.",
          location: job.location || "Not specified",
          postedAt: job.createdAt || "Unknown date",
          experience: job.experience || "Not specified",
          deadline: job.deadline || "No deadline specified",
        }));

        setJobs(jobData);
        setFilteredJobs(jobData);

        // Extract unique experience and location options
        const experienceSet = new Set<string>();
        const locationSet = new Set<string>();

        jobData.forEach((job) => {
          if (job.experience) experienceSet.add(job.experience);
          if (job.location) locationSet.add(job.location);
        });

        setExperienceOptions(Array.from(experienceSet));
        setLocationOptions(Array.from(locationSet));

      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Filter jobs based on search term and selected filters
  useEffect(() => {
    let filtered = jobs;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((job) =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by selected experience
    if (experienceFilter.size > 0) {
      filtered = filtered.filter((job) =>
        experienceFilter.has(job.experience)
      );
    }

    // Filter by selected location
    if (locationFilter.size > 0) {
      filtered = filtered.filter((job) =>
        locationFilter.has(job.location)
      );
    }

    setFilteredJobs(filtered);
  }, [searchTerm, experienceFilter, locationFilter, jobs]);

  const handleExperienceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const experience = event.target.value;
    setExperienceFilter((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(experience)) {
        newSet.delete(experience);
      } else {
        newSet.add(experience);
      }
      return newSet;
    });
  };

  const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const location = event.target.value;
    setLocationFilter((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(location)) {
        newSet.delete(location);
      } else {
        newSet.add(location);
      }
      return newSet;
    });
  };

  return (
    <div className="container mx-auto p-6 mt-20 mb-20 gap-6 flex flex-col md:flex-row">
      {/* Sidebar with Filters */}
      <div className="w-full md:w-1/4 lg:w-1/5 p-4 bg-gray-100 rounded-lg mb-6 md:mb-0">
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
          {experienceOptions.length > 0 ? (
            experienceOptions.map((experience) => (
              <div key={experience} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  value={experience}
                  checked={experienceFilter.has(experience)}
                  onChange={handleExperienceChange}
                  id={`experience-${experience}`}
                  className="mr-2"
                />
                <label htmlFor={`experience-${experience}`} className="text-sm text-gray-700">
                  {experience}
                </label>
              </div>
            ))
          ) : (
            <p>No experience options available</p>
          )}
        </div>

        {/* Location Filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium">Location</label>
          {locationOptions.length > 0 ? (
            locationOptions.map((location) => (
              <div key={location} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  value={location}
                  checked={locationFilter.has(location)}
                  onChange={handleLocationChange}
                  id={`location-${location}`}
                  className="mr-2"
                />
                <label htmlFor={`location-${location}`} className="text-sm text-gray-700">
                  {location}
                </label>
              </div>
            ))
          ) : (
            <p>No location options available</p>
          )}
        </div>
      </div>

      {/* Job Listings */}
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-center mb-6">Job Openings</h1>

        {loading ? (
          <div className="space-y-4">
            {Array(6)
              .fill(null)
              .map((_, index) => (
                <Skeleton key={index} className="h-32 w-full rounded-lg" />
              ))}
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job: Job) => (
              <Card key={job.documentID} className="relative flex flex-col p-4 hover:shadow-md transition-shadow rounded-xl">
                <div className="flex-1 flex flex-col">
                  <CardHeader className="p-0">
                    <CardTitle className="text-lg font-semibold">{job.title}</CardTitle>
                  </CardHeader>

                  <CardContent className="p-0 mt-2 flex flex-col flex-grow space-y-2">
                    <p className="text-gray-600 text-sm break-words">{job.description}</p>

                    <div className="flex items-center text-gray-500 text-sm">
                      <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                      <span>{job.location}</span>
                    </div>

                    <div className="flex items-center text-gray-500 text-xs">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <span>Posted on: {job.postedAt}</span>
                    </div>

                    <div className="flex items-center text-gray-500 text-xs">
                      <Briefcase className="h-4 w-4 mr-2 text-gray-500" />
                      <span>Experience: {job.experience}</span>
                    </div>
                  </CardContent>

                  <div className="flex flex-col mt-auto space-y-2">
                    <div className="p-2 bg-red-100 text-red-700 rounded-lg text-sm font-semibold">
                      <span>Application Deadline: {job.deadline}</span>
                    </div>

                    <Button asChild>
                      <a href={`/jobs/${job.documentID}`}>View Details</a>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No jobs found.</p>
        )}
      </div>
    </div>
  );
};

export default JobBoardPage;
