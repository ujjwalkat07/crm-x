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
import { loginUser } from "@/lib/axios";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await loginUser(email, password);

    if (!result.success) {
      setError(result.message);
      setLoading(false);
      return;
    }

    // On success, redirect to dashboard
    router.push("/dashboard");
  }

  return (
    <AuthCard>
      {/* Email / Password form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="login-email" className="text-sm font-medium">
            Email address
          </Label>
          <Input
            id="login-email"
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
          <div className="flex items-center justify-between">
            <Label htmlFor="login-password" className="text-sm font-medium">
              Password
            </Label>
            <Link
              href="#"
              className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="login-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
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
              Logging in…
            </>
          ) : (
            "Log In"
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative my-6 flex items-center">
        <Separator className="flex-1" />
        <span className="px-3 text-xs font-medium tracking-wider text-muted-foreground uppercase">
          OR
        </span>
        <Separator className="flex-1" />
      </div>

      {/* Social Buttons */}
      <SocialButtons />

      {/* Footer */}
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account yet?{" "}
        <Link
          href="/auth/signup"
          className="font-semibold text-foreground underline underline-offset-4 transition-colors hover:text-foreground/80"
        >
          Sign up
        </Link>
      </p>
    </AuthCard>
  );
}
