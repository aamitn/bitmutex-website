'use client';

import React, { useState, useEffect } from 'react';
import { DiscussionEmbed, CommentCount } from 'disqus-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, MessageSquare, Users, Clock, Sparkles } from 'lucide-react';

// Define the User interface for a logged-in user
interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

// Define the props for the component
interface DisqusCommentsProps {
  post: {
    slug: string;
    title: string;
  };
  currentUser?: User | null;
}

const DisqusComments: React.FC<DisqusCommentsProps> = ({ post, currentUser }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentCount, setCommentCount] = useState<number | null>(null);

  const getDisqusSSOData = (user: User) => {
    return {
      name: user.username,
      id: user.id,
      email: user.email,
      avatar: user.avatar,
      hash: "generated-signature-from-backend",
      public_key: "your-disqus-public-key",
    };
  };

  const disqusConfig = {
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/blog/${post.slug}`,
    identifier: post.slug,
    title: post.title,
    sso: currentUser ? getDisqusSSOData(currentUser) : undefined,
    language: 'en_US',
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Simulate comment count
      setCommentCount(Math.floor(Math.random() * 50) + 1);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="relative">
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20 rounded-3xl transform -rotate-1"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-indigo-50/40 via-cyan-50/20 to-teal-50/40 dark:from-indigo-950/15 dark:via-cyan-950/15 dark:to-teal-950/15 rounded-3xl transform rotate-1"></div>
        
        <Card className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl border-0 ring-1 ring-gray-200/50 dark:ring-gray-700/50 rounded-2xl overflow-hidden">
          {/* Gradient header bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-yellow-400  to-orange-400"></div>
          
          <CardHeader className="pb-6 pt-8">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-4 text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 dark:from-gray-100 dark:via-gray-200 dark:to-gray-300 bg-clip-text text-transparent">
                <div className="relative">
                  <MessageSquare className="h-8 w-8 text-blue-600 dark:text-blue-400 drop-shadow-sm" />
                  <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-500 animate-pulse" />
                </div>
                <span className="tracking-tight">Comments</span>
              </CardTitle>
              
              {/* Modern notification-style comment counter */}
              <div className="flex items-center gap-3">
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                ) : (
                  <div className="group flex items-center gap-2 bg-gradient-to-r from-orange-500  to-amber-700 text-slate-100 px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
                    <Users className="h-4 w-4 transition-transform group-hover:scale-110" />
                    <CommentCount shortname="bitmutex" config={disqusConfig}>
                      {commentCount !== null ? (
                        <div className="flex items-center gap-1">
                          <span className="font-semibold tabular-nums">{commentCount}</span>
                          <span className="text-sm font-medium opacity-90">
                            {commentCount === 1 ? 'comment' : 'comments'}
                          </span>
                        </div>
                      ) : (
                        <span className="font-medium">Loading...</span>
                      )}
                    </CommentCount>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Subtitle with metadata */}
            <div className="flex items-center gap-2 mt-4 text-sm text-gray-600 dark:text-gray-400">
              <Clock className="h-4 w-4" />
              <span>Join the conversation about &ldquo;{post.title}&ldquo;</span>
            </div>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            {isLoading ? (
              <div className="space-y-6">
                {/* Loading skeleton with modern design */}
                <div className="flex items-start gap-4">
                  <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-16 w-full rounded-lg" />
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-12 w-full rounded-lg" />
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-20 w-full rounded-lg" />
                  </div>
                </div>
                
                {/* Loading indicator */}
                <div className="flex items-center justify-center py-8">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <span className="ml-2 text-sm font-medium">Loading discussion...</span>
                  </div>
                </div>
              </div>
            ) : error ? (
              <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
                <Terminal className="h-5 w-5 text-red-600 dark:text-red-400" />
                <AlertTitle className="text-red-800 dark:text-red-200 font-semibold">
                  Unable to Load Comments
                </AlertTitle>
                <AlertDescription className="text-red-700 dark:text-red-300 mt-2">
                  {error}
                  <div className="mt-3">
                    <button 
                      onClick={() => {
                        setError(null);
                        setIsLoading(true);
                        setTimeout(() => setIsLoading(false), 1500);
                      }}
                      className="text-sm bg-red-100 hover:bg-red-200 dark:bg-red-900/50 dark:hover:bg-red-900/70 text-red-800 dark:text-red-200 px-3 py-1 rounded-md transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                </AlertDescription>
              </Alert>
            ) : (
              <div className="relative">
                {/* Success indicator */}
                <div className="absolute -top-4 right-0 flex items-center gap-1 text-green-600 dark:text-green-400 text-xs font-medium opacity-75">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Live</span>
                </div>
                
                {/* Disqus embed with custom styling wrapper */}
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <DiscussionEmbed shortname="bitmutex" config={disqusConfig} />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DisqusComments;