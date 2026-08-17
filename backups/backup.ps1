# DRAGON STUDIOS — MASTER BACKUP SYSTEM SCRIPT
param(
  [string]$BackupBase = "D:\dragon-backups"
)

$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$dbDir = Join-Path $BackupBase "database"
$codeDir = Join-Path $BackupBase "code"
$reportsDir = Join-Path $BackupBase "reports"
$snapshotsDir = Join-Path $BackupBase "snapshots"

# Ensure backup directory structure exists
New-Item -ItemType Directory -Path $dbDir -Force | Out-Null
New-Item -ItemType Directory -Path $codeDir -Force | Out-Null
New-Item -ItemType Directory -Path $reportsDir -Force | Out-Null
New-Item -ItemType Directory -Path $snapshotsDir -Force | Out-Null

$dbFile = Join-Path $dbDir "dragon_db_$timestamp.sql"
$schemaFile = Join-Path $snapshotsDir "schema_snapshot_$timestamp.prisma"

Write-Host "Executing Master Backup for Dragon Studios at $timestamp..." -ForegroundColor Cyan

# 1. Database Dump
$dbUrl = if ($env:DATABASE_URL) { $env:DATABASE_URL } else { "postgresql://neondb_owner:npg_PLneOSAEjJ36@ep-still-brook-az2n4i12.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require" }
pg_dump --dbname=$dbUrl --clean --if-exists -f $dbFile

if (Test-Path $dbFile) {
  $size = (Get-Item $dbFile).Length
  Write-Host "[SUCCESS] Database backup saved: $dbFile ($size Bytes)" -ForegroundColor Green
} else {
  Write-Host "[ERROR] Database dump failed!" -ForegroundColor Red
}

# 2. Schema Snapshot
if (Test-Path "D:\dragon-shared-db\schema.prisma") {
  Copy-Item -Path "D:\dragon-shared-db\schema.prisma" -Destination $schemaFile -Force
  Write-Host "[SUCCESS] Schema snapshot saved: $schemaFile" -ForegroundColor Green
}
