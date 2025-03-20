import { fetchIndustries } from "@/data/loaders";
import * as LucideIcons from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { FC } from "react";

type Industry = {
  uuid: string;
  name: string;
  description: string;
  details: string;
  icon: string;
  slug: string;
  challenges: string[];
  opportunities: string[];
  solutions: string[];
};


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



export default async function IndustryPage() {
  const industries: Industry[] = await fetchIndustries();

  return (
    <div className="container mx-auto py-12 mt-8 mb-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-300 text-center mb-10">
        Industries We Serve
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-4">
        {industries.map((industry) => {
          const IconComponent = getLucideIcon(industry.icon);
          return (
            <Link key={industry.uuid} href={`/industries/${industry.slug}`} passHref>
              <Card className="group h-full flex flex-col p-6 bg-slate-50 dark:bg-slate-800 shadow-lg rounded-xl border border-gray-200 dark:border-slate-700 hover:shadow-2xl hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer relative overflow-hidden">
                {/* Card Header */}
                <CardHeader className="flex items-center space-x-4">
                  <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full">
                    <IconComponent className="w-8 h-8 text-gray-700 dark:text-gray-300" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-300">
                    {industry.name}
                  </h2>
                </CardHeader>

              {/* Card Content */}
              <CardContent className="flex-grow overflow-hidden">
                <p className="mb-4 text-gray-600 dark:text-gray-400 line-clamp-3">
                  {industry.description}
                </p>
              </CardContent>


                {/* Learn More Button - Initially Hidden, Shows on Hover */}
                <div className="absolute inset-x-0 bottom-4 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="bg-slate-800 dark:bg-orange-500 text-white px-4 py-2 rounded-3xl text-center">
                    Learn More →
                  </button>
                </div>
              </Card>
            </Link>

          );
        })}
      </div>
    </div>
  );
}
