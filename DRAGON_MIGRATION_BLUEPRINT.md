# DRAGON STUDIOS — PHASE 2 ENTERPRISE MIGRATION BLUEPRINT (FINAL APPROVED & LOCKED)

> **LOCKED ENTERPRISE ARCHITECTURE SPECIFICATION**  
> **Author**: Principal Software Architect & Lead Database Engineer  
> **Status**: APPROVED & LOCKED ARCHITECTURE BLUEPRINT (READ-ONLY — PENDING DISPATCH APPROVAL)

---

## 1. LOCKED ARCHITECTURE CORE PRINCIPLES

1. **ONE DATABASE**: `dragon_db` (PostgreSQL on `localhost:5432`).
2. **ONE UNIFIED CRM ENTITY**: `Ticket` (with threaded `TicketMessage` and staff `InternalNote`).
3. **ONE SHARED DATABASE PACKAGE**: `D:\dragon-shared-db` (`@dragon/shared-db`).
4. **ONE PRISMA VERSION**: Standardized **Prisma v6.19.3** for both `D:\dragon` and `D:\dragon-admin`.
5. **ZERO DATA LOSS**: Permanent historical retention via `ContactTicket_Legacy_Backup`.
6. **ENTERPRISE ISOLATION & AUDIT**: `tenantId` (multi-company isolation) and `createdByType` (actor classification).

---

## 2. CUSTOMER DOMAIN ARCHITECTURE (APPROVED)

### 2.1 Identity Hierarchy & Relational Map

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. `User` (Master Authentication & System Identity)                         │
│    • Email, password hash, role (PLAYER/ADMIN), status, mfaEnabled          │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │1
                                       │
                                       │1 (Optional / Auto-Created)
┌──────────────────────────────────────▼──────────────────────────────────────┐
│ 2. `CustomerProfile` (Player Experience & Personalization)                  │
│    • Gamer tag, avatar URL, country, language, gaming preferences           │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │1
                                       │
                                       │1 (Optional / Auto-Created)
┌──────────────────────────────────────▼──────────────────────────────────────┐
│ 3. `Customer` (Enterprise CRM Management Directory Entity)                  │
│    • LTV, MRR, company, VIP tier, account executive assignment               │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │1
                                       │
                                       │*
┌──────────────────────────────────────▼──────────────────────────────────────┐
│ 4. `Ticket` (Unified CRM Support Inquiry)                                   │
│    • source (PUBLIC_FORM / ADMIN), status, priority, messages, SLA          │
│    • tenantId (Multi-tenant Data Isolation)                                 │
│    • createdByType (CUSTOMER | ADMIN | AI_AGENT | SYSTEM | EMAIL)           │
│    • legacyContactTicketId, migrationDate                                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. ENHANCED UNIFIED TICKET MODEL (APPROVED)

```prisma
model Ticket {
  id                     String          @id @default(cuid())
  ticketId               String          @unique
  tenantId               String?         // Multi-product & multi-company isolation key
  customerId             String?
  customerName           String
  customerEmail          String
  category               String          @default("General Support")
  subject                String
  description            String
  priority               String          @default("NORMAL")
  status                 String          @default("OPEN")
  slaHours               Int             @default(24)
  assignedTo             String?
  source                 String          @default("ADMIN_CREATED") // "PUBLIC_FORM" | "ADMIN_CREATED" | "EMAIL"
  createdByType          String          @default("CUSTOMER")      // "CUSTOMER" | "ADMIN" | "AI_AGENT" | "SYSTEM" | "EMAIL"
  legacyContactTicketId  String?         // Reference ID of original ContactTicket row
  migrationDate          DateTime?       // Timestamp when record was consolidated
  createdAt              DateTime        @default(now())
  updatedAt              DateTime        @updatedAt
  customer               Customer?       @relation(fields: [customerId], references: [id])
  messages               TicketMessage[]
  internalNotes          InternalNote[]
  attachments            Attachment[]
  emailLogs              EmailLog[]

  @@index([customerId])
  @@index([customerEmail])
  @@index([status])
  @@index([source])
  @@index([tenantId])
  @@index([createdByType])
}
```

---

## 4. DATA MIGRATION PLAN

```sql
-- Step A: Create Legacy Audit Backup Table
CREATE TABLE IF NOT EXISTS "ContactTicket_Legacy_Backup" AS SELECT * FROM "ContactTicket";

-- Step B: Consolidate ContactTicket records into Ticket
INSERT INTO "Ticket" (
  id, "ticketId", "customerName", "customerEmail", category, 
  subject, description, priority, status, "createdAt", "updatedAt", 
  source, "createdByType", "legacyContactTicketId", "migrationDate"
)
SELECT 
  id, "ticketId", name, email, category, 
  subject, message, priority, status, "createdAt", "updatedAt", 
  'PUBLIC_FORM', 'CUSTOMER', id, NOW()
FROM "ContactTicket"
ON CONFLICT (id) DO NOTHING;
```

---

## 5. VERIFICATION PLAN

| Verification Target | Test Strategy | Expected Result |
| :--- | :--- | :--- |
| **`tenantId` Isolation** | Query tickets with `where: { tenantId: "dragon_studios" }` | Returns tenant-isolated tickets |
| **`createdByType` Audit** | Check audit tracking on public submissions vs admin tickets | Public form set to `CUSTOMER`; Admin created set to `ADMIN` |
| **Legacy Retention** | `SELECT COUNT(*) FROM "ContactTicket_Legacy_Backup";` | Identical record count to original `ContactTicket` |
| **Public Build Check** | `npm run build` in `D:\dragon` | `✓ Generating static pages (72/72)` — **0 Errors** |
| **Admin Build Check** | `npm run build` in `D:\dragon-admin` | `✓ Generating static pages (50/50)` — **0 Errors** |

---

## 6. FINAL EXECUTION STEPS (PENDING DISPATCH APPROVAL)

```
[Step 1: Obtain User Explicit Dispatch Approval]
    │
    ▼
[Step 2: Initialize D:\dragon-shared-db Monorepo Package Structure]
    │
    ▼
[Step 3: Standardize @prisma/client Dependency to v6.19.3 Across Workspaces]
    │
    ▼
[Step 4: Create Physical PostgreSQL Backup & ContactTicket_Legacy_Backup Table]
    │
    ▼
[Step 5: Run Schema Sync & Consolidated Data Migration Script]
    │
    ▼
[Step 6: Refactor D:\dragon & D:\dragon-admin to Import from @dragon/shared-db]
    │
    ▼
[Step 7: Run Full Verification Suite (npm run build in both applications)]
```
