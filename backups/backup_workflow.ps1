# DRAGON STUDIOS — AUTOMATED PRODUCTION BACKUP WORKFLOW
param(
  [string]$BackupDir = "D:\dragon-backups"
)

$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$dbBackupFile = Join-Path $BackupDir "dragon_db_auto_backup_$timestamp.sql"

Write-Host "Starting automated backup procedure at $timestamp..." -ForegroundColor Cyan

# 1. Environment PGPASSWORD setup
$env:PGPASSWORD = "123456654321"

# 2. Database Binary Dump
pg_dump -U postgres -h localhost -p 5432 -d dragon_db --clean --if-exists -f $dbBackupFile

if (Test-Path $dbBackupFile) {
  $size = (Get-Item $dbBackupFile).Length
  Write-Host "Database backup successfully created: $dbBackupFile ($size Bytes)" -ForegroundColor Green
} else {
  Write-Host "Database backup failed!" -ForegroundColor Red
}
