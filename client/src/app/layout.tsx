import "./globals.css";

import { JetBrains_Mono, Fraunces, Exo_2, Caveat  } from "next/font/google";
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
import LoginButtonServer from "@/components/custom/LoginButtonServer";
import Metrics from './metrics'

// Font Configuration using next/font with CSS variables for Tailwind integration
/*
Prefered fonts:
- Sorts Mill Goudy
- IM Fell English  -> GREAT
- Fraunces
- Manrope  -> GREAT
- Caveat
- Google Sans Flex
- Sora
- Exo 2
- Expletus Sans 
*/
const fontSans = Exo_2 ({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fontHeading = Fraunces({
  variable: "--font-heading",
  subsets: ["latin"],
});

const fontMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const fontSpecial = Caveat({
  variable: "--font-special",
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
      <body className={cn("min-h-screen font-sans antialiased", fontSans.variable, fontHeading.variable, fontMono.variable, fontSpecial.variable)}>
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
  ? `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL || "http://localhost:1337"}${logo.url}`
  : "";

  const logoWideSrc = logowide?.url
  ? `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL || "http://localhost:1337"}${logowide.url}`
  : "";



  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={cn(
          "min-h-screen",
          fontSans.variable,
          fontHeading.variable,
          fontMono.variable,
          fontSpecial.variable,
          "antialiased"
        )}
       >

        <Metrics /> {/* Analytics */}
        
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
         
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
