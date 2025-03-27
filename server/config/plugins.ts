
export default ({env}) => ({

  upload: {
    config: {
      sizeLimit: 50 * 1024 * 1024, // 50MB in bytes
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

});
