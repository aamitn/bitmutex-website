# Docker Deployment Guide

This monorepo runs **Strapi 5 + Next.js 16 + PostgreSQL 17** in Docker.  
Strapi and Next.js share a single container; Postgres runs in a sidecar.

---

## Files to add to the repo root

| File | Purpose |
|---|---|
| `Dockerfile` | Multi-stage build for the monorepo |
| `docker-compose.yml` | Orchestrates app + postgres services |
| `.dockerignore` | Keeps the build context lean |
| `.env.docker.example` | Template — copy to `.env` and fill in values |

---

## Quick start

```bash
# 1. Prepare environment
cp .env.docker.example .env
# Edit .env — fill in secrets, domains, SMTP, etc.

# 2. Build & start (first run takes several minutes)
docker compose up --build -d

# 3. Tail logs
docker compose logs -f
```

Strapi admin panel → **http://localhost:1337/admin**  
Next.js frontend  → **http://localhost:3000**

---

## Seeding the database

Put `seed-data.tar.gz` (exported via `pnpm export`) in the repo root,  
then uncomment the volume mount in `docker-compose.yml`:

```yaml
volumes:
  - ./seed-data.tar.gz:/app/seed-data.tar.gz:ro
```


---

## How the build works

```
[deps stage]         install all workspace deps with pnpm
      │
[strapi-build]       pnpm turbo build --filter=backend
      │
[production image]   copy source + pre-built Strapi dist
                     pnpm install --prod
```

**At container start** (via `CMD` in Dockerfile):

1. Checks for seed lockfile (`server/public/.seed_lock`)
   - If missing: Seeds the database and creates the lock
   - If exists: Skips seeding (already done)
2. Checks if `client/.next/BUILD_ID` exists in persistent volume
   - If missing: Full build (`pnpm build`)
   - If exists: Skips build and uses cached volume (fast boot!)
3. Starts the application (`pnpm startci`)

> **Why build Next at runtime?**  
> `next build` makes API calls to Strapi for static generation. Strapi must  
> be running and connected to the database, which isn't possible during  
> a pure Docker image build. The startup script waits for Postgres/Strapi,  
> then builds Next.js if needed.

---

## Persistent volumes

| Volume | Contents |
|---|---|
| `postgres_data` | All database files |
| `strapi_uploads` | Uploaded media files (`server/public/uploads`) |

---

## Environment variable notes

| Variable | Notes |
|---|---|
| `STRAPI_BASE_URL` | Used by Next.js SSR internally — always `http://localhost:1337` inside the container |
| `NEXT_PUBLIC_STRAPI_BASE_URL` | Browser-facing URL — must be the public domain (needed for WebSockets) |
| `DATABASE_HOST` | Set to `postgres` (the Compose service name) automatically in `docker-compose.yml` |
| `SEED_DB` | Set `true` only on first boot, then revert to `false` |

---

## Useful commands

```bash
# Start
docker compose up

# Rebuild after code changes
docker compose up --build -d
OR 
docker compose build --no-cache

# Open a shell in the running app container
docker compose exec app sh

# Run Strapi CLI commands
docker compose exec -it app sh
OR
docker compose exec app sh -c "cd server && pnpm strapi <command>"

# Export data for backup
docker compose exec app sh -c "cd server && pnpm strapi export --no-encrypt -f /app/seed-data"
docker compose cp app:/app/seed-data.tar.gz ./seed-data.tar.gz

# Stop everything (preserves volumes)
docker compose down

# Full reset including volumes (⚠ destroys all data)
docker compose down -v
```


## Multi-Platform Buld and Publish

### One-Time Setup (Per Machine)

#### Create and activate a dedicated Buildx builder:
```sh
docker run --privileged --rm tonistiigi/binfmt --install all
```

#### Verify the builder is working correctly:
```sh
docker buildx create --name multi-builder --use
```

#### Enable cross-platform emulation support:
```sh
docker buildx inspect --bootstrap
```


### Build & Push Multi-Architecture Images

#### Enable cross-platform emulation support:
```sh
docker buildx build --platform linux/amd64,linux/arm64 -t bitmutex/
```

#### Enable cross-platform emulation support:
```sh
bm-site:latest -t bitmutex/bm-site:1.0.0 --push .
```

**`Single-Line-Build&Deploy`**: `docker buildx build --platform linux/amd64,linux/arm64 -t bitmutex/bm-site:latest -t bitmutex/bm-site:1.0.0 --push .`