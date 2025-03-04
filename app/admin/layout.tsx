"use client"

import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Users, BookOpen, LogOut } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoaded } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && (!user || user.publicMetadata.role !== "admin")) {
      router.push("/dashboard")
    }
  }, [user, isLoaded, router])

  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-bold">Loading...</div>
      </div>
    )
  }

  const menuItems = [
    { href: "/admin", label: "Dashboard", icon: Home },
    { href: "/admin/tests", label: "Test Management", icon: BookOpen },
    { href: "/admin/users", label: "User Management", icon: Users },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b-8 border-black bg-primary p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/admin">
            <h1 className="text-3xl font-black text-white uppercase">Admin Dashboard</h1>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-white font-bold">Admin: {user.firstName}</span>
            <Button onClick={() => router.push("/dashboard")} className="brutalist-button bg-white text-primary">
              <LogOut className="mr-2 h-4 w-4" /> Back to App
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
                  <Link href={item.href} className="sidebar-menu-item">
                    <item.icon className="mr-2 h-5 w-5" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
} 