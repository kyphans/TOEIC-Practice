"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"

export default function Login() {
  const [email, setEmail] = useState("test@example.com")
  const [password, setPassword] = useState("password123")
  const [error, setError] = useState("")
  const { login, loading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      await login(email, password)
    } catch (err) {
      setError("Invalid email or password")
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-primary font-bold mb-8">
          <ArrowLeft className="mr-2" /> Back to Home
        </Link>

        <div className="max-w-md mx-auto">
          <div className="brutalist-container">
            <h1 className="text-3xl font-black mb-8 uppercase">Login</h1>

            {error && <div className="bg-accent text-white p-4 mb-6 border-4 border-black">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="email" className="text-lg font-bold">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="brutalist-input w-full mt-2"
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-lg font-bold">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="brutalist-input w-full mt-2"
                />
              </div>

              <div className="bg-yellow-100 p-4 border-4 border-black">
                <p className="font-bold">Test Account:</p>
                <p>Email: test@example.com</p>
                <p>Password: password123</p>
              </div>

              <Button type="submit" className="brutalist-button w-full" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p>
                Don't have an account?{" "}
                <Link href="/signup" className="text-primary font-bold underline">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

