import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/auth";
import { COMMAND_REGISTRY } from "@/lib/terminal/command-registry";
import { can } from "@dragon/auth";
import { prisma } from "@/lib/database/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth || !auth.user) {
      return NextResponse.json(
        {
          exitCode: 401,
          output: "HTTP 401 — UNAUTHENTICATED: Please sign in to Dragon Admin OS.",
          format: "text",
        },
        { status: 401 }
      );
    }

    const body = await req.json();
    const rawInput = (body.command || "").trim();
    const confirmationPhrase = body.confirmationPhrase || "";
    const requestedFormat = body.format;

    if (!rawInput) {
      return NextResponse.json({
        exitCode: 2,
        output: "Error: No command input provided. Type 'dragon help' for available commands.",
        format: "text",
      });
    }

    // Command Tokenizer (handles spaces & arguments)
    const tokens = rawInput.match(/(?:[^\s"]+|"[^"]*")+/g) || [rawInput];
    const cleanTokens = tokens.map((t: string) => t.replace(/^"|"$/g, ""));

    // Find best command match in COMMAND_REGISTRY
    let matchedCmdDef = null;
    let matchedNameLength = 0;

    for (const [cmdKey, cmdDef] of Object.entries(COMMAND_REGISTRY)) {
      const keyParts = cmdKey.split(" ");
      const match = keyParts.every((part, idx) => cleanTokens[idx]?.toLowerCase() === part.toLowerCase());
      if (match && keyParts.length > matchedNameLength) {
        matchedCmdDef = cmdDef;
        matchedNameLength = keyParts.length;
      }
    }

    if (!matchedCmdDef) {
      return NextResponse.json({
        exitCode: 2,
        output: `Command not recognized: '${rawInput}'. Type 'dragon help' or '?' for available commands.`,
        format: "text",
      });
    }

    const args = cleanTokens.slice(matchedNameLength);

    // 1. Role / Owner Authorization Check
    const user = auth.user;
    if (matchedCmdDef.requiresOwner) {
      const isOwner = user.role === "OWNER" && Boolean(user.isProtected);
      if (!isOwner) {
        return NextResponse.json({
          exitCode: 403,
          output: `ACCESS DENIED: Command '${matchedCmdDef.name}' requires a protected OWNER account.`,
          format: "text",
        });
      }
    }

    // 2. Permission Check
    if (matchedCmdDef.requiredPermission) {
      const hasPerm = can({ role: user.role, permissions: null }, matchedCmdDef.requiredPermission);
      if (!hasPerm && user.role !== "OWNER") {
        return NextResponse.json({
          exitCode: 403,
          output: `FORBIDDEN: Permission '${matchedCmdDef.requiredPermission}' required for '${matchedCmdDef.name}'.`,
          format: "text",
        });
      }
    }

    // 3. Danger Level & Confirmation Check
    if (matchedCmdDef.dangerLevel === "HIGH" || matchedCmdDef.dangerLevel === "CRITICAL" || matchedCmdDef.dangerLevel === "OPERATIONAL") {
      const expected = matchedCmdDef.confirmationPhrase || "CONFIRM";
      if (!confirmationPhrase || confirmationPhrase.trim().toUpperCase() !== expected.toUpperCase()) {
        return NextResponse.json({
          exitCode: 400,
          requiresConfirmation: true,
          dangerLevel: matchedCmdDef.dangerLevel,
          expectedPhrase: expected,
          output: `DANGEROUS OPERATION [${matchedCmdDef.dangerLevel}]: High-risk operation '${matchedCmdDef.name}'. Type exact confirmation phrase '${expected}' to proceed.`,
          format: "text",
        });
      }
    }

    // 4. Execute Command Handler
    const startTime = Date.now();
    const result = await matchedCmdDef.handler(args, {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isProtected: user.isProtected,
        name: user.name,
      },
      confirmationPhrase,
      formatOverride: requestedFormat || (args.includes("--format=json") || args.includes("json") ? "json" : undefined),
    });

    const durationMs = Date.now() - startTime;

    // 5. Immutable Audit Log Entry
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userEmail: user.email,
        action: `EXECUTE_TERMINAL_${matchedCmdDef.name.replace(/\s+/g, "_").toUpperCase()}`,
        resource: "TERMINAL",
        details: `Executed terminal command: '${rawInput}' (Exit Code: ${result.exitCode}, Duration: ${durationMs}ms)`,
      },
    }).catch((e) => console.warn("Terminal audit log error:", e));

    return NextResponse.json({
      command: matchedCmdDef.name,
      exitCode: result.exitCode,
      output: result.output,
      data: result.data,
      format: result.format,
      durationMs,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Command execution error";
    return NextResponse.json({
      exitCode: 1,
      output: `SYSTEM ERROR: ${message}`,
      format: "text",
    });
  }
}
