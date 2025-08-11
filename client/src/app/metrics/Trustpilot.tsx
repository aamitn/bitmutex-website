"use client";

import Script from "next/script";

interface TrustpilotProps {
  showWidget?: boolean; // Show the TrustBox review widget
  showIntent?: boolean; // Show the review intent script
}

export default function Trustpilot({
  showWidget = true,
  showIntent = false,
}: TrustpilotProps) {
  const locale = process.env.NEXT_PUBLIC_TRUSTPILOT_LOCALE || "en-US";
  const templateId =
    process.env.NEXT_PUBLIC_TRUSTPILOT_TEMPLATE_ID ||
    "56278e9abfbbba0bdcd568bc";
  const businessUnitId =
    process.env.NEXT_PUBLIC_TRUSTPILOT_BUSINESSUNIT_ID ||
    "689a2c9be91f287c6dddfd31";
  const token =
    process.env.NEXT_PUBLIC_TRUSTPILOT_TOKEN ||
    "68840d71-b3f5-4f10-b3e8-82bb6eedff07";
  const reviewLink =
    process.env.NEXT_PUBLIC_TRUSTPILOT_REVIEW_LINK ||
    "https://www.trustpilot.com/review/bitmutex.com";
  const intentKey =
    process.env.NEXT_PUBLIC_TRUSTPILOT_INTENT_KEY || "YqW4fUPXceqlZGwZ";

  return (
    <>
      {/* Load TrustBox Script if widget is shown */}
      {showWidget && (
        <>
          <Script
            src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
            strategy="afterInteractive"
          />
          <div
            className="trustpilot-widget"
            data-locale={locale}
            data-template-id={templateId}
            data-businessunit-id={businessUnitId}
            data-style-height="52px"
            data-style-width="100%"
            data-token={token}
          >
            <a href={reviewLink} target="_blank" rel="noopener">
              Trustpilot
            </a>
          </div>
        </>
      )}

      {/* Load Review Intent Script if enabled */}
      {showIntent && (
        <Script id="trustpilot-intent" strategy="afterInteractive">
          {`
            (function(w,d,s,r,n){
              w.TrustpilotObject=n;
              w[n]=w[n]||function(){(w[n].q=w[n].q||[]).push(arguments)};
              var a=d.createElement(s);
              a.async=1;
              a.src=r;
              a.type='text/java'+s;
              var f=d.getElementsByTagName(s)[0];
              f.parentNode.insertBefore(a,f)
            })(window,document,'script', 'https://invitejs.trustpilot.com/tp.min.js', 'tp');
            tp('register', '${intentKey}');
          `}
        </Script>
      )}
    </>
  );
}
