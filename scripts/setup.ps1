Write-Host "Initializing Printeast Setup..." -ForegroundColor Cyan

# Check for Administrator privileges
$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
if (-not $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "Error: This script must be run as an Administrator to enable pnpm." -ForegroundColor Red
    exit
}

# Enable Corepack
Write-Host "Enabling Corepack (pnpm)..." -ForegroundColor Yellow
corepack enable

# Test pnpm
if (Get-Command pnpm -ErrorAction SilentlyContinue) {
    Write-Host "pnpm is successfully enabled!" -ForegroundColor Green
} else {
    Write-Host "pnpm not found. Installing via npm..." -ForegroundColor Yellow
    npm install -g pnpm
}

# Install dependencies
Write-Host "Installing Project Dependencies..." -ForegroundColor Yellow
pnpm install

# Setup environment if it doesn't exist
if (!(Test-Path .env)) {
    Write-Host "Creating .env from .env.example..." -ForegroundColor Yellow
    Copy-Item .env.example .env
}

Write-Host "Setup Complete! Run 'docker-compose up -d' and 'pnpm dev' to begin." -ForegroundColor Green
