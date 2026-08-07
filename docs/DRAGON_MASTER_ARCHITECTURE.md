# DRAGON STUDIOS — MASTER ARCHITECTURE DOCUMENTATION

> **ENTERPRISE PLATFORM MASTER ARCHITECTURE SPECIFICATION**  
> **Author**: Principal Software Architect & Lead Database Engineer  
> **Status**: LOCKED & VERIFIED (FOUNDATION LOCK COMPLETE)

---

## 1. SYSTEM OVERVIEW

Dragon Studios is an enterprise-grade gaming studio and LiveOps SaaS platform engineered with a unified **Monorepo Shared Database Architecture**.

```
┌─────────────────────────────────────────────────────────┐     ┌─────────────────────────────────────────────────────────┐
│              PUBLIC WEBSITE (PORT 3000)                 │     │             ADMIN CONTROL CENTER (PORT 4000)            │
│                       D:\dragon                         │     │                     D:\dragon-admin                     │
├─────────────────────────────────────────────────────────┤     ├─────────────────────────────────────────────────────────┤
│ • Next.js App Router (v16.2.12)                         │     │ • Next.js App Router (v15.5.22)                         │
│ • NextAuth Player Realm                                 │     │ • Staff Cookie RBAC Security                            │
│ • Public Contact Form & Ticket Lookup                   │     │ • Unified CRM Support Desk & Staff Notes                │
│ • Dynamic CMS Page Renderer                             │     │ • Visual CMS Block Editor                               │
│ • Games & DLC Public Catalog                            │     │ • LiveOps Game Catalog Publishing                       │
└────────────────────────────┬────────────────────────────┘     └────────────────────────────┬────────────────────────────┘
                             │                                                               │
                             └──────────────────────────────┬────────────────────────────────┘
                                                            │
                                                            ▼
                                              ┌───────────────────────────┐
                                              │ SHARED DATABASE PACKAGE   │
                                              │    D:\dragon-shared-db    │
                                              │ • Package: @dragon/shared │
                                              │ • schema.prisma (117)     │
                                              │ • Prisma Client v6.19.3   │
                                              └─────────────┬─────────────┘
                                                            │
                                                            ▼
                                              ┌───────────────────────────┐
                                              │ POSTGRESQL DATABASE       │
                                              │    dragon_db (:5432)      │
                                              │ • Master Tables (117)     │
                                              │ • ContactTicket_Legacy    │
                                              └───────────────────────────┘
```

---

## 2. WORKSPACE DIRECTORY MAP

* **`D:\dragon`**: Public player-facing website, AAA games catalog, player accounts, public contact form.
* **`D:\dragon-admin`**: Enterprise admin control center, CRM support desk, visual CMS editor, media asset manager, analytics.
* **`D:\dragon-shared-db`**: Shared database monorepo package housing the single master `schema.prisma` definition and singleton `PrismaClient` exports `{ prisma, db }`.

---

## 3. DATABASE ARCHITECTURE

* **Database Name**: `dragon_db`
* **Engine**: PostgreSQL 16+
* **Connection Endpoint**: `localhost:5432`
* **Database Connection String**: `postgresql://postgres:123456654321@localhost:5432/dragon_db?schema=public`
* **Master Schema**: `D:\dragon-shared-db\schema.prisma` (**117 Consolidated Models**)

---

## 4. CRM ARCHITECTURE

```
User (Authentication)
 └── CustomerProfile (Player Personalization)
       └── Customer (Enterprise CRM Directory Record)
             └── Ticket (Unified Support Inquiries)
                   ├── TicketMessage (Threaded Communications)
                   ├── InternalNote (Staff Internal Notes)
                   ├── TicketAttachment (File Attachments)
                   ├── EmailLog (Automated Dispatch Logs)
                   └── AIAnalysis (Sentiment & Auto-Category)
```

* **Legacy Audit Retention**: Immutable read-only historical archive table `ContactTicket_Legacy_Backup` (**2/2 rows retained**).

---

## 5. AUTHENTICATION REALMS

1. **Public Realm (`D:\dragon`)**: NextAuth.js JWT session provider handling player credentials (`User`, `Account`, `Session`, `VerificationToken`).
2. **Admin Staff Realm (`D:\dragon-admin`)**: HttpOnly Cookie-based RBAC Authorization (`Admin`, `Role`, `Permission`) with route protection guards.

---

## 6. CORE ARCHITECTURAL RULES (LOCKED)

1. **NEVER** create a second PostgreSQL database.
2. **NEVER** create duplicate `schema.prisma` files outside `D:\dragon-shared-db`.
3. **NEVER** recreate separate `ContactTicket` CRM entities.
4. **ALWAYS** import `{ prisma, db }` directly from `@dragon/shared-db`.
