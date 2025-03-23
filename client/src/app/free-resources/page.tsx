import { Metadata } from "next";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import FreeResourceClient from "@/components/custom/FreeResourceClient";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const apiUrl = process.env.STRAPI_BASE_URL || "http://localhost:1337";
    const baseurl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"; // ✅ Get image base URL from env
    const response = await fetch(`${apiUrl}/api/free-resources?populate=*`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store", // Ensure fresh metadata on every request
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const resources = data?.data?.map((item: any) => item.url) || [];

    const firstResource = resources.length > 0 ? resources[0] : null;
    const description = firstResource
      ? `Explore free resources like ${firstResource} and more to boost your knowledge.`
      : "Access a collection of free resources to enhance your skills and knowledge.";

    return {
      title: "Free Resources | Bitmutex",
      description,
      openGraph: {
        title: "Free Resources | Bitmutex",
        description,
        url: `${baseurl}/free-resources`,
        type: "website",
        images: [{ url: `${baseurl}/bmfree.png` }], // ✅ Image from env variable
      },
      twitter: {
        card: "summary_large_image",
        title: "Free Resources | Bitmutex",
        description,
        images: [{ url: `${baseurl}/bmfree.png` }], // ✅ Image from env variable
      },
    };
  } catch (error) {
    console.error("Error fetching metadata for Free Resources:", error);

    return {
      title: "Free Resources | Bitmutex",
      description: "Access a collection of free resources to enhance your skills and knowledge.",
      openGraph: {
        title: "Free Resources | Bitmutex",
        description: "Access a collection of free resources to enhance your skills and knowledge.",
        url: "https://bitmutex.com/free-resources",
        type: "website",
        images: [{ url: `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "https://bitmutex.com/static"}/free-resources-og.jpg` }], // ✅ Fallback image from env
      },
      twitter: {
        card: "summary_large_image",
        title: "Free Resources | Bitmutex",
        description: "Access a collection of free resources to enhance your skills and knowledge.",
        images: [{ url: `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "https://bitmutex.com/static"}/free-resources-og.jpg` }], // ✅ Fallback image from env
      },
    };
  }
}

export default async function FreeResources() {
  try {
    const apiUrl = process.env.STRAPI_BASE_URL || "http://localhost:1337";
    const response = await fetch(`${apiUrl}/api/free-resources?populate=*`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const resources = data?.data?.map((item: any) => ({
      id: item.id,
      url: item.url,
    })) || [];

    return (
      <section className="max-w-7xl mx-auto mt-28 mb-28 px-6">
        <h1 className="text-3xl font-semibold text-center mb-8">Free Resources</h1>
        <FreeResourceClient resources={resources} />
      </section>
    );
  } catch (error) {
    console.error("Error fetching free resources:", error);

    return (
      <div className="max-w-5xl mx-auto mt-16 px-6">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Unable to load Free Resources. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
}
