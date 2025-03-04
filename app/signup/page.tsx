"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"

export default function Signup() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const { signup, loading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    try {
      await signup(name, email, password)
    } catch (err) {
      setError("Failed to create account")
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
            <h1 className="text-3xl font-black mb-8 uppercase">Sign Up</h1>

            {error && <div className="bg-accent text-white p-4 mb-6 border-4 border-black">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-lg font-bold">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="brutalist-input w-full mt-2"
                />
              </div>

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

              <div>
                <Label htmlFor="confirmPassword" className="text-lg font-bold">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="brutalist-input w-full mt-2"
                />
              </div>

              <Button type="submit" className="brutalist-button w-full" disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p>
                Already have an account?{" "}
                <Link href="/login" className="text-primary font-bold underline">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

