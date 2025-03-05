"use client"

import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Users, BookOpen, Settings, BarChart } from "lucide-react"

export default function AdminDashboard() {
  const { user, isLoaded } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && (!user || user.publicMetadata.role !== "admin")) {
      router.push("/dashboard")
    }
  }, [user, isLoaded, router])

  const adminModules = [
    {
      title: "User Management",
      description: "Manage users, roles, and permissions",
      icon: Users,
      href: "/admin/users",
      stats: "150 Users"
    },
    {
      title: "Test Management",
      description: "Create and manage TOEIC practice tests",
      icon: BookOpen,
      href: "/admin/tests",
      stats: "25 Tests"
    },
    {
      title: "Analytics",
      description: "View test statistics and user performance",
      icon: BarChart,
      href: "/admin/analytics",
      stats: "1.2k Tests Taken"
    },
    {
      title: "Settings",
      description: "Configure system settings and preferences",
      icon: Settings,
      href: "/admin/settings",
      stats: "Last updated: Today"
    }
  ]

  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-bold">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="brutalist-container">
        <h1 className="text-3xl font-black mb-4">Admin Dashboard</h1>
        <p className="text-lg">Manage your TOEIC practice platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {adminModules.map((module, index) => (
          <Link key={index} href={module.href}>
            <Card className="brutalist-card p-6 bg-gray-50/50 hover:bg-primary/10 transition-all duration-300 transform hover:scale-[1.02]">
              <div className="flex items-center mb-4">
                <div className="bg-primary text-white p-3 rounded-md mr-4">
                  <module.icon className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{module.title}</h2>
                  <p className="text-gray-600">{module.description}</p>
                </div>
              </div>
              <div className="text-sm font-bold text-primary">{module.stats}</div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="brutalist-container">
        <h2 className="text-2xl font-black mb-6">Platform Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Total Users", value: "150" },
            { label: "Tests Created", value: "25" },
            { label: "Tests Taken", value: "1.2k" }
          ].map((stat, index) => (
            <div key={index} className="brutalist-card p-6">
              <h3 className="text-lg font-bold mb-2">{stat.label}</h3>
              <p className="text-3xl font-black">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 