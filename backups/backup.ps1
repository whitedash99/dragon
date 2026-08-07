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
$env:PGPASSWORD = "123456654321"
pg_dump -U postgres -h localhost -p 5432 -d dragon_db --clean --if-exists -f $dbFile

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
