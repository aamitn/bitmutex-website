import "./globals.css";

import { Inter, Nunito } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { cn } from "@/lib/utils";
import { notFound } from "next/navigation";
import { Header, Footer } from "@/components/layout";
import { getGlobalPageData } from "@/data/loaders";
import Chat from "@/components/ui/chat";
import LiveUserCount from "@/components/custom/LiveUserCount";
import 'vanilla-cookieconsent/dist/cookieconsent.css';
import CookieConsentComponent from '@/components/cookie/CookieConsent';
import ErrorPage from '@/components/custom/strapi-down-error-page';
// import CalBookingModal from "@/components/custom/appointment";

import LoginButtonServer from "@/components/custom/LoginButtonServer";

const fontSans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fontHeading = Nunito({
  variable: "--font-heading",
  subsets: ["latin"],
});


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let data;
  
  try {
    data = await getGlobalPageData();
  } catch (error) {
    console.error("Error fetching global data, strapi is down", error);
    return (
      <html lang="en">
      <body className={cn("min-h-screen font-sans antialiased", fontSans.variable, fontHeading.variable)}>
        <ErrorPage /> 
      </body>
    </html>
    );
  }
  
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

     {/*   <div className="flex justify-center items-center h-screen">
            <CalBookingModal
              url="https://cal.com/bitmutex"
              trigger={
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                  📅 Open Booking
                </button>
              }
            />
        </div> */}

         
          <Header data={{ ...topNav, logoSrc }} /> {/* Pass logoSrc */}
          <LoginButtonServer />
          {children}
          
          <Footer data={{ ...footer, logoWideSrc }} />
          
          <CookieConsentComponent />
          
          <Chat />
          
          <LiveUserCount />

        </ThemeProvider>
      </body>
    </html>
  );
}
