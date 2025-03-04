"use client"

import type React from "react"

import { useAuth } from "@/components/auth-provider"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, BookOpen, History, User, LogOut } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-bold">Loading...</div>
      </div>
    )
  }

  // Menu items for the sidebar
  const menuItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/dashboard/tests", label: "Practice Tests", icon: BookOpen },
    { href: "/dashboard/history", label: "Test History", icon: History },
    { href: "/dashboard/profile", label: "Profile", icon: User },
  ]

  // Check if the current path matches a menu item
  const isActive = (path: string) => {
    if (path === "/dashboard" && pathname === "/dashboard") {
      return true
    }
    return pathname.startsWith(path) && path !== "/dashboard"
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b-8 border-black bg-primary p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/dashboard">
            <h1 className="text-3xl font-black text-white uppercase">TOEIC Practice</h1>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-white font-bold">Welcome, {user.name}</span>
            <Button onClick={logout} className="brutalist-button bg-white text-primary">
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 border-r-8 border-black bg-white">
          <nav className="p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={`sidebar-menu-item ${isActive(item.href) ? "active" : ""}`}>
                    <item.icon className="mr-2 h-5 w-5" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}

