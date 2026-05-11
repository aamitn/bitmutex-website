import fetchContentType from "@/lib/strapi/fetchContentType";
import BrandKitClient from "./BrandKitClient";
import convert from "color-convert";
import { generateMetadataObject } from "@/lib/metadata";
import { Metadata } from "next";
import { strapiImage } from "@/lib/strapi/strapiImage";
import ColorCard from "@/components/custom/ColorCard";

// Convert HEX to RGB, HSL, CMYK
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
  image: { url: string; name: string };
}

interface BrandKitData {
  colors: Color[];
  brandlogo: Logo[];
}

let heading = "",
  sub_heading = "",
  description = "";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const BASE_URL_NEXT =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const pageData = await fetchContentType(
    "brand-kit",
    { populate: ["seo", "seo.metaImage"] },
    true
  );

  if (!pageData) {
    return {
      title: "Page Not Found | Bitmutex Technologies",
      description: "The requested page does not exist.",
      robots: "noindex, nofollow",
    };
  }

  const seo = pageData?.seo;
  const metadata = generateMetadataObject(seo);

  heading = pageData.heading;
  sub_heading = pageData.sub_heading;
  description = pageData.description;

  const seotitle = seo?.metaTitle
    ? `${seo.metaTitle} | Bitmutex`
    : `${pageData.heading || "Untitled"} | Bitmutex`;

  let seodescription = seo?.metaDescription || pageData.description || "";
  if (seodescription.length > 150) {
    seodescription =
      seodescription.substring(0, seodescription.lastIndexOf(" ", 150)) +
      "...";
  }

  metadata.title = seotitle;
  metadata.description = seodescription;
  metadata.openGraph = {
    ...(metadata.openGraph as any),
    title: seotitle,
    description: seodescription,
    images: seo?.metaImage
      ? [{ url: strapiImage(seo.metaImage.url) }]
      : { url: `${BASE_URL_NEXT}/bmbkit.png` },
    url: `${BASE_URL_NEXT}/brand-kit`,
    site_name: "Bitmutex",
    locale: "en_US",
    type: "website",
  };
  metadata.alternates = { canonical: `${BASE_URL_NEXT}/brand-kit` };

  return metadata;
}

export default async function BrandKitPage() {
  const data: { data: BrandKitData } | null = await fetchContentType(
    "brand-kit",
    {
      populate: {
        colors: "*",
        brandlogo: { populate: "image" },
      },
    }
  );

  if (!data || !data.data) {
    return (
      <p className="text-center text-red-500 font-medium mt-12">
        Error: Unable to fetch data
      </p>
    );
  }

  const updatedColors =
    data.data.colors?.map((color) => ({
      id: color.id,
      name: color.name,
      hex: color.hexcode,
      ...convertColor(color.hexcode),
    })) ?? [];

  const updatedLogos =
    data.data.brandlogo?.map((logo) => ({
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
    <main className="relative min-h-screen bg-[#0a0a0f] text-gray-100 overflow-hidden">

      {/* Ambient background orbs */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute top-1/3 -right-60 w-[500px] h-[500px] rounded-full bg-amber-500/8 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full bg-indigo-600/8 blur-[100px]" />
        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-32">

        {/* ── Page Header ── */}
        <header className="mb-24 text-center">
          {/* Eyebrow label */}
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs tracking-[0.25em] uppercase text-amber-400/80">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Brand Identity System
          </div>

          <h1 className="font-heading text-5xl md:text-7xl font-black tracking-tight leading-none mb-6">
            <span className="text-white">{heading || "Brand"}</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500">
              Kit
            </span>
          </h1>

          {sub_heading && (
            <p className="text-lg md:text-xl text-gray-400 font-light max-w-xl mx-auto leading-relaxed mb-3">
              {sub_heading}
            </p>
          )}
          {description && (
            <p className="text-sm text-gray-600 max-w-lg mx-auto leading-relaxed">
              {description}
            </p>
          )}
        </header>

        {/* ── Brand Colors ── */}
        <section className="mb-28">
          {/* Section label */}
          <div className="flex items-center gap-4 mb-12">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <h2 className="text-xs tracking-[0.3em] uppercase text-gray-500 font-medium px-4">
              Color Palette
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {updatedColors.map((color, i) => (
              <ColorCard key={color.id} color={color} index={i} />
            ))}
          </div>
        </section>

        {/* ── Brand Logos ── */}
        <section>
          <div className="flex items-center gap-4 mb-12">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <h2 className="text-xs tracking-[0.3em] uppercase text-gray-500 font-medium px-4">
              Logo Assets
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          <BrandKitClient logos={updatedLogos} />
        </section>

      </div>
    </main>
  );
}