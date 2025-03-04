"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

type User = {
  id: string
  name: string
  email: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Check if user is logged in on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  // Mock login function - in a real app, this would call an API
  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Test account credentials
      if (email === "test@example.com" && password === "password123") {
        const userData = {
          id: "user-test",
          name: "Test User",
          email: email,
        }

        setUser(userData)
        localStorage.setItem("user", JSON.stringify(userData))
        router.push("/dashboard")
        return
      }

      // For demo purposes, allow any email/password combination
      const userData = {
        id: "user-1",
        name: "Test User",
        email: email,
      }

      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))
      router.push("/dashboard")
    } catch (error) {
      console.error("Login failed", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Mock signup function
  const signup = async (name: string, email: string, password: string) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock user data
      const userData = {
        id: "user-" + Math.floor(Math.random() * 1000),
        name: name,
        email: email,
      }

      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))
      router.push("/dashboard")
    } catch (error) {
      console.error("Signup failed", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Logout function
  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/")
  }

  return <AuthContext.Provider value={{ user, loading, login, signup, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

