import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

// POST /api/exams/[exam_id]/submit
export async function POST(req: NextRequest, { params }: { params: { exam_id: string } }) {
  try {
    const exam_id = Number(params.exam_id);
    const { exam_attempt_id, answers } = await req.json(); // answers: { [exam_question_id]: selected_answer }
    if (!exam_id || !exam_attempt_id || !answers) {
      return NextResponse.json({ error: 'Missing exam_id, exam_attempt_id, or answers' }, { status: 400 });
    }

    // Lấy tất cả exam_questions cho exam_id
    const examQuestions = await sql`
      SELECT id, correct_answer FROM exam_questions WHERE exam_id = ${exam_id}
    `;
    const correctMap = Object.fromEntries(examQuestions.map((q: any) => [q.id, q.correct_answer]));

    // Chấm điểm và gom dữ liệu cho bulk upsert
    let correctCount = 0;
    const totalQuestions = examQuestions.length;
    const answerTuples = [];
    for (const [questionId, selected_answer] of Object.entries(answers)) {
      const correct_answer = correctMap[Number(questionId)];
      const is_correct = selected_answer === correct_answer;
      if (is_correct) correctCount++;
      answerTuples.push([
        exam_attempt_id,
        Number(questionId),
        selected_answer,
        is_correct
      ]);
    }

    // Bulk upsert answers
    if (answerTuples.length > 0) {
      const exam_attempt_ids = answerTuples.map(t => t[0]);
      const exam_question_ids = answerTuples.map(t => t[1]);
      const selected_answers = answerTuples.map(t => t[2]);
      const is_corrects = answerTuples.map(t => t[3]);
      await sql`
        INSERT INTO exam_answers (exam_attempt_id, exam_question_id, selected_answer, is_correct)
        SELECT * FROM UNNEST (
          ${exam_attempt_ids}::int[],
          ${exam_question_ids}::int[],
          ${selected_answers}::text[],
          ${is_corrects}::bool[]
        )
        ON CONFLICT (exam_attempt_id, exam_question_id)
        DO UPDATE SET selected_answer = EXCLUDED.selected_answer, is_correct = EXCLUDED.is_correct
      `;
    }

    // Tính score (giả sử mỗi câu 5 điểm)
    const score = correctCount * 5

    // Update exam_attempts
    await sql`
      UPDATE exam_attempts
      SET score = ${score}, status = 'submitted', submitted_at = NOW()
      WHERE id = ${exam_attempt_id}
    `;

    return NextResponse.json({ score, correctCount, totalQuestions });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
} 