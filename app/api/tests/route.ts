import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { auth } from '@clerk/nextjs/server'

export async function GET() {
  try {
    console.log('Fetching tests')
    // First get all tests
    const { data: tests, error: testsError } = await supabase
      .from('tests')
      .select('*')
      .order('created_at', { ascending: false })

    if (testsError) throw testsError

    // Then get questions for each test
    const testsWithQuestions = await Promise.all(
      tests.map(async (test) => {
        const { data: questions, error: questionsError } = await supabase
          .from('questions')
          .select('id, type, section, part, template, order')
          .eq('test_id', test.id)
          .order('order', { ascending: true })

        if (questionsError) throw questionsError

        return {
          ...test,
          questions
        }
      })
    )

    return NextResponse.json({ tests: testsWithQuestions })
  } catch (error) {
    console.error('Error fetching tests:', error)
    return NextResponse.json({ error: 'Failed to fetch tests' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, questions } = await request.json()

    // Start a transaction
    const { data: test, error: testError } = await supabase
      .from('tests')
      .insert({
        name,
        created_by: userId
      })
      .select()
      .single()

    if (testError) throw testError

    if (questions && questions.length > 0) {
      const questionsWithTestId = questions.map((q: any, index: number) => ({
        ...q,
        test_id: test.id,
        order: index + 1
      }))

      const { error: questionsError } = await supabase
        .from('questions')
        .insert(questionsWithTestId)

      if (questionsError) throw questionsError
    }

    return NextResponse.json({ test })
  } catch (error) {
    console.error('Error creating test:', error)
    return NextResponse.json({ error: 'Failed to create test' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const data = await request.json()
  // TODO: Implement update test logic
  return NextResponse.json({ message: 'Test updated successfully' })
}

export async function DELETE(request: Request) {
  const data = await request.json()
  // TODO: Implement delete test logic 
  return NextResponse.json({ message: 'Test deleted successfully' })
} 