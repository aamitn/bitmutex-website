'use client';

import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, History } from 'lucide-react'; // Changed SVG to Lucide icon for history

export default function SearchWidget() {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [query, setQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const router = useRouter();
  const popoverRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load search history from localStorage on initial component mount
  useEffect(() => {
    const storedHistory = localStorage.getItem('searchHistory');
    if (storedHistory) {
      setSearchHistory(JSON.parse(storedHistory));
    }
  }, []);

  // Close the popover if a click occurs outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsPopoverOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [popoverRef]);

  // Focus the input field when the popover opens
  useEffect(() => {
    if (isPopoverOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isPopoverOpen]);

  const handleSearch = () => {
    if (query.trim()) {
      const newHistory = [query.trim(), ...searchHistory.filter((item) => item !== query.trim())].slice(0, 5);
      setSearchHistory(newHistory);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));

      setIsPopoverOpen(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleHistoryClick = (historyQuery: string) => {
    setQuery(historyQuery);
    handleSearch();
  };

  const handleClearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  const popoverVariants = {
    initial: { opacity: 0, scale: 0.9, y: -10 },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 400, damping: 25 },
    },
    exit: { opacity: 0, scale: 0.9, y: -10, transition: { duration: 0.2 } },
  };

  const tooltipVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.15 } },
  };

  const historyVariants = {
    initial: { opacity: 0, y: -5 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -5, transition: { duration: 0.15 } },
  };

  return (
    <div className="relative z-auto" ref={popoverRef}>
      <motion.button
        onClick={() => setIsPopoverOpen(!isPopoverOpen)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="
          p-2 rounded-full shadow-md
          bg-gradient-to-br from-zinc-100/50 via-zinc-400/80 to-zinc-400/80
          dark:from-slate-800 dark:to-slate-700
          text-slate-800 dark:text-slate-200
          ring-1 ring-slate-300 dark:ring-slate-600
          hover:shadow-lg hover:scale-105
          hover:from-zinc-300 hover:to-zinc-500/80
          dark:hover:from-slate-700 dark:hover:to-slate-600
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
          transition-all duration-300 ease-out
        "
        aria-label="Open search popover"
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
      >
        <Search className="h-5 w-5" />
      </motion.button>

      <AnimatePresence>
        {showTooltip && !isPopoverOpen && (
          <motion.div
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-gray-900 dark:bg-gray-700 shadow-lg whitespace-nowrap"
            variants={tooltipVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            Search
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-2 w-2 bg-gray-900 dark:bg-gray-700 transform rotate-45 -mt-1 rounded-sm" />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isPopoverOpen && (
          <motion.div
            className="
                absolute top-full right-1/2 translate-x-1/2 mt-3 
                p-4 mr-20 md:mr-0 
                w-[calc(100vw-2rem)] md:w-96  
                bg-neutral-200/90 border border-slate-400/70 dark:bg-slate-800 rounded-2xl shadow-2xl 
                border border-slate-200 dark:border-slate-700 
                z-50 md:right-0 md:translate-x-0
                "           
            variants={popoverVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className="flex items-center space-x-2 mb-3">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search for anything..."
                className="flex-grow p-3 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-600 transition-colors duration-200 placeholder-slate-400 dark:placeholder-slate-500"
              />
              <motion.button
                onClick={handleSearch}
                className="py-3 px-5 rounded-xl font-semibold text-white shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-900 dark:from-orange-500 dark:to-orange-700 dark:hover:from-orange-600 dark:hover:to-orange-900"
                whileTap={{ scale: 0.95 }}
                whileHover={{ y: -2 }}
              >
                Search
              </motion.button>
            </div>
            
            <AnimatePresence>
              {searchHistory.length > 0 && query.length > 0 && (
                <motion.div
                  className="bg-slate-100/80 dark:bg-slate-700 rounded-xl p-2"
                  variants={historyVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <div className="flex justify-between items-center px-2 py-1 text-slate-500 dark:text-slate-400 text-sm">
                    <span>Recent Searches</span>
                    <button
                      onClick={handleClearHistory}
                      className="text-xs text-red-500 hover:text-red-600 transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                  <ul className="mt-1">
                    {searchHistory
                      .filter((historyQuery) => historyQuery.toLowerCase().includes(query.toLowerCase()))
                      .map((historyQuery) => (
                        <li key={historyQuery} className="cursor-pointer">
                          <motion.div
                            onClick={() => handleHistoryClick(historyQuery)}
                            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-200"
                            whileHover={{ x: 5 }}
                          >
                            <History className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                            <span className="text-slate-700 dark:text-slate-200">{historyQuery}</span>
                          </motion.div>
                        </li>
                      ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}