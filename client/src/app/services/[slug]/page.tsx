import { notFound } from "next/navigation";
import { fetchServices } from "@/data/loaders";
import TechStackSlider from "@/components/custom/TechStackSlider";
import * as LucideIcons from "lucide-react";
import { ElementType } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FC } from "react";
const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_BASE_URL || "http://localhost:1337";

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
  icon: string;
  techstacklogos: { url: string }[];
  service_items: ServiceItem[];
};

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

// Update to async function and properly handle Promise
export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  // Await the promise resolution to get the slug
  const { slug } = await params;

  const services: Service[] = await fetchServices();
  const service = services.find((s: Service) => s.slug === slug);

  if (!service) {
    return notFound();
  }
  const IconComponent1 = getLucideIcon(service.icon);
  return (
    <div className="container mx-auto py-12 space-y-8">
      <Card>
        <CardHeader>
          {/* Wrapper for Icon and Title */}
          <div className="flex items-center space-x-4">
            <IconComponent1 size={32} className="text-primary" />
            <h1 className="text-4xl font-bold">{service.name}</h1>
          </div>

          {/* Service Description */}
          <p className="text-muted-foreground mt-2">{service.description}</p>
        </CardHeader>

        {/* Button Section */}
        <div className="flex justify-center mt-8 mb-8">
          <Link href="/services">
            <Button variant="outline">Go Back to Services</Button>
          </Link>
        </div>
      </Card>

      <Separator />

      <div className="text-center">
        <h2 className="text-3xl font-semibold uppercase tracking-wide">Tech Stacks We Use</h2>
      </div>

      {service.techstacklogos.length > 0 &&  <TechStackSlider logos={service.techstacklogos} width={120} height={100} />}

      {service.service_items.length > 0 && (
        <div className="mt-8 space-y-6">
          <h2 className="text-2xl font-semibold">Granular Offerings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {service.service_items.map((item, i) => {
              const IconComponent = getLucideIcon(item.icon);
              return (
                <Card key={i} className="flex flex-col p-6 space-y-4">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <IconComponent size={32} className="text-primary" />
                    <h3 className="text-lg font-medium">{item.name}</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
