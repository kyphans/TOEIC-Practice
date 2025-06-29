import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { ExamDetailResponse, ExamSection, ExamQuestion, SectionName, PartCode } from '@/types/exams.type';
import { checkRole } from '@/lib/role';

const SECTION_TIME: Record<SectionName, number> = {
  Listening: 2700,
  Reading: 4500,
};

/**
 * @description Get exam detail - Endpoint: GET /api/exams/[exam_id]
 * @param req - The request object
 * @param params - The parameters object
 * @returns The exam detail
 */
export async function GET(req: Request, { params }: { params: { exam_id: string } }) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const examId = params.exam_id;
  if (!examId) return NextResponse.json({ error: 'Missing exam_id' }, { status: 400 });

  // Check if exam exists
  const [exam] = await sql`SELECT id, title, section_times, display_order FROM exams WHERE id = ${examId}`;
  if (!exam) return NextResponse.json({ error: 'Exam not found' }, { status: 404 });

  try {
    // 1. Lấy userId từ clerkId
    const userRes = await sql`SELECT id FROM users WHERE clerk_id = ${clerkId}`;
    const userId = userRes[0]?.id;
    if (!userId) return NextResponse.json({ error: 'User not found in DB' }, { status: 404 });

    // 2. Kiểm tra attempt in_progress gần nhất
    const [lastAttempt] = await sql`
      SELECT id, status, question_order FROM exam_attempts
      WHERE exam_id = ${examId} AND user_id = ${userId}
      ORDER BY started_at DESC LIMIT 1
    `;

    let attempt;
    let questionOrderArr: number[] | null = null;
    let isNewAttempt = false;

    if (lastAttempt && lastAttempt.status === 'in_progress') {
      attempt = lastAttempt;
      if (exam.display_order === 'random' && lastAttempt.question_order) {
        questionOrderArr = lastAttempt.question_order.split(',').map(Number);
      }
    } else {
      // 2.1. Tạo exam_attempts mới
      const [newAttempt] = await sql`
        INSERT INTO exam_attempts (exam_id, user_id, started_at, status)
        VALUES (${examId}, ${userId}, NOW(), 'in_progress')
        RETURNING id
      `;
      attempt = newAttempt;
      isNewAttempt = true;
    }

    // 3. Lấy thông tin đề thi (exam đã có ở trên)
    // 4. Lấy snapshot câu hỏi + choices
    const questions = await sql`
      SELECT eq.id, eq.content, eq.topic, eq.difficulty, eq.question_type_id,
             eq.original_question_id,
             q.section_id, qs.code as part_code
      FROM exam_questions eq
      LEFT JOIN questions q ON q.id = eq.original_question_id
      LEFT JOIN question_sections qs ON q.section_id = qs.id
      WHERE eq.exam_id = ${examId}
    `;

    const examQuestionIds = questions.map(q => q.id);
    const originalIds = questions.map(q => q.original_question_id).filter(Boolean);

    const [choices, mediaRows, sectionRows] = await Promise.all([
      examQuestionIds.length
        ? sql`SELECT exam_question_id, label, content FROM exam_question_choices WHERE exam_question_id = ANY(${examQuestionIds})`
        : [],
      originalIds.length
        ? sql`SELECT question_id, media_type, content FROM question_media WHERE question_id = ANY(${originalIds})`
        : [],
      sql`SELECT id, code, name, section_name FROM question_sections`,
    ]);

    // 5. Tạo map để tra cứu nhanh
    const choiceMap = new Map<number, { label: string; content: string }[]>();
    choices.forEach(c => {
      if (!choiceMap.has(c.exam_question_id)) choiceMap.set(c.exam_question_id, []);
      choiceMap.get(c.exam_question_id)!.push({ label: c.label, content: c.content });
    });

    const mediaMap = new Map<number, Record<string, string>>();
    mediaRows.forEach(m => {
      if (!mediaMap.has(m.question_id)) mediaMap.set(m.question_id, {});
      mediaMap.get(m.question_id)![m.media_type] = m.content;
    });

    const sectionMap: Record<number, { section_id: number; partCode: PartCode; sectionName: SectionName }> = {};
    sectionRows.forEach(({ id, code, section_name }) => {
      sectionMap[id] = {
        section_id: id as number,
        partCode: code as PartCode,
        sectionName: section_name as SectionName,
      };
    });

    // 6. Biến đổi câu hỏi
    let questionList: ExamQuestion[] = questions.map(q => {
      const opts = (choiceMap.get(q.id) || []).sort((a, b) => a.label.localeCompare(b.label));
      const media = mediaMap.get(q.original_question_id) || {};
      const sectionInfo = sectionMap[q.section_id];
      return {
        id: q.id,
        question: q.content,
        options: opts.map(o => o.content),
        image: media.image,
        audio: media.audio,
        transcript: media.transcript,
        section: sectionInfo.sectionName,
        part_code: sectionInfo.partCode,
      };
    });

    // Nếu display_order là 'random'
    if (exam.display_order === 'random') {
      if (questionOrderArr) {
        // Sắp xếp lại theo thứ tự đã lưu
        const idToQuestion = new Map(questionList.map(q => [q.id, q]));
        questionList = questionOrderArr.map(id => idToQuestion.get(id)).filter(Boolean) as ExamQuestion[];
      } else {
        // Shuffle và lưu lại thứ tự nếu là attempt mới
        questionList = questionList
          .map(value => ({ value, sort: Math.random() }))
          .sort((a, b) => a.sort - b.sort)
          .map(({ value }) => value);
        if (isNewAttempt) {
          const orderStr = questionList.map(q => q.id).join(',');
          await sql`UPDATE exam_attempts SET question_order = ${orderStr} WHERE id = ${attempt.id}`;
        }
      }
    }

    // 7. Group questions by section (Reading/Listening)
    const sectionGroups: Record<SectionName, ExamQuestion[]> = {
      Listening: [],
      Reading: [],
    };
    questionList.forEach(q => {
      sectionGroups[q.section].push(q);
    });

    // Parse section_times nếu có
    let sectionTimes: Record<SectionName, number> = { ...SECTION_TIME };
    if (exam.section_times && typeof exam.section_times === 'string') {
      const [reading, listening] = exam.section_times.split(',').map(s => parseInt(s.trim(), 10));
      if (!isNaN(reading)) sectionTimes.Reading = reading;
      if (!isNaN(listening)) sectionTimes.Listening = listening;
    }
    // Tạo sections chỉ với các section có câu hỏi
    const sections: ExamSection[] = Object.entries(sectionGroups)
      .filter(([, questions]) => questions.length > 0)
      .map(([sectionName, questions]) => ({
        name: sectionName as SectionName,
        time: sectionTimes[sectionName as SectionName] || 0,
        questions,
      }));

    const response: ExamDetailResponse = {
      exam_attempt_id: attempt.id,
      id: exam.id,
      name: exam.title,
      sections,
    };

    return NextResponse.json(response);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error', detail: String(err) }, { status: 500 });
  }
}

/**
 * @description Delete exam - Endpoint: DELETE /api/exams/[exam_id]
 * @param req - The request object
 * @param params - The parameters object
 * @returns 204 if deleted, 403 if forbidden, 404 if not found
 */
export async function DELETE(req: Request, { params }: { params: { exam_id: string } }) {
  const { userId: clerkId, has } = await auth();
  if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const examId = params.exam_id;
  if (!examId) return NextResponse.json({ error: 'Missing exam_id' }, { status: 400 });

  // Lấy user từ clerkId
  const userRes = await sql`SELECT id, role FROM users WHERE clerk_id = ${clerkId}`;
  const user = userRes[0];
  if (!user) return NextResponse.json({ error: 'User not found in DB' }, { status: 404 });

  // Lấy exam
  const examRes = await sql`SELECT id, created_by FROM exams WHERE id = ${examId}`;
  const exam = examRes[0];
  if (!exam) return NextResponse.json({ error: 'Exam not found' }, { status: 404 });

  // Chỉ admin hoặc người tạo mới được xóa
  if (! await checkRole('admin')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  // Xóa exam (cascading các bảng liên quan)
  await sql`DELETE FROM exams WHERE id = ${examId}`;
  return new NextResponse(null, { status: 204 });
}