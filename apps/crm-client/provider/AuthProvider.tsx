'use client'

import { api } from '@/lib/axios';
import axios from 'axios';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'


interface SessionPayload {
  id: string;
  email?: string;
  fullname?: string;
  fullName?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthContextType {
  user: SessionPayload | null
  isLoading: boolean
  isAuthenticated: boolean
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  refreshUser: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionPayload | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("");

  useEffect(() => {
    checkSession()
  }, [])

  const checkSession = async () => {
    try {
      const response = await api.post("/api/auth/verify-token", {}, {
        withCredentials: true,
      });

      setUser(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message || "Login failed. Please try again.",
        );
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
    finally {
      setIsLoading(false) 
    }
  }


  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      refreshUser: checkSession,
    }}>
      {children}
    </AuthContext.Provider>
  )
}


export const useAuth = () => useContext(AuthContext)