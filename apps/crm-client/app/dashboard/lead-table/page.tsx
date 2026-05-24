"use client"

import { useAuth } from "@/provider/AuthProvider";
import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  console.log(isAuthenticated, isLoading, user)
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isLoading, isAuthenticated])

  if (isLoading) return <div>Loading...</div>
  if (!isAuthenticated) return null

  return (
    <div className="flex min-h-svh items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="mt-2 text-muted-foreground">
          Welcome to your CRM dashboard. This page is protected.
        </p>
      </div>
    </div>
  );
}
