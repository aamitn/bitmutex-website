"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function StatusBadge() {
    const { theme } = useTheme();
    const [iframeSrc, setIframeSrc] = useState("");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        setIframeSrc(`${process.env.NEXT_PUBLIC_STATUS_PAGE_URL}/badge?theme=light`);
    }, []);

    useEffect(() => {
        if (!mounted || !theme) return; // Ensure hydration before updating iframe src
        setIframeSrc(`${process.env.NEXT_PUBLIC_STATUS_PAGE_URL}/badge?theme=${theme === "dark" ? "dark" : "light"}`);
    }, [theme, mounted]);

    return (
<div
  className={`transition-opacity duration-500 ease-in-out opacity-0 animate-fade-in 
              bg-opacity-10 rounded-lg p-1 flex md:inline-flex items-center justify-center 
              text-center w-full md:w-auto`}
    style={{
    background: mounted
        ? theme === "dark"
            ? "rgba(255,255,255,0.1)"
            : "rgba(0,0,0,0.05)"
        : "transparent", // Prevent hydration mismatch
    borderRadius: "6px",
    padding: "4px",
    opacity: mounted ? 1 : 0,
    transition: "opacity 0.5s ease-in-out",
    }}
>
<div className="flex flex-col sm:flex-row items-center ml-20 md:ml-0">
  {mounted && iframeSrc && (
                <iframe
                    src={iframeSrc}
                    width="250"
                    height="30"
                    frameBorder="0"
                    scrolling="no"
                    style={{ colorScheme: "normal" }}
                ></iframe>
            )}
  </div>
</div>



    );
}
