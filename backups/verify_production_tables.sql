SELECT 
  (SELECT COUNT(*) FROM "User") AS user_count,
  (SELECT COUNT(*) FROM "CustomerProfile") AS customer_profile_count,
  (SELECT COUNT(*) FROM "Customer") AS customer_count,
  (SELECT COUNT(*) FROM "Ticket") AS ticket_count,
  (SELECT COUNT(*) FROM "ContactTicket_Legacy_Backup") AS legacy_backup_count,
  (SELECT COUNT(*) FROM "GameContent") AS game_content_count,
  (SELECT COUNT(*) FROM "ContentBlock") AS content_block_count,
  (SELECT COUNT(*) FROM "AuditLog") AS audit_log_count;
