param(
  [switch]$SkipInstall,
  [switch]$FrontendOnly
)

$ErrorActionPreference = 'Stop'

Set-Location $PSScriptRoot

function Ensure-Command($commandName, $installHint) {
  if (-not (Get-Command $commandName -ErrorAction SilentlyContinue)) {
    throw "$commandName is not installed or not in PATH. $installHint"
  }
}

function Ensure-Pnpm() {
  if (Get-Command pnpm -ErrorAction SilentlyContinue) {
    return
  }

  Write-Host "pnpm not found, trying to activate pnpm via corepack..."
  if (Get-Command corepack -ErrorAction SilentlyContinue) {
    corepack enable
    corepack prepare pnpm@10.2.0 --activate
  }

  if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
    throw "pnpm is not installed or not in PATH. Install Node.js LTS and run: npm i -g pnpm"
  }
}

function Ensure-EnvFile($examplePath, $envPath) {
  if (-not (Test-Path $envPath)) {
    Copy-Item $examplePath $envPath
    Write-Host "Created $envPath from template."
  }
}

Write-Host "[1/7] Checking required tools..."
Ensure-Pnpm
pnpm -v | Out-Null

if (-not $FrontendOnly) {
  Ensure-Command "docker" "Install Docker Desktop and enable docker compose"
  docker compose version | Out-Null
}

Write-Host "[2/7] Preparing env files..."
Ensure-EnvFile "services/api/.env.example" "services/api/.env"
Ensure-EnvFile "apps/admin/.env.example" "apps/admin/.env"

if (-not $SkipInstall) {
  Write-Host "[3/7] Installing dependencies..."
  pnpm install
} else {
  Write-Host "[3/7] SkipInstall enabled, dependencies install skipped."
}

if ($FrontendOnly) {
  Write-Host "[4/7] FrontendOnly enabled, skipping Docker and backend setup."
  Write-Host "[5/7] Frontend endpoint: http://localhost:5173"
  Write-Host "[6/7] Starting frontend dev server..."
  pnpm --filter admin dev
  exit 0
}

Write-Host "[4/7] Starting PostgreSQL and Redis with Docker Compose..."
docker compose up -d

Write-Host "[5/7] Running Prisma generate/migrate/seed..."
pnpm --filter api prisma:generate
pnpm --filter api prisma:migrate
pnpm --filter api prisma:seed

Write-Host "[6/7] Startup checks..."
Write-Host "Backend health endpoint: http://localhost:3000/api/health"
Write-Host "Frontend endpoint: http://localhost:5173"

Write-Host "[7/7] Starting frontend + backend dev servers..."
pnpm dev
