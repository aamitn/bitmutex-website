"use client";

import { Button } from "@/components/ui/button";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useTheme } from "next-themes";
import Image from "next/image";


interface Logo {
  id: number;
  company: string;
  image: {
    url: string;
    name: string;
  };
}

interface BrandKitClientProps {
  logos: Logo[];
}

export default function BrandKitClient({ logos }: BrandKitClientProps) {
  const handleDownload = async (url: string, name: string) => {
    const response = await fetch(url);
    const blob = await response.blob();
    saveAs(blob, name);
  };

  const handleDownloadAll = async () => {
    if (!logos.length) return;

    const zip = new JSZip();
    const logoFolder = zip.folder("BrandLogos");

    const downloadPromises = logos.map(async (logo) => {
      const response = await fetch(logo.image.url);
      const blob = await response.blob();
      logoFolder?.file(logo.image.name, blob);
    });

    await Promise.all(downloadPromises);

    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "BrandKit_Logos.zip");
    });
  };
  const { theme } = useTheme();
  return (
    <div>
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

      <div className="flex flex-wrap justify-center gap-6 ">
        {logos.map((logo) => (
          <div key={logo.id} className="relative border-none shadow-lg rounded-xl bg-white dark:bg-gray-800/40 hover:scale-105 transition-transform p-4 flex flex-col items-center group">
            <Image
              src={logo.image.url}
              alt={logo.company}
              width={96} // Set an appropriate width
              height={96} // Set an appropriate height
              className={`h-24 object-contain rounded-lg transition-all ${
                theme === "light" ? "invert-[0.09] brightness-110 contrast-125" : ""
              }`}
            />
            {/* Download Button on Hover */}
            <Button
              onClick={() => handleDownload(logo.image.url, logo.image.name)}
              className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              size="sm"
            >
              ⬇️ Download
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
