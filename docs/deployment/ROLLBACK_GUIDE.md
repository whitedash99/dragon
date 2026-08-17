# ROLLBACK GUIDE — DRAGON STUDIOS

## Instant Emergency Rollback Protocol

In the unlikely event that a critical issue occurs during deployment or workspace operation, follow this step-by-step rollback guide.

---

## 1. Database Rollback

Backups are preserved inside `backups/`.

To restore from the latest SQL backup snapshot:
```powershell
# PostgreSQL database restoration
psql -U postgres -d dragon_db -f backups/dragon_db_before_production_launch.sql
```

---

## 2. Source Code Rollback

If operating with Git:
```bash
# Revert to pre-migration commit
git checkout HEAD~1
```

If restoring legacy folder layout:
1. `apps/website` -> `D:\dragon` root
2. `apps/admin` -> `D:\dragon-admin`
3. `packages/shared-db` -> `D:\dragon-shared-db`
4. `docs` -> `D:\dragon-docs`
5. `backups` -> `D:\dragon-backups`

---

## 3. Vercel Deployment Rollback

1. Open Vercel Dashboard for `dragon-website` or `dragon-admin`.
2. Navigate to **Deployments**.
3. Select the previous stable deployment.
4. Click **Redeploy / Instant Rollback**.
