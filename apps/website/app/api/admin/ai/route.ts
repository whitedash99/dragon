import { NextRequest, NextResponse } from "next/server";
import { generateGeminiContent, summarizeSupportTicketWithAi, generateSeoWithAi } from "@/lib/ai/gemini";
import { analyzeContactSubmission } from "@/lib/ai/contact-processor";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, text, prompt, targetLanguage, ticketData } = body;

    // 1. Analyze / Summarize Support Ticket
    if (action === "analyze_ticket") {
      if (ticketData) {
        const aiSummaryText = await summarizeSupportTicketWithAi(ticketData);
        const processorResult = analyzeContactSubmission(ticketData);
        return NextResponse.json({
          success: true,
          analysis: {
            ...processorResult,
            aiSummaryText,
          },
        });
      }

      const processorResult = analyzeContactSubmission({
        name: "Customer",
        email: "customer@domain.com",
        subject: prompt || "Support Request",
        message: text || "",
        category: "Technical Support",
      });
      return NextResponse.json({ success: true, analysis: processorResult });
    }

    // 2. Generate SEO Metadata
    if (action === "generate_seo") {
      const subjectText = text || prompt || "Dragon Studios AAA Games";
      const seoData = await generateSeoWithAi(subjectText);
      return NextResponse.json({
        success: true,
        seo: seoData,
      });
    }

    // 3. Content Translation
    if (action === "translate") {
      const lang = targetLanguage || "Japanese";
      const translationPrompt = `Translate the following gaming text into natural ${lang}:\n\n"${text || prompt}"`;
      const translatedText = await generateGeminiContent({ prompt: translationPrompt });
      return NextResponse.json({
        success: true,
        translatedText,
      });
    }

    // 4. Content Generation (Blogs, Patch Notes, FAQs)
    if (action === "generate_content") {
      const contentPrompt = `Write a professional AAA game studio announcement about: "${prompt || text}". Format with Markdown headers and bullet points.`;
      const generatedContent = await generateGeminiContent({ prompt: contentPrompt });
      return NextResponse.json({
        success: true,
        generatedContent,
      });
    }

    // 5. General AI Prompt Completion
    const completion = await generateGeminiContent({ prompt: prompt || text || "Dragon Studios AI status check" });
    return NextResponse.json({
      success: true,
      completion,
    });
  } catch (error: any) {
    console.error("AI Route Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
