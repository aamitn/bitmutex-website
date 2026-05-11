"use client";
import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface ColorCardProps {
  color: {
    id: number;
    name: string;
    hex: string;
    rgb: string;
    hsl: string;
    cmyk: string;
  };
  index: number;
}

type ColorFormat = "hex" | "rgb" | "hsl" | "cmyk";

export default function ColorCard({ color, index }: ColorCardProps) {
  const [copied, setCopied] = useState<ColorFormat | null>(null);
  const [activeFormat, setActiveFormat] = useState<ColorFormat>("hex");

  const formats: { label: string; key: ColorFormat; value: string }[] = [
    { label: "HEX", key: "hex", value: color.hex },
    { label: "RGB", key: "rgb", value: color.rgb },
    { label: "HSL", key: "hsl", value: color.hsl },
    { label: "CMYK", key: "cmyk", value: color.cmyk },
  ];

  const copyValue = async (value: string, key: ColorFormat) => {
    await navigator.clipboard.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied(null), 1800);
  };

  const active = formats.find((f) => f.key === activeFormat)!;

  return (
    <div
      className="group relative flex flex-col rounded-2xl overflow-hidden
        border border-white/8 bg-white/[0.03] backdrop-blur-sm
        hover:border-white/15 hover:bg-white/[0.06]
        transition-all duration-400
        hover:shadow-[0_16px_48px_rgba(0,0,0,0.5)]"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Color swatch */}
      <div
        className="relative h-32 w-full flex-shrink-0 cursor-pointer"
        style={{ backgroundColor: color.hex }}
        onClick={() => copyValue(color.hex, "hex")}
        title="Click to copy HEX"
      >
        {/* Copy indicator overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
          {copied === "hex" ? (
            <Check className="w-6 h-6 text-white drop-shadow-lg" />
          ) : (
            <Copy className="w-5 h-5 text-white drop-shadow-lg" />
          )}
        </div>

        {/* Hex badge */}
        <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-sm text-white text-xs font-mono tracking-wider">
          {color.hex}
        </div>
      </div>

      {/* Card body */}
      <div className="p-4 space-y-3">
        {/* Color name */}
        <p className="text-sm font-semibold text-white tracking-wide truncate">
          {color.name}
        </p>

        {/* Format tabs */}
        <div className="flex gap-1">
          {formats.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFormat(f.key)}
              className={`flex-1 py-1 rounded-md text-[10px] font-medium tracking-wider uppercase transition-all duration-200
                ${
                  activeFormat === f.key
                    ? "bg-white/15 text-white"
                    : "text-gray-600 hover:text-gray-400 hover:bg-white/5"
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Active value + copy button */}
        <button
          onClick={() => copyValue(active.value, active.key)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg
            bg-white/5 border border-white/8
            hover:bg-white/10 hover:border-white/15
            transition-all duration-200 group/copy"
        >
          <span className="text-xs text-gray-400 font-mono truncate text-left">
            {active.value}
          </span>
          <span className="ml-2 flex-shrink-0">
            {copied === active.key ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-gray-600 group-hover/copy:text-gray-300 transition-colors" />
            )}
          </span>
        </button>
      </div>
    </div>
  );
}