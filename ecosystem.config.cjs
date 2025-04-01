module.exports = {
  apps: [
    {
      name: "bitmutex-strapi", // Strapi backend
      cwd: "./server", // Change directory to the server folder
      script: process.platform === "win32" ? "cmd" : "pnpm",
      args: process.platform === "win32" ? "/c pnpm develop" : "develop",
      env_file: "./.env",
      out_file: "./logs/strapi-out.log",
      error_file: "./logs/strapi-error.log",
      log_file: "./logs/strapi-combined.log",
      merge_logs: true,
      watch: false,
      autorestart: true,
      max_memory_restart: "2G",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "bitmutex-nextjs", // Next.js frontend
      cwd: "./client", // Change directory to the client folder
      script: process.platform === "win32" ? "cmd" : "pnpm",
      args: process.platform === "win32" ? "/c pnpm start -p 3001" : "start -p 3001",
      env_file: "./.env",
      out_file: "./logs/next-out.log",
      error_file: "./logs/next-error.log",
      log_file: "./logs/next-combined.log",
      merge_logs: true,
      watch: false,
      autorestart: true,
      max_memory_restart: "2G",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};