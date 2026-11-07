Migration: Consolidate room-related tables

Files added:
- consolidate_rooms.sql  — SQL migration to create `rooms` and migrate data from `rooms_new`, `room_images_new`, and `room_amenities`. Also ensures `room_availability` exists and points to `rooms`.
- backup_and_migrate_rooms.ps1 — PowerShell script to back up the 'subra' DB and run the migration SQL. Prompts for DB credentials and warns to review before running.

Recommended steps BEFORE running:
1. Stop application services that may write to DB (if possible).
2. Run a full DB backup manually or via the included script.
3. Review `consolidate_rooms.sql` to ensure column mappings match your current data.
4. Run the PowerShell script from the `backend/migrations` directory:

```powershell
cd backend\migrations
.\backup_and_migrate_rooms.ps1
```

Verification after migration:
- Connect to MySQL and run `SELECT COUNT(*) FROM rooms;` and `SELECT COUNT(*) FROM room_availability;` to ensure data exists.
- Spot-check a few room records to verify `images` and `amenities` JSON fields contain expected values.
- If satisfied, consider dropping old tables `rooms_new`, `room_images_new`, `room_amenities` after keeping backups.

Rollback:
- Restore from the backup SQL created in `C:\backups` by running:

```powershell
mysql -u root -p subra < C:\backups\subra_full_YYYYMMDD-HHMMSS.sql
```

Notes:
- The migration attempts to preserve `id` values so existing foreign keys referencing room ids should continue working if they reference the same numeric ids. However, verify any code that references `rooms_new` specifically — you can either update code to reference `rooms` or keep `rooms_new` and adapt.
- This migration uses simple GROUP_CONCAT to assemble image and amenity lists into JSON arrays. If you have special characters in paths/names, inspect the resulting JSON carefully.
