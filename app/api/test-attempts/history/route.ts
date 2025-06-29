import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { TestAttemptHistoryItem } from '@/types/exams.type';

export async function GET() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Lấy userId từ clerkId
  const userRes = await sql`SELECT id FROM users WHERE clerk_id = ${clerkId}`;
  const userId = userRes[0]?.id;
  if (!userId) return NextResponse.json({ error: 'User not found in DB' }, { status: 404 });

  // Lấy lịch sử làm bài
  const rows = await sql`
    SELECT 
      ea.id,
      e.title AS name,
      ea.started_at,
      ea.submitted_at,
      ea.score,
      e.total_questions,
      (EXTRACT(EPOCH FROM (ea.submitted_at - ea.started_at))) AS time_seconds
    FROM exam_attempts ea
    JOIN exams e ON ea.exam_id = e.id
    WHERE ea.user_id = ${userId} AND ea.status = 'submitted'
    ORDER BY ea.started_at DESC
  `;

  // Chuyển đổi dữ liệu cho phù hợp UI
  const history: TestAttemptHistoryItem[] = rows.map((r: any) => ({
    id: r.id,
    name: r.name,
    date: r.submitted_at ? r.submitted_at.toISOString().slice(0, 10) : r.started_at.toISOString().slice(0, 10),
    score: Number(r.score),
    totalScore: Number(r.total_questions) * 5, // giả định mỗi câu 5 điểm
    time: new Date(r.time_seconds * 1000).toISOString().substr(11, 8), // HH:mm:ss
  }));

  return NextResponse.json({ history });
} 