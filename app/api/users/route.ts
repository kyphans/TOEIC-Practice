import { NextResponse } from "next/server"
import { type User } from "@clerk/nextjs/server"
import { createClerkClient } from '@clerk/backend'
import { auth } from '@clerk/nextjs/server'

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })

interface FormattedUser {
  id: string
  firstName: string | null
  lastName: string | null
  email: string | undefined
  role: string
  createdAt: string
  imageUrl: string
  lastSignInAt: string | null
}

export async function GET() {
  try {
    // Check if user is authenticated and is admin
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const currentUser = await clerkClient.users.getUser(userId)
    console.log(currentUser)
    if (currentUser.publicMetadata.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get all users
    const {data: users} = await clerkClient.users.getUserList()
    console.log("users", typeof users)
    
    // Format user data
    const formattedUsers: FormattedUser[] = users.map((user: User) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.emailAddresses[0]?.emailAddress,
      role: user.publicMetadata.role as string || "user",
      createdAt: new Date(user.createdAt).toISOString(),
      imageUrl: user.imageUrl,
      lastSignInAt: user.lastSignInAt ? new Date(user.lastSignInAt).toISOString() : null,
    }))

    return NextResponse.json({ users: formattedUsers })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
