module.exports = {
  apps: [
    {
      name: "strapi-next-app",
      cwd: "./",
      script: process.platform === "win32" ? "cmd" : "yarn",
      args: process.platform === "win32" ? "/c yarn start" : "start",
      env_file: "./.env",
      out_file: "./logs/app-out.log",
      error_file: "./logs/app-error.log",
      log_file: "./logs/app-combined.log",
      merge_logs: true,
      instances: 1,
      watch: false,
      autorestart: true,
      max_memory_restart: "1G",
    },
  ],
};
