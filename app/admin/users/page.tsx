"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Shield, ShieldOff, Search, UserPlus } from "lucide-react"

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  createdAt: string
}

export default function UserManagement() {
  const { user: currentUser, isLoaded } = useUser()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (isLoaded && (!currentUser || currentUser.publicMetadata.role !== "admin")) {
      router.push("/dashboard")
    }
  }, [currentUser, isLoaded, router])

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users")
      const data = await response.json()
      if (data.users) {
        setUsers(data.users)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleRole = async (userId: string, currentRole: string) => {
    try {
      const newRole = currentRole === "admin" ? "user" : "admin"
      await fetch(`/api/users/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      })
      fetchUsers() // Refresh list after update
    } catch (error) {
      console.error("Error updating user role:", error)
    }
  }

  const filteredUsers = users?.filter(user => {
    const searchString = searchTerm.toLowerCase()
    return (
      user.firstName?.toLowerCase().includes(searchString) ||
      user.lastName?.toLowerCase().includes(searchString) ||
      user.email?.toLowerCase().includes(searchString)
    )
  }) || []

  if (!isLoaded || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-bold">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="brutalist-container">
        <h1 className="text-3xl font-black mb-4">Quản lý người dùng</h1>
        <p className="text-lg">Quản lý người dùng và phân quyền</p>
      </div>

      {/* Search and Actions */}
      <div className="flex justify-between items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
          <Input
            type="text"
            placeholder="Tìm kiếm người dùng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 brutalist-input"
          />
        </div>
        <Button className="brutalist-button">
          <UserPlus className="mr-2 h-5 w-5" />
          Mời người dùng
        </Button>
      </div>

      {/* Users List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">Đang tải danh sách người dùng...</div>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className="brutalist-container p-6 flex items-center justify-between"
            >
              <div>
                <h3 className="text-xl font-bold">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-gray-600">{user.email}</p>
                <div className="mt-2">
                  <span
                    className={`inline-block px-3 py-1 text-sm font-bold rounded ${
                      user.role === "admin"
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {user.role}
                  </span>
                  <span className="text-sm text-gray-500 ml-4">
                    Tham gia: {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              {currentUser.id !== user.id && (
                <Button
                  onClick={() => handleToggleRole(user.id, user.role)}
                  className={`brutalist-button ${
                    user.role === "admin" ? "bg-red-500 text-white" : ""
                  }`}
                >
                  {user.role === "admin" ? (
                    <>
                      <ShieldOff className="mr-2 h-5 w-5" />
                      Gỡ quyền Admin
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-5 w-5" />
                      Cấp quyền Admin
                    </>
                  )}
                </Button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
} 