import { sql } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const index = Number(searchParams.get('index')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || 50;
  const offset = (index - 1) * pageSize;

  try {
    const [{ total = 0 }] = await sql`SELECT COUNT(*)::int AS total FROM questions`;

    const questions = await sql`
      SELECT 
        q.id,
        q.content,
        ARRAY_AGG(qc.content ORDER BY qc.label) AS choices,
        q.correct_answer,
        q.difficulty, 
        q.topic, 
        qs.name AS section_name,
        qt.name AS type_name,
        q.created_at,
        COALESCE(
          JSON_AGG(
            CASE 
              WHEN qm.id IS NOT NULL THEN JSON_BUILD_OBJECT(
                'mediaType', qm.media_type, 
                'content', qm.content
              )
            END
          ) FILTER (WHERE qm.id IS NOT NULL), 
          '[]'
        ) AS media
      FROM questions q
      LEFT JOIN question_sections qs ON q.section_id = qs.id
      LEFT JOIN question_types qt ON q.question_type_id = qt.id
      LEFT JOIN question_choices qc ON q.id = qc.question_id
      LEFT JOIN question_media qm ON q.id = qm.question_id
      GROUP BY q.id, qs.name, qt.name
      ORDER BY q.id
      LIMIT ${pageSize} OFFSET ${offset}
    `;

    const formatted = questions.map((q: any) => ({
      id: q.id,
      content: q.content,
      choices: q.choices,
      correctAnswer: q.correct_answer,
      difficulty: q.difficulty,
      topic: q.topic,
      sectionName: q.section_name,
      typeName: q.type_name,
      createdAt: q.created_at,
      media: q.media ?? [],
    }));

    return NextResponse.json({ questions: formatted, total });
  } catch (error) {
    console.error('GET questions error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}