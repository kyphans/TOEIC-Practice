import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { auth } from '@clerk/nextjs/server'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: attempts, error } = await supabase
      .from('test_attempts')
      .select(`
        *,
        tests (
          id,
          name
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ attempts })
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

    // Create new attempt
    const { data: attempt, error: attemptError } = await supabase
      .from('test_attempts')
      .insert({
        test_id,
        user_id: userId,
        answers: {}
      })
      .select()
      .single()

    if (attemptError) throw attemptError

    return NextResponse.json({ attempt })
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

      // Update user progress
      const { data: progress, error: progressError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (progressError && progressError.code !== 'PGRST116') { // PGRST116 = not found
        throw progressError
      }

      if (progress) {
        const newAverage = ((progress.average_score * progress.total_tests) + score) / (progress.total_tests + 1)
        await supabase
          .from('user_progress')
          .update({
            total_tests: progress.total_tests + 1,
            average_score: newAverage,
            last_test_date: new Date().toISOString()
          })
          .eq('user_id', userId)
      } else {
        await supabase
          .from('user_progress')
          .insert({
            user_id: userId,
            total_tests: 1,
            average_score: score,
            last_test_date: new Date().toISOString()
          })
      }
    }

    const { data: attempt, error: attemptError } = await supabase
      .from('test_attempts')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId) // Ensure user owns this attempt
      .select()
      .single()

    if (attemptError) throw attemptError

    return NextResponse.json({ attempt })
  } catch (error) {
    console.error('Error updating attempt:', error)
    return NextResponse.json({ error: 'Failed to update attempt' }, { status: 500 })
  }
} 