# DRAGON STUDIOS — PHASE 1 DATABASE & CRM DISCOVERY REPORT

> **READ-ONLY DISCOVERY AUDIT REPORT**  
> **Target Workspaces**: `D:\dragon` (Public Website) & `D:\dragon-admin` (Admin Control Center)

---

## 1. TOTAL DATABASES FOUND

| Metric / Attribute | Primary PostgreSQL Database (`dragon_db`) | Historical Legacy Draft (`dragonstudio`) |
| :--- | :--- | :--- |
| **Database Name** | `dragon_db` | `dragonstudio` (Obsolete initial draft) |
| **Database Type** | PostgreSQL 15 / 16 | PostgreSQL 15 |
| **Project Path** | `D:\dragon` & `D:\dragon-admin` | Previously referenced in `D:\dragon\.env` |
| **Connection Source** | `DATABASE_URL` env variable | Static fallback in legacy Prisma helper |
| **Environment File** | `D:\dragon\.env` & `D:\dragon-admin\.env` | `D:\dragon\.env` (Old value prior to sync) |
| **Prisma Schema Path** | `D:\dragon\prisma\schema.prisma` & `D:\dragon-admin\prisma\schema.prisma` | None |
| **Migration Folders** | `D:\dragon\prisma\migrations` (3 SQL migrations) | None |

---

## 2. TOTAL CRM SYSTEMS FOUND

### 2.1 Model & Table Inventory
* **Ticket Models**:
  * `ContactTicket`: Stores customer support inquiries submitted via the public contact form (`ticketId`, `name`, `email`, `category`, `subject`, `message`, `status`, `priority`).
  * `Ticket`: Stores internal CRM support tickets created or managed within the admin control center (`ticketId`, `customerName`, `customerEmail`, `category`, `subject`, `description`, `status`, `priority`, `slaHours`, `assignedTo`).
* **Message Model**:
  * `TicketMessage`: Threaded customer and agent messages linked via explicit Prisma relations to `ContactTicket` (`@relation("ContactTicketMessages")`) and `Ticket` (`@relation("AdminTicketMessages")`).
* **Customer Models**:
  * `CustomerProfile`: Player identity, self-service ticket profile, and preference store on `D:\dragon`.
  * `Customer`: Enterprise CRM directory record on `D:\dragon-admin` (`name`, `email`, `company`, `tier`, `totalTickets`, `mrr`).
* **Support Subsystems**:
  * `InternalNote`: Internal staff annotations attached to support tickets.
  * `TicketAttachment`: File attachments linked to tickets.
  * `EmailLog`: Email dispatch logging table (`ticketId`, `recipient`, `subject`, `status`).

### 2.2 API Routes & Pages
* **Public Inquiry API**: `D:\dragon\app\api\contact\route.ts`
* **Public Ticket Tracker API**: `D:\dragon\app\api\support\[ticketId]\route.ts`
* **Public Ticket Self-Service Pages**: `D:\dragon\app\contact\page.tsx`, `D:\dragon\app\track-ticket\page.tsx`, `D:\dragon\app\support\[ticketId]\page.tsx`
* **Admin Master CRM API**: `D:\dragon-admin\src\app\api\crm\tickets\route.ts`
* **Admin Support Command Desk**: `D:\dragon-admin\src\app\crm\page.tsx`

---

## 3. PUBLIC WEBSITE ARCHITECTURE (`D:\dragon`)

* **Framework**: Next.js 16 (App Router) + React 19 + TypeScript.
* **Backend**: Next.js Server Actions & API Route Handlers.
* **Frontend**: Tailwind CSS v4, Framer Motion, Lucide React, Three.js WebGL canvas.
* **Database Driver**: `@prisma/client` v7.9.1 with `@prisma/adapter-pg` driver adapter.
* **Authentication**: NextAuth.js v4 (Player accounts & Google OAuth).
* **CMS Reader**: Headless CMS block fetcher with inline default fallbacks (`lib/cms.ts`).

---

## 4. ADMIN PANEL ARCHITECTURE (`D:\dragon-admin`)

* **Framework**: Next.js 15 (App Router) + React 19 + TypeScript.
* **Backend**: Next.js API Route Handlers.
* **Frontend**: Dark glassmorphic design system, Tailwind CSS v4, Lucide React.
* **Database Driver**: `@prisma/client` v6.19.3.
* **Authentication**: Custom HTTP-Only session cookies (`dragon_admin_session`) + Bcryptjs + RBAC middleware.
* **Control Modules**: Executive Dashboard (`/dashboard`), Headless CMS Visual Editor (`/cms`), Enterprise CRM Support Desk (`/crm`), User RBAC Manager (`/users`), API Platform (`/api-platform`), AI Assistant (`/ai`).

---

## 5. DUPLICATE SYSTEMS FOUND

1. **Dual Database Schemas**: `D:\dragon\prisma\schema.prisma` vs `D:\dragon-admin\prisma\schema.prisma`.
2. **Dual Prisma Clients**: `D:\dragon\lib\prisma.ts` vs `D:\dragon-admin\src\lib\database\prisma.ts`.
3. **Dual CRM Entities**: `ContactTicket` (public contact form) vs `Ticket` (admin-created tickets).
4. **Dual Customer Entities**: `CustomerProfile` vs `Customer`.
5. **Dual Auth Systems**: NextAuth v4 (Players) vs Custom Session Cookie Engine (Staff).

---

## 6. CURRENT PROBLEMS IDENTIFIED

1. **Schema Synchronization Risk**: Maintaining separate `schema.prisma` files without a shared `@dragon/db` package risks schema drift when adding new fields.
2. **Dual CRM Ingestion Mapping**: Having separate `ContactTicket` and `Ticket` tables requires API route handlers to query and merge data from both entities.
3. **Prisma Version Divergence**: `D:\dragon` uses Prisma v7 while `D:\dragon-admin` uses Prisma v6.

---

## 7. RECOMMENDATION

**ONE DATABASE (`dragon_db`) + ONE UNIFIED CRM PIPELINE**

* **One Single PostgreSQL Database (`dragon_db`)**: Serves both public player experiences and administrative operations.
* **One Single Master Prisma Schema**: Use `D:\dragon-admin\prisma\schema.prisma` as the authoritative schema definition and keep `D:\dragon\prisma\schema.prisma` synchronized.
* **One Single Unified CRM Endpoint**: Utilize `D:\dragon-admin\src\app\api\crm\tickets\route.ts` as the primary CRM resolution engine, seamlessly merging `ContactTicket` and `Ticket` data into a single support desk thread.
