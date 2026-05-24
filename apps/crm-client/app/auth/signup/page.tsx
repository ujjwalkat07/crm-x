"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { AuthCard } from "@/components/auth/auth-card";
import { SocialButtons } from "@/components/auth/social-buttons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { signupUser } from "@/lib/axios";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [newsletter, setNewsletter] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signupUser(fullName, email, password);

    if (!result.success) {
      setError(result.message);
      setLoading(false);
      return;
    }

    // On success, redirect to login
    router.push("/auth/login");
  }

  return (
    <AuthCard>
      {/* Social Buttons first (matching design) */}
      <SocialButtons />

      {/* Divider */}
      <div className="relative my-6 flex items-center">
        <Separator className="flex-1" />
        <span className="px-3 text-xs font-medium tracking-wider text-muted-foreground uppercase">
          OR
        </span>
        <Separator className="flex-1" />
      </div>

      {/* Signup Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="signup-fullname" className="text-sm font-medium">
            Full name
          </Label>
          <Input
            id="signup-fullname"
            type="text"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            autoComplete="name"
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-email" className="text-sm font-medium">
            Email address
          </Label>
          <Input
            id="signup-email"
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-password" className="text-sm font-medium">
            Password
          </Label>
          <div className="relative">
            <Input
              id="signup-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              className="h-11 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
        </div>

        {error && (
          <p className="text-sm font-medium text-destructive">{error}</p>
        )}

        <Button
          type="submit"
          size="lg"
          disabled={loading}
          className="h-11 w-full cursor-pointer rounded-lg text-sm font-semibold"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Creating account…
            </>
          ) : (
            "Create an account"
          )}
        </Button>

        {/* Newsletter Checkbox */}
        <div className="flex items-start gap-2.5 pt-1">
          <Checkbox
            id="signup-newsletter"
            checked={newsletter}
            onCheckedChange={(v) => setNewsletter(v === true)}
            className="mt-0.5"
          />
          <label
            htmlFor="signup-newsletter"
            className="cursor-pointer text-xs leading-relaxed text-muted-foreground"
          >
            Please keep me updated by email with the latest news, research
            findings, reward programs, event updates.
          </label>
        </div>
      </form>

      {/* Footer */}
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="font-semibold text-foreground underline underline-offset-4 transition-colors hover:text-foreground/80"
        >
          Login
        </Link>
      </p>
    </AuthCard>
  );
}
