# =============================================================================
# Base
# =============================================================================
FROM node:24-alpine

RUN apk add --no-cache libc6-compat openssl

RUN corepack enable && corepack prepare pnpm@11.1.2 --activate

ENV PNPM_HOME=/usr/local/share/pnpm
ENV PATH=$PNPM_HOME:$PATH

WORKDIR /app

# =============================================================================
# Copy workspace files & Install dependencies
# =============================================================================
COPY . .
ENV NODE_ENV=development
RUN pnpm install --frozen-lockfile

# =============================================================================
# Permissions & Env Setup
# =============================================================================
RUN mkdir -p /app/server/public/uploads
RUN chmod -R 777 /app/server/public

# Run copy script safely during build
RUN pnpm copy

EXPOSE 1337 3000

# =============================================================================
# Runtime (Smart Boot with Volume Caches)
# =============================================================================
# 1. Checks for a seed lockfile. If missing, seeds DB and creates the lock.
# 2. Checks if BUILD_ID exists in the persistent volume.
# 3. If missing: Full build using live Postgres data.
# 4. If exists: Fast boot!
CMD sh -c "\
  echo '===================================================' && \
  echo '🔍 Build Config - DISABLE_TYPECHECK is set to: '$DISABLE_TYPECHECK && \
  echo '===================================================' && \
  if [ ! -f 'server/public/.seed_lock' ]; then \
    echo '🌱 No database lock found: Seeding database...' && \
    pnpm seed && \
    touch server/public/.seed_lock; \
  else \
    echo '✅ Database already seeded: Skipping seed step.'; \
  fi && \
  if [ ! -f 'client/.next/BUILD_ID' ]; then \
    echo '🚀 First boot detected: Compiling Next.js with Postgres data...' && \
    pnpm build --env-mode=loose; \
  elif [ ! -d 'server/dist' ]; then \
    echo '🏗️ Next.js is cached, but Strapi build is missing: Compiling Strapi...' && \
    pnpm turbo run build --filter=backend --env-mode=loose; \
  else \
    echo '✅ Cached builds found for both frontend and backend: Skipping build steps completely.'; \
  fi && \
  pnpm startci \
"