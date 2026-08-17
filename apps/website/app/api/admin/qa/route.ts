import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const qaData = {
      releaseReadinessScore: 98.4,
      totalTestCases: 142,
      passedTests: 138,
      failedTests: 2,
      blockedTests: 2,
      testSuites: [
        { id: "suite-1", name: "Vulkan 1.3 & DX12 Graphics Pipeline", game: "Embers of Valyria", total: 45, passed: 44, failed: 1, status: "READY" },
        { id: "suite-2", name: "128Hz Netcode & Multiplayer Sync", game: "Blacksite Zero", total: 50, passed: 49, failed: 1, status: "READY" },
        { id: "suite-3", name: "DragonID Session & Cloud Saves Sync", game: "Platform", total: 47, passed: 45, failed: 0, status: "PASSED" },
      ],
      activeTestCases: [
        { id: "TC-101", title: "DLSS 3.5 Frame Generation at 4K Resolution", suite: "Graphics Pipeline", priority: "CRITICAL", result: "PASS", tester: "Sarah (Lead QA)" },
        { id: "TC-102", title: "Dedicated Server packet loss recovery during tick spike", suite: "Netcode Sync", priority: "HIGH", result: "PASS", tester: "Devon (Netcode QA)" },
        { id: "TC-103", title: "DualSense Wireless Controller adaptive trigger haptics", suite: "Input & Haptics", priority: "NORMAL", result: "FAIL", tester: "Priya (Hardware QA)" },
        { id: "TC-104", title: "Cross-platform cloud save conflict resolution", suite: "Cloud Saves", priority: "HIGH", result: "PASS", tester: "Alex (Backend QA)" },
      ],
      releaseChecklist: [
        { feature: "Feature Freeze & Code Lock", status: "VERIFIED", signoffBy: "Lead Architect" },
        { feature: "Security & Penetration Audit", status: "VERIFIED", signoffBy: "SecOps Lead" },
        { feature: "Performance & Memory Leak Scan", status: "VERIFIED", signoffBy: "Engine Lead" },
        { feature: "QA Regression & Smoke Test Suite", status: "VERIFIED", signoffBy: "QA Director" },
      ],
    };

    return NextResponse.json({ success: true, qa: qaData });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, testId, result, title, suite, priority } = body;

    if (action === "update_result") {
      await prisma.auditLog.create({
        data: {
          action: "QA_UPDATE_TEST_RESULT",
          userEmail: "QA Tester",
          details: `Updated Test Case ${testId} result to ${result}`,
        },
      });
      return NextResponse.json({ success: true, message: `Test ${testId} result updated to ${result}.` });
    }

    if (action === "create_test_case") {
      await prisma.auditLog.create({
        data: {
          action: "QA_CREATE_TEST_CASE",
          userEmail: "QA Lead",
          details: `Created Test Case: ${title} (${priority}) in suite: ${suite}`,
        },
      });
      return NextResponse.json({ success: true, message: "New test case added to QA matrix." });
    }

    return NextResponse.json({ success: true, message: "QA action processed." });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
