# DEPENDENCY REPORT — DRAGON STUDIOS

## Workspace Package Dependencies

All package dependencies within the monorepo use pnpm protocol workspace links (`workspace:*`), eliminating package duplication and ensuring version consistency across applications.

```json
{
  "dependencies": {
    "@dragon/shared-db": "workspace:*",
    "@dragon/ui": "workspace:*",
    "@dragon/auth": "workspace:*",
    "@dragon/config": "workspace:*",
    "@dragon/email": "workspace:*",
    "@dragon/types": "workspace:*",
    "@dragon/validation": "workspace:*",
    "@dragon/utils": "workspace:*"
  }
}
```

---

## Shared Third-Party Versions

- **Prisma Client**: `6.19.3` (Single source of truth in `@dragon/shared-db`)
- **React**: `19.0.0`
- **TypeScript**: `^5.7.3`
- **Tailwind CSS**: `^4.0.0`
- **Framer Motion**: `^12.0.0`
- **Zod**: `^3.24.1`

---

## Dependency Deduplication Matrix

| Library | Website Version | Admin Version | Consolidated Location |
| :--- | :--- | :--- | :--- |
| `@dragon/shared-db` | Local file reference | Local file reference | `packages/shared-db` (`workspace:*`) |
| `@prisma/client` | 6.19.3 | 6.19.3 | `@dragon/shared-db` |
| `bcryptjs` | 3.0.3 | 2.4.3 | `@dragon/auth` |
| `clsx` & `tailwind-merge` | 2.1.1 & 3.6.0 | 2.1.1 & 3.0.1 | `@dragon/utils` |
| `zod` | 4.4.3 | N/A | `@dragon/validation` |
