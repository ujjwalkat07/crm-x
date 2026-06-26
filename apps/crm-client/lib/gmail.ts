// Gmail REST API helper — all calls made directly from the browser using the
// OAuth access token obtained via @react-oauth/google

import { GmailLabel, GmailListResponse, GmailMessage, GmailMessagePart, ParsedEmail } from "@/types/types";

const GMAIL_BASE = "https://gmail.googleapis.com/gmail/v1/users/me";

async function gmailFetch(endpoint: string, token: string) {
  const res = await fetch(`${GMAIL_BASE}${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Gmail API error: ${res.status}`);
  }
  return res.json();
}

/** Decode base64url encoded string to UTF-8 text */
function decodeBase64(data: string): string {
  try {
    const base64 = data.replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder("utf-8").decode(bytes);
  } catch {
    return "";
  }
}

/** Recursively extract plain text or HTML body from message parts */
function extractBody(part: GmailMessagePart): string {
  // Prefer text/plain, fall back to text/html
  if (part.mimeType === "text/plain" && part.body?.data) {
    return decodeBase64(part.body.data);
  }
  if (part.mimeType === "text/html" && part.body?.data) {
    // Strip basic HTML tags for plain rendering
    const html = decodeBase64(part.body.data);
    return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  }
  if (part.parts) {
    // Try text/plain first across nested parts
    const plain = part.parts.find((p) => p.mimeType === "text/plain");
    if (plain) {
      const result = extractBody(plain);
      if (result) return result;
    }
    for (const p of part.parts) {
      const result = extractBody(p);
      if (result) return result;
    }
  }
  return "";
}

/** Get header value from message payload */
function getHeader(payload: GmailMessagePart, name: string): string {
  return (
    payload.headers?.find(
      (h) => h.name.toLowerCase() === name.toLowerCase()
    )?.value || ""
  );
}

/** Parse sender into name and email */
function parseSender(from: string): { name: string; email: string } {
  const match = from.match(/^(.*?)\s*<(.+?)>$/);
  if (match) {
    return {
      name: match[1]?.trim().replace(/^"|"$/g, "") ?? "",
      email: match[2]?.trim() ?? "",
    };
  }
  return { name: from, email: from };
}

/** Fetch list of message IDs for a label */
export async function fetchMessageList(
  token: string,
  labelId = "INBOX",
  maxResults = 20,
  pageToken?: string
): Promise<GmailListResponse> {
  const params = new URLSearchParams({
    labelIds: labelId,
    maxResults: String(maxResults),
  });
  if (pageToken) params.set("pageToken", pageToken);
  return gmailFetch(`/messages?${params}`, token);
}

/** Fetch a single message with full payload */
export async function fetchMessage(
  token: string,
  messageId: string
): Promise<GmailMessage> {
  return gmailFetch(`/messages/${messageId}?format=full`, token);
}

/** Parse a raw GmailMessage into a clean ParsedEmail object */
export function parseMessage(msg: GmailMessage): ParsedEmail {
  const payload = msg.payload || {};
  const subject = getHeader(payload, "subject") || "(No Subject)";
  const from = getHeader(payload, "from") || "";
  const to = getHeader(payload, "to") || "";
  const date = getHeader(payload, "date") || "";
  const { name: fromName, email: fromEmail } = parseSender(from);

  const body = extractBody(payload);
  const isRead = !msg.labelIds?.includes("UNREAD");
  const isStarred = msg.labelIds?.includes("STARRED") ?? false;

  return {
    id: msg.id,
    threadId: msg.threadId,
    subject,
    from,
    fromName,
    fromEmail,
    to,
    date,
    snippet: msg.snippet || "",
    body,
    isRead,
    isStarred,
    labelIds: msg.labelIds || [],
  };
}

/** Fetch labels with unread counts */
export async function fetchLabels(token: string): Promise<GmailLabel[]> {
  const data = await gmailFetch("/labels", token);
  return data.labels || [];
}

/** Fetch a page of parsed emails for a given label */
export async function fetchEmails(
  token: string,
  labelId = "INBOX",
  maxResults = 15
): Promise<ParsedEmail[]> {
  const list = await fetchMessageList(token, labelId, maxResults);
  if (!list.messages?.length) return [];

  const messages = await Promise.all(
    list.messages.map((m) => fetchMessage(token, m.id))
  );
  return messages.map(parseMessage);
}

/** Format an ISO/RFC date string to a human-readable label */
export function formatEmailDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  } catch {
    return dateStr;
  }
}

/** Get initials from a name for avatar fallback */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
