export interface AIProcessingResult {
  summary: string;
  category: string;
  urgency: "CRITICAL" | "HIGH" | "NORMAL" | "LOW";
  spamScore: number; // 0.0 (legit) to 1.0 (spam)
  suggestedReply: string;
  keywords: string[];
  tags: string[];
  estimatedResponseTime: string;
}

/**
 * Enterprise AI Inbound Contact Analysis Engine
 */
export function analyzeContactSubmission(data: {
  name: string;
  email: string;
  company?: string | null;
  category: string;
  subject: string;
  message: string;
}): AIProcessingResult {
  const content = `${data.subject} ${data.message}`.toLowerCase();
  
  // 1. Spam Score Calculation
  let spamScore = 0.05;
  const spamTriggers = [
    "seo services", "buy backlinks", "crypto investment", "casino", "pills",
    "cheap leads", "guaranteed ranking", "whatsapp me", "telegram", "earn $",
    "wire transfer", "inheritance", "million dollars", "claim prize"
  ];
  spamTriggers.forEach((trigger) => {
    if (content.includes(trigger)) spamScore += 0.35;
  });
  spamScore = Math.min(spamScore, 0.99);

  // 2. Department & Category Classification
  let category = data.category || "General Inquiries";
  if (content.includes("publish") || content.includes("investment") || content.includes("partnership") || content.includes("license")) {
    category = "Publishing & Business";
  } else if (content.includes("press") || content.includes("interview") || content.includes("review code") || content.includes("media")) {
    category = "Press & Media";
  } else if (content.includes("crash") || content.includes("bug") || content.includes("glitch") || content.includes("graphics") || content.includes("engine")) {
    category = "Engineering & Technology";
  } else if (content.includes("career") || content.includes("resume") || content.includes("job") || content.includes("hiring")) {
    category = "Careers & Recruitment";
  }

  // 3. Urgency Determination
  let urgency: "CRITICAL" | "HIGH" | "NORMAL" | "LOW" = "NORMAL";
  if (category === "Publishing & Business" || content.includes("urgent") || content.includes("vulnerability") || content.includes("exploit")) {
    urgency = "HIGH";
  }
  if (content.includes("zero-day") || content.includes("breach") || content.includes("legal notice")) {
    urgency = "CRITICAL";
  }

  // 4. Estimated Response Time based on SLA
  let estimatedResponseTime = "Within 24 Hours";
  if (urgency === "CRITICAL") estimatedResponseTime = "Within 2 Hours";
  else if (urgency === "HIGH") estimatedResponseTime = "Within 6 Hours";

  // 5. Summary Generation
  const cleanMsg = data.message.replace(/\s+/g, " ").trim();
  const summary = cleanMsg.length > 180 ? `${cleanMsg.substring(0, 180)}...` : cleanMsg;

  // 6. Keywords & Tags
  const keywords = Array.from(
    new Set(
      content
        .replace(/[^a-z0-9 ]/g, "")
        .split(" ")
        .filter((w) => w.length > 4 && !["about", "would", "there", "their", "which", "could"].includes(w))
    )
  ).slice(0, 6);

  const tags = [category.toUpperCase().replace(/\s+/g, "_"), `URGENCY_${urgency}`];

  // 7. AI Suggested Reply for Admin Approval
  const suggestedReply = `Hello ${data.name},

Thank you for reaching out to Dragon Studios Command Center regarding "${data.subject}".

Our ${category} engineering team has reviewed your inquiry. We are currently analyzing the specifications provided and will dispatch a comprehensive technical response shortly.

If you have additional attachments or context to provide, please reply directly to this thread or track your ticket status at our Support Center.

Best regards,
Dragon Studios Support Team`;

  return {
    summary,
    category,
    urgency,
    spamScore,
    suggestedReply,
    keywords,
    tags,
    estimatedResponseTime,
  };
}
