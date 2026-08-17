# DATABASE REPORT — DRAGON STUDIOS

## Single Source of Truth Architecture

Both `apps/website` and `apps/admin` utilize the exact same database package: `@dragon/shared-db` located in `packages/shared-db`.

```
packages/shared-db/
├── schema.prisma   # Master PostgreSQL Schema
├── index.ts        # Exports prisma singleton, db wrapper, & PrismaClient
└── src/
    ├── client.ts   # Global Prisma Client Instance with Connection Pooling
    ├── utils/      # Database Health & Connection Checkers
    └── seed.ts     # Master Database Seeder
```

---

## Database Connection Pooling

`packages/shared-db/src/client.ts` uses global singleton instantiation to prevent connection leaks during Next.js Hot Module Replacement (HMR) in development and serverless invocations in production.

---

## Prisma CLI Workflow

```bash
# Validate Prisma Schema
pnpm run prisma:validate

# Generate Prisma Client
pnpm run prisma:generate

# Push Schema Changes (Dev)
pnpm run prisma:push
```

---

## Migration Safety

- No schema columns or tables were altered or removed.
- All existing migrations and seed data in `packages/shared-db` remain untouched.
