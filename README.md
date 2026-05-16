# BM Site - Batteries Included Business Starter Template : Strapi5 + Next16 + React19 +  Postgres17 + SocketIO + SSR & RSC Goodness

**Bitmutex-Website** - A `modern`, `cloud-native` `ready-to-use` business website `starter template` with all the batteries included from SEO to Reusable Blocks. Built using `Strapi 5` at Backend and `NextJs 16 SSR/AppRouter/RSC` with `React 19` in Frontend as a BFF (Backend For Frontend) alongside `Postgres17` as DB. Supports Latest Node 24 LTS with cloud native and bare-metal deployment options.

[![Better Stack Badge](https://uptime.betterstack.com/status-badges/v1/monitor/1mjch.svg)](https://uptime.betterstack.com/?utm_source=status_badge)
[![Deploy Strapi & Next.js via SSH](https://github.com/aamitn/bitmutex-website/actions/workflows/deploy.yml/badge.svg)](https://github.com/aamitn/bitmutex-website/actions/workflows/deploy.yml)
[![Build & Publish Docker Image](https://github.com/aamitn/bitmutex-website/actions/workflows/docker_publish.yml/badge.svg)](https://github.com/aamitn/bitmutex-website/actions/workflows/docker_publish.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=aamitn_bitmutex-website&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=aamitn_bitmutex-website)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=aamitn_bitmutex-website&metric=bugs)](https://sonarcloud.io/summary/new_code?id=aamitn_bitmutex-website)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=aamitn_bitmutex-website&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=aamitn_bitmutex-website)
[![Docker Hub](https://img.shields.io/badge/Docker%20Hub-bitmutex%2Fbm--site-blue?logo=docker)](https://hub.docker.com/r/bitmutex/bm-site)
![Docker Pulls](https://img.shields.io/docker/pulls/bitmutex/bm-site)
![Docker Image Size](https://img.shields.io/docker/image-size/bitmutex/bm-site/latest)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=aamitn_bitmutex-website&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=aamitn_bitmutex-website)
[![GitHub release](https://img.shields.io/github/v/release/aamitn/bitmutex-website)](https://github.com/aamitn/bitmutex-website/releases/latest)
[![GitHub release](https://img.shields.io/github/v/release/aamitn/bitmutex-website?include_prereleases)](https://github.com/aamitn/bitmutex-website/releases)

<!--

[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=aamitn_bitmutex-website&metric=coverage)](https://sonarcloud.io/summary/new_code?id=aamitn_bitmutex-website)
-->

 Manually [DOWNLOAD](https://github.com/aamitn/bitmutex-website/releases/download/INTERNAL-0/seed-data.tar.gz) INIT SEED DATA and `must be placed in repo root` for versions below `2.8.40` . Data in [this](https://github.com/aamitn/bitmutex-website/releases/tag/INTERNAL-0) internal releae

## SINGLE COMMAND DEPLOY 🛠️📦🚀

- For  macOS / Linux(Bash)
```sh
curl -sL https://raw.githubusercontent.com/aamitn/bitmutex-website/main/scripts/install.sh | bash
```

- For Windows (PowerShell)
```sh
irm https://raw.githubusercontent.com/aamitn/bitmutex-website/main/scripts/install.ps1 | iex
```

- For Windows (CMD)
```sh
powershell -ExecutionPolicy Bypass -NoProfile -Command "irm https://raw.githubusercontent.com/aamitn/bitmutex-website/main/scripts/install.ps1 | iex"

OR

curl -fsSL https://raw.githubusercontent.com/aamitn/bitmutex-website/main/scripts/install.ps1 | powershell -ExecutionPolicy Bypass -NoProfile -
```
<img src="https://gitlab.com/aamitn/assets/-/raw/main/bm-site-data/lighthouse.png" width="450" height="auto">


| Screenshot | Illustration |
|------------|--------------|
| <img src="https://gitlab.com/aamitn/assets/-/raw/main/bm-site-data/ss.png" width="450" height="250"> | <img src="https://github.com/aamitn/bitmutex-website/releases/download/INTERNAL-0/illustration.gif" width="450" height="250"> |

<img src="https://gitlab.com/aamitn/assets/-/raw/main/bm-site-data/ER_Diagram.png" width="800" height="auto">


## 🚀 Features
-  **Strapi 5 CMS** (Headless API-driven backend)
-  **Next.js 16** (Fast, SSR-capable frontend)
-  **PostgreSQL 17** (Database for Strapi)
-  **Docker-Compose Support** (For seamless development & deployment)
-  **Native Built-In Live Chat to Discord** (Powered by Socket.io integrated within strapi, No 3rd Party Service/Embed/Widgets)
-  **Strapi Auto-Admin User Creation** (Creates admin user on first run)
-  **Health Check & Auto-Restart** (Ensures services stay healthy)
-  **Sitewide Dynamic SEO** (with Strapi SEO Plugin Integration)
-  **Multiple Custom Collections, Reusable Blocks and Single Types**
-  **Real-Time Features** (Provides live website visitor count)


## 📂 Project Structure
```
📦 bitmutex-website
├── 📂 client # Next.js frontend
		├── Dockerfile
├── 📂 server # Strapi backend (Backend CMS)
		├── Dockerfile
├── 📜 copy-env.mts # Used by root level project package.json for auto copying of .env.example to .env in both `client` and `server` folders
├── 📜 docker-compose.yml # Container configuration
├── 📜 seed-data.tar.gz # Database seed (must be imported manually for data reproducability)
├── 📜 ecosystem.config.cjs (Used for production deployments with PM2)
├── 📜 package.json (root level dependencies to initialize setup of client and server apps)
├── 📜 package.lock.json (npm lockfile)
├── 📜 yarn.lock(yarn lockfile, YARN is preferred for this project )
└── 📜 README.md # This file
```

## Available Commands

| Location        | Command              | Description |
|-----------------|----------------------|-------------|
| **Project Root** | `pnpm client`        | Run the **client** development server from the project root. |
|                 | `pnpm server`        | Run the **server** development server from the project root. |
|                 | `pnpm setup:client`  | Install dependencies for the client and copy `.env` file. |
|                 | `pnpm setup:server`  | Install dependencies for the server and copy `.env` file. |
|                 | `pnpm spawn`         | Install dependencies for root, client, and server in one go. |
|                 | `pnpm dev`           | Start **Strapi** (server) and **Next.js** (client) in parallel for development. |
|                 | `pnpm build`         | Build both server and client in parallel, start server, and exit on build result. |
|                 | `pnpm start`         | Start server and client in parallel (production mode). |
|                 | `pnpm seed`          | Import seed data into Strapi from `seed-data.tar.gz`. |
|                 | `pnpm export`        | Export Strapi data without encryption to `seed-data`. |
|                 | `pnpm repo:upstream` | Fetch and merge latest changes from `upstream/main`. |
|                 | `pnpm repo:sync`     | Pull the latest changes from `origin/main`. |
|                 | `pnpm backup`        | Uploads Strapi export `seed-data.tar.gz` to Cloudflare R2 Storage |
|                 | `pnpm clean`        | Removes root and client , server folder's node_modules, dist, build, .turbo and other static folders |
|                 | `pnpm deepclean`        | Same as clean with added lockfile removal |
| **Backend Server**      | `pnpm develop`       | Start Strapi in development mode. |
|                 | `pnpm start`         | Start Strapi in production mode. |
|                 | `pnpm build`         | Build Strapi project. |
|                 | `pnpm strapi`        | Run Strapi CLI commands. |
|                 | `pnpm deploy`        | Deploy the Strapi project. |
| **Frontend Client**      | `pnpm dev`           | Start Next.js in development mode using Turbopack. |
|                 | `pnpm build`         | Build the Next.js application for production. |
|                 | `pnpm start`         | Start Next.js in production mode. |
|                 | `pnpm lint`          | Run ESLint to check for code quality issues. |

  
## ⚙️Setup Instructions

 0️⃣ 1-Step Docker Deploy 
 ```sh
 git clone --depth=1 https://github.com/aamitn/bitmutex-website.git && cd bitmutex-website && docker compose up
```
##### Read docker build instructions [DOCKER.md](/DOCKER.md) , for Kubernetes Deployments and Helm Charts Read [K8S.md](/K8S.md)  


### 1️⃣ **Clone the Repository**
```sh
git clone --depth=1 https://github.com/aamitn/bitmutex-website.git
cd  bitmutex-website
```
##### omit the `--depth=1` if you want to download the repo with lifetime git history , genrally required for devs contributing to this project


### 2️⃣ **Install Dependencies and Setup Env File**

```sh
pnpm spawn
```
This will run pnpm install  and also copies .env.example to .env on both `client` and `server` directories. After this step `setup your .env` vars accordingly on the auto-generated file.  Create your databases as required. Schema will be auto-generated by Strapi.
- Set `DATABASE_CLIENT=postgres/mysql/sqlite`
- Go to `/server/config/database.ts` and provide DB Credentials there


### 3️⃣ **Run Strapi and Next initially to create strapi DB schemas**
  ```
 pnpm dev
  ```
- After running this strapi should start, go to `http://localhost:1337` and create admin user
- Ctrl-C to stop both strapi and next
- For Local Dev , in /server (Strapi) folder , edit `config/server.ts` and comment out the below line:
```bash
url: 'https://strapiadmin.bitmutex.com', //backend fqdn url //comment for local-dev
```

### 4️⃣ **Import/Seed DB**
You may run this on the project root,
  ```
 pnpm seed
  ```
  or you may run this in `server` directory by doing `cd server`
  ```sh
 pnpm strapi import -f ../seed-data.tar.gz --force
  ```
 After running this strapi should strart, go to `http://localhost:1337` and create admin user


### 5️⃣.1️⃣  **Finally Start the application for development**
  ```sh
pnpm dev
  ```
  This will start both strapi and nextjs  in development mode (next will have `live refresh` and `watch` enabled)

### 5️⃣.1️⃣  **Start the application in prod mode**
  ```sh
pnpm build  OR pnpm turbo build --no-cache
pnpm start
  ```
  This will start both strapi and nextjs  in production mode, no debugging.
 
### 6️⃣  **Build for Production**
- Change your .env vars accordingly for production use case
- Go to project root and run `pnpm build`
- Ensure build is successful adn run `pnpm start`
> To run in cloud VPS/Hosting, use `pm2` , just close any other running instances
  -- Navigate to project root and run `pm2 start ecosystem.config.cjs`
  -- Run `pm2 list` to check status and go to [`http://localhost:1337] and [http://localhost:3001]`
  -- If all started successfully, then autostart the app on machine restart using `pm2 save` and `pm2 startup`
> If using  `oxmgr` , just close any other running instances
  -- Navigate to project root and run `oxmgr apply oxfile.toml`
  -- Run `pm2 list` to check status and go to [`http://localhost:1337] and [http://localhost:3001]`
  -- If all started successfully, then autostart the app on machine restart using `oxmgr service install` and `oxmgr ui` to monitor. 
  commands.
> Use `/server/src/admin/vite.config.ts` `/server/config/server.ts` to control admin dashboard domain access

### 7️⃣  **Upgrade Strapi to Latest Version**
  ```sh
  npx @strapi/upgrade latest 
  OR
  pnpx @strapi/upgrade latest 
  ```
  This will upgrade  strapi to its latest version. More info [here](https://docs.strapi.io/cms/upgrade-tool)

### 8️⃣ **Export DB**
You may run this on the project root,
  ```
 pnpm export
  ```
  or you may run this in `server` directory by doing `cd server`
  ```sh
  pnpm strapi export --no-encrypt -f ../seed-data
  ```
 After running this a file named `seed-data.tar.gz` will be created at project root


## ☁️ Cloud Native Setup Instructions

```sh
docker-compose  up  --build
```

This will start:
- PostgreSQL at `localhost:5432`
- Strapi CMS at `http://localhost:1337`
- Next.js Frontend at `http://localhost:3000`


## 🔑 Default Admin Credentials
> These credentials are created automatically when `AUTO_CREATE_ADMIN=true` in `docker-compose.yml` or `.env` inside `server` directory.

-  **Email**: `admin@bitmutex.com`
-  **Password**: `strapiadmin`   
🚨 **Change the default password after the first login!**


## 📞 Support
If you encounter issues, feel free to [ open an issue](https://github.com/aamitn/bitmutex-website/issues/new/choose).
Designed, Developed and Maintained by `Bitmutex Technologies`
