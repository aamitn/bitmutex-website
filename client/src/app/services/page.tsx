import Link from "next/link";
import { fetchServices } from "@/data/loaders";
import * as LucideIcons from "lucide-react";
import { ElementType } from "react";
import TechStackSlider from "@/components/custom/TechStackSlider";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import React from "react";


type ServiceItem = {
  name: string;
  description: string;
  icon: string;
};

type Service = {
  uuid: string;
  name: string;
  description: string;
  slug: string;
  techstacklogos: { url: string }[];
  service_items: ServiceItem[];
  icon: string;
};

// ✅ Convert kebab-case to PascalCase for Lucide icons
const toPascalCase = (str: string): string =>
  str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");

// ✅ Get the correct Lucide icon
const getLucideIcon = (iconName: string): ElementType => {
  const pascalCaseName = toPascalCase(iconName);
  return (LucideIcons as Record<string, unknown>)[pascalCaseName] as ElementType || LucideIcons.AlertCircle;
};

export default async function ServicesPage() {
  const services: Service[] = await fetchServices();

  return (
    <div className="container mx-auto py-12 mt-8 mb-8">

      <h1 className="text-4xl font-bold text-gray-900  dark:text-gray-300 text-center mb-10">
        Our Services
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <Link key={service.uuid} href={`/services/${service.slug}`} passHref>
            <Card className="group relative p-6 bg-slate-50 dark:bg-slate-800 shadow-lg rounded-xl border border-gray-200 dark:border-slate-700 hover:shadow-xl transition-all h-full flex flex-col">              {/* Icon and Title */}
              <CardHeader className="flex items-center space-x-4">
                <div className="p-3 bg-gray-100 rounded-full">
                  {service.icon && (
                    React.createElement(getLucideIcon(service.icon), {
                      className: "w-8 h-8 text-gray-700",
                    })
                  )}
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-300">
                  {service.name}
                </h2>
              </CardHeader>

              {/* Description */}
              <CardContent className="flex-grow h-full flex flex-col overflow-hidden">
                <p className="text-gray-600 dark:text-amber-500 line-clamp-3">
                  {service.description}
                </p>

                {/* Tech Stack Logos */}
                {service.techstacklogos.length > 0 && (
                  <div className="mt-4">
                    <TechStackSlider logos={service.techstacklogos} width={60} height={80} />
                  </div>
                )}

                {/* View More */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm text-blue-600 dark:text-blue-200 font-medium">
                    View Details →
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
