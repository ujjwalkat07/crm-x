'use client'

import { useState, useEffect, useCallback } from 'react'
import { useGoogleLogin } from '@react-oauth/google'
import {
  fetchEmails,
  fetchLabels,
  formatEmailDate,
  getInitials,
} from '@/lib/gmail'
import {
  Mail,
  Inbox,
  Send,
  Star,
  Trash2,
  FileText,
  RefreshCw,
  LogOut,
  Search,
  ChevronRight,
  X,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Reply,
  Forward,
  MoreHorizontal,
  Pencil,
  CheckCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'react-toastify'
import { Folder, GmailLabel, ParsedEmail } from '@/types/types'

const FOLDERS: Folder[] = [
  { id: 'inbox', label: 'Inbox', icon: <Inbox className="w-4 h-4" />, gmailLabelId: 'INBOX' },
  { id: 'sent', label: 'Sent', icon: <Send className="w-4 h-4" />, gmailLabelId: 'SENT' },
  { id: 'drafts', label: 'Drafts', icon: <FileText className="w-4 h-4" />, gmailLabelId: 'DRAFT' },
  { id: 'starred', label: 'Starred', icon: <Star className="w-4 h-4" />, gmailLabelId: 'STARRED' },
  { id: 'trash', label: 'Trash', icon: <Trash2 className="w-4 h-4" />, gmailLabelId: 'TRASH' },
]

const TOKEN_KEY = 'gmail_access_token'
const EMAIL_KEY = 'gmail_connected_email'

function AvatarCircle({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' }) {
  const colors = [
    'bg-violet-500', 'bg-blue-500', 'bg-emerald-500',
    'bg-amber-500', 'bg-rose-500', 'bg-cyan-500', 'bg-pink-500',
  ]
  const colorIndex = name.charCodeAt(0) % colors.length
  const sizeClass = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm'
  return (
    <div className={`${sizeClass} ${colors[colorIndex]} rounded-full flex items-center justify-center font-bold text-white shrink-0`}>
      {getInitials(name)}
    </div>
  )
}

function EmailRow({
  email,
  isSelected,
  onClick,
}: {
  email: ParsedEmail
  isSelected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3.5 border-b border-border flex items-start gap-3 transition-all hover:bg-muted/40 ${
        isSelected ? 'bg-primary/5 border-l-2 border-l-primary' : 'border-l-2 border-l-transparent'
      } ${!email.isRead ? 'bg-card' : 'bg-background/50'}`}
    >
      <AvatarCircle name={email.fromName || email.fromEmail} size="sm" />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <span className={`text-sm truncate ${!email.isRead ? 'font-semibold text-foreground' : 'font-medium text-muted-foreground'}`}>
            {email.fromName || email.fromEmail}
          </span>
          <span className="text-[10px] text-muted-foreground shrink-0 font-medium">
            {formatEmailDate(email.date)}
          </span>
        </div>
        <p className={`text-xs truncate mb-0.5 ${!email.isRead ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
          {email.subject}
        </p>
        <p className="text-[11px] text-muted-foreground/70 truncate leading-tight">
          {email.snippet}
        </p>
      </div>

      {!email.isRead && (
        <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
      )}
    </button>
  )
}

function EmailDetail({ email, onClose }: { email: ParsedEmail; onClose: () => void }) {
  return (
    <div className="flex flex-col h-full">
      {/* Detail Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="md:hidden text-muted-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-foreground text-sm leading-tight truncate">
            {email.subject}
          </h2>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" title="Reply">
            <Reply className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" title="Forward">
            <Forward className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" title="More options">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Sender Info */}
      <div className="flex items-start gap-4 px-6 py-4 border-b border-border shrink-0">
        <AvatarCircle name={email.fromName || email.fromEmail} />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-semibold text-sm text-foreground">
              {email.fromName || email.fromEmail}
            </span>
            <span className="text-xs text-muted-foreground truncate">
              &lt;{email.fromEmail}&gt;
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            To: {email.to}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {new Date(email.date).toLocaleString([], {
              weekday: 'short', year: 'numeric', month: 'short',
              day: 'numeric', hour: '2-digit', minute: '2-digit',
            })}
          </p>
        </div>
      </div>

      {/* Email Body */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="prose prose-sm max-w-none text-foreground/80 text-sm leading-relaxed whitespace-pre-wrap break-words">
          {email.body || email.snippet || '(Empty message)'}
        </div>
      </div>

      {/* Quick Reply */}
      <div className="shrink-0 px-6 py-4 border-t border-border bg-muted/20">
        <div
          className="w-full border border-border rounded-lg px-4 py-3 text-sm text-muted-foreground bg-background cursor-text hover:border-primary/40 transition-colors"
          onClick={() => toast.info('Compose reply coming soon!')}
        >
          Click to reply to {email.fromName || email.fromEmail}…
        </div>
      </div>
    </div>
  )
}

function ConnectScreen({ onConnect }: { onConnect: () => void }) {
  const login = useGoogleLogin({
    onSuccess: (response) => {
      localStorage.setItem(TOKEN_KEY, response.access_token)
      onConnect()
    },
    onError: (err) => {
      console.error('Google login failed', err)
      toast.error('Google sign-in failed. Please try again.')
    },
    scope: [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/userinfo.email',
    ].join(' '),
  })

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
          <Mail className="w-9 h-9 text-primary" />
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-2">Connect Your Inbox</h1>
        <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
          Connect your Gmail account to read and manage your emails directly inside CRM-X — no tab switching required.
        </p>

        {/* Feature list */}
        <ul className="text-left space-y-3 mb-8 bg-muted/30 border border-border rounded-xl p-5">
          {[
            'Read real emails from your Gmail inbox',
            'Browse Inbox, Sent, Starred, Drafts & Trash',
            'Full email body with sender details',
            'Secure — uses read-only Gmail access',
          ].map((feat) => (
            <li key={feat} className="flex items-center gap-3 text-sm text-muted-foreground">
              <CheckCheck className="w-4 h-4 text-primary shrink-0" />
              {feat}
            </li>
          ))}
        </ul>

        {/* Connect Button */}
        <button
          onClick={() => login()}
          className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 border border-gray-300 rounded-xl px-6 py-3.5 font-semibold text-sm hover:bg-gray-50 hover:shadow-md transition-all active:scale-[0.98] shadow-sm"
        >
          {/* Google SVG logo */}
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Sign in with Google
        </button>

        <p className="text-[11px] text-muted-foreground/60 mt-4 leading-relaxed">
          CRM-X only requests read-only access to your Gmail messages.
          Your credentials are never stored on our servers.
        </p>
      </div>
    </div>
  )
}

export default function InboxPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [emails, setEmails] = useState<ParsedEmail[]>([])
  const [labels, setLabels] = useState<GmailLabel[]>([])
  const [selectedEmail, setSelectedEmail] = useState<ParsedEmail | null>(null)
  const [activeFolder, setActiveFolder] = useState<Folder>(FOLDERS[0]!)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [connectedEmail, setConnectedEmail] = useState<string | null>(null)
  const [showMobileDetail, setShowMobileDetail] = useState(false)

  // Restore session on mount
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    const email = localStorage.getItem(EMAIL_KEY)
    if (token) {
      setIsConnected(true)
      setConnectedEmail(email)
    }
  }, [])

  const loadEmails = useCallback(async (labelId: string, showLoader = true) => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) return

    if (showLoader) setIsLoading(true)
    else setIsFetchingMore(true)
    setError(null)
    setSelectedEmail(null)

    try {
      const [fetchedEmails, fetchedLabels] = await Promise.all([
        fetchEmails(token, labelId, 20),
        fetchLabels(token),
      ])
      setEmails(fetchedEmails)
      setLabels(fetchedLabels)
    } catch (err: any) {
      const msg = err?.message || 'Failed to load emails'
      setError(msg)
      // Token expired — force reconnect
      if (msg.includes('401') || msg.toLowerCase().includes('unauthorized') || msg.toLowerCase().includes('invalid')) {
        handleDisconnect()
        toast.error('Session expired. Please reconnect your Gmail account.')
      }
    } finally {
      setIsLoading(false)
      setIsFetchingMore(false)
    }
  }, [])

  // Fetch emails when connected or folder changes
  useEffect(() => {
    if (isConnected) {
      loadEmails(activeFolder.gmailLabelId)
    }
  }, [isConnected, activeFolder, loadEmails])

  const handleConnect = () => {
    setIsConnected(true)
  }

  const handleDisconnect = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(EMAIL_KEY)
    setIsConnected(false)
    setEmails([])
    setLabels([])
    setSelectedEmail(null)
    setConnectedEmail(null)
  }

  const handleSelectEmail = (email: ParsedEmail) => {
    setSelectedEmail(email)
    setShowMobileDetail(true)
    // Mark as read locally
    setEmails(prev =>
      prev.map(e => e.id === email.id ? { ...e, isRead: true } : e)
    )
  }

  const handleFolderChange = (folder: Folder) => {
    setActiveFolder(folder)
    setSelectedEmail(null)
    setShowMobileDetail(false)
    setSearchQuery('')
  }

  const filteredEmails = emails.filter(email => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      email.subject.toLowerCase().includes(q) ||
      email.fromName.toLowerCase().includes(q) ||
      email.fromEmail.toLowerCase().includes(q) ||
      email.snippet.toLowerCase().includes(q)
    )
  })

  const unreadCount = emails.filter(e => !e.isRead).length

  if (!isConnected) {
    return <ConnectScreen onConnect={handleConnect} />
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-background">

      {/* ── Left: Folder Sidebar ─────────────────────────────────────── */}
      <aside className={`w-56 shrink-0 border-r border-border bg-card flex flex-col ${showMobileDetail ? 'hidden' : 'hidden md:flex'}`}>

        {/* Account chip */}
        <div className="px-4 py-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0">
              {connectedEmail ? connectedEmail[0]?.toUpperCase() : 'G'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">Gmail</p>
              <p className="text-[10px] text-muted-foreground truncate">{connectedEmail || 'Connected'}</p>
            </div>
          </div>
        </div>

        {/* Compose button */}
        <div className="px-3 py-3 border-b border-border">
          <button
            onClick={() => toast.info('Compose feature coming soon!')}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-lg px-3 py-2.5 text-xs font-semibold hover:bg-primary/90 transition-all active:scale-[0.98]"
          >
            <Pencil className="w-3.5 h-3.5" />
            Compose
          </button>
        </div>

        {/* Folders */}
        <nav className="flex-1 py-2 overflow-y-auto">
          {FOLDERS.map((folder) => {
            const isActive = activeFolder.id === folder.id
            return (
              <button
                key={folder.id}
                onClick={() => handleFolderChange(folder)}
                className={`w-full flex items-center justify-between gap-2.5 px-4 py-2.5 text-sm font-medium transition-all rounded-none hover:bg-muted/60 ${
                  isActive
                    ? 'bg-primary/10 text-primary border-r-2 border-r-primary'
                    : 'text-muted-foreground'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {folder.icon}
                  <span>{folder.label}</span>
                </div>
            
              </button>
            )
          })}
        </nav>

        {/* Disconnect */}
        <div className="p-3 border-t border-border">
          <button
            onClick={handleDisconnect}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Disconnect Gmail
          </button>
        </div>
      </aside>

      {/* ── Center: Email List ────────────────────────────────────────── */}
      <div className={`flex flex-col border-r border-border bg-background ${
        showMobileDetail ? 'hidden md:flex md:w-80 lg:w-96 shrink-0' : 'flex-1 md:w-80 lg:w-96 md:flex-none md:shrink-0'
      }`}>

        {/* List header */}
        <div className="px-4 py-3.5 border-b border-border shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h1 className="font-semibold text-foreground text-sm">{activeFolder.label}</h1>
              {unreadCount > 0 && activeFolder.id === 'inbox' && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground">
                  {unreadCount}
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => loadEmails(activeFolder.gmailLabelId, false)}
              disabled={isFetchingMore}
              className="text-muted-foreground hover:text-foreground w-7 h-7"
              title="Refresh"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isFetchingMore ? 'animate-spin' : ''}`} />
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search emails…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-muted/50 border border-border rounded-lg pl-8 pr-8 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/40 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Email list body */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <p className="text-xs">Loading emails…</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 p-6 text-center">
              <AlertCircle className="w-8 h-8 text-destructive/70" />
              <div>
                <p className="text-sm font-medium text-foreground">Failed to load emails</p>
                <p className="text-xs text-muted-foreground mt-1">{error}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => loadEmails(activeFolder.gmailLabelId)}
                className="text-xs"
              >
                Try again
              </Button>
            </div>
          ) : filteredEmails.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-center p-6">
              <Mail className="w-8 h-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                {searchQuery ? 'No emails match your search' : 'No emails in this folder'}
              </p>
            </div>
          ) : (
            filteredEmails.map((email) => (
              <EmailRow
                key={email.id}
                email={email}
                isSelected={selectedEmail?.id === email.id}
                onClick={() => handleSelectEmail(email)}
              />
            ))
          )}
        </div>
      </div>

      {/* ── Right: Email Detail ───────────────────────────────────────── */}
      <div className={`flex-1 flex flex-col overflow-hidden ${
        showMobileDetail ? 'flex' : 'hidden md:flex'
      }`}>
        {selectedEmail ? (
          <EmailDetail
            email={selectedEmail}
            onClose={() => {
              setSelectedEmail(null)
              setShowMobileDetail(false)
            }}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-muted-foreground">
            <div className="w-16 h-16 rounded-2xl bg-muted/50 border border-border flex items-center justify-center mb-4">
              <Mail className="w-7 h-7 text-muted-foreground/50" />
            </div>
            <p className="text-sm font-medium text-foreground/70">Select an email to read</p>
            <p className="text-xs text-muted-foreground mt-1">
              {filteredEmails.length > 0
                ? `${filteredEmails.length} email${filteredEmails.length !== 1 ? 's' : ''} in ${activeFolder.label}`
                : 'Your inbox is empty'}
            </p>
          </div>
        )}
      </div>

      {/* ── Mobile: Folder switcher bottom bar ───────────────────────── */}
      {!showMobileDetail && (
        <div className="fixed bottom-0 left-0 right-0 md:hidden bg-card border-t border-border flex items-center justify-around px-2 py-2 z-30">
          {FOLDERS.map((folder) => {
            const isActive = activeFolder.id === folder.id
            return (
              <button
                key={folder.id}
                onClick={() => handleFolderChange(folder)}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {folder.icon}
                <span className="text-[9px] font-medium">{folder.label}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
