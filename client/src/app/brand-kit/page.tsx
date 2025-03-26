import fetchContentType from "@/lib/strapi/fetchContentType";
import BrandKitClient from "./BrandKitClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import convert from "color-convert";

  // ✅ Convert HEX to RGB, HSL, CMYK
  const convertColor = (hex: string) => {
    const hexValue = hex.replace("#", "");
    const rgb = convert.hex.rgb(hexValue);
    const hsl = convert.hex.hsl(hexValue);
    const cmyk = convert.hex.cmyk(hexValue);
  
    return {
      rgb: `rgb(${rgb.join(", ")})`,
      hsl: `hsl(${hsl.join(", ")}%)`,
      cmyk: `cmyk(${cmyk.join(", ")})`,
    };
  };

  interface Color {
    id: number;
    name: string;
    hexcode: string;
  }
  
  interface Logo {
    id: number;
    company: string;
    image: {
      url: string;
      name: string;
    };
  }
  
  interface BrandKitData {
    colors: Color[];
    brandlogo: Logo[];
  }
  

  export default async function BrandKitPage() {
    const data: { data: BrandKitData } | null = await fetchContentType("brand-kit", {
      populate: {
        colors: "*",
        brandlogo: {
          populate: "image",
        },
      },
    });
  
    if (!data || !data.data) {
      return <p className="text-center text-red-500">Error: Unable to fetch data</p>;
    }
  
    console.log("Fetched BrandKit Data:", data);
  
    // ✅ Extract colors & convert values
    const updatedColors = data.data.colors?.map((color: { id: number; name: string; hexcode: string }) => ({
      id: color.id,
      name: color.name,
      hex: color.hexcode,
      ...convertColor(color.hexcode), // ✅ Add converted color formats
    })) ?? [];
  
    // ✅ Extract logos properly
    const updatedLogos = data.data.brandlogo?.map((logo: any) => ({
      id: logo.id,
      company: logo.company,
      image: {
        url: logo.image?.url
          ? `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${logo.image.url}`
          : "",
        name: logo.image?.name ?? "Unknown Logo",
      },
    })) ?? [];
  
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-neutral-950 text-black dark:text-white transition-all">
        <div className="p-8 max-w-5xl flex-auto min-h-screen mt-16 mb-8">
  
          {/* 🎨 Brand Colors Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">🎨 Brand Colors</h2>
            <div className="flex flex-wrap justify-center gap-6">
              {updatedColors.map((color) => (
                <Card key={color.id} className="border-none shadow-lg bg-white dark:bg-gray-800/40">
                  <CardHeader className="p-0">
                    <div className="w-full h-24 rounded-t-md" style={{ backgroundColor: color.hex }}></div>
                  </CardHeader>
                  <CardContent className="p-4 text-center">
                    <CardTitle className="text-lg font-semibold">{color.name}</CardTitle>
                    <p className="text-sm">HEX: <span className="font-medium">{color.hex}</span></p>
                    <p className="text-sm">RGB: <span className="font-medium">{color.rgb}</span></p>
                    <p className="text-sm">HSL: <span className="font-medium">{color.hsl}</span></p>
                    <p className="text-sm">CMYK: <span className="font-medium">{color.cmyk}</span></p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
  
          {/* 🚀 Brand Logos Section */}
          <h2 className="text-2xl font-semibold mb-6">🚀 Brand Logos</h2>
  
          {/* ✅ Pass Colors & Logos to Client Component */}
          <BrandKitClient logos={updatedLogos} />
        </div>
      </div>
    );
  }
