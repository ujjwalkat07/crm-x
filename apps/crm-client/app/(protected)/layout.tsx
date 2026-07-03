"use client";

import { useAuth } from "../../provider/AuthProvider";
import { api } from "@/lib/axios";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
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
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Menu,
  X,
  Sun,
  Moon,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "axios";

function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [error, setError] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Theme Sync on Mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    const initialTheme = savedTheme || (systemPrefersDark ? "dark" : "light");
    setTheme(initialTheme);

    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);

    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Sparkles className="w-10 h-10 animate-pulse text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const userData = (user as any)?.data || user;
  const fullName = userData?.fullName || userData?.fullname || "CRM Member";
  const email = userData?.email || "member@crm.com";

  // Initials for avatar
  const initials = fullName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout");
      window.location.href = "/login";
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message || "Logout failed. Please try again.",
        );
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  const navLinks = [
    { name: "Leads", href: "/leads", icon: Users },
    { name: "Inbox", href: "/inbox", icon: Mail },
    { name: "Profile", href: "/profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-muted/10 text-foreground flex flex-col">
      {/* Top Header */}
      <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-6 md:px-8 shadow-xs">
        {/* Left Side: Brand Logo */}
        <div className="flex items-center gap-6">
          <Link href="/leads" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-xs shrink-0 transition-transform group-hover:scale-105">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent truncate">
              CRM-X
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 ml-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-xs shadow-primary/10"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-muted-foreground hover:text-foreground cursor-pointer rounded-lg p-2 transition-all active:scale-95 shrink-0 animate-in fade-in duration-300"
            title={
              theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"
            }
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5 transition-transform duration-300 hover:rotate-12" />
            ) : (
              <Sun className="w-5 h-5 text-amber-500 transition-transform duration-500 hover:rotate-90" />
            )}
          </Button>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-muted transition-all outline-none cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground border border-border flex items-center justify-center font-medium text-xs shadow-inner">
                  {initials}
                </div>
                <span className="hidden sm:block text-xs font-semibold text-foreground/80 leading-none">
                  {fullName.split(" ")[0]}
                </span>
                <ChevronDown className="hidden sm:block w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer flex items-center gap-2"
                onClick={() => router.push("/profile")}
              >
                <User className="w-4 h-4 opacity-70" />
                Profile Details
              </DropdownMenuItem>

              <DropdownMenuItem
                className="cursor-pointer flex items-center gap-2"
                disabled
              >
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

          {/* Mobile Menu Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-muted-foreground hover:text-foreground p-1 hover:bg-muted rounded-md cursor-pointer"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
      </header>

      {/* Mobile Dropdown Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-card shadow-md animate-in slide-in-from-top-4 duration-200 z-30">
          <nav className="px-4 py-4 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}

      {/* Page Content */}
      <main className="flex-1 bg-muted/5 min-w-0">{children}</main>
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
