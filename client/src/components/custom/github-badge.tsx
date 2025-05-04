"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { FaGithub } from "react-icons/fa";


interface GitHubBadgeProps {
  repoUrl: string;
  className?: string;
}

export function GitHubBadge({ repoUrl, className = "" }: GitHubBadgeProps) {
  const [stars, setStars] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isStarred, setIsStarred] = useState<boolean>(false);
  const [repoDetails, setRepoDetails] = useState<{ owner: string; repo: string } | null>(null);
  
  // Extract repo owner and name from GitHub URL
  useEffect(() => {
    if (!repoUrl) return;
    
    try {
      const urlObj = new URL(repoUrl);
      if (urlObj.hostname === "github.com") {
        const pathParts = urlObj.pathname.split('/').filter(Boolean);
        if (pathParts.length >= 2) {
          setRepoDetails({
            owner: pathParts[0],
            repo: pathParts[1]
          });
        }
      }
    } catch (e) {
      console.error("Invalid GitHub URL", e);
    }
  }, [repoUrl]);
  
  // Fetch GitHub stars and check if repo is starred by current user
  useEffect(() => {
    if (!repoDetails) return;
    
    const fetchRepoData = async () => {
      setIsLoading(true);
      try {
        // Fetch repo data
        const repoResponse = await fetch(`https://api.github.com/repos/${repoDetails.owner}/${repoDetails.repo}`);
        if (repoResponse.ok) {
          const repoData = await repoResponse.json();
          setStars(repoData.stargazers_count);
        }
        
        // Check if current user has starred the repo
        // This requires user to be logged in to GitHub in their browser
        try {
          const starCheckResponse = await fetch(
            `https://api.github.com/user/starred/${repoDetails.owner}/${repoDetails.repo}`,
            { method: 'GET', credentials: 'include' }
          );
          setIsStarred(starCheckResponse.status === 204); // 204 means repo is starred
        } catch (err) {
          // If this fails, user might not be logged in or might not have granted permission
          console.info("Could not check star status - user might not be logged in to GitHub");
        }
      } catch (error) {
        console.error("Failed to fetch GitHub data", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRepoData();
  }, [repoDetails]);

  // Handle starring/unstarring the repo
  const handleStarClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    if (!repoDetails) return;
    
    try {
      // The GitHub API doesn't support direct starring from browser due to CORS
      // Instead, we'll open GitHub's star UI in a new tab
      window.open(`${repoUrl}/stargazers`, '_blank');
      
      
      // Show a message to the user
      const message = document.createElement('div');
      message.textContent = "Please login to GitHub and click the star button if prompted";
      message.style.position = 'fixed';
      message.style.top = '20px';
      message.style.left = '50%';
      message.style.transform = 'translateX(-50%)';
      message.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
      message.style.color = 'white';
      message.style.padding = '10px 20px';
      message.style.borderRadius = '5px';
      message.style.zIndex = '1000';
      document.body.appendChild(message);
      
      setTimeout(() => {
        document.body.removeChild(message);
      }, 5000);
      
    } catch (error) {
      console.error("Error when starring repository", error);
    }
  };

  return (
    <div className={`flex items-center ${className}`}>
      <Link 
        href={repoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center space-x-2 bg-slate-200 hover:bg-slate-300 dark:bg-gray-700 dark:hover:bg-gray-600 
                   text-gray-800 dark:text-white rounded-md px-3 py-2 transition-all duration-300 group"
      >
        <FaGithub className="w-5 h-5 text-gray-700 dark:text-orange-400 group-hover:text-orange-500 dark:group-hover:text-orange-300" />
        <span className="text-sm">This Site Source</span>
      </Link>
      
      <button 
        onClick={handleStarClick}
        className={`flex items-center ml-2 ${
          isStarred 
            ? 'bg-amber-200 dark:bg-amber-700' 
            : 'bg-amber-100 dark:bg-gray-700'
        } hover:bg-amber-300 dark:hover:bg-amber-600 
        text-gray-800 dark:text-white rounded-md px-3 py-2 transition-all duration-300 group`}
      >
        <Star 
          className={`w-5 h-5 ${
            isStarred 
              ? 'text-amber-600 dark:text-amber-300 fill-amber-500 dark:fill-amber-300' 
              : 'text-amber-500 dark:text-amber-400'
          } group-hover:text-amber-600 dark:group-hover:text-amber-300`} 
          fill={isStarred ? 'currentColor' : 'none'}
        />
        <span className="text-sm ml-1">
          {isLoading ? "..." : stars !== null ? stars.toLocaleString() : "Star"}
        </span>
      </button>
    </div>
  );
}