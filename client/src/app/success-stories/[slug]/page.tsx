"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchSuccessStoryBySlug } from "@/data/loaders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, ArrowLeft, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { FC } from "react";
import * as LucideIcons from "lucide-react";
import dynamic from "next/dynamic";
import Lightbox from 'yet-another-react-lightbox';
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Download from "yet-another-react-lightbox/plugins/download";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import 'yet-another-react-lightbox/styles.css';


const StoryMap = dynamic(() => import("@/components/custom/StoryMap"), { ssr: false });


interface Location {
  name: string;
  lat: number;
  lon: number;
}

interface Impact {
  name: string;
  description: string;
  icon: string;
}

interface Solution {
  name: string;
}

interface Service {
  name: string;
}

interface SuccessStory {
  uuid: number;
  name: string;
  content: string;
  slug: string;
  industry: string;
  websiteurl: string;
  location: Location[];
  logo: string | null;
  glimpses: { url: string }[];
  casestudy: string | null;
  impacts: Impact[];
  stack: Solution[];
  services: Service[];
}

// ✅ Convert kebab-case to PascalCase for Lucide icons
const toPascalCase = (str: string): string =>
  str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");

// ✅ Get the correct Lucide icon
const getLucideIcon = (iconName: string): FC<any> => {
  const pascalCaseName = toPascalCase(iconName);

  // Check if the icon exists in the imported LucideIcons and return it
  const Icon = (LucideIcons as any)[pascalCaseName];

  // Fallback to a default icon if the requested icon does not exist
  if (!Icon) {
    return LucideIcons.AlertCircle; // Replace this with a valid fallback icon if needed
  }

  return Icon;
};

const SuccessStoryDetails = () => {
  const { slug } = useParams();
  const [story, setStory] = useState<SuccessStory | null>(null);
  const [loading, setLoading] = useState(true);

  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);



  useEffect(() => {
    const loadStory = async () => {
      if (!slug) return;
      setLoading(true);
      const fetchedStory = await fetchSuccessStoryBySlug(slug as string);
      setStory(fetchedStory);
      setLoading(false);
    };
    loadStory();
  }, [slug]);

  if (loading) {
    return <p className="text-center text-gray-500 mt-10">Loading...</p>;
  }

  if (!story) {
    return <p className="text-center text-gray-500 mt-10">Success story not found.</p>;
  }

  //Get iamges and convert it to lighbox slide format
  const lightboxImages = story.glimpses?.map(glimpse => ({ src: glimpse.url })) || [];


  return (
    <div className="container mx-auto py-10 px-4 mt-8 mb-12">
      {/* Back Button */}
      <div className="flex items-center mb-6">
        <Link href="/success-stories">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Stories
          </Button>
        </Link>
      </div>

      {/* Success Story Card */}
      <Card className="shadow-lg rounded-lg overflow-hidden rounded-xl">
        {/* Company Logo */}
        {story.logo && (
          <div className="flex justify-center p-6">
            <img src={story.logo} alt={story.name} className="w-40 h-40 object-contain" />
          </div>
        )}

        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl font-extrabold tracking-wide bg-gradient-to-r from-blue-500 to-orange-500 bg-clip-text text-transparent">
            {story.name}
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-slate-300 flex items-center gap-1 mt-1">
            <Briefcase className="w-4 h-4" /> {story.industry}
          </p>
        </CardHeader>

        <CardContent>

          {/* Location with Map */}
          {story.location.length > 0 && (
            <div className="mt-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-slate-300">Location</h4>

              {/* Map using StoryMap Component */}
              <div className="w-full h-96 mt-4 rounded-lg overflow-hidden border border-amber-500 dark:border-gray-300 shadow-md">
                <StoryMap location={story.location[0]} /> {/* Pass the first location */}
              </div>

              {/* Location Details */}
              <div className="mt-2">
                {story.location.map((loc, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md shadow-sm mb-2 border border-gray-200 dark:border-gray-700"
                  >
                    <p className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      {loc.name}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Lat: {loc.lat.toFixed(6)}, Lon: {loc.lon.toFixed(6)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Success Story Heading Content */}
          <Card className="bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-lg border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <CardHeader className="text-center space-y-4 p-6">
              <CardTitle className="text-2xl font-light text-gray-900 dark:text-gray-100 tracking-wide leading-snug">
                How <span className="text-blue-600 dark:text-blue-400">{story.name}</span> Embarked on a Digital Transformation Journey with <span className="text-gray-800 dark:text-gray-300 font-bold">Bitmutex</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                {story.content}
              </p>
            </CardContent>
          </Card>


          {/* Case Study and Client Website Buttons */}
          <div className="mt-6 flex space-x-4">
            {/* Case Study */}
            {story.casestudy && (
              <Link href={story.casestudy} target="_blank">
                <Button className="mt-2">View Case Study</Button>
              </Link>
            )}

            {/* Client Website */}
            {story.websiteurl && (
              <Link href={story.websiteurl} target="_blank">
                <Button className="mt-2">Visit Website</Button>
              </Link>
            )}
          </div>

          {/* Glimpses */}
          {story.glimpses.length > 0 && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-slate-300">Glimpses</h4>
              <div className="flex flex-wrap gap-4 mt-2">
                {story.glimpses.map((glimpse, index) => (
                  <img
                    key={index}
                    src={glimpse.url}
                    alt={`Glimpse ${index + 1}`}
                    className="w-40 h-40 object-cover rounded-lg shadow-md cursor-pointer"
                    onClick={() => {
                      setIsOpen(true);
                      setCurrentIndex(index);
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Lightbox Modal */}
          {isOpen && (
            <Lightbox
              open={isOpen}
              close={() => setIsOpen(false)}
              slides={lightboxImages}
              index={currentIndex}
              plugins={[Thumbnails,Zoom,Download]}
              render={{
                slide: (slideProps) => {
                  return <img src={slideProps.slide?.src} alt="lightbox" />;
                },
                iconPrev: () => <ChevronLeft  />,
                iconNext: () => <ChevronRight  />,
                iconClose: () => <X  />,
              }}
            />
          )}

          <Separator className="my-6" />

          {/* Services Provided */}
          {story.services.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center flex-wrap gap-3">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-slate-300 whitespace-nowrap">
                  Services Provided:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {story.services.map((service) => (
                    <Badge key={service.name} className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                      {service.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}


          {/* Tech Stack */}
          {story.stack.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center flex-wrap gap-3">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-300 whitespace-nowrap">
                  Tech Stack Used:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {story.stack.map((tech) => (
                    <Badge key={tech.name} className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                      {tech.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}


          {/* Key Impacts in Styled Cards */}
          {story.impacts.length > 0 && (
            <div className="mt-8 mb-8">
              <h4 className="text-xl font-bold text-gray-900 dark:text-gray-200 tracking-wide">
                🔥 Key Impacts
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                {story.impacts.map((impact, index) => {
                  const IconComponent = getLucideIcon(impact.icon);
                  return (
                    <Card
                      key={index}
                      className="shadow-lg border border-transparent bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl transition-all transform hover:scale-[1.02] hover:shadow-2xl"
                    >
                      <CardHeader className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-gradient-to-br from-primary-100 to-primary-300 dark:from-primary-700 dark:to-primary-900 shadow-md">
                          <IconComponent size={36} className="text-primary-700 dark:text-primary-300" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{impact.name}</h3>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-justify tracking-tight hyphens-auto">
                          {impact.description}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}



        </CardContent>
      </Card>
    </div>
  );
};

export default SuccessStoryDetails;
