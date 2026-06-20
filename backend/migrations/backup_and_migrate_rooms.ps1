# PowerShell script: backup DB and run consolidation migration
# WARNING: This script will execute SQL against your database. Review before running.

$timestamp = (Get-Date).ToString('yyyyMMdd-HHmmss')
$backupDir = "C:\backups"
if (!(Test-Path $backupDir)) { New-Item -ItemType Directory -Path $backupDir | Out-Null }

$dumpFile = Join-Path $backupDir "subra_full_$timestamp.sql"
$migrationFile = Join-Path $PSScriptRoot "consolidate_rooms.sql"

Write-Host "This script will back up the 'subra' database to: $dumpFile" -ForegroundColor Yellow
Write-Host "Then it will run: $migrationFile" -ForegroundColor Yellow

# Prompt for DB credentials
$mysqlUser = Read-Host "MySQL username (e.g. root)"
$mysqlPass = Read-Host -AsSecureString "MySQL password"
$mysqlPassPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($mysqlPass))

# Locate mysqldump and mysql binaries (common XAMPP path fallback)
$mysqldumpPath = "C:\\xampp\\mysql\\bin\\mysqldump.exe"
$mysqlPath = "C:\\xampp\\mysql\\bin\\mysql.exe"
if (!(Test-Path $mysqldumpPath)) { $mysqldumpPath = "mysqldump" }
if (!(Test-Path $mysqlPath)) { $mysqlPath = "mysql" }

# Run backup
$dumpCmd = "`"$mysqldumpPath`" -u $mysqlUser -p$mysqlPassPlain subra > `"$dumpFile`""
Write-Host "Running backup..." -ForegroundColor Green
Invoke-Expression $dumpCmd
Write-Host "Backup completed: $dumpFile" -ForegroundColor Green

# Run migration
Write-Host "Running migration (consolidate_rooms.sql)..." -ForegroundColor Cyan
$runCmd = "Get-Content -Raw `"$migrationFile`" | `"$mysqlPath`" -u $mysqlUser -p$mysqlPassPlain subra"
Invoke-Expression $runCmd
Write-Host "Migration executed. Verify data before dropping old tables." -ForegroundColor Green

# Cleanup sensitive variable
$mysqlPassPlain = $null

Write-Host "Done. Please verify the 'rooms' table and 'room_availability' before proceeding to drop old tables." -ForegroundColor Yellow
