"use client";

import { useEffect, useState } from "react";
import convert from "color-convert";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_BASE_URL || "https://localhost:3000";

interface Color {
  id: number;
  name: string;
  hexcode: string;
  rgb?: string;
  hsl?: string;
  cmyk?: string;
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

// Convert HEX to RGB, HSL, CMYK using `color-convert`
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

export default function BrandKitPage() {
  const { theme } = useTheme();
  const [data, setData] = useState<BrandKitData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `${STRAPI_BASE_URL}/api/brand-kit?populate[colors]=*&populate[brandlogo][populate]=image`
        );
        if (!response.ok) throw new Error("Failed to fetch data");

        const json = await response.json();

        const updatedColors = json.data.colors.map((color: Color) => ({
          ...color,
          ...convertColor(color.hexcode),
        }));

        const updatedLogos = json.data.brandlogo.map((logo: any) => ({
          id: logo.id,
          company: logo.company,
          image: {
            url: `${STRAPI_BASE_URL}${logo.image.url}`,
            name: logo.image.name,
          },
        }));

        setData({ colors: updatedColors, brandlogo: updatedLogos });
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleDownload = async (url: string, name: string) => {
    const response = await fetch(url);
    const blob = await response.blob();
    saveAs(blob, name);
  };

  const handleDownloadAll = async () => {
    if (!data?.brandlogo.length) return;

    const zip = new JSZip();
    const logoFolder = zip.folder("BrandLogos");

    const downloadPromises = data.brandlogo.map(async (logo) => {
      const response = await fetch(logo.image.url);
      const blob = await response.blob();
      logoFolder?.file(logo.image.name, blob);
    });

    await Promise.all(downloadPromises);

    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "BrandKit_Logos.zip");
    });
  };

  if (loading) return <p className="text-center text-lg text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className={`flex justify-center items-center min-h-screen transition-all ${theme === "dark" ? "bg-neutral-950 text-white" : "bg-gray-100 text-black"}`}>
      <div className="p-8 max-w-5xl flex-auto min-h-screen mt-16 mb-8">

        {/* Colors Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">✨ Brand Colors</h2>
          <div className="flex flex-wrap justify-center gap-6">
            {data?.colors.map((color) => (
              <Card key={color.id} className={`border-none shadow-lg ${theme === "dark" ? "bg-gray-800/40" : "bg-white"}`}>
                <CardHeader className="p-0">
                  <div
                    className="w-full h-24 rounded-t-md"
                    style={{ backgroundColor: color.hexcode }}
                  ></div>
                </CardHeader>
                <CardContent className="p-4 text-center">
                  <CardTitle className="text-lg font-semibold">{color.name}</CardTitle>
                  <p className="text-sm">HEX: <span className="font-medium">{color.hexcode}</span></p>
                  <p className="text-sm">RGB: <span className="font-medium">{color.rgb}</span></p>
                  <p className="text-sm">HSL: <span className="font-medium">{color.hsl}</span></p>
                  <p className="text-sm">CMYK: <span className="font-medium">{color.cmyk}</span></p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Logos Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">🚀 Brand Logos</h2>

          {/* Download All Button */}
          <div className="flex justify-center mb-6">
          <Button
            onClick={handleDownloadAll}
            variant="outline"
            className="px-6 py-2 rounded-lg font-semibold tracking-wide 
            text-neutral-200 bg-neutral-800 hover:bg-neutral-400 hover:text-slate-800 dark:hover:text-slate-800
            dark:bg-orange-500 dark:hover:bg-orange-300 dark:text-white 
            shadow-lg transition-all duration-300 ease-in-out"
            >
              📦 Download All Logos
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {data?.brandlogo.map((logo) => (
              <Card
                key={logo.id}
                className={`relative border-none shadow-lg transition-transform hover:scale-105 ${theme === "dark" ? "bg-gray-800/40" : "bg-white"}`}
              >
                <CardContent className="p-4 flex flex-col items-center group">
                  <img
                    src={logo.image.url}
                    alt={logo.company}
                    className="h-24 object-contain rounded-lg"
                  />
                  <Badge>{logo.company}</Badge>

                  {/* Download Button on Hover */}
                  <Button
                    onClick={() => handleDownload(logo.image.url, logo.image.name)}
                    className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    size="sm"
                  >
                    ⬇️ Download
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
