"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useTheme } from "next-themes";
import Image from "next/image";
import { Download, Package, Check } from "lucide-react";

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
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [downloadingAll, setDownloadingAll] = useState(false);

  const handleDownload = async (url: string, name: string, id: number) => {
    setDownloadingId(id);
    const response = await fetch(url);
    const blob = await response.blob();
    saveAs(blob, name);
    setTimeout(() => setDownloadingId(null), 1500);
  };

  const handleDownloadAll = async () => {
    if (!logos.length) return;
    setDownloadingAll(true);
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
      setDownloadingAll(false);
    });
  };

  const { theme } = useTheme();

  return (
    <div className="space-y-8">
      {/* Download All */}
      <div className="flex justify-center">
        <button
          onClick={handleDownloadAll}
          disabled={downloadingAll}
          className="group relative inline-flex items-center gap-3 px-8 py-3 rounded-full
            border border-white/10 bg-white/5 backdrop-blur-sm
            text-sm font-medium tracking-widest uppercase
            text-gray-300 hover:text-white
            transition-all duration-500
            hover:border-amber-400/40 hover:bg-amber-400/5
            hover:shadow-[0_0_40px_rgba(251,191,36,0.12)]
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Package className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform duration-300" />
          {downloadingAll ? "Preparing archive…" : "Download all logos"}
        </button>
      </div>

      {/* Logo Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
        {logos.map((logo, i) => (
          <div
            key={logo.id}
            className="group relative flex flex-col items-center justify-center gap-4 p-6 rounded-2xl
              border border-white/8 bg-white/[0.03] backdrop-blur-sm
              hover:border-white/20 hover:bg-white/[0.07]
              transition-all duration-400 cursor-pointer
              hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            {/* Logo image */}
            <div className="relative w-20 h-20 flex items-center justify-center">
              <Image
                src={logo.image.url}
                alt={logo.company}
                width={80}
                height={80}
                className={`object-contain transition-all duration-300 group-hover:scale-105
                  ${theme === "light" ? "invert-[0.09] brightness-110 contrast-125" : ""}`}
              />
            </div>

            {/* Company name */}
            <p className="text-xs font-medium tracking-wider uppercase text-gray-500 group-hover:text-gray-300 transition-colors duration-300 text-center">
              {logo.company}
            </p>

            {/* Download button — slides up on hover */}
            <button
              onClick={() => handleDownload(logo.image.url, logo.image.name, logo.id)}
              className="absolute inset-x-4 bottom-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0
                transition-all duration-300
                flex items-center justify-center gap-1.5
                py-1.5 rounded-lg text-xs font-medium tracking-wide
                bg-amber-400/10 border border-amber-400/30 text-amber-300
                hover:bg-amber-400/20"
            >
              {downloadingId === logo.id ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              {downloadingId === logo.id ? "Saved" : "Download"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}