@echo off
setlocal
cd /d "%~dp0"

echo [INFO] Stopping development infrastructure...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0stop-dev.ps1" %*
if errorlevel 1 (
  echo [ERROR] Failed to stop infrastructure.
  exit /b 1
)

endlocal
