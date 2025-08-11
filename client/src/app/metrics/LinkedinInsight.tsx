"use client";

import Script from "next/script";

export default function LinkedInInsight() {
  const partnerId =
    process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID || "8634577";

  return (
    <>
      {/* LinkedIn Insight Setup */}
      <Script id="linkedin-init" strategy="afterInteractive">
        {`
          _linkedin_partner_id = "${partnerId}";
          window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
          window._linkedin_data_partner_ids.push(_linkedin_partner_id);
        `}
      </Script>

      {/* LinkedIn Script Loader */}
      <Script id="linkedin-loader" strategy="afterInteractive">
        {`
          (function(l) {
            if (!l) {
              window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
              window.lintrk.q=[];
            }
            var s = document.getElementsByTagName("script")[0];
            var b = document.createElement("script");
            b.type = "text/javascript";
            b.async = true;
            b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
            s.parentNode.insertBefore(b, s);
          })(window.lintrk);
        `}
      </Script>

      {/* Noscript Fallback */}
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://px.ads.linkedin.com/collect/?pid=${partnerId}&fmt=gif`}
        />
      </noscript>
    </>
  );
}
