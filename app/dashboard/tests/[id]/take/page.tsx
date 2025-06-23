"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { RadioGroup, Radio } from "@/components/ui/radio"
import { Label } from "@/components/ui/label"
import { useAnswersStore } from "@/app/store/answers"
import { useTimerStore } from "@/app/store/timer"
import type { TestData } from '@/lib/testHelper'
import { checkAnswers } from '@/lib/testHelper'
import { SubmitTestDialog } from "@/components/SubmitTestDialog"

export default function TakeTest({ params }: { params: { id: string } }) {
  const router = useRouter()
  const testId = params.id
  const { setAnswer, getAnswersByTestId, initAnswers, clearAnswers } = useAnswersStore()
  const { timeLeft, setTimeLeft, clearTimer } = useTimerStore()

  // State cho test
  const [test, setTest] = useState<TestData | null>(null)
  const [loading, setLoading] = useState(true)
  // State cho dialog xác nhận submit
  const [showSubmitModal, setShowSubmitModal] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/tests?mock=1&testId=${testId}`)
      .then(res => res.json())
      .then(data => {
        setTest(data.test)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [testId])

  useEffect(() => {
    // Khởi tạo answers từ localStorage nếu có
    initAnswers(testId)

    // Khởi tạo timer nếu chưa có
    if (!timeLeft[testId]) {
      setTimeLeft(testId, 7200) // 120 minutes in seconds
    }
  }, [testId, initAnswers, timeLeft, setTimeLeft])

  const answers = getAnswersByTestId(testId)

  // Tính toán câu hỏi đã trả lời/chưa trả lời
  const allQuestions = test ? test.sections.flatMap(section => section.questions) : []
  const answeredQuestions = allQuestions.filter(q => answers[q.id?.toString?.()])
  const unansweredQuestions = allQuestions.filter(q => !answers[q.id?.toString?.()])

  // Handle scroll to question on hash change
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

    // Handle initial hash if exists
    handleHashChange()

    // Add hash change listener
    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [])

  // Handle answer selection
  const handleSelectAnswer = (questionId: string, answer: string) => {
    setAnswer(`${testId}-${questionId}`, answer)
  }

  // Handle test submission
  const handleSubmitTest = () => {
    if (!test) return
    const { correctCount, score } = checkAnswers(testId, answers)
    clearAnswers()
    clearTimer(testId)
    router.push(`/dashboard/tests/${testId}/results?score=${score}&correct=${correctCount}`)
  }

  // Hàm mở modal khi nhấn Submit Test
  const handleOpenSubmitModal = () => setShowSubmitModal(true)
  // Hàm đóng modal
  const handleCloseSubmitModal = () => setShowSubmitModal(false)
  // Hàm xác nhận submit
  const handleConfirmSubmit = () => {
    setShowSubmitModal(false)
    handleSubmitTest()
  }

  if (loading) return <div className='min-h-screen flex items-center justify-center'>Loading test...</div>
  if (!test) return <div className='min-h-screen flex items-center justify-center'>Test not found.</div>

  return (
    <div className='min-h-screen bg-white'>
      {/* Question content */}
      <div className='container mx-auto'>
        {test.sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className='mb-8 sm:mb-12'>
            <h2 className='text-xl sm:text-2xl font-black uppercase border-b-2 sm:border-b-4 border-black pb-1 sm:pb-2 mb-4 sm:mb-6'>
              {section.name} Section
            </h2>
            <div className='space-y-6 sm:space-y-8'>
              {section.questions.map((question, index) => (
                <div 
                  key={question.id} 
                  id={`question${question.id}`}
                  className={`py-4 scroll-mt-20 ${index !== section.questions.length - 1 ? 'border-b border-gray-200' : ''}`}
                >
                  <div className='mb-4'>
                    <h3 className='text-lg sm:text-xl font-bold mb-2 sm:mb-4'>
                      Question {question.id}
                    </h3>
                    <p className='text-base sm:text-lg'>{question.question}</p>
                  </div>

                  {question.type === 'photo' && question.image && (
                    <div className='mb-4 flex justify-center'>
                      <img
                        src={question.image}
                        alt='Question image'
                        className='max-w-full sm:max-w-[400px] h-auto'
                      />
                    </div>
                  )}

                  <div className='space-y-2 sm:space-y-3'>
                    <RadioGroup
                      value={answers[question.id.toString()] || ''}
                      onValueChange={(value) => handleSelectAnswer(question.id.toString(), value)}
                      className='space-y-2 sm:space-y-3'>
                      {question.options.map((option, index) => (
                        <div
                          key={index}
                          className={`test-option cursor-pointer ${answers[question.id.toString()] === option ? 'selected' : ''}`}
                          onClick={() => handleSelectAnswer(question.id.toString(), option)}
                        >
                          <div className='flex items-center w-full'>
                            <Radio
                              id={`${question.id}-option-${index}`}
                              value={option}
                              className='mr-2 sm:mr-3 shadcn-radio'
                              checked={answers[question.id.toString()] === option}
                              onChange={() => handleSelectAnswer(question.id.toString(), option)}
                            />
                            <Label
                              htmlFor={`${question.id}-option-${index}`}
                              className='cursor-pointer font-medium text-base sm:text-lg w-full'
                            >
                              {option}
                            </Label>
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
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
    </div>
  )
}

