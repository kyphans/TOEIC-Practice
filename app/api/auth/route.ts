import { NextResponse } from 'next/server';
import { currentUser, clerkClient, auth } from '@clerk/nextjs/server';
import { sql } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { userId } = await auth()
  const client = await clerkClient()
  const user = await currentUser();

  if (!user || !userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Lấy thêm dữ liệu từ body (password)
  const body = await req.json();
  const { password } = body;
  if (!password) {
    return NextResponse.json({ error: 'Password is required' }, { status: 400 });
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  // Tạo user mới
  const newUser = {
    clerk_id: userId,
    name: user.firstName + (user.lastName ? ' ' + user.lastName : ''),
    email: user.emailAddresses?.[0]?.emailAddress || '',
    role: 'student',
    password_hash: hashedPassword,
    created_at: new Date().toISOString(),
  };

  try {
    // Update user metadata clerk
    const res = await client.users.updateUser(userId, {
      publicMetadata: {
        onboardingComplete: true
      },
    })

    console.log('res Update user metadata clerk:', res);

    // Lưu vào DB
    await sql`INSERT INTO users (name, email, password_hash, created_at) VALUES (${newUser.name}, ${newUser.email}, ${newUser.password_hash}, ${newUser.created_at})`;

    return NextResponse.json({ user: newUser });
  } catch (err) {
    return { error: 'There was an error updating the user metadata.' }
  }
} 