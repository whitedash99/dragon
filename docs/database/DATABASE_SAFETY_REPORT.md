# DRAGON STUDIOS — DATABASE SAFETY & INTEGRITY REPORT

> **POSTGRESQL & PRISMA SAFETY AUDIT**  
> **Status**: PROTECTED & VERIFIED (FOUNDATION LOCK COMPLETE)

---

## 1. DATABASE CONNECTION SPECIFICATION

| Property | Value | Status |
| :--- | :--- | :--- |
| **Database Name** | `dragon_db` | **CONFIRMED SINGLE DB** |
| **Host / Port** | `ep-still-brook-az2n4i12.c-3.ap-southeast-1.aws.neon.tech:5432` | **VERIFIED** |
| **Database Engine** | PostgreSQL 16+ | **VERIFIED** |
| **Schema Name** | `public` | **VERIFIED** |
| **Master Schema Location** | `D:\dragon-shared-db\schema.prisma` | **VERIFIED** |
| **Prisma Version** | **v6.19.3** | **STANDARDIZED** |
| **Total Domain Models** | **117 Models** | **VALIDATED** |

---

## 2. BACKUP & ARCHIVE SNAPSHOTS

1. `D:\dragon-backups\dragon_db_phase3_before_migration.sql` (`175,305 Bytes`)
2. `D:\dragon-backups\dragon_db_before_crm_merge.sql` (`175,305 Bytes`)
3. `D:\dragon-backups\dragon_db_before_production_launch.sql` (`180,963 Bytes`)
4. `D:\dragon-backups\dragon_db_auto_backup_2026-08-02_17-17-20.sql` (`180,963 Bytes`)
5. Immutable Table in PostgreSQL: `ContactTicket_Legacy_Backup` (**2 Rows Preserved**)

---

## 3. RISK AREAS & SAFETY RULES

* **Risk Area**: Unintended schema divergence between applications.  
  * **Rule**: Remove all local `prisma/schema.prisma` files and mandate `@dragon/shared-db`.
* **Risk Area**: Direct manual database mutations.  
  * **Rule**: All database changes must go through `@dragon/shared-db\schema.prisma` and automated backup scripts.
