@echo off
setlocal
cd /d "%~dp0"

echo [INFO] Launching development environment...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-dev.ps1" %*
if errorlevel 1 (
  echo [ERROR] Failed to start development environment.
  exit /b 1
)

endlocal
