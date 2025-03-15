import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bitmutex Technologies - Software Development & Consultancy",
  description:
    "Bitmutex Technologies specializes in software development, consulting, and digital transformation services.",
  applicationName: "Bitmutex Technologies",
  authors: [{ name: "Bitmutex Technologies", url: "https://bitmutex.com" }],
  creator: "Bitmutex Technologies",
  publisher: "Bitmutex Technologies",
  keywords: [
    "Software Development",
    "Consulting",
    "Web Development",
    "Mobile Apps",
    "Bitmutex",
    "Digital Transformation",
  ],
  metadataBase: new URL("https://bitmutex.com"),
  openGraph: {
    title: "Bitmutex Technologies",
    description:
      "Software Development and Consulting Services for enterprises and startups.",
    url: "https://bitmutex.com",
    siteName: "Bitmutex Technologies",
    images: [
      {
        url: "https://bitmutex.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Bitmutex Technologies",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bitmutex Technologies",
    description:
      "Expert software development and consulting services for businesses.",
    images: ["https://bitmutex.com/twitter-card.jpg"],
    creator: "@bitmutex",
  },
  icons: {
    icon: "/favicon.ico", // Standard favicon
    shortcut: "/favicon.ico", // Shortcut icon
    apple: "/apple-touch-icon.png", // Apple devices
    other: [
      {
        rel: "icon",
        type: "image/png",
        url: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        url: "/favicon-16x16.png",
      },
    ],
  },
  robots: "index, follow",
  viewport: "width=device-width, initial-scale=1.0",
};
