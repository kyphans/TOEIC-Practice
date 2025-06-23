import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { getMockTest } from '@/lib/testHelper'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const isMock = searchParams.get('mock') === '1'
  const testId = Number(searchParams.get('testId') || 1)

  if (isMock) {
    const test = getMockTest(testId)
    return NextResponse.json({ test })
  }

  try {
    console.log('Fetching tests')
    // First get all tests
    const tests = await sql`SELECT * FROM tests ORDER BY created_at DESC`;

    // Then get questions for each test
    const testsWithQuestions = await Promise.all(
      tests.map(async (test: any) => {
        const questions = await sql`SELECT id, type, section, part, template, "order" FROM questions WHERE test_id = ${test.id} ORDER BY "order" ASC`;
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
    const testResult = await sql`
      INSERT INTO tests (name, created_by)
      VALUES (${name}, ${userId})
      RETURNING *
    `;
    const test = testResult[0];

    if (questions && questions.length > 0) {
      const questionsWithTestId = questions.map((q: any, index: number) => ({
        ...q,
        test_id: test.id,
        order: index + 1
      }))

      // Insert questions
      for (const q of questionsWithTestId) {
        await sql`
          INSERT INTO questions (test_id, type, section, part, template, "order")
          VALUES (${q.test_id}, ${q.type}, ${q.section}, ${q.part}, ${q.template}, ${q.order})
        `;
      }
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

// TODO: Migrate logic to use neonPool from '@/lib/supabase' instead of supabase 