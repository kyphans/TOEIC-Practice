import { sql } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Lấy query params
  const { searchParams } = new URL(req.url);
  const index = parseInt(searchParams.get('index') || '1', 10); // page index (1-based)
  const pageSize = parseInt(searchParams.get('pageSize') || '50', 10); // default 50
  const offset = (index - 1) * pageSize;

  try {
    // Lấy tổng số câu hỏi
    const totalResult = await sql`SELECT COUNT(*)::int AS total FROM questions`;
    const total = totalResult[0]?.total || 0;

    // Lấy dữ liệu phân trang
    const questions = await sql`
      SELECT 
        q.id,
        q.content,
        ARRAY_AGG(qc.content ORDER BY qc.label) AS choices,
        q.correct_answer,
        qs.name AS section_name,
        qt.name AS type_name,
        q.created_at,
        COALESCE(JSON_AGG(
          CASE WHEN qm.id IS NOT NULL THEN 
            JSON_BUILD_OBJECT('mediaType', qm.media_type, 'content', qm.content)
          END
        ) FILTER (WHERE qm.id IS NOT NULL), '[]') AS media
      FROM questions q
      LEFT JOIN question_sections qs ON q.section_id = qs.id
      LEFT JOIN question_types qt ON q.question_type_id = qt.id
      LEFT JOIN question_choices qc ON q.id = qc.question_id
      LEFT JOIN question_media qm ON q.id = qm.question_id
      GROUP BY q.id, qs.name, qt.name
      ORDER BY q.id
      LIMIT ${pageSize} OFFSET ${offset}
    `;
    // Map lại dữ liệu cho đúng format
    const formattedQuestions = questions.map((q: any) => ({
      id: q.id,
      content: q.content,
      choices: q.choices,
      correctAnswer: q.correct_answer,
      sectionName: q.section_name,
      typeName: q.type_name,
      createdAt: q.created_at,
      media: q.media || [],
    }));
    return NextResponse.json({ questions: formattedQuestions, total });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}