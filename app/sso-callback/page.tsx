"use client"

import { useEffect } from "react"
import { useSignIn, useSignUp } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

export default function SSOCallback() {
  const { signIn, isLoaded: signInLoaded } = useSignIn()
  const { signUp, isLoaded: signUpLoaded } = useSignUp()
  const router = useRouter()

  useEffect(() => {
    if (!signInLoaded || !signUpLoaded) return

    // Xử lý callback từ OAuth provider
    async function handleCallback() {
      try {
        const searchParams = new URLSearchParams(window.location.search)

        if (searchParams.get("createdSessionId")) {
          // Người dùng đã đăng nhập thành công
          router.push("/dashboard")
          return
        }

        // Xử lý OAuth callback
        if (signIn?.status === "needs_first_factor") {
          // Đăng nhập thành công
          router.push("/dashboard")
        } else if (signUp?.status === "needs_first_factor") {
          // Đăng ký thành công
          router.push("/dashboard")
        }
      } catch (err) {
        console.error("Lỗi xử lý OAuth callback:", err)
        router.push("/login")
      }
    }

    handleCallback()
  }, [signIn, signUp, signInLoaded, signUpLoaded, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-2xl font-bold">Đang xử lý đăng nhập...</div>
    </div>
  )
} 