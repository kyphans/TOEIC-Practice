import { NextRequest, NextResponse } from 'next/server';
import { Pool } from '@neondatabase/serverless';

export async function POST(req: NextRequest) {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();
  try {
    const { testName, description, strategy, created_by, questions } = await req.json();
    // Validate payload
    if (!testName || typeof testName !== 'string' || !testName.trim()) {
      return NextResponse.json({ error: 'Exam test name is required' }, { status: 400 });
    }
    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json({ error: 'Questions array is required' }, { status: 400 });
    }
    for (const q of questions) {
      if (!q || typeof q !== 'object') {
        return NextResponse.json({ error: 'Invalid question format' }, { status: 400 });
      }
      if (!q.type || !q.section || !q.part || !q.description || !q.template || !Array.isArray(q.template.options)) {
        return NextResponse.json({ error: 'Missing question fields' }, { status: 400 });
      }
    }

    await client.query('BEGIN');

    // 1. Create new exam
    const examResult = await client.query(
      'INSERT INTO exams (title, description, total_questions, strategy, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [testName, description || null, questions.length, strategy || 'manual', created_by || null]
    );
    const examId = examResult.rows[0].id;

    for (const q of questions) {
      let questionId = q.existedIDInDB;

      if (!questionId) {
        // 1. Lấy section_id từ question_sections với name = type
        const sectionRes = await client.query(
          'SELECT id FROM question_sections WHERE name = $1',
          [q.type]
        );
        if (!sectionRes.rows.length) throw new Error(`Section not found: ${q.type}`);
        const section_id = sectionRes.rows[0].id;

        // 2. Lấy question_type_id từ question_types với name = description (mapping cứng thành 'sentence')
        const questionTypeName = 'sentence';
        const typeRes = await client.query(
          'SELECT id FROM question_types WHERE name = $1',
          [questionTypeName]
        );
        if (!typeRes.rows.length) throw new Error(`Question type not found: ${questionTypeName}`);
        const question_type_id = typeRes.rows[0].id;

        // 3. Insert vào questions
        const questionResult = await client.query(
          'INSERT INTO questions (content, correct_answer, section_id, question_type_id, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING id',
          [q.template.question, q.template.options[0], section_id, question_type_id, created_by || null]
        );
        questionId = questionResult.rows[0].id;

        // 4. Insert vào question_choices
        for (let i = 0; i < q.template.options.length; i++) {
          const opt = q.template.options[i];
          const label = String.fromCharCode(65 + i); // 'A', 'B', ...
          await client.query(
            'INSERT INTO question_choices (question_id, label, content) VALUES ($1, $2, $3)',
            [questionId, label, opt]
          );
        }

        // 5. Insert vào question_media nếu có
        if (q.template.image && q.template.image.trim()) {
          await client.query(
            'INSERT INTO question_media (question_id, media_type, content) VALUES ($1, $2, $3)',
            [questionId, 'image', q.template.image]
          );
        }
        if (q.template.audio && q.template.audio.trim()) {
          await client.query(
            'INSERT INTO question_media (question_id, media_type, content) VALUES ($1, $2, $3)',
            [questionId, 'audio', q.template.audio]
          );
        }
        if (q.template.transcript && q.template.transcript.trim()) {
          await client.query(
            'INSERT INTO question_media (question_id, media_type, content) VALUES ($1, $2, $3)',
            [questionId, 'transcript', q.template.transcript]
          );
        }
      }

      // 6. Snapshot vào exam_questions
      const questionDataArr = await client.query(
        'SELECT * FROM questions WHERE id = $1',
        [questionId]
      );
      const questionData = questionDataArr.rows[0];
      const examQuestionResult = await client.query(
        'INSERT INTO exam_questions (exam_id, original_question_id, content, correct_answer, difficulty, topic, question_type_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
        [
          examId,
          questionId,
          questionData.content,
          questionData.correct_answer,
          questionData.difficulty,
          questionData.topic,
          questionData.question_type_id,
        ]
      );
      const examQuestionId = examQuestionResult.rows[0].id;

      // 7. Snapshot choices vào exam_question_choices
      const choices = await client.query(
        'SELECT label, content FROM question_choices WHERE question_id = $1',
        [questionId]
      );
      for (const choice of choices.rows) {
        await client.query(
          'INSERT INTO exam_question_choices (exam_question_id, label, content) VALUES ($1, $2, $3)',
          [examQuestionId, choice.label, choice.content]
        );
      }
    }

    await client.query('COMMIT');
    return NextResponse.json({ success: true, examId });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    client.release();
    await pool.end();
  }
} 