'use client'

import { AuthProvider, useAuth } from '../../provider/AuthProvider'
import { api } from '@/lib/axios'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard,
  Users,
  Briefcase,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  User,
  ChevronDown,
  Sparkles,
  Menu,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuth()
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  const userData = (user as any)?.data || user
  const fullName = userData?.fullName || userData?.fullname || "CRM Member"
  const email = userData?.email || "member@crm.com"
  
  // Initials for avatar
  const initials = fullName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout')
      window.location.href = '/login'
    } catch (err) {
      console.error("Logout failed:", err)
      window.location.href = '/login'
    }
  }

  const navLinks = [
    { name: 'Dashboard', href: '#', icon: LayoutDashboard, disabled: true },
    { name: 'Leads', href: '/leads', icon: Users },
    { name: 'Deals', href: '#', icon: Briefcase, disabled: true },
    { name: 'Analytics', href: '#', icon: BarChart3, disabled: true },
    { name: 'Settings', href: '#', icon: Settings, disabled: true },
  ]

  return (
    <div className="min-h-screen bg-muted/10 text-foreground flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border h-screen fixed left-0 top-0 z-30">
        {/* Brand */}
        <div className="h-16 flex items-center gap-2.5 px-6 border-b border-border">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-xs">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            CRM-X
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navLinks.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href

            return (
              <Link
                key={link.name}
                href={link.disabled ? '#' : link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  link.disabled
                    ? 'opacity-40 cursor-not-allowed hover:bg-transparent'
                    : isActive
                    ? 'bg-primary text-primary-foreground shadow-xs shadow-primary/10'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
                onClick={(e) => link.disabled && e.preventDefault()}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                {link.name}
              </Link>
            )
          })}
        </nav>

        {/* Footer Profile */}
        <div className="p-4 border-t border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-semibold text-primary text-sm shadow-inner">
              {initials}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-card animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-foreground leading-tight">
                {fullName}
              </p>
              <p className="text-xs text-muted-foreground truncate leading-tight mt-0.5">
                {email}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Modal */}
      {isMobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setIsMobileSidebarOpen(false)} />
          <aside className="relative flex flex-col w-64 bg-card h-full border-r border-border animate-in slide-in-from-left duration-200">
            <div className="h-16 flex items-center justify-between px-6 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="font-bold text-lg">CRM-X</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsMobileSidebarOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
              {navLinks.map((link) => {
                const Icon = link.icon
                const isActive = pathname === link.href

                return (
                  <Link
                    key={link.name}
                    href={link.disabled ? '#' : link.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      link.disabled
                        ? 'opacity-40 cursor-not-allowed'
                        : isActive
                        ? 'bg-primary text-primary-foreground shadow-xs'
                        : 'text-muted-foreground hover:bg-muted'
                    }`}
                    onClick={(e) => {
                      if (link.disabled) e.preventDefault()
                      else setIsMobileSidebarOpen(false)
                    }}
                  >
                    <Icon className="w-4 h-4" />
                    {link.name}
                  </Link>
                )
              })}
            </nav>
            <div className="p-4 border-t border-border bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-semibold text-primary text-sm">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate leading-tight">{fullName}</p>
                  <p className="text-xs text-muted-foreground truncate leading-tight mt-0.5">{email}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Main Wrapper */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        {/* Top Header */}
        <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-6 md:px-8 shadow-xs">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-muted-foreground hover:text-foreground"
              onClick={() => setIsMobileSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div>
              <h2 className="text-base font-semibold text-foreground md:text-lg flex items-center gap-2">
                Leads Dashboard
              </h2>
            </div>
          </div>

          {/* Header Right */}
          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <Button
              variant="ghost"
              size="icon-xs"
              className="text-muted-foreground hover:text-foreground relative"
            >
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-destructive rounded-full" />
            </Button>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-muted transition-all outline-none cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground border border-border flex items-center justify-center font-medium text-xs shadow-inner">
                    {initials}
                  </div>
                  <span className="hidden sm:block text-xs font-semibold text-foreground/80 leading-none">
                    {fullName.split(' ')[0]}
                  </span>
                  <ChevronDown className="hidden sm:block w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                  <User className="w-4 h-4 opacity-70" />
                  Profile Details
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer flex items-center gap-2" disabled>
                  <Settings className="w-4 h-4 opacity-70" />
                  Preferences
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive focus:bg-destructive/10 cursor-pointer flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 bg-muted/5 min-w-0">
          {children}
        </main>
      </div>
    </div>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DashboardShell>{children}</DashboardShell>
    </AuthProvider>
  )
}