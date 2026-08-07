# ARCHITECTURE REPORT — DRAGON STUDIOS OMEGA ENTERPRISE

## System Architecture

```mermaid
graph TD
    subgraph Monorepo Root [Dragon Studios Monorepo]
        subgraph Applications [apps/]
            WEB["apps/website\n(Next.js 16 - Port 3000)"]
            ADM["apps/admin\n(Next.js 15 - Port 4000)"]
        end

        subgraph Shared Packages [packages/]
            SDB["@dragon/shared-db\n(Prisma ORM Singleton)"]
            UI["@dragon/ui\n(Design System Tokens)"]
            AUTH["@dragon/auth\n(RBAC & JWT Utils)"]
            CFG["@dragon/config\n(Shared TS Configs)"]
            EML["@dragon/email\n(Email Templates)"]
            TYP["@dragon/types\n(Domain Interfaces)"]
            VAL["@dragon/validation\n(Zod Schemas)"]
            UTL["@dragon/utils\n(Shared Helpers & cn)"]
        end
    end

    DB[(PostgreSQL Database)]

    WEB --> SDB
    ADM --> SDB
    WEB --> UI
    ADM --> UI
    WEB --> AUTH
    ADM --> AUTH
    WEB --> EML
    ADM --> EML
    WEB --> VAL
    ADM --> VAL

    SDB --> DB
```

---

## Contact System Data Flow (Zero Gmail Dependency)

1. **User Submits Contact Form** (`apps/website`): Form data validated via `@dragon/validation` -> Inserted into PostgreSQL via `@dragon/shared-db`.
2. **Admin Contact Inbox** (`apps/admin`): Real-time query to PostgreSQL -> Filter by status (`UNREAD`, `READ`, `ARCHIVED`, `SPAM`) & priority (`LOW`, `MEDIUM`, `HIGH`, `URGENT`).
3. **Admin Reply System** (`apps/admin`): Admin writes reply -> Calls `@dragon/email` mailer -> Dispatches email automatically -> Updates database audit log.

---

## Enterprise Hardening Highlights

- **Role-Based Access Control (RBAC)**: Managed centrally in `@dragon/auth`.
- **Single Source Database Truth**: `@dragon/shared-db` manages all migrations, client instantiation, and singleton pooling.
- **TurboRepo Build Cache**: Incremental compilation with sub-second cached builds.
