//Create Custom Block
/* Custom Block Codes in These Files :
  1. src->components->block-renderer->layout->ckeditor-block.tsx 
  2. src->components->block-renderer->index.tsx
  3. src->types->index.ts (add in export type Block and add interface for Props)
  4. src->data->loaders->index.ts (inside getLandingPage())
*/

import type { CkeditorBlockMarkdownProps } from "@/types";
import React from "react";
import  RenderMarkdown  from "@/components/custom/RenderMarkdown";

export function CkeditorBlockMarkdown({ content }: Readonly<CkeditorBlockMarkdownProps>) {
  if (!content) return null;


  return (
    <section className="mb-4 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-6xl bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 md:p-10 transition-all border dark:border-gray-700">
        <div
          className="rich-text  text-gray-800 dark:text-gray-200 leading-relaxed"
        />
        <RenderMarkdown content={content} />
      </div>
    </section>
  );
}
