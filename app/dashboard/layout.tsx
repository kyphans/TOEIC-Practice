"use client"

import { useUser, UserButton } from "@clerk/nextjs"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useMemo } from "react"
import Link from "next/link"
import { Home, BookOpen, History, User, Shield } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/login")
    }
  }, [user, isLoaded, router])

  // Menu items for the sidebar
  const menuItems = [
    { href: "/dashboard", label: "Home", icon: Home },
    { href: "/dashboard/tests", label: "Practice Tests", icon: BookOpen },
    { href: "/dashboard/history", label: "History", icon: History },
    { href: "/dashboard/profile", label: "Profile", icon: User },
    ...(user && user.publicMetadata.role === "admin" ? [{ href: "/admin", label: "Admin Dashboard", icon: Shield }] : []),
  ]

  // Check if the current path matches a menu item
  const isActive = (path: string) => {
    if (path === "/dashboard" && pathname === "/dashboard") {
      return true
    }
    return pathname.startsWith(path) && path !== "/dashboard"
  }

  // const isAdmin = user.publicMetadata.role === "admin"
  // const isAdmin = true;

  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-bold">Loading...</div>
      </div>
    )
  }

  return (
    <div className='min-h-screen flex flex-col'>
      {/* Header */}
      <header className='border-b-8 border-black bg-primary p-4'>
        <div className='container mx-auto flex justify-between items-center'>
          <Link href='/dashboard'>
            <h1 className='text-2xl sm:text-3xl font-black text-white uppercase'>
              TOEIC Practice
            </h1>
          </Link>
          <div className='flex items-center gap-4'>
            <span className='text-white font-bold hidden sm:inline'>
              Welcome, {user.firstName}
            </span>
            <UserButton afterSignOutUrl='/login' />
          </div>
        </div>
      </header>

      <div className='flex flex-col md:flex-row flex-1'>
        {/* Sidebar */}
        <aside
          className={`w-full md:w-64 border-r-0 md:border-r-8 border-b-8 md:border-b-0 border-black bg-white flex flex-col`}>
          <nav className='p-4 flex-none'>
            <ul className='flex md:block space-x-2 md:space-x-0 space-y-0 md:space-y-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0'>
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`sidebar-menu-item flex items-center ${
                      isActive(item.href) ? 'active' : ''
                    }`}>
                    <item.icon className='mr-0 md:mr-2 h-5 w-5' />
                    <span className='hidden md:inline'>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main content - 76px is the height of the header */}
        <div className='flex-1 overflow-y-auto max-h-[calc(100vh-76px)]'>
          {children}
        </div>
      </div>
    </div>
  );
}

