"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import {
  Mail,
  Search,
  Loader2,
  Calendar,
  User,
  ArrowLeft,
  Inbox,
  Send,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { formatRelativeDate } from "@/utils/format-date";

interface Email {
  id: string;
  userId: string;
  to: string;
  toName: string | null;
  from: string;
  subject: string;
  htmlBody: string;
  sentAt: string;
}

export default function InboxPage() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  
  // Mobile navigation helper: if true, show detail view on mobile
  const [showMobileDetail, setShowMobileDetail] = useState(false);

  useEffect(() => {
    async function fetchEmails() {
      try {
        const res = await api.get("/api/email");
        const data = res.data.data || res.data || [];
        setEmails(data);
        if (data.length > 0) {
          setSelectedEmail(data[0]);
        }
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to fetch emails.");
      } finally {
        setLoading(false);
      }
    }
    fetchEmails();
  }, []);


  const getSnippet = (html: string) => {
    const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    return text.length > 60 ? text.slice(0, 60) + "..." : text;
  };

  const filteredEmails = emails.filter((email) => {
    const term = searchQuery.toLowerCase();
    const toMatch = email.to.toLowerCase();
    const toNameMatch = (email.toName || "").toLowerCase();
    const subjectMatch = email.subject.toLowerCase();
    const bodyMatch = email.htmlBody.toLowerCase();
    return (
      toMatch.includes(term) ||
      toNameMatch.includes(term) ||
      subjectMatch.includes(term) ||
      bodyMatch.includes(term)
    );
  });

  const selectEmail = (email: Email) => {
    setSelectedEmail(email);
    setShowMobileDetail(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Loading Outbox…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row overflow-hidden bg-background">
      
      {/* ── LEFT PANE: EMAIL LIST ── */}
      <div 
        className={`w-full md:w-[380px] lg:w-[420px] border-r border-border flex flex-col h-full shrink-0 ${
          showMobileDetail ? "hidden md:flex" : "flex"
        }`}
      >
        {/* Pane Header */}
        <div className="p-4 border-b border-border/60 bg-card/30 space-y-3 shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold tracking-tight">Sent Mail</h1>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Manage your outbound communications and client interactions
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <Send className="w-4 h-4" />
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recipients, subjects, body…"
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background text-xs placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/50 font-medium transition-shadow"
            />
          </div>
        </div>

        {/* Email list */}
        <div className="flex-1 overflow-y-auto divide-y divide-border/40">
          {filteredEmails.length === 0 ? (
            <div className="p-8 text-center space-y-4 mt-8">
              <div className="w-12 h-12 rounded-full bg-muted/60 border border-border flex items-center justify-center mx-auto text-muted-foreground">
                <Inbox className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-foreground">No emails found</p>
                <p className="text-xs text-muted-foreground max-w-[240px] mx-auto leading-relaxed">
                  {searchQuery ? "Try resetting your search filters." : "You haven't sent any emails yet using the CRM AI Composer."}
                </p>
              </div>
            </div>
          ) : (
            filteredEmails.map((email) => {
              const isSelected = selectedEmail?.id === email.id;
              return (
                <button
                  key={email.id}
                  onClick={() => selectEmail(email)}
                  className={`w-full text-left p-4 transition-all hover:bg-muted/40 flex items-start gap-3.5 relative cursor-pointer ${
                    isSelected ? "bg-muted/50 border-r-2 border-primary" : ""
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-xs text-primary shrink-0 mt-0.5">
                    {(email.toName || email.to)?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold text-foreground truncate">
                        {email.toName || email.to}
                      </p>
                      <p className="text-[10px] text-muted-foreground whitespace-nowrap">
                        {formatRelativeDate(email.sentAt)}
                      </p>
                    </div>
                    <p className="text-xs font-semibold text-foreground/80 truncate">
                      {email.subject}
                    </p>
                    <p className="text-[11px] text-muted-foreground leading-normal truncate">
                      {getSnippet(email.htmlBody)}
                    </p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0 self-center md:hidden" />
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ── RIGHT PANE: EMAIL DETAIL ── */}
      <div 
        className={`flex-1 flex flex-col h-full bg-card/10 ${
          showMobileDetail ? "flex" : "hidden md:flex"
        }`}
      >
        <AnimatePresence mode="wait">
          {selectedEmail ? (
            <motion.div 
              key={selectedEmail.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex flex-col h-full overflow-hidden"
            >
              {/* Detail Header */}
              <div className="px-6 py-4 border-b border-border/60 bg-card/30 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowMobileDetail(false)}
                    className="md:hidden text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <div>
                    <h2 className="text-sm font-bold text-foreground truncate max-w-[280px] lg:max-w-md">
                      {selectedEmail.subject}
                    </h2>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      Sent {new Date(selectedEmail.sentAt).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Envelope Info */}
              <div className="px-6 py-4 border-b border-border/40 bg-muted/10 shrink-0 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground border border-border flex items-center justify-center font-bold text-sm shrink-0">
                    {(selectedEmail.toName || selectedEmail.to)?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-foreground">
                      To: {selectedEmail.toName || "Client"}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {selectedEmail.to}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground border border-border rounded px-2 py-0.5 bg-background">
                    Sent via CRM-X
                  </span>
                </div>
              </div>

              {/* Email Content Frame */}
              <div className="flex-1 overflow-y-auto px-6 py-6 bg-background">
                <div className="max-w-2xl mx-auto rounded-xl border border-border bg-card p-6 lg:p-8 shadow-xs">
                  {/* HTML Body display */}
                  <div 
                    className="prose prose-sm dark:prose-invert max-w-none text-xs text-foreground/90 space-y-4"
                    dangerouslySetInnerHTML={{ __html: selectedEmail.htmlBody }}
                  />
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-center bg-background">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-muted/60 border border-border flex items-center justify-center mx-auto text-muted-foreground">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-foreground">No Email Selected</p>
                  <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                    Select a correspondence from the list on the left to read the full thread contents.
                  </p>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
