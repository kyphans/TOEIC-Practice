import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { TestAttemptSummary } from '@/types/exams.type';

export async function GET() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Lấy userId từ clerkId
  const userRes = await sql`SELECT id FROM users WHERE clerk_id = ${clerkId}`;
  const userId = userRes[0]?.id;
  if (!userId) return NextResponse.json({ error: 'User not found in DB' }, { status: 404 });

  // Lấy thống kê
  const [row] = await sql`
    SELECT 
      COUNT(*) AS total_tests,
      AVG(ea.score / NULLIF(e.total_questions, 0)) * 100 AS avg_score_percent,
      MAX(ea.started_at) AS last_test_date
    FROM exam_attempts ea
    JOIN exams e ON ea.exam_id = e.id
    WHERE ea.user_id = ${userId} AND ea.status = 'submitted'
  `;

  const summary: TestAttemptSummary = {
    totalTests: Number(row.total_tests) || 0,
    avgScorePercent: row.avg_score_percent ? Math.round(Number(row.avg_score_percent)) : 0,
    lastTestDate: row.last_test_date ? row.last_test_date.toISOString().slice(0, 10) : null,
  };

  return NextResponse.json({ summary });
} 