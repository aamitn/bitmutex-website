"use client";

import { useState } from "react";
import { FaLink } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CopyToClipboardButtonProps {
  link: string;
}

const CopyToClipboardButton: React.FC<CopyToClipboardButtonProps> = ({ link }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [tooltipOpen, setTooltipOpen] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTooltipOpen(true);

    // Reset copied state and close tooltip after 2 seconds
    setTimeout(() => {
      setCopied(false);
      setTooltipOpen(false);
    }, 2000);
  };

  return (
    <TooltipProvider>
      <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen} delayDuration={200}>
        <TooltipTrigger asChild>
          <Button
            onClick={handleCopy}
            variant="outline"
            size="icon"
            className="rounded-full hover:bg-blue-100 dark:hover:bg-gray-200 hover:text-accent-foreground transition border-0 hover:border-1"
          >
            <FaLink className="w-4 h-4 text-orange-500" />
          </Button>
        </TooltipTrigger>
        <TooltipContent className="text-xs">
          {copied ? "Copied!" : "Copy link"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CopyToClipboardButton;
