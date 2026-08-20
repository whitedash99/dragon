import { NextRequest, NextResponse } from "next/server";
import { generateGeminiText, analyzeTicketWithAi, generateSeoWithAi } from "@/lib/ai/gemini";
import { prisma } from "@/lib/database/prisma";
import { getAuthenticatedUser } from "@/lib/auth/auth";

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  try {
    const auth = await getAuthenticatedUser();
    const userEmail = auth?.user?.email || "admin@dragongamingstudios.com";

    const body = await req.json();
    const { action, prompt, text, targetLanguage, ticketData, currentContent } = body;

    // 0. God-Level CMS Copy Rewriter (Gemini 2.5)
    if (action === "cms_rewrite") {
      const rewritePrompt = prompt || `Make this gaming studio copy more epic, punchy, and cinematic: "${currentContent || text}". Return ONLY the rewritten text.`;
      const result = await generateGeminiText({
        prompt: rewritePrompt,
        systemInstruction: "You are a world-class game studio creative director and lead copywriter. You write legendary, punchy, immersive gaming headlines, subheadlines, and announcements for 3D & 2D games.",
      });
      await recordUsage("cms_rewrite", startTime, userEmail);
      return NextResponse.json({ success: true, result, completion: result });
    }

    // 1. CRM Support Ticket Analysis
    if (action === "analyze_ticket") {
      if (ticketData) {
        const analysis = await analyzeTicketWithAi(ticketData);
        await recordUsage("crm_summary", startTime, userEmail);
        return NextResponse.json({ success: true, analysis });
      }
      return NextResponse.json({ success: false, error: "ticketData is required for ticket analysis" }, { status: 400 });
    }

    // 2. SEO Metadata Generation
    if (action === "generate_seo") {
      const topic = prompt || text || "Dragon Studios Gaming";
      const seo = await generateSeoWithAi(topic);
      await recordUsage("seo", startTime, userEmail);
      return NextResponse.json({ success: true, seo });
    }

    // 3. Multilingual Content Translation
    if (action === "translate") {
      const lang = targetLanguage || "Japanese";
      const translationPrompt = `Translate the following gaming content into natural ${lang}:\n\n"${text || prompt}"`;
      const translatedText = await generateGeminiText({ prompt: translationPrompt });
      await recordUsage("translate", startTime, userEmail);
      return NextResponse.json({ success: true, translatedText });
    }

    // 4. CMS Content Generation
    if (action === "generate_content") {
      const contentPrompt = `Write a professional game studio announcement about: "${prompt || text}". Format with Markdown headers and bullet points.`;
      const generatedContent = await generateGeminiText({ prompt: contentPrompt });
      await recordUsage("content", startTime, userEmail);
      return NextResponse.json({ success: true, generatedContent });
    }

    // 5. Studio AI Chat Completion
    const completion = await generateGeminiText({ prompt: prompt || text || "Dragon Studios AI status check" });
    await recordUsage("chat", startTime, userEmail);

    return NextResponse.json({ success: true, completion });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

async function recordUsage(feature: string, startTime: number, userEmail: string) {
  const elapsed = (Date.now() - startTime) / 1000;
  try {
    await prisma.aIUsage.create({
      data: {
        feature,
        model: "gemini-2.5-flash",
        tokens: 350,
        responseTime: elapsed,
        status: "SUCCESS",
        userEmail,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "EXECUTE_AI_FEATURE",
        userEmail,
        details: `Executed AI feature [${feature}] in ${elapsed.toFixed(2)}s`,
      },
    }).catch((e) => console.warn("AuditLog warning:", e));
  } catch (e) {
    console.error("Error recording AI usage", e);
  }
}
