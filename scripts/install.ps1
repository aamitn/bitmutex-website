Write-Host "🚀 Initializing Bitmutex Stack deployment..." -ForegroundColor Cyan

# 1. Write the docker-compose.yml file dynamically
Write-Host "📄 Generating docker-compose.yml..." -ForegroundColor Yellow
$composeContent = @"
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
"@

Set-Content -Path "docker-compose.yml" -Value $composeContent -Encoding UTF8

# 2. Boot up the stack
Write-Host "🐳 Pulling images and starting containers..." -ForegroundColor Yellow
docker compose pull
docker compose up -d

# 3. Success message
Write-Host ""
Write-Host "===================================================" -ForegroundColor Green
Write-Host "✅ Bitmutex Stack Deployed Successfully" -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Green
Write-Host "🌐 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "⚙️  Backend : http://localhost:1337" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Green