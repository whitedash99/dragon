-- STEP A: ALTER TICKET TABLE COLUMNS
ALTER TABLE "Ticket" ADD COLUMN IF NOT EXISTS "tenantId" VARCHAR(255) DEFAULT 'dragon_studios';
ALTER TABLE "Ticket" ADD COLUMN IF NOT EXISTS "createdByType" VARCHAR(255) DEFAULT 'CUSTOMER';
ALTER TABLE "Ticket" ADD COLUMN IF NOT EXISTS "source" VARCHAR(255) DEFAULT 'ADMIN_CREATED';
ALTER TABLE "Ticket" ADD COLUMN IF NOT EXISTS "legacyContactTicketId" VARCHAR(255);
ALTER TABLE "Ticket" ADD COLUMN IF NOT EXISTS "migrationDate" TIMESTAMP;
ALTER TABLE "Ticket" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP;
ALTER TABLE "Ticket" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN DEFAULT false;

-- STEP B: CREATE INDEXES
CREATE INDEX IF NOT EXISTS "Ticket_tenantId_idx" ON "Ticket"("tenantId");
CREATE INDEX IF NOT EXISTS "Ticket_createdByType_idx" ON "Ticket"("createdByType");
CREATE INDEX IF NOT EXISTS "Ticket_source_idx" ON "Ticket"("source");
CREATE INDEX IF NOT EXISTS "Ticket_legacyContactTicketId_idx" ON "Ticket"("legacyContactTicketId");

-- STEP C: MIGRATE CONTACT TICKET RECORDS INTO TICKET TABLE
INSERT INTO "Ticket" (
  id, "ticketId", "customerName", "customerEmail", category, 
  subject, description, priority, status, "createdAt", "updatedAt", 
  source, "createdByType", "legacyContactTicketId", "migrationDate", "tenantId"
)
SELECT 
  id, "ticketId", name, email, category, 
  subject, message, priority, status, "createdAt", "updatedAt", 
  'PUBLIC_FORM', 'CUSTOMER', id, NOW(), 'dragon_studios'
FROM "ContactTicket"
ON CONFLICT ("ticketId") DO NOTHING;

-- STEP D: RE-LINK TICKET MESSAGES TO UNIFIED TICKET TABLE
UPDATE "TicketMessage" tm
SET "ticketId" = t."id"
FROM "Ticket" t
WHERE tm."contactTicketId" = t."ticketId" OR tm."ticketId" = t."ticketId";

-- STEP E: VERIFICATION SUMMARY QUERY
SELECT 
  (SELECT COUNT(*) FROM "ContactTicket") AS contact_ticket_count,
  (SELECT COUNT(*) FROM "ContactTicket_Legacy_Backup") AS legacy_backup_count,
  (SELECT COUNT(*) FROM "Ticket" WHERE source = 'PUBLIC_FORM') AS migrated_public_tickets,
  (SELECT COUNT(*) FROM "Ticket") AS total_tickets,
  (SELECT COUNT(*) FROM "TicketMessage") AS total_messages;
