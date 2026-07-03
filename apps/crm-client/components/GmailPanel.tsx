"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Send,
  X,
  Sparkles,
  Loader2,
  Wand2,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { api } from "@/lib/axios";

// Dynamically import RichTextEditor to avoid SSR issues with Tiptap
const RichTextEditor = dynamic(() => import("./RichTextEditor"), {
  ssr: false,
});

type Props = {
  contactEmail?: string;
  contactName?: string;
  onClose: () => void;
};

type SendStatus = "idle" | "sending" | "success" | "error";

export default function GmailPanel({
  contactEmail = "",
  contactName = "",
  onClose,
}: Props) {
  // Recipient details states
  const [recipientEmail, setRecipientEmail] = useState(contactEmail);
  const [recipientName, setRecipientName] = useState(contactName);

  // Compose state
  const [subject, setSubject] = useState("");
  const [htmlBody, setHtmlBody] = useState("<p></p>");
  const [prompt, setPrompt] = useState("");

  // AI generation state
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState("");

  // Send state
  const [sendStatus, setSendStatus] = useState<SendStatus>("idle");
  const [sendError, setSendError] = useState("");

  // Prompt panel visibility
  const [promptOpen, setPromptOpen] = useState(true);

  // ── Generate email with AI
  async function handleGenerate() {
    if (!prompt.trim()) return;
    if (!recipientEmail.trim()) {
      setGenError("Please specify a recipient email first.");
      return;
    }
    setGenerating(true);
    setGenError("");

    try {
      const response = await api.post("/api/email/ai-generate", {
        contactEmail: recipientEmail,
        contactName: recipientName,
        userMessage: prompt,
      });

      const data = response.data;

      if (data.subject) setSubject(data.subject);
      if (data.htmlBody) setHtmlBody(data.htmlBody);
      setPromptOpen(false); // collapse the prompt box after generation
    } catch (err: any) {
      console.error(err);
      setGenError(err.response?.data?.message || "AI generation failed.");
    } finally {
      setGenerating(false);
    }
  }

  // ── Send the email
  async function handleSend() {
    if (!recipientEmail.trim()) {
      setSendError("Please specify a recipient email address.");
      setSendStatus("error");
      return;
    }
    if (!subject.trim() || !htmlBody || htmlBody === "<p></p>") return;

    setSendStatus("sending");
    setSendError("");

    try {
      const response = await api.post("/api/email/send", {
        to: recipientEmail,
        toName: recipientName,
        subject,
        htmlBody,
      });

      setSendStatus("success");
    } catch (err: any) {
      console.error(err);
      setSendStatus("error");
      setSendError(err.response?.data?.message || "Failed to send email.");
    }
  }

  const isBodyEmpty =
    !htmlBody || htmlBody === "<p></p>" || htmlBody === "<p><br></p>";

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 60 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="fixed inset-y-0 right-0 z-50 w-full max-w-[520px] flex flex-col shadow-2xl"
        style={{
          background: "var(--color-card)",
          borderLeft: "1px solid var(--color-border)",
        }}
      >
        {/* ── Header  */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold leading-none text-foreground">
                AI Email Composer
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5 truncate max-w-[260px]">
                {contactName} · {contactEmail}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Scrollable Body  */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* Success state */}
          <AnimatePresence>
            {sendStatus === "success" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center gap-3 py-10 text-center"
              >
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">
                    Email Sent!
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your email to {recipientName || recipientEmail} was
                    delivered successfully.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSendStatus("idle");
                    setSubject("");
                    setHtmlBody("<p></p>");
                    setPrompt("");
                    setPromptOpen(true);
                    if (!contactEmail) {
                      setRecipientName("");
                      setRecipientEmail("");
                    }
                  }}
                  className="mt-2 px-4 py-2 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                >
                  Compose Another
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {sendStatus !== "success" && (
            <>
              {/* Contact / Recipient Selection */}
              {contactEmail ? (
                <div className="flex items-center gap-2.5 rounded-lg border border-border bg-muted/30 px-3 py-2.5">
                  <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-xs text-primary shrink-0">
                    {recipientName?.[0]?.toUpperCase() ?? "?"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold text-foreground leading-none truncate">
                      {recipientName}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                      {recipientEmail}
                    </p>
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground border border-border rounded px-1.5 py-0.5">
                    To
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3.5 rounded-xl border border-border bg-muted/10 p-3.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                      To Name
                    </label>
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="Recipient name…"
                      className="w-full rounded-lg border border-border bg-background text-foreground text-xs px-3 py-2 placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-shadow font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                      To Email
                    </label>
                    <input
                      type="email"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      placeholder="Recipient email…"
                      className="w-full rounded-lg border border-border bg-background text-foreground text-xs px-3 py-2 placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-shadow font-medium"
                    />
                  </div>
                </div>
              )}

              {/* AI Prompt Panel */}
              <div className="rounded-xl border border-border bg-muted/20 overflow-hidden">
                <button
                  onClick={() => setPromptOpen(!promptOpen)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold text-foreground hover:bg-muted/40 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Wand2 className="w-3.5 h-3.5 text-primary" />
                    Generate with AI
                  </span>
                  {promptOpen ? (
                    <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                  )}
                </button>

                <AnimatePresence initial={false}>
                  {promptOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-3.5 pb-3.5 pt-1 space-y-2.5 border-t border-border">
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          Describe what to write — the AI will fill the editor
                          with a polished, ready-to-send email.
                        </p>
                        <textarea
                          rows={3}
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          placeholder={`e.g. "Ask ${contactName} for a referral for a Full-Stack role"`}
                          className="w-full rounded-lg border border-border bg-background text-foreground text-xs p-3 placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:ring-1 focus:ring-primary/50 transition-shadow"
                        />
                        {genError && (
                          <p className="text-[11px] text-destructive flex items-center gap-1.5">
                            <AlertCircle className="w-3 h-3 shrink-0" />
                            {genError}
                          </p>
                        )}
                        <button
                          onClick={handleGenerate}
                          disabled={generating || !prompt.trim()}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 disabled:opacity-50 transition-all active:scale-95"
                        >
                          {generating ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />{" "}
                              Generating…
                            </>
                          ) : (
                            <>
                              <Wand2 className="w-3.5 h-3.5" /> Generate Email
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Subject line */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Email subject…"
                  className="w-full rounded-lg border border-border bg-background text-foreground text-sm px-3 py-2 placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-shadow font-medium"
                />
              </div>

              {/* Rich Text Editor */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                  Email Body
                </label>
                <RichTextEditor
                  content={htmlBody}
                  onChange={setHtmlBody}
                  placeholder={`Write your email to ${contactName}…`}
                />
              </div>

              {/* Send error */}
              <AnimatePresence>
                {sendStatus === "error" && sendError && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="rounded-lg border border-destructive/30 bg-destructive/5 px-3.5 py-2.5 flex items-start gap-2 text-xs text-destructive"
                  >
                    <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    <span>{sendError}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>

        {/* ── Footer / Send Button  */}
        {sendStatus !== "success" && (
          <div className="px-5 py-3.5 border-t border-border shrink-0 flex items-center gap-3">
            <button
              onClick={handleSend}
              disabled={
                sendStatus === "sending" || !subject.trim() || isBodyEmpty
              }
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 disabled:opacity-40 transition-all active:scale-95"
            >
              {sendStatus === "sending" ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Sending…
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" /> Send to {contactName}
                </>
              )}
            </button>
            <div className="flex items-center gap-1.5 shrink-0">
              <Sparkles className="w-3 h-3 text-muted-foreground" />
              <p className="text-[10px] text-muted-foreground whitespace-nowrap">
                NVIDIA NIM
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
}
