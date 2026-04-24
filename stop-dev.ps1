$ErrorActionPreference = 'Stop'

Set-Location $PSScriptRoot

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
  throw "docker is not installed or not in PATH."
}

Write-Host "Stopping Docker services (PostgreSQL and Redis)..."
docker compose down
Write-Host "Done."
