import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/auth";
import { COMMAND_REGISTRY } from "@/lib/terminal/command-registry";
import { can } from "@dragon/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth || !auth.user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const user = auth.user;
    const allCommands = Object.values(COMMAND_REGISTRY);

    // Filter duplicate alias pointers in registry
    const uniqueCommandsMap: Record<string, typeof allCommands[0]> = {};
    allCommands.forEach((cmd) => {
      if (!uniqueCommandsMap[cmd.name]) {
        uniqueCommandsMap[cmd.name] = cmd;
      }
    });

    const commandList = Object.values(uniqueCommandsMap).map((cmd) => {
      // Check user access
      let isAllowed = true;
      if (cmd.requiresOwner && !(user.role === "OWNER" && user.isProtected)) {
        isAllowed = false;
      } else if (cmd.requiredPermission) {
        const hasPerm = can({ role: user.role, permissions: null }, cmd.requiredPermission);
        if (!hasPerm && user.role !== "OWNER") {
          isAllowed = false;
        }
      }

      return {
        name: cmd.name,
        aliases: cmd.aliases || [],
        namespace: cmd.namespace,
        category: cmd.category,
        description: cmd.description,
        usage: cmd.usage,
        examples: cmd.examples || [],
        arguments: cmd.arguments || [],
        options: cmd.options || [],
        requiredPermission: cmd.requiredPermission || "Public / Auth",
        requiresOwner: Boolean(cmd.requiresOwner),
        dangerLevel: cmd.dangerLevel,
        confirmationPhrase: cmd.confirmationPhrase,
        isAllowed,
      };
    });

    return NextResponse.json({
      success: true,
      userRole: user.role,
      isProtectedOwner: user.role === "OWNER" && Boolean(user.isProtected),
      totalCommands: commandList.length,
      commands: commandList,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error fetching registry";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
