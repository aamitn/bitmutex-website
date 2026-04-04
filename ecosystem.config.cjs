module.exports = {
  apps: [
    {
      name: "bitmutex-strapi",
      cwd: "./server",
      // Direct path to the strapi binary
      script: "./node_modules/@strapi/strapi/bin/strapi.js",
      args: "start",
      env_file: "./.env",
      out_file: "./logs/strapi-out.log",
      error_file: "./logs/strapi-error.log",
      log_file: "./logs/strapi-combined.log",
      merge_logs: true,
      autorestart: true,
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "bitmutex-nextjs",
      cwd: "./client",
      // Direct path to the next binary
      script: "./node_modules/next/dist/bin/next",
      args: "start -p 3000",
      env_file: "./.env",
      out_file: "./logs/next-out.log",
      error_file: "./logs/next-error.log",
      log_file: "./logs/next-combined.log",
      merge_logs: true,
      autorestart: true,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};