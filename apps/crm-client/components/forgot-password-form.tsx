"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { api } from "@/lib/axios"
import axios from "axios"
import Link from "next/dist/client/link"
import { motion, AnimatePresence } from "framer-motion"
import { KeyRound, ArrowLeft, Mail, CheckCircle2, AlertCircle, Sparkles } from "lucide-react"

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setError("Please enter your email address.")
      return
    }

    setError("")
    setLoading(true)

    try {
      // POST back to crm-server `/api/auth/forgot-password` endpoint
      await api.post("/api/auth/forgot-password", { email })
      setSuccess(true)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message || "User not found or something went wrong."
        )
      } else {
        setError("Something went wrong. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="relative overflow-hidden border border-muted/50 bg-card/65 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:shadow-primary/5 hover:border-muted-foreground/20">
        {/* Sleek top ambient light effect */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        
        <AnimatePresence mode="wait">
          {!success ? (
            <motion.div
              key="forgot-password-step"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary ring-8 ring-primary/5">
                  <KeyRound className="size-6 animate-pulse" />
                </div>
                <CardTitle className="text-2xl font-bold tracking-tight bg-gradient-to-br from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent">
                  Forgot Password?
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground/80 max-w-[280px] mx-auto mt-1">
                  Enter your email address and we&apos;ll send you a link to reset your password.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <FieldGroup>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-2 text-sm font-medium bg-destructive/10 text-destructive p-3 rounded-lg border border-destructive/20 mb-2"
                      >
                        <AlertCircle className="size-4 shrink-0" />
                        <span>{error}</span>
                      </motion.div>
                    )}

                    <Field className="space-y-2">
                      <div className="flex items-center justify-between">
                        <FieldLabel htmlFor="email" className="text-sm font-semibold tracking-wide">
                          Email Address
                        </FieldLabel>
                      </div>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/60 transition-colors pointer-events-none" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="name@example.com"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-9 pr-4 py-2 bg-background/50 border border-muted focus-visible:ring-primary/20 focus-visible:border-primary/50 transition-all rounded-lg"
                        />
                      </div>
                      <FieldDescription className="text-xs text-muted-foreground/60">
                        We will verify this email in our CRM records.
                      </FieldDescription>
                    </Field>

                    <Field className="pt-2">
                      <Button
                        type="submit"
                        className="w-full relative overflow-hidden group shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 font-medium rounded-lg"
                        disabled={loading}
                      >
                        {loading ? (
                          <div className="flex items-center justify-center gap-2">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                            <span>Processing...</span>
                          </div>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            <span>Send Reset Link</span>
                            <Sparkles className="size-4 transition-transform group-hover:translate-x-1 group-hover:scale-110" />
                          </span>
                        )}
                      </Button>
                    </Field>

                    <div className="mt-4 text-center">
                      <Link
                        href="/login"
                        className="inline-flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
                      >
                        <ArrowLeft className="size-4" />
                        <span>Back to Login</span>
                      </Link>
                    </div>
                  </FieldGroup>
                </form>
              </CardContent>
            </motion.div>
          ) : (
            <motion.div
              key="success-step"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, type: "spring", damping: 25 }}
              className="text-center p-6"
            >
              <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 ring-8 ring-emerald-500/5">
                  <CheckCircle2 className="size-8" />
                </div>
                <CardTitle className="text-2xl font-bold tracking-tight text-emerald-500">
                  Link Sent!
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground/80 mt-2">
                  A password reset link has been successfully dispatched to your email address:
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-2 pb-4 space-y-6">
                <div className="bg-muted/40 border border-muted px-4 py-3 rounded-lg font-medium text-sm text-foreground break-all shadow-inner">
                  {email}
                </div>
                
                <p className="text-xs text-muted-foreground/60 leading-relaxed max-w-[280px] mx-auto">
                  Please check your inbox (and spam folder) for a message with instructions to reset your account.
                </p>

                <Button
                  asChild
                  variant="outline"
                  className="w-full hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all duration-300 font-medium rounded-lg"
                >
                  <Link href="/login" className="flex items-center justify-center gap-2">
                    <ArrowLeft className="size-4" />
                    <span>Return to Login</span>
                  </Link>
                </Button>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
      
      <FieldDescription className="px-6 text-center text-xs text-muted-foreground/50">
        Secured by CRM X Identity and Access Management.
      </FieldDescription>
    </div>
  )
}
