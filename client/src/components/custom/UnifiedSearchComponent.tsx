'use client';
import { algoliasearch } from 'algoliasearch';
import { useState, useEffect, useMemo } from "react";
import type { SearchResponse } from "@algolia/client-search";
import { BaseHit } from 'instantsearch.js';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation'; 
import ImageWithFallback from '@/components/custom/ImageWithFallback'

// Define interfaces for different hit types
interface JobHit extends BaseHit {
  title: string;
  description: string;
  jobtype: string;
  deadline: string;
  statu: string;
  location?: string;
  salary?: string;
  experience?: string;
  type: 'job';
  _searchIndex: 'job';
}

interface TestimonialHit extends BaseHit {
  text: string;
  firstname: string;
  lastname: string;
  job: string;
  image?: {
    url: string;
    name: string;
  };
  type: 'testimonial';
  _searchIndex: 'testimonial';
}

interface SuccessStoryHit extends BaseHit {
  name: string;
  content?: string;
  slug: string;
  websiteurl?: string;
  services?: Array<{
    name: string;
    description: string;
  }>;
  industry?: {
    name: string;
    description: string;
  };
  impacts?: Array<{
    name: string;
    description: string;
    icon: string;
  }>;
  stack?: Array<{
    name: string;
  }>;
  location?: Array<{
    name: string;
  }>;
  type: 'success-story';
  _searchIndex: 'success-story';
}

interface ServiceHit extends BaseHit {
  name: string;
  description?: string;
  slug: string;
  icon?: string;
  service_items?: Array<{
    name: string;
    description: string;
    icon: string;
  }>;
  type: 'service';
  _searchIndex: 'service';
}

interface ProjectHit extends BaseHit {
  name: string;
  description?: Array<{
    children: Array<{
      text: string;
    }>;
  }>;
  slug: string;
  repourl?: string;
  hostedurl?: string;
  image?: {
    url: string;
    name: string;
  };
  category?: {
    text: string;
    description: string;
  };
  type: 'project';
  _searchIndex: 'project';
}

interface PostHit extends BaseHit {
  title: string;
  description?: string;
  slug: string;
  views?: number;
  image?: {
    url: string;
    name: string;
  };
  category?: {
    text: string;
    description: string;
  };
  author?: {
    firstname: string;
    lastname: string;
    username: string;
  };
  type: 'post';
  _searchIndex: 'post';
}

interface PageHit extends BaseHit {
  title: string;
  description?: string;
  slug: string;
  type: 'page';
  _searchIndex: 'page';
}

interface LogoHit extends BaseHit {
  company: string;
  image?: {
    url: string;
    name: string;
  };
  type: 'logo';
  _searchIndex: 'logo';
}

interface IndustryHit extends BaseHit {
  name: string;
  description?: string;
  details?: string;
  icon?: string;
  slug: string;
  challenges?: Array<{
    name: string;
  }>;
  opportunities?: Array<{
    name: string;
  }>;
  solutions?: Array<{
    name: string;
  }>;
  type: 'industry';
  _searchIndex: 'industry';
}

interface FreeResourceHit extends BaseHit {
  url: string;
  type: 'free-resource';
  _searchIndex: 'free-resource';
}

interface FAQHit extends BaseHit {
  question: string;
  answer?: string;
  type: 'faq';
  _searchIndex: 'faq';
}

interface CategoryHit extends BaseHit {
  text: string;
  description?: string;
  job?: {
    title: string;
    description: string;
    jobtype: string;
  };
  type: 'category';
  _searchIndex: 'category';
}

type UnifiedHit = JobHit | TestimonialHit | SuccessStoryHit | ServiceHit | ProjectHit | PostHit | PageHit | LogoHit | IndustryHit | FreeResourceHit | FAQHit | CategoryHit;

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || 'demo-app-id',
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY || 'demo-search-key'
);

// Utility function to generate URL slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
    .replace(/^(-+)|(-+)$/g, '') // Remove leading/trailing hyphens
}

// Utility function to get the appropriate link for each content type
function getContentLink(hit: UnifiedHit): string {
  switch (hit.type) {
    case 'job':
      return `/jobs/${hit.documentId}`;
    
    case 'post': {
      const postHit = hit as PostHit;
      // Use existing slug or generate from title
      const slug = postHit.slug || generateSlug(postHit.title);
      return `/blog/${slug}`;
    }
    
    case 'project': {
      const projectHit = hit as ProjectHit;
      const slug = projectHit.slug || generateSlug(projectHit.name);
      return `/projects/${slug}`;
    }
    
    case 'service': {
      const serviceHit = hit as ServiceHit;
      const slug = serviceHit.slug || generateSlug(serviceHit.name);
      return `/services/${slug}`;
    }
    
    case 'success-story': {
      const storyHit = hit as SuccessStoryHit;
      const slug = storyHit.slug || generateSlug(storyHit.name);
      return `/success-stories/${slug}`;
    }
    
    case 'page': {
      const pageHit = hit as PageHit;
      const slug = pageHit.slug || generateSlug(pageHit.title);
      return `/${slug}`;
    }
    
    case 'industry': {
      const industryHit = hit as IndustryHit;
      const slug = industryHit.slug || generateSlug(industryHit.name);
      return `/industries/${slug}`;
    }
    
    case 'testimonial':
      return `/testimonials#${hit.objectID}`;
    
    case 'logo':
      return `/logos#${hit.objectID}`;
    
    case 'faq':
      return `/faq#${hit.objectID}`;
    
    case 'category':
      return `/categories#${hit.objectID}`;
    
    case 'free-resource': {
      const resourceHit = hit as FreeResourceHit;
      return resourceHit.url;
    }
    
    default:
      return '#';
  }
}

// Component wrapper for linking
function LinkWrapper({ hit, children }: { hit: UnifiedHit; children: React.ReactNode }) {
  const link = getContentLink(hit);
  const isExternal = link.startsWith('http') || link.startsWith('mailto:');
  const isAnchor = link.startsWith('#') || link.includes('#');

  if (isExternal) {
    return (
      <a 
        href={link} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block h-full"
      >
        {children}
      </a>
    );
  }

  if (isAnchor) {
    return (
      <a 
        href={link}
        className="block h-full"
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={link} className="block h-full">
      {children}
    </Link>
  );
}

// Component to render different hit types
function UnifiedHitComponent({ hit }: { hit: UnifiedHit }) {
  const renderContent = () => {
    switch (hit.type) {
      case 'testimonial': {
        const testimonialHit = hit as TestimonialHit;
        return (
          <div className="relative flex flex-col bg-blue-50 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border-l-4 border-blue-500 h-full">
            <div className="absolute top-2 right-2 px-2 py-1 bg-blue-500 text-white text-xs font-semibold rounded z-10">
              TESTIMONIAL
            </div>
            {testimonialHit.image?.url && (
              <ImageWithFallback
              src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${testimonialHit.image.url}`}
              alt={`${testimonialHit.firstname} ${testimonialHit.lastname}`}
              fallbackSrc="https://placehold.co/300x200/3B82F6/FFFFFF?text=No+Image"
              width={300}
              height={200}
              className="object-cover"
            />
            )}
            <div className="p-4 flex-1">
              <h3 className="text-lg font-bold mb-2 text-blue-900">
                {testimonialHit.firstname} {testimonialHit.lastname}
              </h3>
              <p className="text-sm text-blue-600 font-medium mb-2">{testimonialHit.job}</p>
              <p className="text-sm text-gray-700 line-clamp-3">{testimonialHit.text}</p>
            </div>
          </div>
        );
      }

      case 'job': {
        const jobHit = hit as JobHit;
        return (
          <div className="relative flex flex-col bg-green-50 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border-l-4 border-green-500 h-full">
            <div className="absolute top-2 right-2 px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded z-10">
              JOB
            </div>
            <div className="p-4 flex-1">
              <h3 className="text-lg font-bold mb-2 text-green-900">{jobHit.title}</h3>
              <p className="text-sm text-green-600 font-medium mb-2">{jobHit.jobtype}</p>
              {jobHit.location && <p className="text-xs text-gray-600 mb-2">📍 {jobHit.location}</p>}
              <p className="text-sm text-gray-700 line-clamp-3 mb-3">{jobHit.description}</p>
              <div className="flex justify-between text-xs text-gray-500 mt-auto">
                <span>📅 {jobHit.deadline}</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  jobHit.statu === 'active' || jobHit.statu === 'Open ' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                }`}>
                  {jobHit.statu}
                </span>
              </div>
            </div>
          </div>
        );
      }

      case 'success-story': {
        const storyHit = hit as SuccessStoryHit;
        return (
          <div className="relative flex flex-col bg-purple-50 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border-l-4 border-purple-500 h-full">
            <div className="absolute top-2 right-2 px-2 py-1 bg-purple-500 text-white text-xs font-semibold rounded z-10">
              SUCCESS STORY
            </div>
            <div className="p-4 flex-1">
              <h3 className="text-lg font-bold mb-2 text-purple-900">{storyHit.name}</h3>
              {storyHit.industry && <p className="text-sm text-purple-600 font-medium mb-2">{storyHit.industry.name}</p>}
              {storyHit.websiteurl && (
                <a href={storyHit.websiteurl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline mb-2 block" onClick={(e) => e.stopPropagation()}>
                  🔗 Visit Website
                </a>
              )}
              {storyHit.location && storyHit.location.length > 0 && (
                <p className="text-xs text-gray-600 mb-2">📍 {storyHit.location[0].name}</p>
              )}
              {storyHit.stack && storyHit.stack.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {storyHit.stack.slice(0, 3).map((tech, index) => (
                    <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                      {tech.name}
                    </span>
                  ))}
                </div>
              )}
            {storyHit.logo?.url && (
              <ImageWithFallback
              src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${storyHit.logo.url}`}
              alt={`${storyHit.name}`}
              fallbackSrc="https://placehold.co/300x200/3B82F6/FFFFFF?text=No+Image"
              width={300}
              height={200}
              className="object-cover"
            />
            )}
            </div>
          </div>
        );
      }

      case 'service': {
        const serviceHit = hit as ServiceHit;
        return (
          <div className="relative flex flex-col bg-indigo-50 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border-l-4 border-indigo-500 h-full">
            <div className="absolute top-2 right-2 px-2 py-1 bg-indigo-500 text-white text-xs font-semibold rounded z-10">
              SERVICE
            </div>
            <div className="p-4 flex-1">
              <div className="flex items-center mb-2">
                {serviceHit.icon && <span className="mr-2 text-lg">🔧</span>}
                <h3 className="text-lg font-bold text-indigo-900">{serviceHit.name}</h3>
              </div>
              <p className="text-sm text-gray-700 line-clamp-3 mb-3">{serviceHit.description}</p>
              {serviceHit.service_items && serviceHit.service_items.length > 0 && (
                <p className="text-xs text-indigo-600">{serviceHit.service_items.length} service items available</p>
              )}
            </div>
          </div>
        );
      }

      case 'project': {
        const projectHit = hit as ProjectHit;
        const description = projectHit.description?.[0]?.children?.[0]?.text || '';
        return (
          <div className="relative flex flex-col bg-orange-50 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border-l-4 border-orange-500 h-full">
            <div className="absolute top-2 right-2 px-2 py-1 bg-orange-500 text-white text-xs font-semibold rounded z-10">
              PROJECT
            </div>
            {projectHit.image?.url && (
              <ImageWithFallback
                src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${projectHit.image.url}`}
                alt={projectHit.name}
                fallbackSrc="https://placehold.co/300x200/F97316/FFFFFF?text=Project"
                width={300}
                height={200}
                className="object-cover"
              />
            )}
            <div className="p-4 flex-1">
              <h3 className="text-lg font-bold mb-2 text-orange-900">{projectHit.name}</h3>
              {projectHit.category && <p className="text-sm text-orange-600 font-medium mb-2">{projectHit.category.text}</p>}
              <p className="text-sm text-gray-700 line-clamp-3 mb-3">{description}</p>
              <div className="flex gap-2 text-xs">
                {projectHit.repourl && (
                  <a href={projectHit.repourl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline" onClick={(e) => e.stopPropagation()}>
                    📂 Repo
                  </a>
                )}
                {projectHit.hostedurl && (
                  <a href={projectHit.hostedurl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline" onClick={(e) => e.stopPropagation()}>
                    🌐 Live
                  </a>
                )}
              </div>
            </div>
          </div>
        );
      }

      case 'post': {
        const postHit = hit as PostHit;
        return (
          <div className="relative flex flex-col bg-rose-50 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border-l-4 border-rose-500 h-full">
            <div className="absolute top-2 right-2 px-2 py-1 bg-rose-500 text-white text-xs font-semibold rounded z-10">
              BLOG POST
            </div>
            {postHit.image?.url && (
              <ImageWithFallback
                src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${postHit.image.url}`}
                alt={postHit.title}
                fallbackSrc="https://placehold.co/300x200/F43F5E/FFFFFF?text=Blog+Post"
                width={300}
                height={200}
                className="object-cover"
              />
            )}
            <div className="p-4 flex-1">
              <h3 className="text-lg font-bold mb-2 text-rose-900">{postHit.title}</h3>
              {postHit.category && <p className="text-sm text-rose-600 font-medium mb-2">{postHit.category.text}</p>}
              <p className="text-sm text-gray-700 line-clamp-3 mb-3">{postHit.description}</p>
              <div className="flex justify-between text-xs text-gray-500 mt-auto">
                {postHit.author && (
                  <span>👤 {postHit.author.firstname} {postHit.author.lastname}</span>
                )}
                {postHit.views && <span>👁️ {postHit.views} views</span>}
              </div>
            </div>
          </div>
        );
      }

      case 'page': {
        const pageHit = hit as PageHit;
        return (
          <div className="relative flex flex-col bg-cyan-50 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border-l-4 border-cyan-500 h-full">
            <div className="absolute top-2 right-2 px-2 py-1 bg-cyan-500 text-white text-xs font-semibold rounded z-10">
              PAGE
            </div>
            <div className="p-4 flex-1">
              <h3 className="text-lg font-bold mb-2 text-cyan-900">{pageHit.title}</h3>
              <p className="text-sm text-gray-700 line-clamp-3">{pageHit.description}</p>
              <p className="text-xs text-cyan-600 mt-2">/{pageHit.slug}</p>
            </div>
          </div>
        );
      }

      case 'logo': {
        const logoHit = hit as LogoHit;
        return (
          <div className="relative flex flex-col bg-gray-50 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border-l-4 border-gray-500 h-full">
            <div className="absolute top-2 right-2 px-2 py-1 bg-gray-500 text-white text-xs font-semibold rounded z-10">
              LOGO
            </div>
            {logoHit.image?.url && (
              <ImageWithFallback
              src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${logoHit.image.url}`}
              alt={`${logoHit.company} logo`}
              fallbackSrc="https://placehold.co/300x200/6B7280/FFFFFF?text=Logo"
              fill
              className="object-contain bg-white p-4"
              sizes="(max-width: 768px) 100vw, 300px"
            />
            )}
            <div className="p-4 flex-1">
              <h3 className="text-lg font-bold mb-2 text-gray-900">{logoHit.company}</h3>
            </div>
          </div>
        );
      }

      case 'industry': {
        const industryHit = hit as IndustryHit;
        return (
          <div className="relative flex flex-col bg-emerald-50 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border-l-4 border-emerald-500 h-full">
            <div className="absolute top-2 right-2 px-2 py-1 bg-emerald-500 text-white text-xs font-semibold rounded z-10">
              INDUSTRY
            </div>
            <div className="p-4 flex-1">
              <div className="flex items-center mb-2">
                {industryHit.icon && <span className="mr-2 text-lg">🏢</span>}
                <h3 className="text-lg font-bold text-emerald-900">{industryHit.name}</h3>
              </div>
              <p className="text-sm text-gray-700 line-clamp-3 mb-3">{industryHit.description}</p>
              <div className="flex gap-4 text-xs text-emerald-600">
                {industryHit.challenges && <span>{industryHit.challenges.length} challenges</span>}
                {industryHit.solutions && <span>{industryHit.solutions.length} solutions</span>}
              </div>
            </div>
          </div>
        );
      }

      case 'free-resource': {
        const resourceHit = hit as FreeResourceHit;
        return (
          <div className="relative flex flex-col bg-yellow-50 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border-l-4 border-yellow-500 h-full">
            <div className="absolute top-2 right-2 px-2 py-1 bg-yellow-500 text-white text-xs font-semibold rounded z-10">
              FREE RESOURCE
            </div>
            <div className="p-4 flex-1">
              <h3 className="text-lg font-bold mb-2 text-yellow-900">Free Resource</h3>
              <div className="text-sm text-blue-600 hover:underline break-all">
                {resourceHit.url}
              </div>
            </div>
          </div>
        );
      }

      case 'faq': {
        const faqHit = hit as FAQHit;
        return (
          <div className="relative flex flex-col bg-teal-50 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border-l-4 border-teal-500 h-full">
            <div className="absolute top-2 right-2 px-2 py-1 bg-teal-500 text-white text-xs font-semibold rounded z-10">
              FAQ
            </div>
            <div className="p-4 flex-1">
              <h3 className="text-lg font-bold mb-2 text-teal-900">❓ {faqHit.question}</h3>
              {faqHit.answer && <p className="text-sm text-gray-700 line-clamp-3">{faqHit.answer}</p>}
            </div>
          </div>
        );
      }

      case 'category': {
        const categoryHit = hit as CategoryHit;
        return (
          <div className="relative flex flex-col bg-violet-50 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border-l-4 border-violet-500 h-full">
            <div className="absolute top-2 right-2 px-2 py-1 bg-violet-500 text-white text-xs font-semibold rounded z-10">
              CATEGORY
            </div>
            <div className="p-4 flex-1">
              <h3 className="text-lg font-bold mb-2 text-violet-900">{categoryHit.text}</h3>
              <p className="text-sm text-gray-700 line-clamp-2 mb-2">{categoryHit.description}</p>
              {categoryHit.job && (
                <div className="mt-2 p-2 bg-violet-100 rounded">
                  <p className="text-xs text-violet-700 font-medium">{categoryHit.job.title}</p>
                  <p className="text-xs text-violet-600">{categoryHit.job.jobtype}</p>
                </div>
              )}
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <LinkWrapper hit={hit}>
      {renderContent()}
    </LinkWrapper>
  );
}

// Hook for unified search across multiple indexes
function useUnifiedSearch(
    query: string,
    options: { hitsPerIndex?: number } = {}
    ) {
    const [results, setResults] = useState<UnifiedHit[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { hitsPerIndex = 5 } = options;

    const debouncedQuery = useMemo(() => {
        const timeout = setTimeout(() => query, 300);
        return query;
    }, [query]);

    useEffect(() => {
        if (!debouncedQuery.trim()) {
        setResults([]);
        setError(null);
        return;
        }

        setLoading(true);
        setError(null);

        const searches = [
        { indexName: "production_api::job.job", query: debouncedQuery, hitsPerPage: hitsPerIndex },
        { indexName: "production_api::testimonial.testimonial", query: debouncedQuery, hitsPerPage: hitsPerIndex },
        { indexName: "production_api::success-story.success-story", query: debouncedQuery, hitsPerPage: hitsPerIndex },
        { indexName: "production_api::service.service", query: debouncedQuery, hitsPerPage: hitsPerIndex },
        { indexName: "production_api::project.project", query: debouncedQuery, hitsPerPage: hitsPerIndex },
        { indexName: "production_api::post.post", query: debouncedQuery, hitsPerPage: hitsPerIndex },
        { indexName: "production_api::page.page", query: debouncedQuery, hitsPerPage: hitsPerIndex },
        { indexName: "production_api::logo.logo", query: debouncedQuery, hitsPerPage: hitsPerIndex },
        { indexName: "production_api::industry.industry", query: debouncedQuery, hitsPerPage: hitsPerIndex },
        { indexName: "production_api::free-resource.free-resource", query: debouncedQuery, hitsPerPage: hitsPerIndex },
        { indexName: "production_api::faq.faq", query: debouncedQuery, hitsPerPage: hitsPerIndex },
        { indexName: "production_api::category.category", query: debouncedQuery, hitsPerPage: hitsPerIndex }
        ];

        searchClient
        .search(searches)
        .then((response) => {
            const [
            jobResults,
            testimonialResults,
            successStoryResults,
            serviceResults,
            projectResults,
            postResults,
            pageResults,
            logoResults,
            industryResults,
            freeResourceResults,
            faqResults,
            categoryResults
            ] = response.results as [
            SearchResponse<JobHit>,
            SearchResponse<TestimonialHit>,
            SearchResponse<SuccessStoryHit>,
            SearchResponse<ServiceHit>,
            SearchResponse<ProjectHit>,
            SearchResponse<PostHit>,
            SearchResponse<PageHit>,
            SearchResponse<LogoHit>,
            SearchResponse<IndustryHit>,
            SearchResponse<FreeResourceHit>,
            SearchResponse<FAQHit>,
            SearchResponse<CategoryHit>
            ];

            const allHits: UnifiedHit[] = [
            ...jobResults.hits.map((hit) => ({ ...hit, type: "job" as const, _searchIndex: "job" as const })),
            ...testimonialResults.hits.map((hit) => ({ ...hit, type: "testimonial" as const, _searchIndex: "testimonial" as const })),
            ...successStoryResults.hits.map((hit) => ({ ...hit, type: "success-story" as const, _searchIndex: "success-story" as const })),
            ...serviceResults.hits.map((hit) => ({ ...hit, type: "service" as const, _searchIndex: "service" as const })),
            ...projectResults.hits.map((hit) => ({ ...hit, type: "project" as const, _searchIndex: "project" as const })),
            ...postResults.hits.map((hit) => ({ ...hit, type: "post" as const, _searchIndex: "post" as const })),
            ...pageResults.hits.map((hit) => ({ ...hit, type: "page" as const, _searchIndex: "page" as const })),
            ...logoResults.hits.map((hit) => ({ ...hit, type: "logo" as const, _searchIndex: "logo" as const })),
            ...industryResults.hits.map((hit) => ({ ...hit, type: "industry" as const, _searchIndex: "industry" as const })),
            ...freeResourceResults.hits.map((hit) => ({ ...hit, type: "free-resource" as const, _searchIndex: "free-resource" as const })),
            ...faqResults.hits.map((hit) => ({ ...hit, type: "faq" as const, _searchIndex: "faq" as const })),
            ...categoryResults.hits.map((hit) => ({ ...hit, type: "category" as const, _searchIndex: "category" as const }))
            ];

            const sortedHits = allHits.sort((a, b) => {
            const scoreA = a._rankingInfo?.nbTypos || 0;
            const scoreB = b._rankingInfo?.nbTypos || 0;
            return scoreA - scoreB;
            });

            setResults(sortedHits);
        })
        .catch((err) => {
            console.error("Search error:", err);
            setError("Search failed. Please try again.");
            setResults([]);
        })
        .finally(() => setLoading(false));
    }, [debouncedQuery, hitsPerIndex]);

    return { results, loading, error };
    }

// Search statistics component
function SearchStats({ results, query, loading }: { 
  results: UnifiedHit[], 
  query: string, 
  loading: boolean 
}) {
  if (loading || !query.trim()) return null;

  const stats = results.reduce((acc, hit) => {
    acc[hit.type] = (acc[hit.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="mb-4 text-sm text-gray-600 bg-white p-3 rounded-lg shadow">
      <span className="font-medium">{results.length}</span> results found for &quot;{query}&quot;
      <div className="flex flex-wrap gap-2 mt-2">
        {Object.entries(stats).map(([type, count]) => (
          <span key={type} className="px-2 py-1 bg-gray-100 rounded text-xs">
            {type.replace('-', ' ')}: {count}
          </span>
        ))}
      </div>
    </div>
  );
}

// Filter component
function SearchFilters({ 
  onFilterChange, 
  activeFilters 
}: { 
  onFilterChange: (filters: string[]) => void,
  activeFilters: string[]
}) {
  const filterOptions = [
    { value: 'job', label: 'Jobs', color: 'green' },
    { value: 'testimonial', label: 'Testimonials', color: 'blue' },
    { value: 'success-story', label: 'Success Stories', color: 'purple' },
    { value: 'service', label: 'Services', color: 'indigo' },
    { value: 'project', label: 'Projects', color: 'orange' },
    { value: 'post', label: 'Blog Posts', color: 'rose' },
    { value: 'page', label: 'Pages', color: 'cyan' },
    { value: 'logo', label: 'Logos', color: 'gray' },
    { value: 'industry', label: 'Industries', color: 'emerald' },
    { value: 'free-resource', label: 'Free Resources', color: 'yellow' },
    { value: 'faq', label: 'FAQs', color: 'teal' },
    { value: 'category', label: 'Categories', color: 'violet' }
  ];

  const toggleFilter = (filter: string) => {
    const newFilters = activeFilters.includes(filter)
      ? activeFilters.filter(f => f !== filter)
      : [...activeFilters, filter];
    onFilterChange(newFilters);
  };

  const colorClasses = {
    green: 'bg-green-500 hover:bg-green-600',
    blue: 'bg-blue-500 hover:bg-blue-600',
    purple: 'bg-purple-500 hover:bg-purple-600',
    indigo: 'bg-indigo-500 hover:bg-indigo-600',
    orange: 'bg-orange-500 hover:bg-orange-600',
    rose: 'bg-rose-500 hover:bg-rose-600',
    cyan: 'bg-cyan-500 hover:bg-cyan-600',
    gray: 'bg-gray-500 hover:bg-gray-600',
    emerald: 'bg-emerald-500 hover:bg-emerald-600',
    yellow: 'bg-yellow-500 hover:bg-yellow-600',
    teal: 'bg-teal-500 hover:bg-teal-600',
    violet: 'bg-violet-500 hover:bg-violet-600'
  };

  return (
    <div className="mb-4">
      <div className="flex flex-wrap gap-2 mb-2">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => toggleFilter(option.value)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              activeFilters.includes(option.value)
                ? `${colorClasses[option.color as keyof typeof colorClasses]} text-white`
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
      {activeFilters.length > 0 && (
        <button
          onClick={() => onFilterChange([])}
          className="text-xs text-gray-500 hover:text-gray-700 underline"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}

// Main search component
export default function UnifiedSearchComponent() {
  const router = useRouter(); // <-- Initialize useRouter
  const searchParams = useSearchParams(); // <-- Initialize useSearchParams
  const urlQuery = searchParams.get('q') || ''; // <-- Get the 'q' parameter
  
  const [query, setQuery] = useState(urlQuery);
  const [filters, setFilters] = useState<string[]>([]);
  const [hitsPerIndex, setHitsPerIndex] = useState(5);
  const { results, loading, error } = useUnifiedSearch(query, { hitsPerIndex });

  // Sync internal state with URL query parameter on initial load or URL change
  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);

  // Handle input change and update the URL
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    
    // Update URL with new query parameter
    const newSearchParams = new URLSearchParams(searchParams);
    if (newQuery) {
      newSearchParams.set('q', newQuery);
    } else {
      newSearchParams.delete('q');
    }
    router.replace(`?${newSearchParams.toString()}`);
  };

  // Apply client-side filtering
  const filteredResults = useMemo(() => {
    if (filters.length === 0) return results;
    return results.filter(hit => filters.includes(hit.type));
  }, [results, filters]);

  return (
    <div>
      {/* Search Input */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search across all content types..."
            value={query}
            onChange={handleInputChange} // <-- Use the new handler
            className="w-full p-4 pr-12 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {loading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            ) : (
              <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      {query.trim() && (
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Results per type:</label>
            <select
              value={hitsPerIndex}
              onChange={(e) => setHitsPerIndex(Number(e.target.value))}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={3}>3</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>
      )}

      {/* Filters */}
      {query.trim() && (
        <SearchFilters 
          onFilterChange={setFilters} 
          activeFilters={filters}
        />
      )}

      {/* Error State */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Search Stats */}
      <SearchStats results={filteredResults} query={query} loading={loading} />

      {/* Results */}
      {query.trim() && !loading && (
        <div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredResults.map((hit, index) => (
              <UnifiedHitComponent key={`${hit.objectID}-${hit._searchIndex}-${index}`} hit={hit} />
            ))}
          </div>
          
          {filteredResults.length === 0 && !error && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.462-.743-6.21-2.009A7.962 7.962 0 014 9c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8-8-3.582-8-8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-500">Try adjusting your search terms or filters</p>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!query.trim() && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900 dark:text-gray-400 mb-2">Unified Content Search</h3>
          <p className="text-gray-500 mb-4">Search across jobs, testimonials, success stories, services, projects, blog posts, pages, logos, industries, free resources, FAQs, and categories</p>
          
          {/* Content Type Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 max-w-4xl mx-auto text-xs">
            <div className="p-2 bg-green-50 rounded border-l-2 border-green-500">
              <div className="font-medium text-green-800">Jobs</div>
            </div>
            <div className="p-2 bg-blue-50 rounded border-l-2 border-blue-500">
              <div className="font-medium text-blue-800">Testimonials</div>
            </div>
            <div className="p-2 bg-purple-50 rounded border-l-2 border-purple-500">
              <div className="font-medium text-purple-800">Success Stories</div>
            </div>
            <div className="p-2 bg-indigo-50 rounded border-l-2 border-indigo-500">
              <div className="font-medium text-indigo-800">Services</div>
            </div>
            <div className="p-2 bg-orange-50 rounded border-l-2 border-orange-500">
              <div className="font-medium text-orange-800">Projects</div>
            </div>
            <div className="p-2 bg-rose-50 rounded border-l-2 border-rose-500">
              <div className="font-medium text-rose-800">Blog Posts</div>
            </div>
            <div className="p-2 bg-cyan-50 rounded border-l-2 border-cyan-500">
              <div className="font-medium text-cyan-800">Pages</div>
            </div>
            <div className="p-2 bg-gray-50 rounded border-l-2 border-gray-500">
              <div className="font-medium text-gray-800">Logos</div>
            </div>
            <div className="p-2 bg-emerald-50 rounded border-l-2 border-emerald-500">
              <div className="font-medium text-emerald-800">Industries</div>
            </div>
            <div className="p-2 bg-yellow-50 rounded border-l-2 border-yellow-500">
              <div className="font-medium text-yellow-800">Free Resources</div>
            </div>
            <div className="p-2 bg-teal-50 rounded border-l-2 border-teal-500">
              <div className="font-medium text-teal-800">FAQs</div>
            </div>
            <div className="p-2 bg-violet-50 rounded border-l-2 border-violet-500">
              <div className="font-medium text-violet-800">Categories</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
