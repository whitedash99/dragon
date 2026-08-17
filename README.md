# Dragon Studios — Enterprise Platform Monorepo

Welcome to the **Dragon Studios** unified enterprise workspace, powered by **pnpm Workspaces**, **TurboRepo**, **Next.js**, and **Prisma ORM**.

## 🏗️ Architecture Overview

```
dragon-studios/
├── apps/
│   ├── website/          # Public Website & Gaming Portal (Next.js 16)
│   └── admin/            # Enterprise Admin Panel (Next.js 15)
├── packages/
│   ├── shared-db/        # Single Source of Truth Prisma Client & Schemas
│   ├── ui/               # Unified Design Tokens & Reusable UI Components
│   ├── auth/             # Authentication & RBAC Utilities
│   ├── config/           # Shared TypeScript & Tooling Configurations
│   ├── email/            # Transactional Mailers & Template Engine
│   ├── types/            # Platform-wide TypeScript Interfaces
│   ├── validation/       # Shared Zod Validation Schemas
│   └── utils/            # Core Helper Functions & Formatting Utilities
├── docs/                 # Platform System Maps & Architectural Docs
├── backups/              # Verified Database & Source Code Snapshots
├── scripts/              # Monorepo Automation & Verification Workflows
└── .github/              # GitHub Actions CI/CD Pipeline
```

## 🚀 Quick Start

### Prerequisites
- **Node.js**: v20+
- **pnpm**: v9+ (or `npx pnpm`)
- **PostgreSQL**: v15+

### Installation & Build

```bash
# Install dependencies across all workspace packages & apps
pnpm install

# Generate Prisma Client
pnpm run prisma:generate

# Development Mode (Runs Website + Admin concurrently with TurboRepo)
pnpm run dev

# Full Workspace Build
pnpm run build

# Typecheck & Lint
pnpm run typecheck
pnpm run lint
```

## 📄 Platform Documentation Reports

- 📘 [`MONOREPO_MIGRATION_REPORT.md`](./docs/reports/MONOREPO_MIGRATION_REPORT.md)
- 📐 [`ARCHITECTURE_REPORT.md`](./docs/architecture/ARCHITECTURE_REPORT.md)
- 📦 [`DEPENDENCY_REPORT.md`](./docs/reports/DEPENDENCY_REPORT.md)
- 🔗 [`IMPORT_FIX_REPORT.md`](./docs/reports/IMPORT_FIX_REPORT.md)
- 🗄️ [`DATABASE_REPORT.md`](./docs/database/DATABASE_REPORT.md)
- 🚀 [`DEPLOYMENT_GUIDE.md`](./docs/deployment/DEPLOYMENT_GUIDE.md)
- ⏪ [`ROLLBACK_GUIDE.md`](./docs/deployment/ROLLBACK_GUIDE.md)
