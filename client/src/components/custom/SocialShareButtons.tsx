import {
  FaSquareXTwitter,
  FaSquareFacebook,
  FaLinkedin,
  FaSquareWhatsapp,
  FaSquareReddit,
} from "react-icons/fa6";
import CopyToClipboardButton from "@/components/custom/CopyToClipboardButton";
import React, { ReactNode } from "react";

/**
 * Defines the props for the Tooltip component.
 *
 * @property {string} message - The text to display inside the tooltip.
 * @property {ReactNode} children - The content that will trigger the tooltip.
 */
interface TooltipProps {
  message: string;
  children: ReactNode;
}

/**
 * A reusable Tooltip component that displays a message on hover.
 *
 * It uses Tailwind CSS's 'group' and 'group-hover' utilities to show/hide the tooltip.
 * The tooltip is positioned absolutely relative to its parent 'group' element.
 *
 * @param {TooltipProps} props - The properties for the component.
 * @returns {React.FC} A React functional component.
 */
const Tooltip: React.FC<TooltipProps> = ({ message, children }) => {
  return (
    <div className="relative group flex justify-center">
      {children}
      {/* The tooltip content. It's hidden by default and becomes visible on hover. */}
      <span
        className="absolute top-10 scale-0 transition-all duration-200 ease-in-out
                   rounded-lg bg-gray-800 dark:bg-gray-700 p-2 text-xs text-white
                   group-hover:scale-100 opacity-0 group-hover:opacity-100
                   whitespace-nowrap z-10 shadow-lg"
      >
        {message}
      </span>
    </div>
  );
};

/**
 * Defines the props for the SocialShareButtons component.
 *
 * @property {string} slug - The unique slug for the blog post, used to construct the share URL.
 * @property {string} title - The title of the blog post, used in the social media share text.
 */
interface SocialShareButtonsProps {
  slug: string;
  title: string;
}

/**
 * A responsive and reusable component that displays social media sharing buttons.
 *
 * The component generates a series of share buttons for Twitter, Facebook, LinkedIn,
 * Reddit, and WhatsApp. It also includes a "copy to clipboard" button. The share
 * URLs are dynamically generated based on the provided `slug` and `title`.
 *
 * @param {SocialShareButtonsProps} props - The properties for the component.
 * @returns {React.FC} A React functional component.
 */
const SocialShareButtons: React.FC<SocialShareButtonsProps> = ({ slug, title }) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:1337";
  const shareUrl = encodeURIComponent(`${baseUrl}/blog/${slug}`);
  const shareText = encodeURIComponent(`Check out our latest blog post:\n\n"${title}"\n\nRead more below:`);

  const shareLinks = [
    {
      name: "X (formerly Twitter)",
      url: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`,
      icon: FaSquareXTwitter,
      className: "hover:text-blue-500 dark:hover:text-blue-500",
    },
    {
      name: "Facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      icon: FaSquareFacebook,
      className: "hover:text-blue-600 dark:hover:text-blue-600",
    },
    {
      name: "LinkedIn",
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${shareText}`,
      icon: FaLinkedin,
      className: "hover:text-blue-700 dark:hover:text-blue-700",
    },
    {
      name: "Reddit",
      url: `https://www.reddit.com/submit?url=${shareUrl}&title=${shareText}`,
      icon: FaSquareReddit,
      className: "hover:text-orange-500 dark:hover:text-orange-500",
    },
    {
      name: "WhatsApp",
      url: `https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`,
      icon: FaSquareWhatsapp,
      className: "hover:text-green-500 dark:hover:text-green-500",
    },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 my-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md border-t border-b border-gray-200 dark:border-gray-700">
      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 mr-2">Share this article:</span>
      {shareLinks.map((link) => {
        const Icon = link.icon;
        return (
          <Tooltip key={link.name} message={link.name}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Share on ${link.name}`}
              className={`p-2 transition-colors duration-200 transform rounded-full text-gray-500 dark:text-gray-400 ${link.className}`}
            >
              <Icon className="w-6 h-6" />
            </a>
          </Tooltip>
        );
      })}
      <div className="pl-4 ml-4 border-l border-gray-300 dark:border-gray-600">
        <CopyToClipboardButton link={decodeURIComponent(shareUrl)} />
      </div>
    </div>
  );
};

export default SocialShareButtons;
