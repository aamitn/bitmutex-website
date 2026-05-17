"use client";

import { useEffect, useState, useRef } from "react";
import { Book, ChevronDown, ChevronUp, GripHorizontal, X, List } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

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
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(true); // Controlled visibility state

  // Manual Drag State
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const observerRef = useRef<IntersectionObserver | null>(null);

  // 1. Detect screen size on mount and CLOSE the widget if <= 1366x768
  useEffect(() => {
    if (typeof window !== "undefined") {
      // If screen width is 1366 or lower, OR height is 768 or lower, start closed
      if (window.innerWidth <= 1366 || window.innerHeight <= 768) {
        setIsVisible(false);
      }
    }
  }, []);

  // Extract headings on mount
  useEffect(() => {
    const container = document.querySelector(`.${containerClass}`);
    if (!container) return;

    const headingElements = Array.from(container.querySelectorAll("h2, h3, h4"));
    const tocItems: TOCItem[] = [];

    headingElements.forEach((heading) => {
      const id = heading.id || heading.textContent?.toLowerCase().replaceAll(/\s+/g, "-");
      if (id) {
        heading.id = id;
        tocItems.push({
          id,
          text: heading.textContent || "",
          level: Number.parseInt(heading.tagName.replace("H", ""), 10),
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

  const handleScrollTo = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${id}`);
      setIsMobileToCOpen(false);
    }
  };

  // --- Drag Handlers ---
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button")) return; // Prevent drag on buttons
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <>
      {/* Desktop View Lifecycle Management */}
      <AnimatePresence>
        {isVisible ? (
          /* Large Screen Desktop View Widget */
          <motion.nav
            key="toc-widget"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "hidden xl:flex flex-col",
              "fixed top-24 left-4 2xl:left-16 z-50",
              "w-64 min-w-[200px] max-w-[450px] max-h-[75vh]",
              "bg-white dark:bg-gray-900",
              "border border-gray-300 dark:border-gray-700",
              "rounded-xl shadow-lg hover:shadow-xl transition-shadow",
              "resize-x overflow-hidden"
            )}
            style={{
              x: position.x,
              y: position.y,
              touchAction: "none",
            }}
          >
            {/* Draggable Header Top Row */}
            <div 
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800 cursor-grab active:cursor-grabbing select-none shrink-0"
            >
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 pointer-events-none">
                <GripHorizontal size={16} className="shrink-0" />
                <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Contents
                </h3>
              </div>
              
              <div className="flex items-center gap-1 z-10">
                {/* Minimize Action Toggle */}
                <button
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMinimized(!isMinimized);
                  }}
                  className="p-1 rounded-md text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-400 transition-colors"
                  title={isMinimized ? "Expand Menu" : "Minimize Menu"}
                >
                  {isMinimized ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                </button>
                
                {/* Hide UI Action Toggle */}
                <button
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsVisible(false);
                  }}
                  className="p-1 rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  title="Hide Table of Contents"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Links Menu Wrapper */}
            <motion.div
              animate={{ 
                height: isMinimized ? 0 : "auto",
                opacity: isMinimized ? 0 : 1 
              }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="overflow-y-auto w-full scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700"
            >
              <div className="p-4 max-h-[50vh] w-full">
                <ul className="font-sans space-y-1.5 text-xs text-gray-600 dark:text-gray-400 w-full">
                  {headings.map(({ id, text, level }) => (
                    <li
                      key={id}
                      style={{ paddingLeft: `${(level - 2) * 12}px` }}
                      className="w-full"
                    >
                      <a
                        href={`#${id}`}
                        className={`block px-2.5 py-1 rounded-md transition-all truncate w-full ${
                          activeId === id 
                            ? 'bg-blue-600 text-white font-semibold' 
                            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleScrollTo(id);
                        }}
                        title={text}
                      >
                        {text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </motion.nav>
        ) : (
          /* Floating Reopen Handle (Icon-only, expands on hover) */
          <motion.button
            key="toc-reopen-trigger"
            onClick={() => setIsVisible(true)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="
              hidden xl:flex items-center 
              fixed top-32 left-0 z-50 
              bg-blue-600 text-white
              rounded-r-xl shadow-md 
              hover:bg-blue-700 transition-colors duration-300 group
            "
          >
            {/* Persistent Icon */}
            <div className="py-2.5 pl-3 pr-2">
              <List size={16} className="shrink-0" />
            </div>
            
            {/* Hidden text that slides out on hover */}
            <span className="
              max-w-0 opacity-0 overflow-hidden whitespace-nowrap 
              group-hover:max-w-[120px] group-hover:opacity-100 group-hover:pr-4 
              transition-all duration-300 ease-in-out 
              text-xs font-medium
            ">
              Show Contents
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Trigger floating button for Mobile & Laptops */}
      <div className="fixed bottom-40 right-6 xl:hidden z-40">
        <button
          onClick={() => setIsMobileToCOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3.5 rounded-full shadow-xl transition-transform active:scale-95 flex items-center justify-center"
          aria-label="Table of Contents"
        >
          <Book size={22} />
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileToCOpen && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[100] flex flex-col justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileToCOpen(false)}
          >
            <motion.div
              className="bg-white dark:bg-gray-900 p-6 max-h-[80vh] w-full max-w-lg mx-auto overflow-y-auto rounded-t-2xl shadow-2xl border-t border-gray-200 dark:border-gray-800"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-4 text-center text-gray-900 dark:text-gray-100">
                Table of Contents
              </h3>
              <ul className="space-y-2 text-sm max-h-[50vh] overflow-y-auto pr-1">
                {headings.map(({ id, text, level }) => (
                  <li key={id} style={{ paddingLeft: `${(level - 2) * 16}px` }}>
                    <button
                      onClick={() => handleScrollTo(id)}
                      className={`block w-full text-left px-3 py-2 rounded-lg transition-all ${
                        activeId === id 
                          ? "bg-blue-600 text-white font-semibold" 
                          : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {text}
                    </button>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setIsMobileToCOpen(false)}
                className="mt-6 w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 py-3 rounded-xl font-medium transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Close Menu
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TableOfContents;