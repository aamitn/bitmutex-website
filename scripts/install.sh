#!/bin/bash
echo "🚀 Initializing Bitmutex Stack deployment..."

# 1. Write the docker-compose.yml file dynamically
echo "📄 Generating docker-compose.yml..."
cat << 'EOF' > docker-compose.yml
name: bitmutex

services:

  # ── PostgreSQL ──────────────────────────────────────────────────────────────
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

  # ── App (Strapi + Next.js in one container) ─────────────────────────────────
  app:
    image: bitmutex/bm-site:latest

    restart: unless-stopped

    depends_on:
      postgres:
        condition: service_healthy

    env_file:
      - .env
      - path: server/.env
        required: false
      - path: client/.env
        required: false

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

# 2. Boot up the stack
echo "🐳 Pulling images and starting containers..."
docker compose pull
docker compose up -d

# 3. Success message
echo ""
echo "==================================================="
echo "✅ Bitmutex Stack Deployed Successfully"
echo "==================================================="
echo "🌐 Frontend: http://localhost:3000"
echo "⚙️  Backend : http://localhost:1337"
echo "==================================================="