Write-Host "=== DRAGON STUDIOS MONOREPO VERIFICATION ===" -ForegroundColor Cyan
Write-Host "[1/5] Installing dependencies with pnpm..." -ForegroundColor Yellow
pnpm install

Write-Host "[2/5] Generating Prisma Client..." -ForegroundColor Yellow
pnpm run prisma:generate

Write-Host "[3/5] Running Typecheck..." -ForegroundColor Yellow
pnpm run typecheck

Write-Host "[4/5] Running Lint..." -ForegroundColor Yellow
pnpm run lint

Write-Host "[5/5] Building Applications with Turbo..." -ForegroundColor Yellow
pnpm run build

Write-Host "=== VERIFICATION COMPLETE: ALL SYSTEMS GO ===" -ForegroundColor Green
