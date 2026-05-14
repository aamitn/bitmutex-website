Write-Host "Checking environment files..." -ForegroundColor Yellow

# ─────────────────────────────────────────────────────────────
# Download .env files if missing
# ─────────────────────────────────────────────────────────────

$files = @(
    @{
        Url  = "https://raw.githubusercontent.com/aamitn/bitmutex-website/main/.env.example"
        Dest = ".env"
    },
    @{
        Url  = "https://raw.githubusercontent.com/aamitn/bitmutex-website/main/server/.env.example"
        Dest = "server/.env"
    },
    @{
        Url  = "https://raw.githubusercontent.com/aamitn/bitmutex-website/main/client/.env.example"
        Dest = "client/.env"
    }
)

foreach ($file in $files) {

    $dir = Split-Path $file.Dest -Parent

    if ($dir -and !(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }

    if (!(Test-Path $file.Dest)) {

        Write-Host "Downloading $($file.Dest)..." -ForegroundColor Cyan

        curl.exe -L $file.Url -o $file.Dest

        if ($LASTEXITCODE -ne 0) {
            Write-Host "Failed to download $($file.Dest)" -ForegroundColor Red
            exit 1
        }

    }
    else {

        Write-Host "$($file.Dest) already exists" -ForegroundColor Green

    }
}

# ─────────────────────────────────────────────────────────────
# Generate docker-compose.yml
# ─────────────────────────────────────────────────────────────

Write-Host "Initializing Bitmutex Stack deployment..." -ForegroundColor Cyan
Write-Host "Generating docker-compose.yml..." -ForegroundColor Yellow

$composeContent = @'
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
'@

Set-Content -Path "docker-compose.yml" -Value $composeContent -Encoding UTF8

# ─────────────────────────────────────────────────────────────
# Cleanup previous broken containers
# ─────────────────────────────────────────────────────────────

Write-Host "Cleaning previous containers..." -ForegroundColor Yellow

docker compose down -v

# ─────────────────────────────────────────────────────────────
# Start stack
# ─────────────────────────────────────────────────────────────

Write-Host "Pulling images and starting containers..." -ForegroundColor Yellow

docker compose pull
docker compose up

# ─────────────────────────────────────────────────────────────
# Show logs
# ─────────────────────────────────────────────────────────────

Write-Host ""
Write-Host "Container Status:" -ForegroundColor Cyan

docker compose ps

Write-Host ""
Write-Host "Recent Logs:" -ForegroundColor Cyan

docker compose logs --tail=50

# ─────────────────────────────────────────────────────────────
# Success Message
# ─────────────────────────────────────────────────────────────

Write-Host ""
Write-Host "===================================================" -ForegroundColor Green
Write-Host "Bitmutex Stack Deployment Complete" -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Green
Write-Host "Frontend : http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend  : http://localhost:1337" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Green