
export default ({env}) => ({

  upload: {
    config: {
      sizeLimit: 50 * 1024 * 1024, // 50 MB in bytes
    },
  },

  seo: {
    enabled: true,
  },

  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST', 'smtp.zoho.com'),
        port: env('SMTP_PORT', 587),
        auth: {
          user: env('SMTP_USERNAME'),
          pass: env('SMTP_PASSWORD'),
        },
        // ... any custom nodemailer options
      },
      settings: {
        defaultFrom: env('SMTP_DEFAULT_FROM'),
        defaultReplyTo: env('SMTP_DEFAULT_REPLY_TO'),
      },
    },
  },

  'strapi-algolia': {
    enabled: true,
    config: {
      apiKey: env('ALGOLIA_ADMIN_KEY'),
      applicationId: env('ALGOLIA_APP_ID'),
      contentTypes: [
        { name: 'api::blog-page.blog-page' },
        { name: 'api::brand-kit.brand-kit' },
        { name: 'api::category.category' },
        { name: 'api::free-resource.free-resource' },
        { name: 'api::global.global' },
        { name: 'api::industries-page.industries-page' },
        { name: 'api::industry.industry' },
        { name: 'api::job.job' },
        { name: 'api::jobs-page.jobs-page' },
        { name: 'api::landing-page.landing-page' },
        { name: 'api::logo.logo' },
        {
           name: 'api::page.page',
          hideFields: [ 'blocks']
        },
        {
          name: 'api::post.post',
          hideFields: [ 'content','content1', 'content2']
        },
        {
          name: 'api::project.project',
          hideFields: [ 'details']
        },
        { name: 'api::projects-page.projects-page' },
        { 
          name: 'api::service.service',
           hideFields: [ 'techstacklogos','success_stories'] 
        },
        { name: 'api::services-page.services-page' },
        { name: 'api::stories-page.stories-page' },
        { 
          name: 'api::success-story.success-story',
          hideFields: [ 'casestudy',  'glimpses']
         },
        { name: 'api::testimonial.testimonial' },
        { name: 'api::faq.faq' },
      ],
    },
  },

  sentry: {
    enabled: true,
    config: {
      dsn: env('SENTRY_DSN'),
      sendMetadata: true,
      init: {
        environment: env('NODE_ENV'),
        release: 'bitmutex@1.0.0',
      },
    },
  },


  'strapi-cache': {
  enabled: true,
  config: {
      debug: false, // Enable debug logs
      max: 1000, // Maximum number of items in the cache (only for memory cache)
      ttl: 1000 * 60 * 60, // Time to live for cache items (1 hour)
      size: 1024 * 1024 * 1024, // Maximum size of the cache (1 GB) (only for memory cache)
      allowStale: false, // Allow stale cache items (only for memory cache)
      cacheableRoutes: [
        '/api/blog-pages',         // collection
        '/api/brand-kits',         // collection
        '/api/categories',         // collection
        '/api/free-resources',     // collection
        '/api/global',             // single
        '/api/industries-page',    // single
        '/api/industries',         // collection
        '/api/jobs',               // collection
        '/api/jobs-page',          // single
        '/api/landing-page',       // single
        '/api/logos',              // collection
        '/api/pages',              // collection
        '/api/posts',              // collection
        '/api/projects',           // collection
        '/api/projects-page',      // single
        '/api/services',           // collection
        '/api/services-page',      // single
        '/api/stories-page',       // single
        '/api/success-stories',    // collection
        '/api/testimonials',       // collection
        '/api/faqs'                // collection
      ],// Caches routes which start with these paths (if empty array, all '/api' routes are cached)
      provider: 'memory', // Cache provider ('memory' or 'redis')
      redisConfig: env('REDIS_URL', 'redis://localhost:6379'), // Redis config takes either a string or an object see https://github.com/redis/ioredis for references to what object is available, the object or string is passed directly to ioredis client (if using Redis)
      redisClusterNodes: [], // If provided any cluster node (this list is not empty), initialize ioredis redis cluster client. Each object must have keys 'host' and 'port'. See https://github.com/redis/ioredis for references
      redisClusterOptions: {}, // Options for ioredis redis cluster client. redisOptions key is taken from redisConfig parameter above if not set here. See https://github.com/redis/ioredis for references
      cacheHeaders: true, // Plugin also stores response headers in the cache (set to false if you don't want to cache headers)
      cacheHeadersDenyList: ['access-control-allow-origin', 'content-encoding'], // Headers to exclude from the cache (must be lowercase, if empty array, no headers are excluded, cacheHeaders must be true)
      cacheHeadersAllowList: ['content-type', 'content-security-policy'], // Headers to include in the cache (must be lowercase, if empty array, all headers are cached, cacheHeaders must be true)
      cacheAuthorizedRequests: false, // Cache requests with authorization headers (set to true if you want to cache authorized requests)
      cacheGetTimeoutInMs: 1000, // Timeout for getting cached data in milliseconds (default is 1 second)
      autoPurgeCache: true, // Automatically purge cache on content CRUD operations
      autoPurgeCacheOnStart: true, // Automatically purge cache on Strapi startup
  },
},

});
