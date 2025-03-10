"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { RadioGroup, Radio } from "@/components/ui/radio"
import { Label } from "@/components/ui/label"
import { getMockTest } from "@/app/mock-questions"
import { useAnswersStore } from "@/app/store/answers"
import { useTimerStore } from "@/app/store/timer"

export default function TakeTest({ params }: { params: { id: string } }) {
  const router = useRouter()
  const testId = params.id
  const { setAnswer, getAnswersByTestId, initAnswers, clearAnswers } = useAnswersStore()
  const { timeLeft, setTimeLeft, clearTimer } = useTimerStore()

  // Get test data
  const test = getMockTest(parseInt(testId))

  useEffect(() => {
    // Khởi tạo answers từ localStorage nếu có
    initAnswers(testId)

    // Khởi tạo timer nếu chưa có
    if (!timeLeft[testId]) {
      setTimeLeft(testId, 7200) // 120 minutes in seconds
    }
  }, [testId, initAnswers, timeLeft, setTimeLeft])

  const answers = getAnswersByTestId(testId)

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
    // Calculate a mock score
    const totalQuestions = test.sections.reduce((total, section) => total + section.questions.length, 0)
    const answeredQuestions = Object.keys(answers).length
    const mockScore = Math.floor((answeredQuestions / totalQuestions) * 990)

    // Clear answers and timer
    clearAnswers()
    clearTimer(testId)

    // Navigate to results page
    router.push(`/dashboard/tests/${testId}/results?score=${mockScore}`)
  }

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
                          className={`test-option ${
                            answers[question.id.toString()] === option ? 'selected' : ''
                          }`}>
                          <div className='flex items-center'>
                            <Radio
                              id={`${question.id}-option-${index}`}
                              value={option}
                              className='mr-2 sm:mr-3'
                            />
                            <Label
                              htmlFor={`${question.id}-option-${index}`}
                              className='cursor-pointer font-medium text-base sm:text-lg w-full'>
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
            onClick={handleSubmitTest}
            className='brutalist-button text-base sm:text-lg py-4 sm:py-6 px-8 sm:px-12'>
            Submit Test
          </Button>
        </div>
      </div>
    </div>
  )
}

