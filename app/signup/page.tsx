"use client"

import { useSignUp } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import { useState } from "react"

export default function Signup() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!isLoaded) return

    if (password !== confirmPassword) {
      setError("Mật khẩu không khớp")
      setLoading(false)
      return
    }

    try {
      const result = await signUp.create({
        firstName,
        lastName,
        emailAddress: email,
        password,
      })

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId })
        router.push("/dashboard")
      } else {
        console.error("Đăng ký không thành công:", result)
        setError("Đăng ký không thành công")
      }
    } catch (err: any) {
      console.error("Lỗi đăng ký:", err)
      setError(err.errors?.[0]?.message || "Có lỗi xảy ra khi đăng ký")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    if (!isLoaded) return

    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard",
      })
    } catch (err: any) {
      console.error("Lỗi đăng ký Google:", err)
      setError(err.errors?.[0]?.message || "Không thể đăng ký bằng Google")
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-primary font-bold mb-8">
          <ArrowLeft className="mr-2" /> Quay lại Trang chủ
        </Link>

        <div className="max-w-md mx-auto">
          <div className="brutalist-container">
            <h1 className="text-3xl font-black mb-8 uppercase">Đăng ký</h1>

            {error && <div className="bg-accent text-white p-4 mb-6 border-4 border-black">{error}</div>}

            <Button
              onClick={handleGoogleSignup}
              className="brutalist-button w-full mb-6 bg-white hover:bg-gray-50 text-gray-900 border-4 border-black"
              disabled={loading}
            >
              <img src="/google.svg" alt="Google" className="w-5 h-5 mr-2" />
              Đăng ký bằng Google
            </Button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-4 border-black"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-600 font-bold">
                  HOẶC
                </span>
              </div>
            </div>

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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="brutalist-input w-full mt-2"
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-lg font-bold">
                  Mật khẩu
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
                  Xác nhận mật khẩu
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
                {loading ? "Đang đăng ký..." : "Đăng ký"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p>
                Đã có tài khoản?{" "}
                <Link href="/login" className="text-primary font-bold underline">
                  Đăng nhập
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

