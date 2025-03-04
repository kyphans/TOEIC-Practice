"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { RadioGroup, Radio } from "@/components/ui/radio"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { getMockTest } from "@/app/mock-questions"
import { useAnswersStore } from "@/app/store/answers"
import { useTimerStore } from "@/app/store/timer"

export default function TakeTest({ params }: { params: { id: string } }) {
  const router = useRouter()
  const testId = params.id
  const { setAnswer, getAnswersByTestId, initAnswers, clearAnswers } = useAnswersStore()
  const { timeLeft, setTimeLeft, decrementTime, clearTimer } = useTimerStore()

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

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  // Handle timer
  useEffect(() => {
    const timer = setInterval(() => {
      if (timeLeft[testId] <= 1) {
        clearInterval(timer)
        handleSubmitTest()
      } else {
        decrementTime(testId)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [testId, timeLeft, decrementTime])

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
    <div className='min-h-screen flex flex-col bg-white'>
      {/* Test header */}
      <header className='bg-primary p-4 text-white'>
        <div className='container mx-auto flex justify-between items-center'>
          <h1 className='text-2xl font-black'>
            {test.name}
          </h1>
          <div className='flex items-center gap-4'>
            <div className='brutalist-card bg-white text-black p-2 flex items-center'>
              <AlertCircle className='mr-2 h-5 w-5 text-primary' />
              <span className='font-bold'>
                Time Left: {formatTime(timeLeft[testId] || 0)}
              </span>
            </div>
            <Button
              onClick={handleSubmitTest}
              className='brutalist-button bg-white text-primary'>
              Submit Test
            </Button>
          </div>
        </div>
      </header>

      {/* Question content */}
      <div className='container mx-auto py-8 px-4'>
        {test.sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className='mb-12'>
            <h2 className='text-2xl font-black uppercase border-b-4 border-black pb-2 mb-6'>
              {section.name} Section
            </h2>
            <div className='space-y-12'>
              {section.questions.map((question) => (
                <div 
                  key={question.id} 
                  id={`question${question.id}`}
                  className='brutalist-container p-6 scroll-mt-20'
                >
                  <div className='mb-6'>
                    <h3 className='text-xl font-bold mb-4'>
                      Question {question.id}
                    </h3>
                    <p className='text-lg'>{question.question}</p>
                  </div>

                  {question.type === 'photo' && question.image && (
                    <div className='mb-6 flex justify-center'>
                      <img
                        src={question.image}
                        alt='Question image'
                        className='border-4 border-black max-w-[400px] h-auto'
                      />
                    </div>
                  )}

                  <div className='space-y-4'>
                    <RadioGroup
                      value={answers[question.id.toString()] || ''}
                      onValueChange={(value) => handleSelectAnswer(question.id.toString(), value)}
                      className='space-y-4'>
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
                              className='mr-3'
                            />
                            <Label
                              htmlFor={`${question.id}-option-${index}`}
                              className='cursor-pointer font-bold text-lg w-full'>
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
        <div className='mt-8 flex justify-center'>
          <Button
            onClick={handleSubmitTest}
            className='brutalist-button text-lg py-6 px-12'>
            Submit Test
          </Button>
        </div>
      </div>
    </div>
  )
}

