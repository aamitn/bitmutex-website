import React, { useState, useEffect } from 'react';
import { SeparatorVertical} from 'lucide-react';
import Link from "next/link";
import { GitHubVersion } from "@/components/custom/GitHubVersion";

// Define the props for the FooterBottom component.
// This allows you to pass in the copyright text.
interface FooterBottomProps {
  text: string;
}

/**
 * A minimal and professional-looking footer component for copyright information.
 *
 * @param {FooterBottomProps} props - The props for the component.
 * @param {string} props.text - The custom text to be displayed in the copyright notice.
 * @returns {JSX.Element} The rendered FooterBottom component.
 */
const FooterBottom: React.FC<FooterBottomProps> = ({ text }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  // Get the current year dynamically to keep the copyright up to date.
  const currentYear = new Date().getFullYear();

  // Update time every second
  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time in a clean, readable format
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Prevent hydration mismatch by not showing time until mounted
  if (!mounted) {
    return (
      <footer className="relative border-t border-gray-200/70 dark:border-gray-800/70 bg-gradient-to-r from-gray-50/80 via-white/60 to-gray-50/80 dark:from-gray-900/80 dark:via-gray-800/60 dark:to-gray-900/80 mt-10 pt-5 pb-5 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/[0.02] via-purple-500/[0.02] to-pink-500/[0.02]"></div>
        <div className="container mx-auto px-4 relative">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <span className="text-gray-800 dark:text-gray-200 font-medium">&copy;</span>
                <span>2018 - {currentYear}</span>
              </span>
              <div className="w-1 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
              <span className="font-semibold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
                {text}
              </span>
              <div className="w-1 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
              <span className="text-gray-500 dark:text-gray-500">All rights reserved</span>
            </div>
            
            {/* Loading placeholder for date and time */}
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-white/70 to-gray-50/70 dark:from-gray-800/70 dark:to-gray-700/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-gray-200/50 dark:border-gray-600/50 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="flex flex-col items-end gap-0.5">
                    <div className="w-16 h-3 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                    <div className="w-12 h-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                  <div className="w-1.5 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="relative border-t border-zinc-300 dark:border-zinc-700 bg-gradient-to-r from-gray-50/80 via-white/60 to-gray-50/80 dark:from-gray-900/80 dark:via-gray-800/60 dark:to-gray-900/80 mt-5 pt-2 pb-2 backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/[0.02] via-purple-500/[0.02] to-pink-500/[0.02]"></div>
      <div className="container mx-auto px-4 relative">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <span className="text-gray-800 dark:text-gray-200 font-medium">&copy;</span>
              <span>2018 - {currentYear}</span>
            </span>
            <SeparatorVertical size={12} />
            <span className="font-semibold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
              {text}
            </span>
            <SeparatorVertical size={12} />
            <span className="text-gray-500 dark:text-gray-500">All rights reserved</span>
            |
            <Link href="/privacy-policy" className="flex items-center gap-3">
              <span className="text-gray-500 dark:text-gray-500">Privacy Policy</span>
            </Link>
            <SeparatorVertical size={12} />
            <Link href="/terms-and-conditions" className="flex items-center gap-3">
              <span className="text-gray-500 dark:text-gray-500">Terms &amp; Conditions</span>
            </Link>
          </div>

          {/* GitHub version */}
          <span className="text-zinc-600 dark:text-zinc-400 ">
            <span className="hidden md:inline px-2">App Version: </span>
              <GitHubVersion owner="aamitn" repo="winhider" compact={true}/>
          </span> 



          {/* date and time display */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gradient-to-r from-white/70 to-gray-50/70 dark:from-gray-800/70 dark:to-gray-700/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-gray-200/50 dark:border-gray-600/50 shadow-sm hover:shadow-md transition-all duration-300">
              
              <div className="flex flex-col items-end">
                <span className="font-mono font-bold text-xs text-gray-700 dark:text-gray-300 tabular-nums leading-tight">
                  {formatTime(currentTime)}
                </span>
                <span className="font-medium text-[10px] text-gray-500 dark:text-gray-400 leading-tight">
                  {formatDate(currentTime)}
                </span>
              </div>
              <div className="relative">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                <div className="absolute inset-0 w-1.5 h-1.5 bg-green-400 rounded-full animate-ping opacity-75"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterBottom;