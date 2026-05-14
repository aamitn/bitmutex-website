#!/usr/bin/env bash

set -e

echo "Checking environment files..."

# ─────────────────────────────────────────────────────────────
# Download .env files if missing
# ─────────────────────────────────────────────────────────────

FILES=(
  ".env|https://raw.githubusercontent.com/aamitn/bitmutex-website/main/.env.example"
  "server/.env|https://raw.githubusercontent.com/aamitn/bitmutex-website/main/server/.env.example"
  "client/.env|https://raw.githubusercontent.com/aamitn/bitmutex-website/main/client/.env.example"
)

for entry in "${FILES[@]}"; do

  DEST="${entry%%|*}"
  URL="${entry##*|}"

  DIR=$(dirname "$DEST")

  mkdir -p "$DIR"

  if [ ! -f "$DEST" ]; then

    echo "Downloading $DEST..."

    curl -fsSL "$URL" -o "$DEST"

  else

    echo "$DEST already exists"

  fi

done

# ─────────────────────────────────────────────────────────────
# Generate docker-compose.yml
# ─────────────────────────────────────────────────────────────

echo "Initializing Bitmutex Stack deployment..."
echo "Generating docker-compose.yml..."

cat << 'EOF' > docker-compose.yml
name: bitmutex

services:

  # ── PostgreSQL ─────────────────────────────────────────────
  postgres:
    image: postgres:18-alpine

    restart: unless-stopped

    env_file:
      - .env

    environment:
      POSTGRES_DB: ${DATABASE_NAME:-strapi-bitmutex}
      POSTGRES_USER: ${DATABASE_USERNAME:-postgres}
      POSTGRES_PASSWORD: ${DATABASE_PASSWORD:-1234qwer}

    volumes:
      - postgres_data:/var/lib/postgresql

    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DATABASE_USERNAME:-postgres} -d ${DATABASE_NAME:-strapi-bitmutex}"]
      interval: 10s
      timeout: 5s
      retries: 5

    networks:
      - internal

  # ── App (Strapi + Next.js) ────────────────────────────────
  app:
    image: bitmutex/bm-site:latest

    restart: unless-stopped

    depends_on:
      postgres:
        condition: service_healthy

    env_file:
      - .env

    environment:
      DATABASE_HOST: postgres
      DATABASE_PORT: 5432
      DATABASE_CLIENT: postgres

      HOST: 0.0.0.0
      NODE_ENV: production
      DISABLE_TYPECHECK: "true"
      AUTO_CREATE_ADMIN: "false"

    ports:
      - "${STRAPI_PORT:-1337}:1337"
      - "${NEXT_PORT:-3000}:3000"

    volumes:
      - strapi_public:/app/server/public
      - next_build:/app/client/.next

    networks:
      - internal

volumes:
  postgres_data:
  next_build:
  strapi_public:

networks:
  internal:
    driver: bridge
EOF

# ─────────────────────────────────────────────────────────────
# Cleanup previous containers
# ─────────────────────────────────────────────────────────────

echo "Cleaning previous containers..."

docker compose down -v || true

# ─────────────────────────────────────────────────────────────
# Start stack
# ─────────────────────────────────────────────────────────────

echo "Pulling images and starting containers..."

docker compose pull
docker compose up

# ─────────────────────────────────────────────────────────────
# Show status and logs
# ─────────────────────────────────────────────────────────────

echo ""
echo "Container Status:"
docker compose ps

echo ""
echo "Recent Logs:"
docker compose logs --tail=50

# ─────────────────────────────────────────────────────────────
# Success Message
# ─────────────────────────────────────────────────────────────

echo ""
echo "==================================================="
echo "Bitmutex Stack Deployment Complete"
echo "==================================================="
echo "Frontend : http://localhost:3000"
echo "Backend  : http://localhost:1337"
echo "==================================================="