
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

});
