import React, { useState, useEffect } from 'react';
import { AlertCircle, Loader2, Tag, ExternalLink } from 'lucide-react';
import { FaGithub } from "react-icons/fa";
import { cn } from '@/lib/utils';

// Define the props for the GitHubVersion component
interface GitHubVersionProps {
  readonly owner: string;
  readonly repo: string;
  readonly token?: string;
  readonly showRepoLink?: boolean;
  readonly compact?: boolean;
  readonly theme?: 'light' | 'dark' | 'glass';
}

/**
 * A stunning, professional component that fetches and displays the latest release tag
 * from a GitHub repository with beautiful animations and modern design.
 */
export function GitHubVersion({
  owner,
  repo,
  token,
  showRepoLink = false,
  compact = false,
  theme = 'glass'
}: GitHubVersionProps) {
  const [version, setVersion] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [releaseUrl, setReleaseUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestRelease = async () => {
      setLoading(true);
      setError(null);

      try {
        const usedToken = token || process.env.NEXT_PUBLIC_GITHUB_TOKEN;
        const headers: HeadersInit = {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'GitHubVersion-Component'
        };

        if (usedToken) {
          headers.Authorization = `Bearer ${usedToken}`;
        }

        const response = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/releases/latest`,
          { headers }
        );

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Unauthorized - Invalid or missing token');
          } else if (response.status === 404) {
            throw new Error('Repository not found or no releases');
          } else {
            throw new Error(`GitHub API error: ${response.statusText}`);
          }
        }

        const data = await response.json();
        setVersion(data.tag_name || 'N/A');
        setReleaseUrl(data.html_url);
      } catch (err: any) {
        console.error('Error fetching GitHub version:', err);
        setError('Failed to load version');
        setVersion('N/A');
      } finally {
        setLoading(false);
      }
    };

    fetchLatestRelease();
  }, [owner, repo, token]);

  const getThemeClasses = () => {
    switch (theme) {
      case 'dark':
        return 'bg-slate-900 border-slate-800 text-slate-100 shadow-2xl';
      case 'light':
        return 'bg-white border-slate-200 text-slate-800 shadow-lg';
      case 'glass':
      default:
        return 'bg-white/10 backdrop-blur-md border-white/20 text-white shadow-xl saturate-150';
    }
  };

  const getThemeText = () => {
    switch (theme) {
      case 'dark':
        return 'text-white/80';
      case 'light':
        return 'text-slate-700';
      case 'glass':
      default:
        return 'text-white/80';
    }
  };

  const repoUrl = `https://github.com/${owner}/${repo}`;

  if (compact) {
    return (
      <div className={cn(
        `inline-flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300`,
        `hover:scale-105`,
        getThemeClasses()
      )}>
        {loading && (
          <div className="flex items-center gap-2">
            <Loader2 className="w-3 h-3 animate-spin text-blue-400" />
            <span className={cn("text-xs font-medium", getThemeText())}>Loading...</span>
          </div>
        )}
        
        {error && (
          <div className="flex items-center gap-2">
            <AlertCircle className="w-3 h-3 text-red-400" />
            <span className="text-xs font-medium text-red-400">Error</span>
          </div>
        )}
        
        {!loading && !error && (
          <a
            href={releaseUrl || repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <Tag className="w-3 h-3 dark:text-green-400 text-emerald-600  animate-pulse" />
              <span
                className="
                  text-xs font-bold tracking-wide
                  bg-gradient-to-r
                  from-sky-500 via-sky-600 to-blue-700
                  dark:from-amber-400 dark:via-orange-400 dark:to-amber-600
                  bg-clip-text text-transparent
                  transition-all duration-300 ease-in-out
                  hover:from-blue-700 hover:via-indigo-600 hover:to-purple-700
                  dark:hover:from-amber-300 dark:hover:via-orange-300 dark:hover:to-red-400
                  cursor-default select-none
                "
              >
                {version}
            </span>
          </a>
        )}
      </div>
    );
  }

  return (
    <div className={cn(
      `inline-flex items-center gap-3 px-5 py-3 rounded-2xl border transition-all duration-500`,
      `hover:shadow-2xl hover:-translate-y-0.5`,
      getThemeClasses()
    )}>
      {loading && (
        <div className="flex items-center gap-3 animate-pulse">
          <div className="relative">
            <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
            <div className="absolute inset-0 bg-blue-400/30 rounded-full animate-ping"></div>
          </div>
          <div className="space-y-1">
            <span className={cn("text-sm font-semibold", getThemeText())}>
              Fetching latest release...
            </span>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <FaGithub className="w-3 h-3 text-slate-400" />
              <span>{owner}/{repo}</span>
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <div className="flex items-center gap-3">
          <div className="relative">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <div className="absolute inset-0 bg-red-400/20 rounded-full animate-ping"></div>
          </div>
          <div className="space-y-1">
            <span className="text-sm font-semibold text-red-500">
              Version unavailable
            </span>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <FaGithub className="w-3 h-3" />
              <span>{owner}/{repo}</span>
            </div>
          </div>
        </div>
      )}
      
      {!loading && !error && (
        <div className="flex items-center gap-3 group">
          <div className="relative">
            <div className="p-2 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl shadow-lg">
              <Tag className="w-4 h-4 text-white" />
            </div>
            <div className="absolute -inset-1 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl opacity-30 animate-pulse-slow"></div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <a
                href={releaseUrl || repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 bg-clip-text text-transparent transition-transform duration-300 group-hover:scale-105"
              >
                {version}
              </a>
              <div className="px-2 py-0.5 bg-gradient-to-r from-green-600 to-emerald-700 text-white text-xs font-semibold rounded-full shadow-md">
                Latest
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <FaGithub className="w-3 h-3 text-slate-400" />
                <span className="font-medium">{owner}/{repo}</span>
              </div>
              
              {showRepoLink && (
                <div className="flex items-center gap-2">
                  <div className="h-3 w-px bg-slate-500"></div>
                  <a
                    href={releaseUrl || repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>View Release</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}