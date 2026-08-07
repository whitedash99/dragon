# DRAGON STUDIOS — DEVELOPER RULE BOOK & GOVERNANCE

> **MANDATORY DEVELOPER GUIDELINES FOR DRAGON STUDIOS PLATFORM**  
> **Target Audience**: All Software Engineers, Database Architects, and DevOps Contributors

---

## 1. THE 5 GOLDEN LAWS OF DEVELOPMENT

1. **Law 1 — Single Database Rule**: Never create a second PostgreSQL database or alter `DATABASE_URL` target away from `dragon_db`.
2. **Law 2 — Shared Schema Single Source of Truth**: Never create local `schema.prisma` files in `D:\dragon` or `D:\dragon-admin`. All schema modifications must occur exclusively in `D:\dragon-shared-db\schema.prisma`.
3. **Law 3 — Unified Client Consumption**: Always import `{ prisma, db }` directly from `@dragon/shared-db`.
4. **Law 4 — No Duplicate Logic / Legacy Models**: Never recreate separate `ContactTicket` models or un-synchronized CRM entities.
5. **Law 5 — Automated Backup Mandatory**: Always run `D:\dragon-backups\backup.ps1` before any schema or structural refactoring.

---

## 2. CODE & PR AUDIT CHECKLIST

- [ ] Does `package.json` consume `"@dragon/shared-db": "file:../dragon-shared-db"`?
- [ ] Are all database imports originating from `@dragon/shared-db`?
- [ ] Have you verified that `npx prisma validate` in `D:\dragon-shared-db` passes with 0 errors?
- [ ] Have production builds (`npm run build` in both `D:\dragon` and `D:\dragon-admin`) passed with 0 errors?
