# DEPLOYMENT GUIDE — VERCEL & PRODUCTION

## Overview

The Dragon Studios monorepo is configured for independent deployment of `apps/website` and `apps/admin` on Vercel while sharing `@dragon/shared-db` and a single PostgreSQL database.

---

## 1. Website Application Deployment

- **Vercel Project Name**: `dragon-website`
- **Domain**: `website.dragonstudios.com` (or `dragonstudios.com`)
- **Root Directory**: `apps/website`
- **Build Command**: `pnpm run build`
- **Install Command**: `pnpm install`
- **Output Directory**: `.next`

### Environment Variables
```env
DATABASE_URL=postgresql://user:password@host:5432/dragon_db?schema=public
NEXTAUTH_SECRET=your-production-secret
NEXTAUTH_URL=https://website.dragonstudios.com
```

---

## 2. Admin Panel Deployment

- **Vercel Project Name**: `dragon-admin`
- **Domain**: `admin.dragonstudios.com`
- **Root Directory**: `apps/admin`
- **Build Command**: `pnpm run build`
- **Install Command**: `pnpm install`
- **Output Directory**: `.next`

### Environment Variables
```env
DATABASE_URL=postgresql://user:password@host:5432/dragon_db?schema=public
JWT_SECRET=your-admin-jwt-secret
NEXT_PUBLIC_API_URL=https://admin.dragonstudios.com
```

---

## Vercel Build Settings Matrix

| Project | Root Directory | Override Build Command | Output Directory |
| :--- | :--- | :--- | :--- |
| `website` | `apps/website` | `pnpm --filter @dragon/website build` | `.next` |
| `admin` | `apps/admin` | `pnpm --filter @dragon/admin build` | `.next` |
