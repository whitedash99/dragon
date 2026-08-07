# DRAGON STUDIOS — COMPLETE SYSTEM MAP

> **END-TO-END SYSTEM PLATFORM SUBSYSTEM MAP**

---

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   DRAGON STUDIOS PLATFORM                              │
├───────────────────────────────┬───────────────────────────────┬────────────────────────┤
│ SUBSYSTEM                     │ IMPLEMENTATION WORKSPACE      │ KEY DOMAIN ENTITIES    │
├───────────────────────────────┼───────────────────────────────┼────────────────────────┤
│ 1. Frontend Public Website    │ D:\dragon                     │ Page, PageSection      │
│ 2. Frontend Admin Center      │ D:\dragon-admin               │ Dashboard, Telemetry   │
│ 3. Shared Database Package    │ D:\dragon-shared-db           │ @dragon/shared-db      │
│ 4. Single PostgreSQL Engine   │ dragon_db (:5432)             │ 117 Master Tables      │
│ 5. CRM Support Desk           │ D:\dragon & D:\dragon-admin   │ Ticket, TicketMessage  │
│ 6. Headless CMS Engine        │ D:\dragon-admin /cms          │ ContentBlock, Revision │
│ 7. AI Analysis Engine         │ Google Gemini AI              │ AIAnalysis, AISearch   │
│ 8. Media Studio               │ D:\dragon-admin /media        │ MediaAsset, MediaUsage │
│ 9. Games & LiveOps Catalog    │ D:\dragon /games              │ GameContent, DLC       │
│ 10. Player Authentication     │ NextAuth.js JWT Provider      │ User, Session, Account │
│ 11. Staff RBAC Security       │ HttpOnly Cookie RBAC          │ Admin, Role            │
│ 12. Analytics & Audit Logs    │ Telemetry Pipeline            │ AuditLog, Visitor      │
└───────────────────────────────┴───────────────────────────────┴────────────────────────┘
```
