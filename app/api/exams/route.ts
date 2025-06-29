import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { Difficulty, SectionName } from '@/types/exams.type';

/**
 * @description - Create a new exam - Endpoint: POST /api/exams
 * @param req - The request body containing the exam details
 * @returns The created exam ID
 */
export async function POST(req: NextRequest) {
  console.log('[POST /api/exams] Start');
  const client = await pool.connect();
  try {
    console.log('[POST /api/exams] Parsing request body...');
    const { testName, description, strategy, created_by, questions } = await req.json();
    // Validate payload
    if (!testName || typeof testName !== 'string' || !testName.trim()) {
      console.log('[POST /api/exams] Missing testName');
      return NextResponse.json({ error: 'Exam test name is required' }, { status: 400 });
    }
    if (!Array.isArray(questions) || questions.length === 0) {
      console.log('[POST /api/exams] Missing questions array');
      return NextResponse.json({ error: 'Questions array is required' }, { status: 400 });
    }
    for (const q of questions) {
      if (!q || typeof q !== 'object') {
        console.log('[POST /api/exams] Invalid question format', q);
        return NextResponse.json({ error: 'Invalid question format' }, { status: 400 });
      }
      if (!q.type || !q.section || !q.part || !q.description || !q.template || !Array.isArray(q.template.options)) {
        console.log('[POST /api/exams] Missing question fields', q);
        return NextResponse.json({ error: 'Missing question fields' }, { status: 400 });
      }
    }

    // Lấy trước section_id cho tất cả các type = (Part 1, Part 2, Part 3, Part 4, Part 5, Part 6, Part 7)
    const questionTypeNames = [...new Set(questions.map(q => q.type))];
    console.log('[POST /api/exams] Fetching section ids for:', questionTypeNames);
    const sectionRes = await client.query(
      `SELECT id, name FROM question_sections WHERE name = ANY($1)`,
      [questionTypeNames]
    );
    const sectionMap = Object.fromEntries(sectionRes.rows.map((r: any) => [r.name, r.id]));
    console.log('[POST /api/exams] Section map:', sectionMap);

    // Lấy trước question_type_id (mặc định là 'sentence')
    const questionTypeName = 'sentence';
    console.log('[POST /api/exams] Fetching question_type_id for:', questionTypeName);
    const typeRes = await client.query(
      `SELECT id FROM question_types WHERE name = $1`,
      [questionTypeName]
    );
    if (!typeRes.rows.length) throw new Error(`Question type not found: ${questionTypeName}`);
    const questionTypeId = typeRes.rows[0].id;
    console.log('[POST /api/exams] questionTypeId:', questionTypeId);

    console.log('[POST /api/exams] Begin transaction');
    await client.query('BEGIN');

    // Get section names from type of parts = (Part 1, Part 2, Part 3, Part 4, Part 5, Part 6, Part 7)
    function getSectionNamesFromParts(parts: string[]): string | null {
      const has = (set: Set<string>) => parts.some(p => set.has(p));

      const listeningParts = new Set(['Part 1', 'Part 2', 'Part 3', 'Part 4']);
      const readingParts = new Set(['Part 5', 'Part 6', 'Part 7']);

      const sections = [
        has(listeningParts) ? 'Listening' : null,
        has(readingParts) ? 'Reading' : null,
      ].filter(Boolean);

      return sections.length > 0 ? sections.join(', ') : null;
    }

    // Hàm lấy tần suất xuất hiện nhiều nhất cho difficulty từ questions.difficulty
    // nếu questions = [] thì trả về 'easy'
    function getMostFrequentDifficulty(difficulties: (string | undefined)[]): string {
      const difficultyCount = difficulties.reduce((acc, d) => {
        if (!d) return acc;
        acc[d] = (acc[d] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      return Object.keys(difficultyCount).reduce((a, b) => difficultyCount[a] > difficultyCount[b] ? a : b, 'easy') || 'easy';
    }


    // 1. Create new exam
    console.log('[POST /api/exams] Inserting exam...');
    const examResult = await client.query(
      'INSERT INTO exams (title, description, total_questions, difficulty, strategy, section_names, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      [testName, description || null, questions.length, getMostFrequentDifficulty(questions.map(q => q.difficulty)), strategy || 'manual', getSectionNamesFromParts(questionTypeNames), created_by || null]
    );
    const examId = examResult.rows[0].id;
    console.log(`[POST /api/exams] Exam inserted with id: ${examId}`);

    // Chuẩn bị dữ liệu cho bulk insert
    const questionIndexMap = new Map(); // Map index -> questionId
    const choicesToInsert = [];
    const mediaToInsert = [];

    // 2. Insert questions (nếu chưa tồn tại)
    for (const [idx, q] of questions.entries()) {
      console.log(`[POST /api/exams] Processing question ${idx + 1}/${questions.length}`);
      let questionId = q.existedIDInDB;
      if (!questionId) {
        console.log(`[POST /api/exams] Inserting question for type: ${q.type}`);
        const res = await client.query(
          'INSERT INTO questions (content, correct_answer, section_id, question_type_id, created_by, difficulty) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
          [q.template.question, q.template.options[0], sectionMap[q.type], questionTypeId, created_by || null, 'easy']
        );
        questionId = res.rows[0].id;
        console.log(`[POST /api/exams] Question inserted with id: ${questionId}`);
        // Bulk choices
        for (let i = 0; i < q.template.options.length; i++) {
          const opt = q.template.options[i];
          const label = String.fromCharCode(65 + i);
          choicesToInsert.push([questionId, label, opt]);
        }
        // Bulk media
        if (q.template.image && q.template.image.trim()) {
          mediaToInsert.push([questionId, 'image', q.template.image]);
        }
        if (q.template.audio && q.template.audio.trim()) {
          mediaToInsert.push([questionId, 'audio', q.template.audio]);
        }
        if (q.template.transcript && q.template.transcript.trim()) {
          mediaToInsert.push([questionId, 'transcript', q.template.transcript]);
        }
      }
      questionIndexMap.set(idx, questionId);
    }

    // Bulk insert choices
    if (choicesToInsert.length) {
      // Log chi tiết từng choices theo questionId
      const choicesByQuestion: Record<string, {label: string, content: string}[]> = {};
      for (const [questionId, label, content] of choicesToInsert) {
        const qid = String(questionId);
        if (!choicesByQuestion[qid]) choicesByQuestion[qid] = [];
        choicesByQuestion[qid].push({ label, content });
      }
      console.log('[POST /api/exams] Bulk inserting choices for questions:', Object.keys(choicesByQuestion).length);
      for (const [qid, choices] of Object.entries(choicesByQuestion)) {
        console.log(`[POST /api/exams]   QuestionId: ${qid}, Choices:`, choices);
      }
      console.log(`[POST /api/exams] Bulk inserting ${choicesToInsert.length} choices...`);
      const values = choicesToInsert.map((_, i) => `($${i*3+1}, $${i*3+2}, $${i*3+3})`).join(',');
      await client.query(
        `INSERT INTO question_choices (question_id, label, content) VALUES ${values}`,
        choicesToInsert.flat()
      );
    }
    // Bulk insert media
    if (mediaToInsert.length) {
      console.log(`[POST /api/exams] Bulk inserting ${mediaToInsert.length} media...`);
      const values = mediaToInsert.map((_, i) => `($${i*3+1}, $${i*3+2}, $${i*3+3})`).join(',');
      await client.query(
        `INSERT INTO question_media (question_id, media_type, content) VALUES ${values}`,
        mediaToInsert.flat()
      );
    }

    // 3. Snapshot vào exam_questions và exam_question_choices (batch insert)
    const examQuestionsToInsert = [];
    const examQuestionsMap = []; // Lưu mapping: idx -> {questionId, examQuestionData}
    for (const [idx, q] of questions.entries()) {
      const questionId = questionIndexMap.get(idx);
      // Lấy dữ liệu question (chỉ lấy cột cần thiết)
      const questionDataArr = await client.query(
        'SELECT content, correct_answer, difficulty, topic, question_type_id FROM questions WHERE id = $1',
        [questionId]
      );
      const questionData = questionDataArr.rows[0];
      examQuestionsToInsert.push([
        examId,
        questionId,
        questionData.content,
        questionData.correct_answer,
        questionData.difficulty,
        questionData.topic,
        questionData.question_type_id,
      ]);
      examQuestionsMap.push({ idx, questionId });
    }
    // Batch insert exam_questions
    let examQuestionIds = [];
    if (examQuestionsToInsert.length) {
      const values = examQuestionsToInsert.map((_, i) => `($${i*7+1}, $${i*7+2}, $${i*7+3}, $${i*7+4}, $${i*7+5}, $${i*7+6}, $${i*7+7})`).join(',');
      const res = await client.query(
        `INSERT INTO exam_questions (exam_id, original_question_id, content, correct_answer, difficulty, topic, question_type_id) VALUES ${values} RETURNING id` ,
        examQuestionsToInsert.flat()
      );
      examQuestionIds = res.rows.map(r => r.id);
    }
    // Batch insert exam_question_choices
    const allExamQuestionChoices = [];
    for (let i = 0; i < examQuestionsMap.length; i++) {
      const { idx, questionId } = examQuestionsMap[i];
      const examQuestionId = examQuestionIds[i];
      // Lấy choices
      const choices = await client.query(
        'SELECT label, content FROM question_choices WHERE question_id = $1',
        [questionId]
      );
      for (const choice of choices.rows) {
        allExamQuestionChoices.push([examQuestionId, choice.label, choice.content]);
      }
    }
    if (allExamQuestionChoices.length) {
      const values = allExamQuestionChoices.map((_, i) => `($${i*3+1}, $${i*3+2}, $${i*3+3})`).join(',');
      await client.query(
        `INSERT INTO exam_question_choices (exam_question_id, label, content) VALUES ${values}`,
        allExamQuestionChoices.flat()
      );
    }

    console.log('[POST /api/exams] Commit transaction');
    await client.query('COMMIT');
    console.log('[POST /api/exams] Success');
    return NextResponse.json({ success: true, examId });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('[POST /api/exams] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    client.release();
    console.log('[POST /api/exams] Connection closed');
  }
}

/**
 * @description Get all exams - Endpoint: GET /api/exams
 * @param req - The request object
 * @returns The list of exams
 */
export async function GET(req: Request) {
  console.log('[GET /api/exams] Start');
  const { userId } = await auth();
  console.log('[GET /api/exams] userId:', userId);

  if (!userId) {
    console.log('[GET /api/exams] Unauthorized');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get query params
  const { searchParams } = new URL(req.url);
  const index = parseInt(searchParams.get('index') || '1', 10); // page index (1-based)
  const pageSize = parseInt(searchParams.get('pageSize') || '50', 10); // default 50
  const offset = (index - 1) * pageSize;
  const difficultyParam = searchParams.get('difficulty');
  const group = searchParams.get('group') === 'true';
  let difficulties: string[] | undefined = undefined;
  if (difficultyParam) {
    difficulties = difficultyParam.split(',').map(d => d.trim().toLowerCase());
  }
  console.log('[GET /api/exams] Query params:', { index, pageSize, offset, difficulties, group });

  try {
    // Build WHERE clause for difficulty
    let whereClause = '';
    let whereValues: any[] = [];
    if (difficulties && difficulties.length > 0) {
      whereClause = 'WHERE LOWER(e.difficulty::text) = ANY($1)';
      whereValues.push(difficulties);
    }

    // Get total exams (with filter)
    let totalResult;
    if (whereClause) {
      totalResult = await pool.query(
        `SELECT COUNT(*)::int AS total FROM exams e ${whereClause}`,
        whereValues
      );
    } else {
      totalResult = await pool.query(
        'SELECT COUNT(*)::int AS total FROM exams'
      );
    }
    const total = totalResult.rows[0]?.total || 0;
    console.log('[GET /api/exams] Total exams:', total);

    // Get paginated exams (with filter)
    let exams;
    if (whereClause) {
      exams = await pool.query(
        `
          SELECT 
            e.id,
            e.title,
            e.description,
            e.total_questions,
            e.difficulty,
            e.section_names,
            e.strategy,
            e.section_times,
            e.created_by,
            e.created_at
          FROM exams e
          ${whereClause}
          ORDER BY e.id DESC
          LIMIT $${whereValues.length + 1} OFFSET $${whereValues.length + 2}
        `,
        [...whereValues, pageSize, offset]
      );
    } else {
      exams = await pool.query(
        `
          SELECT 
            e.id,
            e.title,
            e.description,
            e.total_questions,
            e.difficulty,
            e.section_names,
            e.strategy,
            e.section_times,
            e.created_by,
            e.created_at
          FROM exams e
          ORDER BY e.id DESC
          LIMIT $1 OFFSET $2
        `,
        [pageSize, offset]
      );
    }
    console.log('[GET /api/exams] Exams fetched:', exams.rows.length);
    // Format data
    const formattedExams = exams.rows.map((e: any) => {
      // Parse section_names và section_times thành mảng sections
      const sectionNames = e.section_names ? e.section_names.split(',').map((s: string) => s.trim()) : [];
      const sectionTimes = (typeof e.section_times === 'string' && e.section_times)
        ? e.section_times.split(',').map((s: string) => {
            const n = parseInt(s.trim(), 10);
            return isNaN(n) ? null : n;
          })
        : [];
      const sections = sectionNames.map((name: string, idx: number) => ({
        name,
        time: sectionTimes[idx] ?? null,
      }));
      return {
        id: e.id,
        title: e.title,
        description: e.description,
        totalQuestions: e.total_questions,
        difficulty: e.difficulty ?? Difficulty.Easy,
        strategy: e.strategy,
        sections,
        createdBy: e.created_by,
        createdAt: e.created_at,
      };
    });

    let responseData: any;
    if (group) {
      // Group by difficulty
      responseData = {};
      for (const exam of formattedExams) {
        const diff = (exam.difficulty || 'easy').toLowerCase();
        if (!responseData[diff]) responseData[diff] = [];
        responseData[diff].push(exam);
      }
    } else {
      responseData = { exams: formattedExams, total };
    }
    console.log('[GET /api/exams] Returning data:', group ? Object.keys(responseData) : { exams: formattedExams.length, total });
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('[GET /api/exams] Error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
} 