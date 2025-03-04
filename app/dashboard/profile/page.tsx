"use client"

import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

export default function Profile() {
  const { user, isLoaded } = useUser()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")

  // Load user data when component mounts
  useState(() => {
    if (isLoaded && user) {
      setFirstName(user.firstName || "")
      setLastName(user.lastName || "")
    }
  })

  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-bold">Loading...</div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      await user.update({
        firstName,
        lastName,
      })
      setSuccess(true)
    } catch (err: any) {
      console.error("Lỗi cập nhật thông tin:", err)
      setError(err.errors?.[0]?.message || "Có lỗi xảy ra khi cập nhật thông tin")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-black mb-8 uppercase">Hồ sơ cá nhân</h1>

      {error && (
        <div className="bg-accent text-white p-4 mb-6 border-4 border-black">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500 text-white p-4 mb-6 border-4 border-black">
          Cập nhật thông tin thành công!
        </div>
      )}

      <div className="brutalist-container">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName" className="text-lg font-bold">
                Họ
              </Label>
              <Input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="brutalist-input w-full mt-2"
              />
            </div>
            <div>
              <Label htmlFor="lastName" className="text-lg font-bold">
                Tên
              </Label>
              <Input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="brutalist-input w-full mt-2"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email" className="text-lg font-bold">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={user.emailAddresses[0]?.emailAddress || ""}
              disabled
              className="brutalist-input w-full mt-2 bg-gray-100"
            />
          </div>

          <Button type="submit" className="brutalist-button w-full" disabled={loading}>
            {loading ? "Đang cập nhật..." : "Cập nhật thông tin"}
          </Button>
        </form>
      </div>
    </div>
  )
}

