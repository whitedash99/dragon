CREATE TABLE IF NOT EXISTS "ContactTicket_Legacy_Backup" AS SELECT * FROM "ContactTicket";
SELECT COUNT(*) AS original_count FROM "ContactTicket";
SELECT COUNT(*) AS backup_count FROM "ContactTicket_Legacy_Backup";
