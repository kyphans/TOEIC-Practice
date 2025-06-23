// TODO: Migrate logic to use neonPool from '@/lib/supabase' instead of supabase

import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Placeholder for the removed supabase query
    return NextResponse.json({ attempts: [] })
  } catch (error) {
    console.error('Error fetching attempts:', error)
    return NextResponse.json({ error: 'Failed to fetch attempts' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { test_id } = await request.json()

    // Placeholder for the removed supabase insert
    return NextResponse.json({ attempt: {} })
  } catch (error) {
    console.error('Error creating attempt:', error)
    return NextResponse.json({ error: 'Failed to create attempt' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, answers, completed, score } = await request.json()

    const updates: any = {
      answers
    }

    if (completed) {
      updates.completed_at = new Date().toISOString()
      updates.score = score

      // Placeholder for the removed supabase select
      const progress = null

      if (progress) {
        const newAverage = ((progress.average_score * progress.total_tests) + score) / (progress.total_tests + 1)
        // Placeholder for the removed supabase update
      } else {
        // Placeholder for the removed supabase insert
      }
    }

    // Placeholder for the removed supabase update
    return NextResponse.json({ attempt: {} })
  } catch (error) {
    console.error('Error updating attempt:', error)
    return NextResponse.json({ error: 'Failed to update attempt' }, { status: 500 })
  }
} 