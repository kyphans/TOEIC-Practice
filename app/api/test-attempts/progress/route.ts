import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { TestAttemptProgressItem } from '@/types/exams.type';

export async function GET() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Lấy userId từ clerkId
  const userRes = await sql`SELECT id FROM users WHERE clerk_id = ${clerkId}`;
  const userId = userRes[0]?.id;
  if (!userId) return NextResponse.json({ error: 'User not found in DB' }, { status: 404 });

  // Lấy dữ liệu tiến bộ
  const rows = await sql`
    SELECT 
      ea.id,
      ea.started_at,
      ea.submitted_at,
      ea.score,
      e.total_questions
    FROM exam_attempts ea
    JOIN exams e ON ea.exam_id = e.id
    WHERE ea.user_id = ${userId} AND ea.status = 'submitted'
    ORDER BY ea.started_at ASC
  `;

  const progress: TestAttemptProgressItem[] = rows.map((r: any) => ({
    id: r.id,
    date: r.submitted_at ? r.submitted_at.toISOString().slice(0, 10) : r.started_at.toISOString().slice(0, 10),
    score: Number(r.score),
    totalScore: Number(r.total_questions) * 5, // giả định mỗi câu 5 điểm
  }));

  return NextResponse.json({ progress });
} 