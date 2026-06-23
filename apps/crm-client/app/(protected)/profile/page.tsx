'use client'

import { useAuth } from '../../../provider/AuthProvider'
import { api } from '@/lib/axios'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User as UserIcon,
  Lock,
  Mail,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  KeyRound,
  Fingerprint
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'

export default function ProfilePage() {
  const { user, refreshUser } = useAuth()
  const [activeTab, setActiveTab] = useState<'details' | 'security'>('details')
  
  // Profile Details Form State
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [detailsError, setDetailsError] = useState('')
  const [detailsSuccess, setDetailsSuccess] = useState('')
  const [detailsLoading, setDetailsLoading] = useState(false)

  // Security Form State
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [securityError, setSecurityError] = useState('')
  const [securitySuccess, setSecuritySuccess] = useState('')
  const [securityLoading, setSecurityLoading] = useState(false)

  // Pre-fill user data when loaded
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || user.fullname || '')
      setEmail(user.email || '')
    }
  }, [user])

  if (!user) return null

  // User initials
  const initials = fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const handleUpdateDetails = async (e: React.FormEvent) => {
    e.preventDefault()
    setDetailsError('')
    setDetailsSuccess('')

    if (!fullName.trim() || !email.trim()) {
      setDetailsError('All fields are required.')
      return
    }

    setDetailsLoading(true)
    try {
      await api.put('/api/auth/profile', {
        fullName: fullName.trim(),
        email: email.trim(),
      })
      await refreshUser()
      setDetailsSuccess('Profile details updated successfully.')
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setDetailsError(err.response?.data?.message || 'Failed to update details. Please try again.')
      } else {
        setDetailsError('Something went wrong. Please try again.')
      }
    } finally {
      setDetailsLoading(false)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setSecurityError('')
    setSecuritySuccess('')

    if (!newPassword || !confirmPassword) {
      setSecurityError('Please enter and confirm your new password.')
      return
    }

    if (newPassword.length < 6) {
      setSecurityError('Password must be at least 6 characters long.')
      return
    }

    if (newPassword !== confirmPassword) {
      setSecurityError('Passwords do not match.')
      return
    }

    setSecurityLoading(true)
    try {
      await api.put('/api/auth/profile', {
        password: newPassword,
      })
      setNewPassword('')
      setConfirmPassword('')
      setSecuritySuccess('Password updated successfully.')
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setSecurityError(err.response?.data?.message || 'Failed to update password. Please try again.')
      } else {
        setSecurityError('Something went wrong. Please try again.')
      }
    } finally {
      setSecurityLoading(false)
    }
  }

  const formattedJoinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Unknown'

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 space-y-8 animate-in fade-in duration-300">
      
      {/* Header section with page title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground/95 to-muted-foreground bg-clip-text text-transparent">
            Account Settings
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your profile information, email preferences, and password security.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Profile Card Summary */}
        <div className="md:col-span-1 space-y-6">
          <Card className="relative overflow-hidden border border-border/80 bg-card shadow-xl backdrop-blur-md">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary/60 via-primary to-primary/60" />
            <CardContent className="pt-8 pb-6 flex flex-col items-center text-center">
              
              <div className="relative w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center font-bold text-primary text-3xl shadow-inner mb-4">
                {initials || <UserIcon className="w-10 h-10" />}
                <span className="absolute bottom-1.5 right-1.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-card animate-pulse" />
              </div>

              <h2 className="text-xl font-bold text-foreground truncate max-w-full">
                {fullName || 'CRM Member'}
              </h2>
              <p className="text-sm text-muted-foreground truncate max-w-full mt-1">
                {email || 'member@crm.com'}
              </p>

              <div className="w-full border-t border-border/50 my-6" />

              <div className="w-full space-y-3.5 text-left text-xs">
                <div className="flex items-center gap-2.5 text-muted-foreground">
                  <Calendar className="w-4 h-4 text-primary/70 shrink-0" />
                  <span>Joined {formattedJoinedDate}</span>
                </div>
                <div className="flex items-center gap-2.5 text-muted-foreground">
                  <ShieldCheck className="w-4 h-4 text-primary/70 shrink-0" />
                  <span>Status: Active CRM Agent</span>
                </div>
                <div className="flex items-center gap-2.5 text-muted-foreground">
                  <Fingerprint className="w-4 h-4 text-primary/70 shrink-0" />
                  <span className="font-mono truncate">ID: {user.id}</span>
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Navigation/Tab Selector */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setActiveTab('details')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left outline-none cursor-pointer ${
                activeTab === 'details'
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/15'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              <span>Profile Details</span>
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left outline-none cursor-pointer ${
                activeTab === 'security'
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/15'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>Security & Password</span>
            </button>
          </div>
        </div>

        {/* Edit Panel */}
        <div className="md:col-span-2">
          <AnimatePresence mode="wait">
            {activeTab === 'details' ? (
              <motion.div
                key="details-tab"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <Card className="border border-border/80 bg-card shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2.5">
                      <UserIcon className="w-5 h-5 text-primary" />
                      <span>Personal Information</span>
                    </CardTitle>
                    <CardDescription>
                      Update your account details and user email address.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleUpdateDetails} className="space-y-6">
                      <FieldGroup>
                        {detailsError && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2.5 text-sm font-medium bg-destructive/10 text-destructive p-3.5 rounded-lg border border-destructive/20"
                          >
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{detailsError}</span>
                          </motion.div>
                        )}

                        {detailsSuccess && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2.5 text-sm font-medium bg-emerald-500/10 text-emerald-500 p-3.5 rounded-lg border border-emerald-500/20"
                          >
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                            <span>{detailsSuccess}</span>
                          </motion.div>
                        )}

                        <Field className="space-y-2">
                          <FieldLabel htmlFor="fullName" className="text-sm font-semibold tracking-wide">
                            Full Name
                          </FieldLabel>
                          <div className="relative">
                            <UserIcon className="absolute left-3.5 top-1/2 w-4 h-4 -translate-y-1/2 text-muted-foreground/60 transition-colors pointer-events-none" />
                            <Input
                              id="fullName"
                              type="text"
                              required
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              placeholder="John Doe"
                              className="pl-10 pr-4 py-2.5 bg-background/50 border border-muted focus-visible:ring-primary/20 focus-visible:border-primary/50 transition-all rounded-lg"
                            />
                          </div>
                        </Field>

                        <Field className="space-y-2">
                          <FieldLabel htmlFor="email" className="text-sm font-semibold tracking-wide">
                            Email Address
                          </FieldLabel>
                          <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 w-4 h-4 -translate-y-1/2 text-muted-foreground/60 transition-colors pointer-events-none" />
                            <Input
                              id="email"
                              type="email"
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="name@company.com"
                              className="pl-10 pr-4 py-2.5 bg-background/50 border border-muted focus-visible:ring-primary/20 focus-visible:border-primary/50 transition-all rounded-lg"
                            />
                          </div>
                          <FieldDescription className="text-xs text-muted-foreground/65">
                            Note: Changing your email will update your login credentials.
                          </FieldDescription>
                        </Field>

                        <div className="pt-2">
                          <Button
                            type="submit"
                            className="relative overflow-hidden group shadow-md shadow-primary/10 hover:shadow-primary/20 transition-all font-medium rounded-lg px-6"
                            disabled={detailsLoading}
                          >
                            {detailsLoading ? (
                              <div className="flex items-center gap-2">
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                                <span>Saving Changes...</span>
                              </div>
                            ) : (
                              <span className="flex items-center gap-2">
                                <span>Save Changes</span>
                                <Sparkles className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:scale-105" />
                              </span>
                            )}
                          </Button>
                        </div>
                      </FieldGroup>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="security-tab"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <Card className="border border-border/80 bg-card shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2.5">
                      <KeyRound className="w-5 h-5 text-primary" />
                      <span>Security Settings</span>
                    </CardTitle>
                    <CardDescription>
                      Update your account security details and credentials.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleUpdatePassword} className="space-y-6">
                      <FieldGroup>
                        {securityError && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2.5 text-sm font-medium bg-destructive/10 text-destructive p-3.5 rounded-lg border border-destructive/20"
                          >
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{securityError}</span>
                          </motion.div>
                        )}

                        {securitySuccess && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2.5 text-sm font-medium bg-emerald-500/10 text-emerald-500 p-3.5 rounded-lg border border-emerald-500/20"
                          >
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                            <span>{securitySuccess}</span>
                          </motion.div>
                        )}

                        <Field className="space-y-2">
                          <FieldLabel htmlFor="newPassword" className="text-sm font-semibold tracking-wide">
                            New Password
                          </FieldLabel>
                          <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 w-4 h-4 -translate-y-1/2 text-muted-foreground/60 transition-colors pointer-events-none" />
                            <Input
                              id="newPassword"
                              type="password"
                              required
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="Min. 6 characters"
                              className="pl-10 pr-4 py-2.5 bg-background/50 border border-muted focus-visible:ring-primary/20 focus-visible:border-primary/50 transition-all rounded-lg"
                            />
                          </div>
                        </Field>

                        <Field className="space-y-2">
                          <FieldLabel htmlFor="confirmPassword" className="text-sm font-semibold tracking-wide">
                            Confirm Password
                          </FieldLabel>
                          <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 w-4 h-4 -translate-y-1/2 text-muted-foreground/60 transition-colors pointer-events-none" />
                            <Input
                              id="confirmPassword"
                              type="password"
                              required
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder="Confirm new password"
                              className="pl-10 pr-4 py-2.5 bg-background/50 border border-muted focus-visible:ring-primary/20 focus-visible:border-primary/50 transition-all rounded-lg"
                            />
                          </div>
                        </Field>

                        <div className="pt-2">
                          <Button
                            type="submit"
                            className="relative overflow-hidden group shadow-md shadow-primary/10 hover:shadow-primary/20 transition-all font-medium rounded-lg px-6"
                            disabled={securityLoading}
                          >
                            {securityLoading ? (
                              <div className="flex items-center gap-2">
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                                <span>Updating Password...</span>
                              </div>
                            ) : (
                              <span className="flex items-center gap-2">
                                <span>Update Password</span>
                                <Sparkles className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:scale-105" />
                              </span>
                            )}
                          </Button>
                        </div>
                      </FieldGroup>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  )
}
