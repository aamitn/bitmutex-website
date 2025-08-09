"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { FaGithub } from "react-icons/fa";

interface GitHubBadgeProps {
  repoUrl: string;
  className?: string;
}

// ⚠️ DANGER: DO NOT USE A HARDCODED TOKEN IN PRODUCTION! ⚠️
// This is a major security vulnerability. Anyone who inspects your source code
// can steal this token and gain access to your GitHub account.
// This is for demonstration purposes ONLY.
const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

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

  // Fetch GitHub stars and check if repo is starred by the authenticated user
  useEffect(() => {
    if (!repoDetails || !GITHUB_TOKEN) return;

    const fetchRepoData = async () => {
      setIsLoading(true);
      try {
        const headers = {
          'Authorization': `token ${GITHUB_TOKEN}`
        };

        // Fetch repo data with authentication
        const repoResponse = await fetch(
          `https://api.github.com/repos/${repoDetails.owner}/${repoDetails.repo}`,
          { headers }
        );
        if (repoResponse.ok) {
          const repoData = await repoResponse.json();
          setStars(repoData.stargazers_count);
        }

        // Check if the authenticated user has starred the repo
        const starCheckResponse = await fetch(
          `https://api.github.com/user/starred/${repoDetails.owner}/${repoDetails.repo}`,
          { method: 'GET', headers }
        );
        setIsStarred(starCheckResponse.status === 204); // 204 means repo is starred
        
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

    if (!repoDetails || !GITHUB_TOKEN) {
      console.warn("Cannot star/unstar without a valid token.");
      return;
    }

    setIsLoading(true);
    const headers = {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Content-Length': '0', // Required for PUT requests
    };
    const url = `https://api.github.com/user/starred/${repoDetails.owner}/${repoDetails.repo}`;

    try {
      const method = isStarred ? 'DELETE' : 'PUT';
      const response = await fetch(url, { method, headers });

      if (response.ok) {
        setIsStarred(!isStarred);
        // Optimistically update the star count
        setStars(prevStars => {
          if (prevStars === null) return null;
          return isStarred ? prevStars - 1 : prevStars + 1;
        });
      } else {
        console.error("Failed to star/unstar repository:", response.statusText);
      }
    } catch (error) {
      console.error("Error when starring/unstarring repository", error);
    } finally {
      setIsLoading(false);
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
        disabled={isLoading || !GITHUB_TOKEN}
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