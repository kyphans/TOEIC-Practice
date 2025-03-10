import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { auth } from '@clerk/nextjs'

export async function GET() {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: progress, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = not found
      throw error
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