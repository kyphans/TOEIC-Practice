"use client"

import { useSignIn } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import { useState, useEffect } from "react"
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  useAuth
} from '@clerk/nextjs';

export default function Login() {
  const { isLoaded, signIn, setActive } = useSignIn()
  const { isSignedIn } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (isSignedIn) {
      router.push("/dashboard")
    }
  }, [isSignedIn, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!isLoaded) return

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      })

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId })
        router.push("/dashboard")
      } else {
        console.error("Đăng nhập không thành công:", result)
        setError("Đăng nhập không thành công")
      }
    } catch (err: any) {
      console.error("Lỗi đăng nhập:", err)
      setError(err.errors?.[0]?.message || "Email hoặc mật khẩu không đúng")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    if (!isLoaded) return

    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/dashboard',
        redirectUrlComplete: '/dashboard'
      });
    } catch (err: any) {
      console.error("Lỗi đăng nhập Google:", err)
      setError(err.errors?.[0]?.message || "Không thể đăng nhập bằng Google")
    }
  }

  return (
    <div className='min-h-screen bg-white flex flex-col'>
      <div className='container mx-auto px-4 py-8'>
        <Link
          href='/'
          className='inline-flex items-center text-primary font-bold mb-8'>
          <ArrowLeft className='mr-2' /> Quay lại Trang chủ
        </Link>

        <div className='max-w-md mx-auto'>
          <div className='brutalist-container'>
            <h1 className='text-3xl font-black mb-8 uppercase'>Đăng nhập</h1>

            {error && (
              <div className='bg-accent text-white p-4 mb-6 border-4 border-black'>
                {error}
              </div>
            )}

            <Button
              onClick={handleGoogleLogin}
              className='brutalist-button w-full mb-6 bg-white hover:bg-gray-50 text-gray-900 border-4 border-black'
              disabled={loading}>
              <img src='/google.svg' alt='Google' className='w-5 h-5 mr-2' />
              Đăng nhập bằng Google
            </Button>

            <div className='relative mb-6'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t-4 border-black'></div>
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-2 bg-white text-gray-600 font-bold'>
                  HOẶC
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className='space-y-6'>
              <div>
                <Label htmlFor='email' className='text-lg font-bold'>
                  Email
                </Label>
                <Input
                  id='email'
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className='brutalist-input w-full mt-2'
                />
              </div>

              <div>
                <Label htmlFor='password' className='text-lg font-bold'>
                  Mật khẩu
                </Label>
                <Input
                  id='password'
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className='brutalist-input w-full mt-2'
                />
              </div>

              <Button
                type='submit'
                className='brutalist-button w-full'
                disabled={loading}>
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Button>
            </form>

            <div className='mt-6 text-center'>
              <p>
                Chưa có tài khoản?{' '}
                <Link
                  href='/signup'
                  className='text-primary font-bold underline'>
                  Đăng ký
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <SignedOut>
        <SignInButton />
        <SignUpButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
}

