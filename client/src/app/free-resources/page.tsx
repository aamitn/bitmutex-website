import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import FreeResourceClient from "@/components/custom/FreeResourceClient";

export default async function FreeResources() {
  try {
    const apiUrl = process.env.STRAPI_BASE_URL || "http://localhost:1337";
    const response = await fetch(`${apiUrl}/api/free-resources?populate=*`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // Ensures fresh data on every request
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    // ✅ Adjust mapping to match API response structure
    const resources =
      data?.data?.map((item: any) => ({
        id: item.id,
        url: item.url, // Ensure correct field is used
      })) || [];

    console.log("Mapped Resources:", JSON.stringify(resources, null, 2));

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