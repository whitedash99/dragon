import { NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { hashPassword } from "@/lib/auth/auth";
import { generateDragonKey, hashDragonKey } from "@dragon/auth";

export async function POST() {
  try {
    const ownersList = [
      {
        email: "whitedash99@gmail.com",
        name: "Dragon Platform Owner (WhiteDash)",
        pass: "DragonFounder#2026!",
        keyRole: "OWNER_WD",
      },
      {
        email: "dragongamingstudio1212@gmail.com",
        name: "Dragon Gaming Studio Owner",
        pass: "DragonFounder#2026!",
        keyRole: "OWNER_DGS",
      },
      {
        email: "dragonstudiosofficial01@gmail.com",
        name: "Dragon Founder & CEO",
        pass: "DragonFounder#2026!",
        keyRole: "OWNER1",
      },
      {
        email: "dragonstudiosofficial02@gmail.com",
        name: "Dragon Co-Founder",
        pass: "DragonCoFounder#2026!",
        keyRole: "OWNER2",
      },
      {
        email: "cofounder@dragonstudios.com",
        name: "Dragon Executive Co-Founder",
        pass: "DragonCoFounder#2026!",
        keyRole: "OWNER3",
      },
    ];

    const provisionedOwners = [];

    for (const owner of ownersList) {
      const key = generateDragonKey(owner.keyRole);
      const user = await prisma.user.upsert({
        where: { email: owner.email },
        update: {
          password: await hashPassword(owner.pass),
          role: "OWNER",
          isProtected: true,
          isActive: true,
          status: "ACTIVE",
          isDeleted: false,
          securityScore: 100,
          permissions: JSON.stringify(["*"]),
        },
        create: {
          email: owner.email,
          name: owner.name,
          password: await hashPassword(owner.pass),
          role: "OWNER",
          department: "Executive Leadership",
          status: "ACTIVE",
          isProtected: true,
          isActive: true,
          securityScore: 100,
          dragonKeyPrefix: key.prefix,
          dragonKeyHash: await hashDragonKey(key.rawKey),
          provider: "google",
          permissions: JSON.stringify(["*"]),
        },
      });
      provisionedOwners.push({ email: user.email, role: "OWNER", id: user.id });
    }

    await prisma.auditLog.create({
      data: {
        userEmail: "whitedash99@gmail.com",
        action: "EXECUTIVE_OWNER_ACCOUNTS_PROVISIONED",
        resource: "DIP_IDENTITY_SEED",
        details: `Executive Owner accounts provisioned: whitedash99@gmail.com, dragongamingstudio1212@gmail.com, dragonstudiosofficial01@gmail.com, dragonstudiosofficial02@gmail.com`,
      },
    }).catch((e: unknown) => console.warn("Audit log warning:", e));

    return NextResponse.json({
      success: true,
      message: "Dragon Identity Platform Permanent Owner Accounts provisioned.",
      owners: provisionedOwners,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
