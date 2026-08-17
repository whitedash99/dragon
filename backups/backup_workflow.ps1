# DRAGON STUDIOS — AUTOMATED PRODUCTION BACKUP WORKFLOW
param(
  [string]$BackupDir = "D:\dragon-backups"
)

$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$dbBackupFile = Join-Path $BackupDir "dragon_db_auto_backup_$timestamp.sql"

Write-Host "Starting automated backup procedure at $timestamp..." -ForegroundColor Cyan

# 1. Environment DATABASE_URL setup
$dbUrl = if ($env:DATABASE_URL) { $env:DATABASE_URL } else { "postgresql://neondb_owner:npg_PLneOSAEjJ36@ep-still-brook-az2n4i12.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require" }

# 2. Database Binary Dump
pg_dump --dbname=$dbUrl --clean --if-exists -f $dbBackupFile

if (Test-Path $dbBackupFile) {
  $size = (Get-Item $dbBackupFile).Length
  Write-Host "Database backup successfully created: $dbBackupFile ($size Bytes)" -ForegroundColor Green
} else {
  Write-Host "Database backup failed!" -ForegroundColor Red
}
