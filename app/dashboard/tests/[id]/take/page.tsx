"use client"

import { useAnswersStore } from "@/app/store/answers"
import { QuestionGrid } from '@/components/QuestionGrid'
import { SubmitTestDialog } from "@/components/SubmitTestDialog"
import { Button } from "@/components/ui/button"
import { fetcher } from '@/lib/query'
import type { ExamDetailResponse } from '@/types/exams.type'
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import useSWR from 'swr'
import { QuestionCard } from "../../../../../components/QuestionCard"

export default function TakeTest({ params }: { params: { id: string } }) {
  // ====== Router & Store ======
  const router = useRouter()
  const testId = params.id
  const { setAnswer, getAnswersByTestId, initAnswers, clearAnswers } = useAnswersStore()

  // ====== State ======
  // State cho dialog xác nhận submit
  const [showSubmitModal, setShowSubmitModal] = useState(false)

  // ====== Lấy đề thi thật bằng SWR ======
  const { data, error, isLoading, isValidating } = useSWR<ExamDetailResponse>(
    `/api/exams/${testId}`,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  );

  // ====== Chuẩn hóa data trả về từ SWR ======
  const examData = useMemo<ExamDetailResponse>(() => {
    return data ?? {
      id: 0,
      name: '',
      exam_attempt_id: 0,
      sections: [],
    };
  }, [data]);

  // ====== useEffect ======
  // Điều hướng về trang test nếu không có exam_attempt_id
  useEffect(() => {
    if (!isValidating && !examData?.exam_attempt_id) {
      router.push('/dashboard/tests');
    }
  }, [isValidating, examData, error, router]);

  // Khởi tạo answers từ localStorage nếu có
  useEffect(() => {
    initAnswers(testId)
  }, [testId, initAnswers])

  // Lắng nghe thay đổi hash để scroll tới câu hỏi tương ứng
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      if (hash) {
        const element = document.querySelector(hash)
        if (element) {
          element.scrollIntoView({ behavior: "smooth" })
        }
      }
    }
    handleHashChange()
    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [])

  // ====== Memoized Data ======
  // Lấy answers từ localStorage
  const answers = useMemo(() => getAnswersByTestId(testId), [testId, getAnswersByTestId])

  // Tính toán danh sách câu hỏi
  const allQuestions = useMemo(() => 
    examData.id ? examData.sections.flatMap(section => section.questions) : [], 
    [examData]
  )
  // Câu hỏi đã trả lời
  const answeredQuestions = useMemo(() => 
    allQuestions.filter(q => answers[q.id?.toString?.()]), 
    [allQuestions, answers]
  )
  // Câu hỏi chưa trả lời
  const unansweredQuestions = useMemo(() => 
    allQuestions.filter(q => !answers[q.id?.toString?.()]), 
    [allQuestions, answers]
  )

  // ====== Đánh lại số thứ tự câu hỏi dựa trên part và thứ tự trong part ======
  // 1. Nhóm câu hỏi theo part
  const questionsByPart = allQuestions.reduce((acc, question) => {
    const part = question.part_code ? parseInt(question.part_code.replace(/[^0-9]/g, '')) || 0 : 0;
    if (!acc[part]) acc[part] = [];
    acc[part].push(question);
    return acc;
  }, {} as Record<number, typeof allQuestions>);
  // 2. Sort các part
  const sortedParts = Object.keys(questionsByPart).map(Number).sort((a, b) => a - b);
  // 3. Tạo mapping từ id sang số thứ tự
  const questionNumberMap: Record<string, number> = {};
  let currentNumber = 1;
  sortedParts.forEach(part => {
    questionsByPart[part].forEach(q => {
      questionNumberMap[q.id.toString()] = currentNumber;
      currentNumber++;
    });
  });

  // Chuyển đổi allQuestions sang Question[] cho QuestionGrid
  const questionsForGrid = useMemo(() => allQuestions.map(q => ({
    id: q.id,
    question: q.question,
    options: q.options,
    image: q.image,
    audio: q.audio,
    section: q.section,
    transcript: q.transcript,
    type: 'unknown',
    part: q.part_code ? parseInt(q.part_code.replace(/[^0-9]/g, '')) || 0 : 0
  })), [allQuestions])

  // ====== Handler Functions ======
  // Chọn đáp án cho câu hỏi
  const handleSelectAnswer = (questionId: string, answer: string) => {
    setAnswer(`${testId}-${questionId}`, answer)
  }

  // Mở modal xác nhận submit
  const handleOpenSubmitModal = () => {
    setShowSubmitModal(true);
  }
  // Đóng modal xác nhận submit
  const handleCloseSubmitModal = () => setShowSubmitModal(false)
  // Xác nhận submit bài thi
  const handleConfirmSubmit = () => {
    setShowSubmitModal(false)
    handleSubmitTest()
  }
  // Xử lý submit bài thi
  const handleSubmitTest = () => {
    if (!answers) return
    console.log('submitted test', answers)
    // Có thể cần sửa lại checkAnswers nếu muốn dùng dữ liệu thật
    // const { correctCount, score } = checkAnswers(testId, answers)
    clearAnswers()
    // clearTimer(testId)
    router.push(`/dashboard/tests/${testId}/results`)
  }

  // ====== Render ======
  const testName = examData.name || ''

  if (isLoading || isValidating) return <div className='min-h-screen flex items-center justify-center'>Loading test...</div>
  if (error || !examData.exam_attempt_id) return <div className='min-h-screen flex items-center justify-center'>Test not found.</div>

  return (
    <div className='min-h-screen bg-white'>
      <div className='container mx-auto flex flex-row min-h-screen'>
        {/* Main question content */}
        <div className={'p-3 sm:p-6 flex-1'}>
          {/* Question content */}
          {examData.sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className='mb-8 sm:mb-12'>
              <h2 className='text-xl sm:text-2xl font-black uppercase border-b-2 sm:border-b-4 border-black pb-1 sm:pb-2 mb-4 sm:mb-6'>
                {section.name} Section
              </h2>
              <div className='space-y-6 sm:space-y-8'>
                {[...section.questions]
                  .sort((a, b) => questionNumberMap[a.id.toString()] - questionNumberMap[b.id.toString()])
                  .map((question, index) => (
                    <QuestionCard
                      key={question.id}
                      question={question}
                      answer={answers[question.id.toString()] || '_NONE_'}
                      onSelectAnswer={handleSelectAnswer}
                      questionNumber={questionNumberMap[question.id.toString()]}
                    />
                  ))}
              </div>
            </div>
          ))}

          {/* Submit button at bottom */}
          <div className='mt-6 sm:mt-8 flex justify-center pb-6 sm:pb-8'>
            <Button
              onClick={handleOpenSubmitModal}
              className='brutalist-button text-base sm:text-lg py-4 sm:py-6 px-8 sm:px-12'>
              Submit Test
            </Button>
          </div>
        </div>
        {/* QuestionGrid sticky right column */}
        {allQuestions.length > 0 && (
          <div className='hidden md:block w-80 flex-shrink-0'>
            <div className='top-0 p-2 sm:p-3 border-l-8 border-black bg-white z-50 h-[calc(100vh-76px)] sticky right-0'>
              <QuestionGrid
                questions={questionsForGrid}
                testId={testId}
                testName={testName}
                onSubmitTest={handleOpenSubmitModal}
              />
            </div>
          </div>
        )}
      </div>
      {/* Dialog xác nhận submit */}
      <SubmitTestDialog
        open={showSubmitModal}
        onOpenChange={setShowSubmitModal}
        answeredQuestions={answeredQuestions}
        unansweredQuestions={unansweredQuestions}
        onConfirm={handleConfirmSubmit}
        onCancel={handleCloseSubmitModal}
      />
    </div>
  );
}

