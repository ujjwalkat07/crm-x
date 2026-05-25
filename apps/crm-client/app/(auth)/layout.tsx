'use client'

import { useAuth } from '../../provider/AuthProvider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Sparkles } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/leads")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Sparkles className="w-10 h-10 animate-pulse text-primary" />
      </div>
    )
  }

  if (user) {
    return null // Prevent showing login/signup layout during redirect
  }

  return <>{children}</>
}
