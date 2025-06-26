import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { ExamDetailResponse, ExamSection, ExamQuestion, SectionName, PartCode } from '@/types/exams.type';

const SECTION_TIME: Record<SectionName, number> = {
  Listening: 2700,
  Reading: 4500,
};

export async function GET(req: Request, { params }: { params: { exam_id: string } }) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const examId = params.exam_id;
  if (!examId) return NextResponse.json({ error: 'Missing exam_id' }, { status: 400 });

  // Check if exam exists
  const [exam] = await sql`SELECT id, title FROM exams WHERE id = ${examId}`;
  if (!exam) return NextResponse.json({ error: 'Exam not found' }, { status: 404 });

  try {
    // 1. Lấy userId từ clerkId
    const userRes = await sql`SELECT id FROM users WHERE clerk_id = ${clerkId}`;
    const userId = userRes[0]?.id;
    if (!userId) return NextResponse.json({ error: 'User not found in DB' }, { status: 404 });

    // 2. Tạo exam_attempts
    const [attempt] = await sql`
      INSERT INTO exam_attempts (exam_id, user_id, started_at, status)
      VALUES (${examId}, ${userId}, NOW(), 'in_progress')
      RETURNING id
    `;

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
    const questionList: ExamQuestion[] = questions.map(q => {
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

    // 7. Group questions by section (Reading/Listening)
    const sectionGroups: Record<SectionName, ExamQuestion[]> = {
      Listening: [],
      Reading: [],
    };
    questionList.forEach(q => {
      sectionGroups[q.section].push(q);
    });

    // Tạo sections chỉ với các section có câu hỏi
    const sections: ExamSection[] = Object.entries(sectionGroups)
      .filter(([, questions]) => questions.length > 0)
      .map(([sectionName, questions]) => ({
        name: sectionName as SectionName,
        time: SECTION_TIME[sectionName as SectionName] || 0,
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