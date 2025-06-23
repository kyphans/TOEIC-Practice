// TODO: Migrate logic to use neonPool from '@/lib/supabase' instead of supabase

import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'

export async function GET() {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // If no progress found, return default values
    if (!progress) {
      return NextResponse.json({
        progress: {
          total_tests: 0,
          average_score: 0,
          last_test_date: null
        }
      })
    }

    return NextResponse.json({ progress })
  } catch (error) {
    console.error('Error fetching user progress:', error)
    return NextResponse.json({ error: 'Failed to fetch user progress' }, { status: 500 })
  }
} 