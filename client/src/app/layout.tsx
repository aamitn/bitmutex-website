import "./globals.css";

import { Inter, Nunito } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { cn } from "@/lib/utils";
import { notFound } from "next/navigation";
import { Header, Footer } from "@/components/layout";
import { getGlobalPageData } from "@/data/loaders";
import Chat from "@/components/ui/chat";
import { metadata } from "@/app/metadata"; // Import metadata

const fontSans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fontHeading = Nunito({
  variable: "--font-heading",
  subsets: ["latin"],
});

export { metadata }; // Export metadata for Next.js to use

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const data = await getGlobalPageData();
  if (!data) notFound();

  const { topNav, footer, logo, logowide } = data.data;

  console.log("logowide:", data.data);

  // Ensure full image URL for Next.js Image component
  const logoSrc = logo?.url
  ? `${process.env.STRAPI_BASE_URL || "http://localhost:1337"}${logo.url}`
  : "";

  const logoWideSrc = logowide?.url
  ? `${process.env.STRAPI_BASE_URL || "http://localhost:1337"}${logowide.url}`
  : "";

  

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen font-sans antialiased",
          fontSans.variable,
          fontHeading.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header data={{ ...topNav, logoSrc }} /> {/* Pass logoSrc */}
          {children}
          <Footer data={{ ...footer, logoWideSrc }} />
          <Chat />
        </ThemeProvider>
      </body>
    </html>
  );
}
