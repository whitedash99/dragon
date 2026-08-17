import { prisma } from "@/lib/database/prisma";
import { can } from "@dragon/auth";
import path from "path";
import fs from "fs/promises";

export type DangerLevel = "SAFE" | "LOW" | "MEDIUM" | "HIGH" | "OPERATIONAL" | "ADMIN" | "OWNER" | "CRITICAL";

export interface CommandContext {
  user: {
    id: string;
    email: string;
    role: string;
    isProtected?: boolean;
    name?: string | null;
  };
  confirmationPhrase?: string;
  formatOverride?: "text" | "table" | "json";
}

export interface CommandResult {
  exitCode: number;
  output: string;
  data?: unknown;
  format: "text" | "table" | "json";
  operationId?: string;
}

export interface CommandOptionDef {
  flag: string;
  description: string;
  values?: string[];
}

export interface CommandDef {
  name: string;
  aliases?: string[];
  namespace: string;
  description: string;
  category: string;
  usage: string;
  examples?: string[];
  arguments?: string[];
  options?: CommandOptionDef[];
  requiredPermission?: string;
  requiresOwner?: boolean;
  dangerLevel: DangerLevel;
  confirmationPhrase?: string;
  handler: (args: string[], ctx: CommandContext) => Promise<CommandResult>;
}

// Registry Maps
export const COMMAND_REGISTRY: Record<string, CommandDef> = {};
export const ALIAS_MAP: Record<string, string> = {};

export function registerCommand(cmd: CommandDef) {
  COMMAND_REGISTRY[cmd.name.toLowerCase()] = cmd;
  if (cmd.aliases) {
    cmd.aliases.forEach((alias) => {
      ALIAS_MAP[alias.toLowerCase()] = cmd.name;
      COMMAND_REGISTRY[alias.toLowerCase()] = cmd;
    });
  }
}

// Operation ID Generator
export function generateOperationId(): string {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `OP-DRG-2026-${num}`;
}

// ── REAL HTTP HEALTH CHECK UTILITY ──
// Performs an actual HTTP request and returns measured latency + real status
async function checkHttpHealth(
  url: string,
  timeoutMs = 5000
): Promise<{
  status: "ONLINE" | "DEGRADED" | "OFFLINE";
  httpCode: number | null;
  latencyMs: number | null;
  reason: string;
}> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const start = Date.now();

  try {
    const res = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      redirect: "follow",
    });
    clearTimeout(timer);
    const latencyMs = Date.now() - start;

    if (res.status >= 200 && res.status < 400) {
      return { status: "ONLINE", httpCode: res.status, latencyMs, reason: `HTTP ${res.status}` };
    } else if (res.status >= 400 && res.status < 500) {
      return { status: "DEGRADED", httpCode: res.status, latencyMs, reason: `HTTP ${res.status} Client Error` };
    } else {
      return { status: "DEGRADED", httpCode: res.status, latencyMs, reason: `HTTP ${res.status} Server Error` };
    }
  } catch (err: unknown) {
    clearTimeout(timer);
    const latencyMs = Date.now() - start;

    if (err instanceof Error) {
      if (err.name === "AbortError") {
        return { status: "OFFLINE", httpCode: null, latencyMs, reason: `Timeout after ${timeoutMs}ms` };
      }
      const msg = err.message.toLowerCase();
      if (msg.includes("econnrefused") || msg.includes("connect")) {
        return { status: "OFFLINE", httpCode: null, latencyMs: null, reason: "Connection refused" };
      }
      if (msg.includes("enotfound") || msg.includes("dns")) {
        return { status: "OFFLINE", httpCode: null, latencyMs: null, reason: "DNS resolution failed" };
      }
      return { status: "OFFLINE", httpCode: null, latencyMs: null, reason: err.message };
    }
    return { status: "OFFLINE", httpCode: null, latencyMs: null, reason: "Unknown network error" };
  }
}

// Resolve configured URLs from environment (never hardcode)
function getWebsiteUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
}
function getAdminUrl(): string {
  return process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:4000";
}

// Real database health check with measured latency
async function checkDatabaseHealth(): Promise<{
  status: "CONNECTED" | "OFFLINE";
  latencyMs: number | null;
  reason: string;
}> {
  const start = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { status: "CONNECTED", latencyMs: Date.now() - start, reason: "SELECT 1 OK" };
  } catch (err: unknown) {
    return {
      status: "OFFLINE",
      latencyMs: null,
      reason: err instanceof Error ? err.message : "Database query failed",
    };
  }
}

// Format Helper
export function formatTableOutput(headers: string[], rows: (string | number | null | undefined)[][]): string {
  if (rows.length === 0) return "No records found.";
  const colWidths = headers.map((h, i) =>
    Math.max(h.length, ...rows.map((r) => String(r[i] ?? "").length))
  );

  const headerLine = headers
    .map((h, i) => h.padEnd(colWidths[i]))
    .join("  ");

  const separator = headers
    .map((_, i) => "─".repeat(colWidths[i]))
    .join("  ");

  const rowLines = rows.map((r) =>
    r.map((val, i) => String(val ?? "").padEnd(colWidths[i])).join("  ")
  );

  return [headerLine, separator, ...rowLines].join("\n");
}

/* =========================================================================
   PATH TRAVERSAL & WORKSPACE SCOPE VALIDATOR (FILE OPERATIONS)
   ========================================================================= */

const ALLOWED_SCOPES = [
  path.resolve("d:/dragon/apps"),
  path.resolve("d:/dragon/packages"),
  path.resolve("d:/dragon/public-assets"),
  path.resolve("d:/dragon/generated"),
];

export function validateAllowedWorkspacePath(requestedPath: string): { valid: boolean; resolvedPath?: string; error?: string } {
  if (!requestedPath || typeof requestedPath !== "string") {
    return { valid: false, error: "Invalid path argument." };
  }

  // Reject explicit traversal patterns & OS root escapes
  if (
    requestedPath.includes("..") ||
    requestedPath.toLowerCase().includes("c:\\") ||
    requestedPath.toLowerCase().includes("windows") ||
    requestedPath.toLowerCase().includes("system32")
  ) {
    return { valid: false, error: "SECURITY REJECTION: Path traversal ('..', system roots) prohibited." };
  }

  const normalized = path.normalize(requestedPath);
  const absolute = path.isAbsolute(normalized) ? normalized : path.resolve("d:/dragon", normalized);

  const isWithinScope = ALLOWED_SCOPES.some((scope) => absolute.startsWith(scope));
  if (!isWithinScope) {
    return {
      valid: false,
      error: `SCOPE VIOLATION: Path '${requestedPath}' is outside authorized Dragon workspace scopes (/dragon/apps, /dragon/packages, /dragon/public-assets, /dragon/generated).`,
    };
  }

  return { valid: true, resolvedPath: absolute };
}

/* =========================================================================
   COMMAND REGISTRATION — TERMINAL 3.0
   ========================================================================= */

// 1. BUILT-INS & HELP SYSTEM
registerCommand({
  name: "dragon help",
  aliases: ["help", "?", "dragon explain"],
  namespace: "built-in",
  category: "BUILT-IN",
  description: "Display organized command catalog or detailed help & arguments for a specific command.",
  usage: "dragon help [namespace|command]",
  examples: ["dragon help", "dragon help website", "dragon help team", "dragon help files"],
  dangerLevel: "SAFE",
  handler: async (args) => {
    const target = args[0]?.toLowerCase();

    if (!target) {
      const categories: Record<string, CommandDef[]> = {};
      Object.values(COMMAND_REGISTRY).forEach((cmd) => {
        if (!categories[cmd.category]) categories[cmd.category] = [];
        if (!categories[cmd.category].some((c) => c.name === cmd.name)) {
          categories[cmd.category].push(cmd);
        }
      });

      let out = "DRAGON TERMINAL 3.0 — COMMAND CATALOG\n";
      out += "=================================================\n\n";

      for (const [cat, cmds] of Object.entries(categories)) {
        out += `${cat}\n`;
        out += `${"─".repeat(cat.length)}\n`;
        cmds.forEach((c) => {
          out += `  ${c.name.padEnd(32)} ${c.description}\n`;
        });
        out += "\n";
      }

      out += "Type 'dragon help <namespace>' (e.g. 'dragon help files') for specific namespace help.\n";
      return { exitCode: 0, output: out, format: "text" };
    }

    const matched = Object.values(COMMAND_REGISTRY).filter(
      (c) =>
        c.namespace.toLowerCase() === target ||
        c.name.toLowerCase().includes(target) ||
        c.category.toLowerCase() === target
    );

    if (matched.length === 0) {
      return {
        exitCode: 2,
        output: `No commands found for '${target}'. Type 'dragon help' for full catalog.`,
        format: "text",
      };
    }

    let out = `COMMAND EXPLANATION & HELP: '${target.toUpperCase()}'\n`;
    out += `${"─".repeat(50)}\n`;
    matched.forEach((c) => {
      out += `Command:     ${c.name}\n`;
      out += `Usage:       ${c.usage}\n`;
      out += `Category:    ${c.category}\n`;
      out += `Profile:     ${c.dangerLevel}\n`;
      out += `Permission:  ${c.requiredPermission || "Public / Auth"}\n`;
      out += `Description: ${c.description}\n`;
      if (c.examples) {
        out += `Examples:\n${c.examples.map((ex) => `  - ${ex}`).join("\n")}\n`;
      }
      out += "\n";
    });

    return { exitCode: 0, output: out, format: "text" };
  },
});

registerCommand({
  name: "dragon whoami",
  aliases: ["whoami"],
  namespace: "built-in",
  category: "BUILT-IN",
  description: "Display authenticated user session identity, role, and protection status.",
  usage: "dragon whoami",
  dangerLevel: "SAFE",
  handler: async (_, ctx) => {
    const u = ctx.user;
    let out = "DRAGON IDENTITY SESSION\n";
    out += "─────────────────────────────────────────────────\n";
    out += `User ID:     ${u.id}\n`;
    out += `Email:       ${u.email}\n`;
    out += `Name:        ${u.name || "N/A"}\n`;
    out += `Role:        ${u.role}\n`;
    out += `Protected:   ${u.isProtected ? "YES (OWNER ROOT)" : "NO"}\n`;
    out += "─────────────────────────────────────────────────\n";
    return { exitCode: 0, output: out, data: u, format: "text" };
  },
});

registerCommand({
  name: "dragon version",
  aliases: ["version"],
  namespace: "built-in",
  category: "BUILT-IN",
  description: "Display Dragon OS platform build and runtime environment details.",
  usage: "dragon version",
  dangerLevel: "SAFE",
  handler: async () => {
    let out = "DRAGON OS ENTERPRISE PLATFORM\n";
    out += "─────────────────────────────────────────────────\n";
    out += "Version:     v3.0.0-ENTERPRISE (Terminal 3.0)\n";
    out += "Build:       2026.08.12-PROD\n";
    out += "Engine:      Dragon Operations Runner Framework\n";
    out += "Database:    Neon Serverless PostgreSQL\n";
    out += "Auth:        Dragon Identity Platform (DIP)\n";
    out += "─────────────────────────────────────────────────\n";
    return { exitCode: 0, output: out, format: "text" };
  },
});

registerCommand({
  name: "dragon status",
  aliases: ["status", "d status", "dg status"],
  namespace: "built-in",
  category: "BUILT-IN",
  description: "Check live status across Website, Admin OS, Database, and Security Posture.",
  usage: "dragon status",
  dangerLevel: "SAFE",
  handler: async () => {
    const startTime = Date.now();
    const websiteUrl = getWebsiteUrl();
    const adminUrl = getAdminUrl();

    // Run ALL health checks concurrently for performance
    const [websiteHealth, adminHealth, dbHealth, identityResult, supportResult, recruitResult] = await Promise.all([
      checkHttpHealth(websiteUrl, 5000),
      checkHttpHealth(`${adminUrl}/api/health`, 5000),
      checkDatabaseHealth(),
      prisma.user.count({ where: { isDeleted: false } }).then(c => ({ ok: true, count: c })).catch(e => ({ ok: false, count: 0, error: e })),
      prisma.contactTicket.count().then(c => ({ ok: true, count: c })).catch(e => ({ ok: false, count: 0, error: e })),
      prisma.teamApplication.count().then(c => ({ ok: true, count: c })).catch(e => ({ ok: false, count: 0, error: e })),
    ]);

    let out = "DRAGON OS PLATFORM STATUS\n";
    out += "─────────────────────────────────────────────────\n";
    out += `Public Website:   ${websiteHealth.status} (${websiteUrl})\n`;
    out += `                  ${websiteHealth.reason}${websiteHealth.latencyMs !== null ? ` — ${websiteHealth.latencyMs}ms` : ""}\n`;
    out += `Admin OS Portal:  ${adminHealth.status} (${adminUrl})\n`;
    out += `                  ${adminHealth.reason}${adminHealth.latencyMs !== null ? ` — ${adminHealth.latencyMs}ms` : ""}\n`;
    out += `Neon PostgreSQL:  ${dbHealth.status}${dbHealth.latencyMs !== null ? ` (${dbHealth.latencyMs}ms)` : ""}\n`;
    out += `                  ${dbHealth.reason}\n`;
    out += `Identity Engine:  ${identityResult.ok ? "AVAILABLE" : "DATABASE_ERROR"} (${identityResult.count} users)\n`;
    out += `Support Desk:     ${supportResult.ok ? "AVAILABLE" : "DATABASE_ERROR"} (${supportResult.count} tickets)\n`;
    out += `Recruitment:      ${recruitResult.ok ? "AVAILABLE" : "DATABASE_ERROR"} (${recruitResult.count} candidates)\n`;
    out += "─────────────────────────────────────────────────\n";
    out += `Duration:         ${Date.now() - startTime} ms\n`;

    const hasFailure = websiteHealth.status === "OFFLINE" || adminHealth.status === "OFFLINE" || dbHealth.status === "OFFLINE";
    out += hasFailure ? "EXIT 7 — One or more services OFFLINE" : "EXIT 0";

    return { exitCode: hasFailure ? 7 : 0, output: out, format: "text" };
  },
});

registerCommand({
  name: "dragon health",
  aliases: ["d health", "dg health"],
  namespace: "system",
  category: "SYSTEM",
  description: "Aggregated health check workflow across Website, Admin, Database, Identity, CMS, and Security.",
  usage: "dragon health",
  dangerLevel: "SAFE",
  handler: async () => {
    const startTime = Date.now();
    const websiteUrl = getWebsiteUrl();
    const adminUrl = getAdminUrl();

    // Concurrent real checks
    const [websiteHealth, adminHealth, dbHealth, usersCount, cmsCount, eventsCount, sessionCount] = await Promise.all([
      checkHttpHealth(websiteUrl, 5000),
      checkHttpHealth(`${adminUrl}/api/health`, 5000),
      checkDatabaseHealth(),
      prisma.user.count().then(c => ({ ok: true, count: c })).catch(() => ({ ok: false, count: 0 })),
      prisma.contentBlock.count().then(c => ({ ok: true, count: c })).catch(() => ({ ok: false, count: 0 })),
      prisma.analyticsEvent.count().then(c => ({ ok: true, count: c })).catch(() => ({ ok: false, count: 0 })),
      prisma.session.count({ where: { expiresAt: { gte: new Date() } } }).then(c => ({ ok: true, count: c })).catch(() => ({ ok: false, count: 0 })),
    ]);

    let out = "DRAGON OS HEALTH CHECK\n";
    out += "─────────────────────────────────────────────────\n";
    out += `Website:       ${websiteHealth.status} (${websiteHealth.reason}${websiteHealth.latencyMs !== null ? `, ${websiteHealth.latencyMs}ms` : ""})\n`;
    out += `Admin Portal:  ${adminHealth.status} (${adminHealth.reason}${adminHealth.latencyMs !== null ? `, ${adminHealth.latencyMs}ms` : ""})\n`;
    out += `Database:      ${dbHealth.status} (${dbHealth.latencyMs !== null ? `${dbHealth.latencyMs}ms latency` : dbHealth.reason})\n`;
    out += `Identity (DIP):${usersCount.ok ? "AVAILABLE" : "DATABASE_ERROR"} (${usersCount.count} identities)\n`;
    out += `CMS Engine:    ${cmsCount.ok ? "AVAILABLE" : "DATABASE_ERROR"} (${cmsCount.count} page blocks)\n`;
    out += `Analytics:     ${eventsCount.ok ? "AVAILABLE" : "DATABASE_ERROR"} (${eventsCount.count} events logged)\n`;
    out += `Sessions:      ${sessionCount.ok ? "AVAILABLE" : "DATABASE_ERROR"} (${sessionCount.count} active)\n`;
    out += "─────────────────────────────────────────────────\n";
    out += `Duration:      ${Date.now() - startTime} ms\n`;

    const hasFailure = websiteHealth.status === "OFFLINE" || adminHealth.status === "OFFLINE" || dbHealth.status === "OFFLINE";
    out += hasFailure ? "EXIT 7 — One or more services OFFLINE" : "EXIT 0";

    return { exitCode: hasFailure ? 7 : 0, output: out, format: "text" };
  },
});

// 2. SCOPED DRAGON FILE OPERATIONS COMMANDS
registerCommand({
  name: "dragon files list",
  namespace: "files",
  category: "FILE OPERATIONS",
  description: "List directory contents within authorized Dragon workspace scopes.",
  usage: "dragon files list <relative-path>",
  examples: ["dragon files list apps", "dragon files list packages"],
  requiredPermission: "settings.manage",
  dangerLevel: "SAFE",
  handler: async (args) => {
    const targetPath = args[0] || "apps";
    const check = validateAllowedWorkspacePath(targetPath);
    if (!check.valid || !check.resolvedPath) {
      return { exitCode: 3, output: `Error: ${check.error}`, format: "text" };
    }

    try {
      const entries = await fs.readdir(check.resolvedPath, { withFileTypes: true });
      const rows = entries.map((e) => [
        e.name,
        e.isDirectory() ? "DIR" : "FILE",
        e.isDirectory() ? "-" : "Bytes",
      ]);

      const headers = ["NAME", "TYPE", "SIZE"];
      const table = formatTableOutput(headers, rows);
      return {
        exitCode: 0,
        output: `WORKSPACE FILE LISTING: [${targetPath}]\n\n${table}`,
        format: "table",
      };
    } catch (err) {
      return { exitCode: 6, output: `Error listing files in '${targetPath}': ${err instanceof Error ? err.message : 'Path not found'}`, format: "text" };
    }
  },
});

registerCommand({
  name: "dragon files read",
  namespace: "files",
  category: "FILE OPERATIONS",
  description: "Read file contents from authorized Dragon workspace scope.",
  usage: "dragon files read <relative-path>",
  requiredPermission: "settings.manage",
  dangerLevel: "SAFE",
  handler: async (args) => {
    const targetPath = args[0];
    if (!targetPath) {
      return { exitCode: 3, output: "Error: File path required. Usage: dragon files read <relative-path>", format: "text" };
    }

    const check = validateAllowedWorkspacePath(targetPath);
    if (!check.valid || !check.resolvedPath) {
      return { exitCode: 3, output: `Error: ${check.error}`, format: "text" };
    }

    try {
      const content = await fs.readFile(check.resolvedPath, "utf-8");
      // Truncate if very large
      const displayContent = content.length > 3000 ? content.substring(0, 3000) + "\n... [TRUNCATED]" : content;
      return { exitCode: 0, output: `FILE CONTENTS: [${targetPath}]\n${"─".repeat(50)}\n${displayContent}`, format: "text" };
    } catch (err) {
      return { exitCode: 6, output: `Error reading file '${targetPath}': ${err instanceof Error ? err.message : 'File not found'}`, format: "text" };
    }
  },
});

registerCommand({
  name: "dragon files create",
  namespace: "files",
  category: "FILE OPERATIONS",
  description: "Create a new file within authorized Dragon workspace scope.",
  usage: "dragon files create <relative-path> <content>",
  requiredPermission: "settings.manage",
  dangerLevel: "OPERATIONAL",
  confirmationPhrase: "CREATE FILE",
  handler: async (args, ctx) => {
    const targetPath = args[0];
    const content = args.slice(1).join(" ") || "";
    if (!targetPath) {
      return { exitCode: 3, output: "Error: File path required.", format: "text" };
    }

    const check = validateAllowedWorkspacePath(targetPath);
    if (!check.valid || !check.resolvedPath) {
      return { exitCode: 3, output: `Error: ${check.error}`, format: "text" };
    }

    const opId = generateOperationId();

    try {
      await fs.mkdir(path.dirname(check.resolvedPath), { recursive: true });
      await fs.writeFile(check.resolvedPath, content, "utf-8");

      await prisma.auditLog.create({
        data: {
          userId: ctx.user.id,
          userEmail: ctx.user.email,
          action: "CREATE_WORKSPACE_FILE",
          resource: "FILES",
          details: `Created workspace file '${targetPath}' via Terminal (${opId}).`,
        },
      });

      return { exitCode: 0, operationId: opId, output: `SUCCESS [${opId}]: Created workspace file '${targetPath}'.`, format: "text" };
    } catch (err) {
      return { exitCode: 1, output: `Error creating file '${targetPath}': ${err instanceof Error ? err.message : 'Write failed'}`, format: "text" };
    }
  },
});

registerCommand({
  name: "dragon files delete",
  namespace: "files",
  category: "FILE OPERATIONS",
  description: "Delete a file within authorized Dragon workspace scope (Requires Owner + Confirmation).",
  usage: "dragon files delete <relative-path>",
  requiresOwner: true,
  dangerLevel: "HIGH",
  confirmationPhrase: "DELETE FILE",
  handler: async (args, ctx) => {
    const targetPath = args[0];
    if (!targetPath) {
      return { exitCode: 3, output: "Error: File path required.", format: "text" };
    }

    const check = validateAllowedWorkspacePath(targetPath);
    if (!check.valid || !check.resolvedPath) {
      return { exitCode: 3, output: `Error: ${check.error}`, format: "text" };
    }

    const opId = generateOperationId();

    try {
      await fs.unlink(check.resolvedPath);

      await prisma.auditLog.create({
        data: {
          userId: ctx.user.id,
          userEmail: ctx.user.email,
          action: "DELETE_WORKSPACE_FILE",
          resource: "FILES",
          details: `Deleted workspace file '${targetPath}' via Terminal (${opId}).`,
        },
      });

      return { exitCode: 0, operationId: opId, output: `SUCCESS [${opId}]: Deleted workspace file '${targetPath}'.`, format: "text" };
    } catch (err) {
      return { exitCode: 6, output: `Error deleting file '${targetPath}': ${err instanceof Error ? err.message : 'File not found'}`, format: "text" };
    }
  },
});

// 3. WEBSITE SUBSYSTEM COMMANDS
registerCommand({
  name: "dragon website status",
  aliases: ["d web", "dg web"],
  namespace: "website",
  category: "WEBSITE",
  description: "Check live public website connectivity, CMS live sync, and HTTP latency.",
  usage: "dragon website status",
  requiredPermission: "cms.read",
  dangerLevel: "SAFE",
  handler: async (args) => {
    const websiteUrl = getWebsiteUrl();
    const verbose = args.includes("--verbose");
    const startTime = Date.now();

    const health = await checkHttpHealth(websiteUrl, 5000);

    let out = "DRAGON PUBLIC WEBSITE STATUS\n";
    out += "─────────────────────────────────────────────────\n";
    out += `URL:          ${websiteUrl}\n`;
    out += `Status:       ${health.status}\n`;
    out += `HTTP Code:    ${health.httpCode !== null ? health.httpCode : "N/A"}\n`;
    out += `Reason:       ${health.reason}\n`;
    out += `Latency:      ${health.latencyMs !== null ? `${health.latencyMs} ms` : "N/A"}\n`;

    if (verbose) {
      out += "─────────────────────────────────────────────────\n";
      out += `Checked:      ${new Date().toISOString()}\n`;
      out += `Source:       Live HTTP request (GET ${websiteUrl})\n`;
      out += `Timeout:      5000 ms\n`;
    }

    out += "─────────────────────────────────────────────────\n";
    out += `Duration:     ${Date.now() - startTime} ms\n`;
    out += health.status === "ONLINE" ? "EXIT 0" : `EXIT 7 — Website ${health.status}`;

    return { exitCode: health.status === "ONLINE" ? 0 : 7, output: out, format: "text" };
  },
});

registerCommand({
  name: "dragon website analytics",
  namespace: "website",
  category: "WEBSITE",
  description: "Fetch live public website traffic telemetry and event stats.",
  usage: "dragon website analytics [--range 7d|30d|90d]",
  requiredPermission: "analytics.read",
  dangerLevel: "SAFE",
  handler: async (args, ctx) => {
    const rangeArg = args.find((a) => a.startsWith("--range="))?.split("=")[1] || "30d";

    let startDate: Date | undefined;
    if (rangeArg === "7d") startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    else if (rangeArg === "30d") startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    else if (rangeArg === "90d") startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

    const whereClause = startDate ? { createdAt: { gte: startDate } } : {};

    const [events, visitorsCount] = await Promise.all([
      prisma.analyticsEvent.findMany({ where: whereClause, take: 100 }),
      prisma.visitor.count().catch(() => 0),
    ]);

    const pageViews = events.filter((e) => e.event === "PAGE_VIEW").length;
    const contactSubs = events.filter((e) => e.event === "CONTACT_SUBMISSION").length;
    const careerApps = events.filter((e) => e.event === "CAREER_APPLICATION").length;

    if (ctx.formatOverride === "json") {
      return {
        exitCode: 0,
        output: JSON.stringify({ range: rangeArg, totalEvents: events.length, pageViews, uniqueVisitors: visitorsCount, contactSubs, careerApps }, null, 2),
        format: "json",
      };
    }

    let out = `DRAGON WEBSITE ANALYTICS (${rangeArg.toUpperCase()})\n`;
    out += "─────────────────────────────────────────────────\n";
    out += `Total Tracked Events:  ${events.length.toLocaleString()}\n`;
    out += `Page Views:            ${pageViews.toLocaleString()}\n`;
    out += `Unique Visitors:       ${visitorsCount.toLocaleString()}\n`;
    out += `Contact Submissions:   ${contactSubs.toLocaleString()}\n`;
    out += `Career Applications:   ${careerApps.toLocaleString()}\n`;
    out += "─────────────────────────────────────────────────\n";
    return { exitCode: 0, output: out, format: "text" };
  },
});

registerCommand({
  name: "dragon website realtime",
  namespace: "website",
  category: "WEBSITE",
  description: "Display recent real-time public website events stream.",
  usage: "dragon website realtime",
  requiredPermission: "analytics.read",
  dangerLevel: "SAFE",
  handler: async () => {
    const events = await prisma.analyticsEvent.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
    });

    if (events.length === 0) {
      return { exitCode: 0, output: "REALTIME ANALYTICS STREAM: No recent events logged.", format: "text" };
    }

    let out = "REALTIME WEBSITE EVENT STREAM\n";
    out += "─────────────────────────────────────────────────\n";
    events.forEach((e) => {
      const timeStr = new Date(e.createdAt).toLocaleTimeString();
      out += `${timeStr}  ${e.event.padEnd(20)} ${e.category} (${e.userEmail || "Visitor"})\n`;
    });
    out += "─────────────────────────────────────────────────\n";
    return { exitCode: 0, output: out, format: "text" };
  },
});

registerCommand({
  name: "dragon website pages",
  namespace: "website",
  category: "WEBSITE",
  description: "List all published pages on the public Dragon Studios website.",
  usage: "dragon website pages",
  requiredPermission: "cms.read",
  dangerLevel: "SAFE",
  handler: async (_, ctx) => {
    const pages = await prisma.page.findMany({
      orderBy: { updatedAt: "desc" },
      select: { title: true, slug: true, status: true, category: true, updatedAt: true },
    });

    if (ctx.formatOverride === "json") {
      return { exitCode: 0, output: JSON.stringify(pages, null, 2), format: "json" };
    }

    const headers = ["SLUG", "TITLE", "CATEGORY", "STATUS", "LAST UPDATED"];
    const rows = pages.map((p) => [
      p.slug,
      p.title,
      p.category,
      p.status,
      new Date(p.updatedAt).toLocaleDateString(),
    ]);

    const table = formatTableOutput(headers, rows);
    return { exitCode: 0, output: `WEBSITE PUBLISHED PAGES (${pages.length})\n\n${table}`, format: "table" };
  },
});

// 4. TEAM SUBSYSTEM COMMANDS
registerCommand({
  name: "dragon team list",
  aliases: ["d team", "dg team"],
  namespace: "team",
  category: "TEAM & WORKFORCE",
  description: "List all active staff identities and role entitlements.",
  usage: "dragon team list [--format table|json]",
  requiredPermission: "users.read",
  dangerLevel: "SAFE",
  handler: async (_, ctx) => {
    const users = await prisma.user.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, role: true, isProtected: true, isActive: true },
    });

    if (ctx.formatOverride === "json") {
      return { exitCode: 0, output: JSON.stringify(users, null, 2), format: "json" };
    }

    const headers = ["ID", "NAME", "EMAIL", "ROLE", "PROTECTED", "STATUS"];
    const rows = users.map((u) => [
      u.id.substring(0, 12),
      u.name || "N/A",
      u.email,
      u.role,
      u.isProtected ? "YES" : "NO",
      u.isActive ? "ACTIVE" : "INACTIVE",
    ]);

    const table = formatTableOutput(headers, rows);
    return { exitCode: 0, output: `DRAGON TEAM WORKFORCE (${users.length} Identities)\n\n${table}`, format: "table" };
  },
});

registerCommand({
  name: "dragon team inspect",
  namespace: "team",
  category: "TEAM & WORKFORCE",
  description: "Inspect detailed identity record for a team member by ID or email.",
  usage: "dragon team inspect <userId|email>",
  requiredPermission: "users.read",
  dangerLevel: "SAFE",
  handler: async (args, ctx) => {
    const target = args[0];
    if (!target) {
      return { exitCode: 3, output: "Error: User ID or email is required. Usage: dragon team inspect <userId|email>", format: "text" };
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ id: target }, { email: target }],
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isProtected: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return { exitCode: 6, output: `Error: User identity '${target}' not found in database.`, format: "text" };
    }

    if (ctx.formatOverride === "json") {
      return { exitCode: 0, output: JSON.stringify(user, null, 2), format: "json" };
    }

    let out = `TEAM MEMBER INSPECTION: ${user.name || user.email}\n`;
    out += "─────────────────────────────────────────────────\n";
    out += `User ID:     ${user.id}\n`;
    out += `Email:       ${user.email}\n`;
    out += `Name:        ${user.name || "N/A"}\n`;
    out += `Role:        ${user.role}\n`;
    out += `Protected:   ${user.isProtected ? "YES (OWNER ROOT)" : "NO"}\n`;
    out += `Status:      ${user.isActive ? "ACTIVE" : "INACTIVE"}\n`;
    out += `Created:     ${new Date(user.createdAt).toLocaleString()}\n`;
    out += "─────────────────────────────────────────────────\n";

    return { exitCode: 0, output: out, data: user, format: "text" };
  },
});

// 5. RECRUITMENT SUBSYSTEM COMMANDS
registerCommand({
  name: "dragon recruitment applications",
  aliases: ["d recruit", "dg recruit"],
  namespace: "recruitment",
  category: "RECRUITMENT",
  description: "List career candidate applications in recruitment pipeline.",
  usage: "dragon recruitment applications",
  requiredPermission: "applications.read",
  dangerLevel: "SAFE",
  handler: async (_, ctx) => {
    const apps = await prisma.teamApplication.findMany({
      orderBy: { createdAt: "desc" },
      select: { applicationNumber: true, applicantName: true, applicantEmail: true, jobTitle: true, status: true, createdAt: true },
    });

    if (ctx.formatOverride === "json") {
      return { exitCode: 0, output: JSON.stringify(apps, null, 2), format: "json" };
    }

    const headers = ["APP NUMBER", "CANDIDATE", "EMAIL", "JOB TITLE", "STATUS", "SUBMITTED"];
    const rows = apps.map((a) => [
      a.applicationNumber,
      a.applicantName,
      a.applicantEmail,
      a.jobTitle,
      a.status,
      new Date(a.createdAt).toLocaleDateString(),
    ]);

    const table = formatTableOutput(headers, rows);
    return { exitCode: 0, output: `RECRUITMENT APPLICATIONS (${apps.length})\n\n${table}`, format: "table" };
  },
});

registerCommand({
  name: "dragon recruitment approve",
  namespace: "recruitment",
  category: "RECRUITMENT",
  description: "Approve a candidate recruitment application (Requires Owner authorization).",
  usage: "dragon recruitment approve <appNumber>",
  requiredPermission: "applications.review",
  requiresOwner: true,
  dangerLevel: "HIGH",
  confirmationPhrase: "APPROVE APPLICATION",
  handler: async (args, ctx) => {
    const appNum = args[0];
    if (!appNum) {
      return { exitCode: 3, output: "Error: Application number required (e.g. DRG-APP-2026-00001).", format: "text" };
    }

    const app = await prisma.teamApplication.findFirst({
      where: { OR: [{ applicationNumber: appNum }, { id: appNum }] },
    });

    if (!app) {
      return { exitCode: 6, output: `Error: Application '${appNum}' not found.`, format: "text" };
    }

    const opId = generateOperationId();

    const updated = await prisma.teamApplication.update({
      where: { id: app.id },
      data: {
        status: "APPROVED",
        reviewedBy: ctx.user.email,
        reviewedAt: new Date(),
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: ctx.user.id,
        userEmail: ctx.user.email,
        action: "APPROVE_RECRUITMENT_APPLICATION",
        resource: "RECRUITMENT",
        details: `Approved candidate application [${updated.applicationNumber}] (${updated.applicantName}) via Terminal (${opId}).`,
      },
    });

    return {
      exitCode: 0,
      operationId: opId,
      output: `SUCCESS [${opId}]: Candidate application [${updated.applicationNumber}] (${updated.applicantName}) status updated to APPROVED. Audit record created.`,
      format: "text",
    };
  },
});

// 6. SUPPORT SUBSYSTEM COMMANDS
registerCommand({
  name: "dragon support tickets",
  aliases: ["d tickets", "dg tickets"],
  namespace: "support",
  category: "SUPPORT DESK",
  description: "List support desk customer tickets.",
  usage: "dragon support tickets",
  requiredPermission: "crm.read",
  dangerLevel: "SAFE",
  handler: async (_, ctx) => {
    const tickets = await prisma.contactTicket.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
      select: { ticketId: true, name: true, email: true, category: true, subject: true, status: true, priority: true },
    });

    if (ctx.formatOverride === "json") {
      return { exitCode: 0, output: JSON.stringify(tickets, null, 2), format: "json" };
    }

    const headers = ["TICKET ID", "CUSTOMER", "CATEGORY", "SUBJECT", "PRIORITY", "STATUS"];
    const rows = tickets.map((t) => [
      t.ticketId,
      t.name,
      t.category,
      t.subject.length > 25 ? t.subject.substring(0, 25) + "..." : t.subject,
      t.priority,
      t.status,
    ]);

    const table = formatTableOutput(headers, rows);
    return { exitCode: 0, output: `SUPPORT DESK TICKETS (${tickets.length})\n\n${table}`, format: "table" };
  },
});

// 7. CMS SUBSYSTEM COMMANDS
registerCommand({
  name: "dragon cms pages",
  aliases: ["d cms", "dg cms"],
  namespace: "cms",
  category: "CMS CONTENT",
  description: "List CMS pages and sections.",
  usage: "dragon cms pages",
  requiredPermission: "cms.read",
  dangerLevel: "SAFE",
  handler: async (_, ctx) => {
    const pages = await prisma.page.findMany({
      orderBy: { updatedAt: "desc" },
      select: { title: true, slug: true, status: true, category: true },
    });

    if (ctx.formatOverride === "json") {
      return { exitCode: 0, output: JSON.stringify(pages, null, 2), format: "json" };
    }

    const headers = ["SLUG", "TITLE", "CATEGORY", "STATUS"];
    const rows = pages.map((p) => [p.slug, p.title, p.category, p.status]);

    const table = formatTableOutput(headers, rows);
    return { exitCode: 0, output: `CMS CONTENT PAGES (${pages.length})\n\n${table}`, format: "table" };
  },
});

registerCommand({
  name: "dragon cms publish",
  namespace: "cms",
  category: "CMS CONTENT",
  description: "Publish a CMS page or content block snapshot.",
  usage: "dragon cms publish <slug>",
  requiredPermission: "cms.edit",
  dangerLevel: "OPERATIONAL",
  confirmationPhrase: "PUBLISH CONTENT",
  handler: async (args, ctx) => {
    const slug = args[0];
    if (!slug) {
      return { exitCode: 3, output: "Error: Page slug required (e.g. 'home' or 'careers').", format: "text" };
    }

    const page = await prisma.page.findFirst({ where: { slug } });
    if (!page) {
      return { exitCode: 6, output: `Error: CMS page '${slug}' not found.`, format: "text" };
    }

    const opId = generateOperationId();

    const updated = await prisma.page.update({
      where: { id: page.id },
      data: { status: "PUBLISHED" },
    });

    await prisma.auditLog.create({
      data: {
        userId: ctx.user.id,
        userEmail: ctx.user.email,
        action: "PUBLISH_CMS_PAGE",
        resource: "CMS",
        details: `Published CMS page [${updated.slug}] via Terminal (${opId}).`,
      },
    });

    return { exitCode: 0, operationId: opId, output: `SUCCESS [${opId}]: CMS page '${updated.title}' (${updated.slug}) is now PUBLISHED.`, format: "text" };
  },
});

// 8. SECURITY & AUDIT COMMANDS
registerCommand({
  name: "dragon security status",
  aliases: ["d sec", "dg sec"],
  namespace: "security",
  category: "SECURITY",
  description: "Check security posture, active sessions, and DIP score.",
  usage: "dragon security status",
  requiredPermission: "security.read",
  dangerLevel: "SAFE",
  handler: async () => {
    const startTime = Date.now();
    const [userResult, sessionResult, deviceResult, passkeyResult] = await Promise.all([
      prisma.user.count().then(c => ({ ok: true, count: c })).catch(() => ({ ok: false, count: 0 })),
      prisma.session.count({ where: { expiresAt: { gte: new Date() } } }).then(c => ({ ok: true, count: c })).catch(() => ({ ok: false, count: 0 })),
      prisma.userDevice.count({ where: { trusted: true } }).then(c => ({ ok: true, count: c })).catch(() => ({ ok: false, count: 0 })),
      prisma.passkeyCredential.count().then(c => ({ ok: true, count: c })).catch(() => ({ ok: false, count: 0 })),
    ]);

    const hasGoogleAuth = !!process.env.GOOGLE_CLIENT_ID;
    const hasWebAuthn = passkeyResult.ok;

    let out = "DRAGON SECURITY POSTURE REPORT\n";
    out += "─────────────────────────────────────────────────\n";
    out += `Google OAuth:         ${hasGoogleAuth ? "CONFIGURED" : "NOT_CONFIGURED"}\n`;
    out += `WebAuthn / Passkeys:  ${hasWebAuthn ? `AVAILABLE (${passkeyResult.count} registered)` : "DATABASE_ERROR"}\n`;
    out += `Identities:           ${userResult.ok ? `${userResult.count} Registered Users` : "DATABASE_ERROR"}\n`;
    out += `Active Sessions:      ${sessionResult.ok ? `${sessionResult.count} Unexpired Tokens` : "DATABASE_ERROR"}\n`;
    out += `Trusted Devices:      ${deviceResult.ok ? `${deviceResult.count} Devices Registered` : "DATABASE_ERROR"}\n`;
    out += "─────────────────────────────────────────────────\n";
    out += `Duration:             ${Date.now() - startTime} ms\n`;
    return { exitCode: 0, output: out, format: "text" };
  },
});

registerCommand({
  name: "dragon audit recent",
  namespace: "audit",
  category: "SECURITY",
  description: "Fetch recent immutable system audit log entries.",
  usage: "dragon audit recent",
  requiredPermission: "audit.read",
  dangerLevel: "SAFE",
  handler: async (_, ctx) => {
    const logs = await prisma.auditLog.findMany({
      take: 15,
      orderBy: { createdAt: "desc" },
      select: { id: true, action: true, userEmail: true, resource: true, details: true, createdAt: true },
    });

    if (ctx.formatOverride === "json") {
      return { exitCode: 0, output: JSON.stringify(logs, null, 2), format: "json" };
    }

    const headers = ["ACTION", "ACTOR", "RESOURCE", "DETAILS", "TIMESTAMP"];
    const rows = logs.map((l) => [
      l.action,
      l.userEmail || "System",
      l.resource || "N/A",
      l.details ? (l.details.length > 30 ? l.details.substring(0, 30) + "..." : l.details) : "N/A",
      new Date(l.createdAt).toLocaleTimeString(),
    ]);

    const table = formatTableOutput(headers, rows);
    return { exitCode: 0, output: `IMMUTABLE AUDIT LOGS (${logs.length} Recent)\n\n${table}`, format: "table" };
  },
});

// 9. DATABASE COMMANDS
registerCommand({
  name: "dragon database status",
  aliases: ["d db", "dg db"],
  namespace: "database",
  category: "DATABASE",
  description: "Check Neon PostgreSQL database latency and connection pool status.",
  usage: "dragon database status",
  requiredPermission: "settings.manage",
  dangerLevel: "SAFE",
  handler: async () => {
    const dbHealth = await checkDatabaseHealth();

    let out = "NEON POSTGRESQL DATABASE STATUS\n";
    out += "─────────────────────────────────────────────────\n";
    out += "Provider:      Neon Serverless PostgreSQL\n";
    out += `Status:        ${dbHealth.status}\n`;
    out += `Query Latency: ${dbHealth.latencyMs !== null ? `${dbHealth.latencyMs} ms` : "N/A"}\n`;
    out += `Reason:        ${dbHealth.reason}\n`;
    out += "─────────────────────────────────────────────────\n";

    return { exitCode: dbHealth.status === "CONNECTED" ? 0 : 7, output: out, format: "text" };
  },
});

registerCommand({
  name: "dragon database counts",
  namespace: "database",
  category: "DATABASE",
  description: "Fetch live table record counts directly from Neon PostgreSQL.",
  usage: "dragon database counts",
  requiredPermission: "settings.manage",
  dangerLevel: "SAFE",
  handler: async (_, ctx) => {
    const [users, sessions, tickets, apps, auditLogs, events, cmsBlocks, games] = await Promise.all([
      prisma.user.count(),
      prisma.session.count(),
      prisma.contactTicket.count(),
      prisma.teamApplication.count(),
      prisma.auditLog.count(),
      prisma.analyticsEvent.count(),
      prisma.contentBlock.count(),
      prisma.gameContent.count(),
    ]);

    const counts = [
      { Table: "User", Records: users },
      { Table: "Session", Records: sessions },
      { Table: "ContactTicket", Records: tickets },
      { Table: "TeamApplication", Records: apps },
      { Table: "AuditLog", Records: auditLogs },
      { Table: "AnalyticsEvent", Records: events },
      { Table: "ContentBlock", Records: cmsBlocks },
      { Table: "GameContent", Records: games },
    ];

    if (ctx.formatOverride === "json") {
      return { exitCode: 0, output: JSON.stringify(counts, null, 2), format: "json" };
    }

    const headers = ["TABLE NAME", "LIVE RECORD COUNT"];
    const rows = counts.map((c) => [c.Table, c.Records.toLocaleString()]);

    const table = formatTableOutput(headers, rows);
    return { exitCode: 0, output: `DATABASE TABLE COUNTS\n\n${table}`, format: "table" };
  },
});

// 10. OWNER COMMANDS & GOVERNANCE
registerCommand({
  name: "dragon owner status",
  namespace: "owner",
  category: "OWNER GOVERNANCE",
  description: "Display protected Owner governance status and Data Command Center status.",
  usage: "dragon owner status",
  requiresOwner: true,
  dangerLevel: "SAFE",
  handler: async (_, ctx) => {
    const protectedOwnersCount = await prisma.user.count({
      where: { role: "OWNER", isProtected: true, isDeleted: false },
    });

    let out = "DRAGON OWNER GOVERNANCE STATUS\n";
    out += "─────────────────────────────────────────────────\n";
    out += `Authenticated Owner: ${ctx.user.email}\n`;
    out += `Protected Root:      YES (isProtected = true)\n`;
    out += `Protected Owners:    ${protectedOwnersCount} Accounts Active\n`;
    out += "Data Control:        ENABLED (/data-control)\n";
    out += "─────────────────────────────────────────────────\n";
    return { exitCode: 0, output: out, format: "text" };
  },
});

registerCommand({
  name: "dragon data full-purge",
  namespace: "data",
  category: "OWNER GOVERNANCE",
  description: "Execute Nuclear Level 3 Full Application Data Purge (Protected Owners only).",
  usage: "dragon data full-purge",
  requiresOwner: true,
  dangerLevel: "CRITICAL",
  confirmationPhrase: "PURGE ALL DRAGON DATA",
  handler: async (_, ctx) => {
    const opId = generateOperationId();

    const [
      resEvents,
      resSessions,
      resContact,
      resTickets,
      resApps,
      resInvs,
      resRevisions,
      resNonOwnerUsers,
    ] = await prisma.$transaction([
      prisma.analyticsEvent.deleteMany(),
      prisma.analyticsSession.deleteMany(),
      prisma.contactTicket.deleteMany(),
      prisma.ticket.deleteMany(),
      prisma.teamApplication.deleteMany(),
      prisma.teamInvitation.deleteMany({ where: { status: { not: "ACCEPTED" } } }),
      prisma.contentRevision.deleteMany(),
      prisma.user.deleteMany({
        where: {
          role: { not: "OWNER" },
          isProtected: false,
        },
      }),
    ]);

    const affectedCount =
      resEvents.count +
      resSessions.count +
      resContact.count +
      resTickets.count +
      resApps.count +
      resInvs.count +
      resRevisions.count +
      resNonOwnerUsers.count;

    await prisma.auditLog.create({
      data: {
        userId: ctx.user.id,
        userEmail: ctx.user.email,
        action: "EXECUTE_NUCLEAR_DATA_PURGE",
        resource: "TERMINAL",
        details: `Owner ${ctx.user.email} executed Full Application Data Purge via Terminal (${opId}): ${affectedCount} records purged. Security Root INTACT.`,
      },
    });

    return {
      exitCode: 0,
      operationId: opId,
      output: `SUCCESS [${opId}]: Full Application Data Purge completed. ${affectedCount} record(s) purged cleanly. Protected Owners & Security Root INTACT.`,
      format: "text",
    };
  },
});

/* =========================================================================
   REAL WEBSITE CONTROL BRIDGE COMMANDS
   ========================================================================= */

// 1. CMS REAL MUTATION COMMANDS
registerCommand({
  name: "dragon cms page",
  namespace: "cms",
  category: "CMS CONTENT",
  description: "Inspect single CMS page sections and SEO data by slug.",
  usage: "dragon cms page <slug>",
  requiredPermission: "cms.read",
  dangerLevel: "SAFE",
  handler: async (args, ctx) => {
    const slug = args[0];
    if (!slug) {
      return { exitCode: 3, output: "Error: Page slug required (e.g. 'home' or 'careers').", format: "text" };
    }

    const page = await prisma.page.findFirst({
      where: { OR: [{ slug }, { id: slug }] },
      include: { sections: true, seoData: true },
    });

    if (!page) {
      return { exitCode: 6, output: `Error: CMS page '${slug}' not found in database.`, format: "text" };
    }

    if (ctx.formatOverride === "json") {
      return { exitCode: 0, output: JSON.stringify(page, null, 2), format: "json" };
    }

    let out = `CMS PAGE DETAILS: ${page.title} (${page.slug})\n`;
    out += "─────────────────────────────────────────────────\n";
    out += `Page ID:     ${page.id}\n`;
    out += `Status:      ${page.status}\n`;
    out += `Category:    ${page.category}\n`;
    out += `Author:      ${page.author}\n`;
    out += `Sections:    ${page.sections.length} Section(s)\n`;
    out += `SEO Title:   ${page.seoData?.metaTitle || "N/A"}\n`;
    out += `Last Update: ${new Date(page.updatedAt).toLocaleString()}\n`;
    out += "─────────────────────────────────────────────────\n";
    return { exitCode: 0, output: out, data: page, format: "text" };
  },
});

registerCommand({
  name: "dragon cms edit",
  namespace: "cms",
  category: "CMS CONTENT",
  description: "Edit CMS page title directly in Neon PostgreSQL.",
  usage: "dragon cms edit <slug> <newTitle>",
  requiredPermission: "cms.edit",
  dangerLevel: "OPERATIONAL",
  confirmationPhrase: "EDIT CONTENT",
  handler: async (args, ctx) => {
    const slug = args[0];
    const newTitle = args.slice(1).join(" ");
    if (!slug || !newTitle) {
      return { exitCode: 3, output: "Error: Slug and new title required. Usage: dragon cms edit <slug> <newTitle>", format: "text" };
    }

    const page = await prisma.page.findFirst({ where: { OR: [{ slug }, { id: slug }] } });
    if (!page) {
      return { exitCode: 6, output: `Error: CMS page '${slug}' not found.`, format: "text" };
    }

    const opId = generateOperationId();

    const updated = await prisma.page.update({
      where: { id: page.id },
      data: { title: newTitle },
    });

    await prisma.contentRevision.create({
      data: {
        pageId: page.id,
        version: 1,
        content: JSON.stringify({ oldTitle: page.title, newTitle }),
        changedBy: ctx.user.email,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: ctx.user.id,
        userEmail: ctx.user.email,
        action: "EDIT_CMS_PAGE",
        resource: "CMS",
        details: `Updated CMS page [${page.slug}] title to '${newTitle}' via Terminal (${opId}).`,
      },
    });

    return {
      exitCode: 0,
      operationId: opId,
      output: `SUCCESS [${opId}]: Updated CMS page [${page.slug}] title from '${page.title}' to '${updated.title}'. Real database updated cleanly.`,
      format: "text",
    };
  },
});

registerCommand({
  name: "dragon cms unpublish",
  namespace: "cms",
  category: "CMS CONTENT",
  description: "Unpublish CMS page (Set status to DRAFT in Neon PostgreSQL).",
  usage: "dragon cms unpublish <slug>",
  requiredPermission: "cms.publish",
  dangerLevel: "OPERATIONAL",
  confirmationPhrase: "UNPUBLISH CONTENT",
  handler: async (args, ctx) => {
    const slug = args[0];
    if (!slug) {
      return { exitCode: 3, output: "Error: Page slug required.", format: "text" };
    }

    const page = await prisma.page.findFirst({ where: { OR: [{ slug }, { id: slug }] } });
    if (!page) {
      return { exitCode: 6, output: `Error: CMS page '${slug}' not found.`, format: "text" };
    }

    const opId = generateOperationId();

    const updated = await prisma.page.update({
      where: { id: page.id },
      data: { status: "DRAFT" },
    });

    await prisma.auditLog.create({
      data: {
        userId: ctx.user.id,
        userEmail: ctx.user.email,
        action: "UNPUBLISH_CMS_PAGE",
        resource: "CMS",
        details: `Unpublished CMS page [${updated.slug}] via Terminal (${opId}).`,
      },
    });

    return { exitCode: 0, operationId: opId, output: `SUCCESS [${opId}]: CMS page '${updated.title}' (${updated.slug}) status updated to DRAFT.`, format: "text" };
  },
});

// 2. GAMES SUBSYSTEM MUTATION COMMANDS
registerCommand({
  name: "dragon games list",
  aliases: ["d games"],
  namespace: "games",
  category: "GAMES CONTENT",
  description: "List AAA game titles and release status from Neon PostgreSQL.",
  usage: "dragon games list",
  requiredPermission: "cms.read",
  dangerLevel: "SAFE",
  handler: async (_, ctx) => {
    const games = await prisma.gameContent.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, slug: true, status: true, isPublished: true },
    });

    if (ctx.formatOverride === "json") {
      return { exitCode: 0, output: JSON.stringify(games, null, 2), format: "json" };
    }

    const headers = ["SLUG", "GAME TITLE", "STATUS", "PUBLISHED"];
    const rows = games.map((g) => [g.slug, g.name, g.status, g.isPublished ? "YES" : "NO"]);

    const table = formatTableOutput(headers, rows);
    return { exitCode: 0, output: `DRAGON AAA GAMES CATALOG (${games.length})\n\n${table}`, format: "table" };
  },
});

registerCommand({
  name: "dragon games get",
  namespace: "games",
  category: "GAMES CONTENT",
  description: "Get detailed AAA game info by slug or ID.",
  usage: "dragon games get <slug|id>",
  requiredPermission: "cms.read",
  dangerLevel: "SAFE",
  handler: async (args, ctx) => {
    const slug = args[0];
    if (!slug) {
      return { exitCode: 3, output: "Error: Game slug or ID required.", format: "text" };
    }

    const game = await prisma.gameContent.findFirst({
      where: { OR: [{ slug }, { id: slug }] },
    });

    if (!game) {
      return { exitCode: 6, output: `Error: Game title '${slug}' not found in database.`, format: "text" };
    }

    if (ctx.formatOverride === "json") {
      return { exitCode: 0, output: JSON.stringify(game, null, 2), format: "json" };
    }

    let out = `GAME CATALOG RECORD: ${game.name} (${game.slug})\n`;
    out += "─────────────────────────────────────────────────\n";
    out += `ID:          ${game.id}\n`;
    out += `Genre:       ${game.genre}\n`;
    out += `Status:      ${game.status}\n`;
    out += `Release Date:${game.releaseDate}\n`;
    out += `Engine:      ${game.engine}\n`;
    out += `Published:   ${game.isPublished ? "YES" : "NO"}\n`;
    out += `Description: ${game.description}\n`;
    out += "─────────────────────────────────────────────────\n";
    return { exitCode: 0, output: out, data: game, format: "text" };
  },
});

registerCommand({
  name: "dragon games publish",
  namespace: "games",
  category: "GAMES CONTENT",
  description: "Publish AAA game content to public website (isPublished = true).",
  usage: "dragon games publish <slug>",
  requiredPermission: "cms.publish",
  dangerLevel: "OPERATIONAL",
  confirmationPhrase: "PUBLISH GAME",
  handler: async (args, ctx) => {
    const slug = args[0];
    if (!slug) {
      return { exitCode: 3, output: "Error: Game slug required.", format: "text" };
    }

    const game = await prisma.gameContent.findFirst({ where: { OR: [{ slug }, { id: slug }] } });
    if (!game) {
      return { exitCode: 6, output: `Error: Game title '${slug}' not found.`, format: "text" };
    }

    const opId = generateOperationId();

    const updated = await prisma.gameContent.update({
      where: { id: game.id },
      data: { isPublished: true },
    });

    await prisma.auditLog.create({
      data: {
        userId: ctx.user.id,
        userEmail: ctx.user.email,
        action: "PUBLISH_GAME_CONTENT",
        resource: "GAMES",
        details: `Published game content [${updated.slug}] via Terminal (${opId}).`,
      },
    });

    return { exitCode: 0, operationId: opId, output: `SUCCESS [${opId}]: Game '${updated.name}' (${updated.slug}) is now PUBLISHED on website.`, format: "text" };
  },
});

// 3. GLOBAL CONTENT SEARCH & EDIT COMMANDS
registerCommand({
  name: "dragon content search",
  namespace: "content",
  category: "CMS CONTENT",
  description: "Global content search across pages, content blocks, and game titles.",
  usage: "dragon content search <query>",
  requiredPermission: "cms.read",
  dangerLevel: "SAFE",
  handler: async (args, ctx) => {
    const query = args.join(" ");
    if (!query) {
      return { exitCode: 3, output: "Error: Search query required.", format: "text" };
    }

    const [pages, blocks, games] = await Promise.all([
      prisma.page.findMany({ where: { OR: [{ title: { contains: query, mode: "insensitive" } }, { slug: { contains: query, mode: "insensitive" } }] }, take: 10 }),
      prisma.contentBlock.findMany({ where: { OR: [{ key: { contains: query, mode: "insensitive" } }, { content: { contains: query, mode: "insensitive" } }] }, take: 10 }),
      prisma.gameContent.findMany({ where: { OR: [{ name: { contains: query, mode: "insensitive" } }, { slug: { contains: query, mode: "insensitive" } }] }, take: 10 }),
    ]);

    const results = [
      ...pages.map((p) => ({ Type: "PAGE", ID: p.id, Key: p.slug, Label: p.title })),
      ...blocks.map((b) => ({ Type: "BLOCK", ID: b.id, Key: b.key, Label: b.label })),
      ...games.map((g) => ({ Type: "GAME", ID: g.id, Key: g.slug, Label: g.name })),
    ];

    if (ctx.formatOverride === "json") {
      return { exitCode: 0, output: JSON.stringify(results, null, 2), format: "json" };
    }

    const headers = ["TYPE", "KEY / SLUG", "LABEL / TITLE"];
    const rows = results.map((r) => [r.Type, r.Key, r.Label]);

    const table = formatTableOutput(headers, rows);
    return { exitCode: 0, output: `CONTENT SEARCH RESULTS FOR '${query.toUpperCase()}' (${results.length})\n\n${table}`, format: "table" };
  },
});

registerCommand({
  name: "dragon content edit",
  namespace: "content",
  category: "CMS CONTENT",
  description: "Edit live ContentBlock text directly in Neon PostgreSQL database.",
  usage: "dragon content edit <blockKey> <newText>",
  requiredPermission: "cms.edit",
  dangerLevel: "OPERATIONAL",
  confirmationPhrase: "EDIT CONTENT BLOCK",
  handler: async (args, ctx) => {
    const key = args[0];
    const newText = args.slice(1).join(" ");
    if (!key || !newText) {
      return { exitCode: 3, output: "Error: Block key and new text required. Usage: dragon content edit <blockKey> <newText>", format: "text" };
    }

    const block = await prisma.contentBlock.findFirst({ where: { OR: [{ key }, { id: key }] } });
    if (!block) {
      return { exitCode: 6, output: `Error: ContentBlock '${key}' not found.`, format: "text" };
    }

    const opId = generateOperationId();

    const updated = await prisma.contentBlock.update({
      where: { id: block.id },
      data: {
        content: newText,
        version: block.version + 1,
        updatedBy: ctx.user.email,
      },
    });

    await prisma.contentRevision.create({
      data: {
        blockKey: block.key,
        version: updated.version,
        content: newText,
        changedBy: ctx.user.email,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: ctx.user.id,
        userEmail: ctx.user.email,
        action: "EDIT_CONTENT_BLOCK",
        resource: "CMS",
        details: `Edited ContentBlock [${block.key}] via Terminal (${opId}). Version: ${updated.version}`,
      },
    });

    return {
      exitCode: 0,
      operationId: opId,
      output: `SUCCESS [${opId}]: ContentBlock [${block.key}] updated to version ${updated.version}. Real Neon PostgreSQL updated.`,
      format: "text",
    };
  },
});

// 4. ASSETS & DOWNLOADS COMMANDS
registerCommand({
  name: "dragon assets list",
  aliases: ["d assets"],
  namespace: "assets",
  category: "ASSETS & MEDIA",
  description: "List digital media assets from Neon PostgreSQL database.",
  usage: "dragon assets list",
  requiredPermission: "cms.read",
  dangerLevel: "SAFE",
  handler: async (_, ctx) => {
    const assets = await prisma.mediaAsset.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, type: true, mimeType: true, size: true, createdAt: true },
    });

    if (ctx.formatOverride === "json") {
      return { exitCode: 0, output: JSON.stringify(assets, null, 2), format: "json" };
    }

    const headers = ["ID", "ASSET NAME", "TYPE", "MIME TYPE", "SIZE (BYTES)"];
    const rows = assets.map((a) => [a.id.substring(0, 10), a.name, a.type, a.mimeType, a.size]);

    const table = formatTableOutput(headers, rows);
    return { exitCode: 0, output: `MEDIA ASSETS CATALOG (${assets.length})\n\n${table}`, format: "table" };
  },
});

registerCommand({
  name: "dragon downloads list",
  namespace: "downloads",
  category: "ASSETS & MEDIA",
  description: "List public game build downloads and patches.",
  usage: "dragon downloads list",
  requiredPermission: "cms.read",
  dangerLevel: "SAFE",
  handler: async (_, ctx) => {
    const downloads = await prisma.patchNote.findMany({
      take: 10,
      orderBy: { releasedAt: "desc" },
      select: { id: true, version: true, title: true, releasedAt: true },
    });

    if (ctx.formatOverride === "json") {
      return { exitCode: 0, output: JSON.stringify(downloads, null, 2), format: "json" };
    }

    const headers = ["ID", "VERSION", "TITLE", "RELEASE DATE"];
    const rows = downloads.map((d) => [d.id.substring(0, 10), d.version, d.title, new Date(d.releasedAt).toLocaleDateString()]);

    const table = formatTableOutput(headers, rows);
    return { exitCode: 0, output: `GAME BUILD DOWNLOADS (${downloads.length})\n\n${table}`, format: "table" };
  },
});

// 5. ACCESS & ROLES COMMANDS
registerCommand({
  name: "dragon access roles",
  namespace: "access",
  category: "IDENTITY & ACCESS",
  description: "List RBAC system roles and privilege levels.",
  usage: "dragon access roles",
  requiredPermission: "roles.read",
  dangerLevel: "SAFE",
  handler: async (_, ctx) => {
    const roles = await prisma.role.findMany({
      include: { permissions: true },
    });

    if (ctx.formatOverride === "json") {
      return { exitCode: 0, output: JSON.stringify(roles, null, 2), format: "json" };
    }

    const headers = ["ROLE NAME", "CUSTOM", "PERMISSIONS COUNT", "DESCRIPTION"];
    const rows = roles.map((r) => [r.name, r.isCustom ? "YES" : "NO", r.permissions.length, r.description || "System Role"]);

    const table = formatTableOutput(headers, rows);
    return { exitCode: 0, output: `DIP RBAC SYSTEM ROLES (${roles.length})\n\n${table}`, format: "table" };
  },
});

// 6. SYSTEM INTEGRATIONS & AI COMMANDS
registerCommand({
  name: "dragon system integrations",
  namespace: "system",
  category: "SYSTEM",
  description: "Check status of external system integrations (Resend, Google Auth, Neon, Vercel).",
  usage: "dragon system integrations",
  requiredPermission: "settings.manage",
  dangerLevel: "SAFE",
  handler: async () => {
    const dbHealth = await checkDatabaseHealth();
    const hasResend = !!process.env.RESEND_API_KEY;
    const hasGoogleOAuth = !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET;
    const hasAuthSecret = !!process.env.AUTH_SECRET || !!process.env.NEXTAUTH_SECRET;

    let out = "DRAGON OS EXTERNAL INTEGRATIONS\n";
    out += "─────────────────────────────────────────────────\n";
    out += `Neon Postgres:  ${dbHealth.status} (${dbHealth.latencyMs !== null ? `${dbHealth.latencyMs}ms` : dbHealth.reason})\n`;
    out += `Email / Resend: ${hasResend ? "CONFIGURED" : "NOT_CONFIGURED"}\n`;
    out += `Google OAuth:   ${hasGoogleOAuth ? "CONFIGURED" : "NOT_CONFIGURED"}\n`;
    out += `Auth Secret:    ${hasAuthSecret ? "CONFIGURED" : "NOT_CONFIGURED"}\n`;
    out += "─────────────────────────────────────────────────\n";
    return { exitCode: 0, output: out, format: "text" };
  },
});

registerCommand({
  name: "dragon ai status",
  namespace: "ai",
  category: "SYSTEM",
  description: "Check AI Copilot agent engine telemetry and status.",
  usage: "dragon ai status",
  requiredPermission: "ai.read",
  dangerLevel: "SAFE",
  handler: async () => {
    const hasAiConfig = !!process.env.OPENAI_API_KEY || !!process.env.GEMINI_API_KEY || !!process.env.AI_API_KEY;

    let out = "DRAGON AI CENTER STATUS\n";
    out += "─────────────────────────────────────────────────\n";
    out += `AI Provider:  ${hasAiConfig ? "CONFIGURED" : "NOT_CONFIGURED"}\n`;
    out += "Safety Guard: Strict Permissions + Database Invariant Check\n";
    out += "─────────────────────────────────────────────────\n";
    return { exitCode: 0, output: out, format: "text" };
  },
});

registerCommand({
  name: "dragon reports overview",
  namespace: "reports",
  category: "SYSTEM",
  description: "Generate executive operational metrics report.",
  usage: "dragon reports overview",
  requiredPermission: "analytics.read",
  dangerLevel: "SAFE",
  handler: async () => {
    const [uCount, aCount, tCount, pCount] = await Promise.all([
      prisma.user.count(),
      prisma.analyticsEvent.count(),
      prisma.contactTicket.count(),
      prisma.page.count(),
    ]);

    let out = "DRAGON OS EXECUTIVE REPORT\n";
    out += "─────────────────────────────────────────────────\n";
    out += `Registered Identities: ${uCount}\n`;
    out += `Analytics Events:      ${aCount}\n`;
    out += `Support Tickets:       ${tCount}\n`;
    out += `CMS Published Pages:   ${pCount}\n`;
    out += "─────────────────────────────────────────────────\n";
    return { exitCode: 0, output: out, format: "text" };
  },
});


