import { NextResponse } from "next/server"
import { clerkClient } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs"

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Kiểm tra quyền admin
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const currentUser = await clerkClient.users.getUser(userId)
    if (currentUser.publicMetadata.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Lấy dữ liệu từ request body
    const { role } = await request.json()
    
    // Cập nhật role cho user
    await clerkClient.users.updateUser(params.id, {
      publicMetadata: { role }
    })

    return NextResponse.json({ message: "Role updated successfully" })
  } catch (error) {
    console.error("Error updating user role:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 