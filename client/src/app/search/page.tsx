'use client';

import UnifiedSearchComponent from '@/components/custom/UnifiedSearchComponent'


// Main App component
export default function Home() {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header Section */}
          <div className="text-center mb-8 mt-20">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-sky-500 via-blue-500 to-blue-600 dark:from-orange-500 dark:via-orange-400 dark:to-orange-600 dark:bg-gradient-to-r">            Search
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Search across all your content in one place.
            </p>
            <div className="mt-2 text-sm text-gray-500 dark:text-gray-500">
              12 content types • Real-time search • Advanced filtering • Direct navigation
            </div>
          </div>
  
          {/* Search Component */}
          <UnifiedSearchComponent />
        </div>
      </div>
    );
  }
