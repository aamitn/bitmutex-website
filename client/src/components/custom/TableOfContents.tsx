"use client";

import { useEffect, useState, useRef } from "react";
import { Book } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TOCProps {
  containerClass: string;
}

const TableOfContents = ({ containerClass }: TOCProps) => {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [isMobileToCOpen, setIsMobileToCOpen] = useState<boolean>(false);

  const observerRef = useRef<IntersectionObserver | null>(null);

  // Extract headings on mount
  useEffect(() => {
    const container = document.querySelector(`.${containerClass}`);
    if (!container) return;

    const headingElements = Array.from(container.querySelectorAll("h2, h3, h4"));
    const tocItems: TOCItem[] = [];

    headingElements.forEach((heading) => {
      const id = heading.id || heading.textContent?.toLowerCase().replace(/\s+/g, "-");
      if (id) {
        heading.id = id;
        tocItems.push({
          id,
          text: heading.textContent || "",
          level: parseInt(heading.tagName.replace("H", ""), 10),
        });
      }
    });

    setHeadings(tocItems);
  }, [containerClass]);

  // Observe sections and update active link
  useEffect(() => {
    if (!headings.length) return;

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
          history.replaceState(null, "", `#${entry.target.id}`);
          break;
        }
      }
    };

    observerRef.current = new IntersectionObserver(handleIntersection, {
      rootMargin: "-20% 0px -70% 0px",
      threshold: 0.1,
    });

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observerRef.current?.observe(element);
    });

    return () => observerRef.current?.disconnect();
  }, [headings]);

  // Function to handle smooth scrolling
  const handleScrollTo = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${id}`);
      setIsMobileToCOpen(false); // Close TOC on mobile after selection
    }
  };

  return (
    <>

      <motion.nav
        className="
            hidden lg:flex flex-col 
            md:fixed md:top-20 
            lg:left-20 md:right-4 
            sm:w-44 md:w-52 lg:w-64 
            max-h-[75vh] md:max-h-screen 
            overflow-y-auto p-4 
            bg-white dark:bg-gray-900 
            border border-gray-300 dark:border-gray-700 
            rounded-lg shadow-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        whileHover={{ scale: 1.02, transition: { duration: 0.3 } }} // Subtle hover effect
      >
        <h3 className="text-lg font-semibold mb-3 text-center md:text-left">Table of Contents</h3>
        <ul className="space-y-2 text-sm">
          {headings.map(({ id, text, level }) => (
            <motion.li
              key={id}
              className={`ml-${(level - 2) * 4}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: level * 0.1 }} // Staggered fade-in for items
            >
              <a
                href={`#${id}`}
                className={`block px-3 py-1 rounded-md transition-all ${activeId === id ? 'bg-blue-600 text-white font-semibold' : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleScrollTo(id);
                }}
              >
                {text}
              </a>
            </motion.li>
          ))}
        </ul>
      </motion.nav>



      {/* Mobile View (Floating Button & Sliding Panel) */}
      <div className="fixed bottom-4 right-4 lg:hidden">
        {/* Floating Button */}
        <button
          onClick={() => setIsMobileToCOpen(true)}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg opacity-80 hover:opacity-100 transition-opacity"
          aria-label="Table of Contents"
        >
          <Book size={20} />
        </button>
      </div>

      {/* Mobile TOC Panel */}
      <AnimatePresence>
        {isMobileToCOpen && (
          <motion.div
            className="z-[999] fixed inset-0 bg-black bg-opacity-50 flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileToCOpen(false)}
          >
            {/* Slide-up TOC Panel */}
            <motion.div
              className="bg-white dark:bg-gray-900 p-6 max-h-[80vh] overflow-y-auto rounded-t-lg shadow-lg"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 120, damping: 15 }}
              onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside
            >
              <h3 className="text-lg font-semibold mb-3 text-center">Table of Contents</h3>
              <ul className="space-y-2 text-sm">
                {headings.map(({ id, text, level }) => (
                  <li key={id} className={`ml-${(level - 2) * 4}`}>
                    <button
                      onClick={() => handleScrollTo(id)}
                      className={`block w-full text-left px-3 py-1 rounded-md transition-all ${activeId === id ? "bg-blue-600 text-white font-semibold" : "hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                    >
                      {text}
                    </button>
                  </li>
                ))}
              </ul>

              {/* Close Button */}
              <button
                onClick={() => setIsMobileToCOpen(false)}
                className="mt-4 w-full bg-red-500 text-white py-2 rounded-md"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TableOfContents;
