//Create Custom Block
/* Custom Block Codes in These Files :
  1. src->components->block-renderer->layout->ckeditor-block.tsx 
  2. src->components->block-renderer->index.tsx
  3. src->types->index.ts (add in export type Block and add interface for Props)
  4. src->data->loaders->index.ts (inside getLandingPage())
*/

import type { CkeditorBlockProps } from "@/types";
import React, { useMemo } from "react";
import sanitizeHtml from "sanitize-html";

export function CkeditorBlock({ content }: Readonly<CkeditorBlockProps>) {
  if (!content) return null;

  const sanitizedContent = useMemo(
    () =>
      sanitizeHtml(content, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat([
          "img", "iframe", "h1", "h2", "h3", "h4", "h5", "h6", "a"
        ]),
        allowedAttributes: {
          ...sanitizeHtml.defaults.allowedAttributes,
          iframe: ["src", "width", "height", "frameborder", "allow", "allowfullscreen"],
          img: ["src", "alt", "width", "height", "style"],
          a: ["href", "target", "rel"],
        },
        allowedIframeHostnames: ["www.youtube.com", "player.vimeo.com"],
      }),
    [content]
  );

  return (
    <section className="flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-6xl bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 md:p-10 transition-all border dark:border-gray-700">
        <div
          className="ckeditor-content text-gray-800 dark:text-gray-200 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />
      </div>
    </section>
  );
}
