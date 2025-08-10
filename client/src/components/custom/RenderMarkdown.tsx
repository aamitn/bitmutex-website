import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // GitHub-Flavored Markdown (tables, task lists)
import rehypeRaw from "rehype-raw"; // Allow raw HTML inside Markdown
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"; // Syntax Highlighting
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism"; // Theme
import CodeBlockWithCopy from "./CodeBlockWithCopy"; 

interface RenderMarkdownProps {
  content: string;
}

const RenderMarkdown: React.FC<RenderMarkdownProps> = ({ content }) => {
  if (!content) return null;

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        h1: ({ node, ...props }) => (
          <>
            <h1 className="text-4xl font-bold mt-8 mb-4 border-b pb-3 text-gray-900 dark:text-gray-100" {...props} />
          </>
        ),
        h2: ({ node, ...props }) => (
          <>
            <h2 className="text-3xl font-semibold mt-6 mb-3 border-b pb-2 text-gray-800 dark:text-gray-200" {...props} />
          </>
        ),
        h3: (props) => <h3 className="text-2xl font-semibold mt-5 mb-2 text-gray-700 dark:text-gray-300" {...props} />,
        p: (props) => <p className="mb-4 text-lg leading-relaxed text-gray-700 dark:text-gray-300" {...props} />,
        ul: (props) => <ul className="list-disc pl-6 mb-4 space-y-2 text-lg text-gray-700 dark:text-gray-300" {...props} />,
        ol: (props) => <ol className="list-decimal pl-6 mb-4 space-y-2 text-lg text-gray-700 dark:text-gray-300" {...props} />,
        blockquote: (props) => (
          <blockquote className="border-l-4 pl-5 italic text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-sm" {...props} />
        ),
        hr: () => <hr className="border-gray-500 dark:border-gray-300 my-6" />, // Custom HR styling

        code({ node, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          return match ? (
            <div className="rounded-lg shadow-sm overflow-hidden my-4">
              <CodeBlockWithCopy language={match[1]}>
                {String(children).trim()}
              </CodeBlockWithCopy>
            </div>
          ) : (
            <code className="bg-gray-200 dark:bg-gray-700 text-sm p-1 rounded-md text-red-600 dark:text-red-400 font-mono" {...props}>
              {children}
            </code>
          );
        },

        table: (props) => (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm" {...props} />
          </div>
        ),
        th: (props) => (
          <th className="border border-gray-400 dark:border-gray-600 px-4 py-3 bg-gray-200 dark:bg-gray-700 text-left text-lg font-semibold" {...props} />
        ),
        td: (props) => (
          <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-lg text-gray-700 dark:text-gray-300" {...props} />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default RenderMarkdown;
