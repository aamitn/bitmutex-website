module.exports = {
  apps: [
    {
      name: "bitmutex-strapi",
      cwd: "./server",
      script: "./node_modules/@strapi/strapi/bin/strapi.js",
      args: "start",
      env_file: "./.env",
      out_file: "./logs/strapi-out.log",
      error_file: "./logs/strapi-error.log",
      log_file: "./logs/strapi-combined.log",
      merge_logs: true,
      autorestart: true,
      // Production Additions:
      max_memory_restart: "2G", // Restarts if memory exceeds 1 Gigabyte
      exp_backoff_restart_delay: 100, // Delays restart progressively if the app crash-loops
      kill_timeout: 5000, // Gives Strapi 5 seconds to finish processing requests before shutting down
      instances: 1, // Keep Strapi at 1 instance (fork mode) to avoid database lock/file upload issues
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "bitmutex-nextjs",
      cwd: "./client",
      script: "./node_modules/next/dist/bin/next",
      args: "start -p 3137",
      env_file: "./.env",
      out_file: "./logs/next-out.log",
      error_file: "./logs/next-error.log",
      log_file: "./logs/next-combined.log",
      merge_logs: true,
      autorestart: true,
      // Production Additions:
      max_memory_restart: "2G", // Next.js frontend usually requires less memory
      exp_backoff_restart_delay: 100, 
      kill_timeout: 3000, 
      instances: "max", // Scales Next.js across all available CPU cores for better traffic handling
      exec_mode: "cluster", 
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
