import { Response } from "express";
import { AuthRequest } from "../../middleware/jwt-verify";
import nodemailer from "nodemailer";
import { config } from "../../config/env-config/config";
import { prisma } from "../../lib/prisma";

const NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1";

// ── Controller: AI Generate Email 
export const aiGenerateEmail = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const { contactEmail, contactName, userMessage } = req.body;

    if (!userMessage || !contactEmail) {
      return res.status(400).json({
        message: "Missing required fields: contactEmail and userMessage are required.",
      });
    }

    const nvidiaKey = config.NVIDIA_API_KEY

    const systemPrompt = `You are an email drafting assistant inside CRM-X, a professional CRM platform.
The recipient is: ${contactName} <${contactEmail}>.

Your ONLY job is to output a valid JSON object with exactly two keys:
- "subject": a concise, professional email subject line (plain text, no markdown)
- "htmlBody": the full email body as clean HTML (use <p>, <strong>, <em>, <ul>, <li>, <br> tags only — NO markdown, NO code blocks, NO extra explanation)

The email should be professional, polished, and appropriately signed off.
Do NOT include any other text, explanation, or markdown outside the JSON object.
Return ONLY the JSON object.`;

    const response = await fetch(`${NVIDIA_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${nvidiaKey}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        temperature: 0.7,
        top_p: 1,
        max_tokens: 1024,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("NVIDIA API error:", errText);
      return res.status(response.status).json({
        message: "AI request failed. Please try again.",
      });
    }

    const data: any = await response.json();
    const rawText: string = data.choices?.[0]?.message?.content ?? "";

    console.log("Raw text:", rawText);

    let subject = "";
    let htmlBody = "";
    try {
      // Strip markdown code fences if model wrapped the JSON
      const cleaned = rawText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
      const parsed = JSON.parse(cleaned);
      subject = parsed.subject ?? "";
      htmlBody = parsed.htmlBody ?? parsed.body ?? rawText;
    } catch {
      htmlBody = `<p>${rawText.replace(/\n/g, "<br>")}</p>`;
    }

    return res.status(200).json({ subject, htmlBody });

  } catch (error: unknown) {
    console.error("aiGenerateEmail error:", error);
    return res.status(500).json({
      message: "Internal server error during AI generation.",
    });
  }
};

// ── Controller: Send Email via SMTP 
export const sendEmail = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const { to, toName, subject, htmlBody } = req.body;

    if (!to || !subject || !htmlBody) {
      return res.status(400).json({
        message: "Missing required fields: to, subject, and htmlBody are required.",
      });
    }

    const host = config.SMTP_HOST || "smtp.gmail.com";
    const port = Number(config.SMTP_PORT) || 587;
    const user = config.SMTP_USER;
    const pass = config.SMTP_PASS;
    const secureFlag = config.SMTP_SECURE;

    // Auto-enable secure (SSL/TLS) for port 465, or if explicitly configured as "true"
    const secure = secureFlag === "true" || port === 465;

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });

    const fromAddress = config.SMTP_FROM || user;

    const info = await transporter.sendMail({
      from: `"CRM-X" <${fromAddress}>`,
      to: toName ? `"${toName}" <${to}>` : to,
      subject,
      html: htmlBody,
    });

    // Save email record to database if user is authenticated
    if (req.user?.id) {
      await prisma.email.create({
        data: {
          userId: req.user.id,
          to,
          toName: toName || null,
          from: fromAddress || "",
          subject,
          htmlBody,
        },
      });
    }

    return res.status(200).json({
      success: true,
      messageId: info.messageId,
    });

  } catch (error: any) {
    console.error("sendEmail error:", error);
    return res.status(500).json({
      message: error?.message ?? "Failed to send email. Check your SMTP credentials.",
    });
  }
};

// ── Controller: Get Sent Emails
export const getEmails = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const emails = await prisma.email.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: {
        sentAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      data: emails,
    });
  } catch (error: any) {
    console.error("getEmails error:", error);
    return res.status(500).json({
      message: "Internal server error while retrieving emails.",
    });
  }
};

