"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { RadioGroup, Radio } from "@/components/ui/radio"
import { Label } from "@/components/ui/label"
import { AlertCircle, ChevronLeft, ChevronRight } from "lucide-react"

export default function TakeTest({ params }: { params: { id: string } }) {
  const router = useRouter()
  const testId = params.id

  // State for the test
  const [currentSection, setCurrentSection] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeLeft, setTimeLeft] = useState(7200) // 120 minutes in seconds
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mock test data - in a real app, you would fetch this from an API
  const test = {
    id: Number.parseInt(testId),
    name: `TOEIC Test ${testId}`,
    sections: [
      {
        name: "Listening",
        time: 2700, // 45 minutes in seconds
        questions: [
          {
            id: "L1",
            type: "photo",
            question:
              "Look at the picture and listen to the four statements. Choose the statement that best describes the picture.",
            image: "/placeholder.svg?height=300&width=400",
            options: ["A", "B", "C", "D"],
          },
          {
            id: "L2",
            type: "audio",
            question:
              "Listen to the question and the three responses. Choose the response that best answers the question.",
            options: ["A", "B", "C"],
          },
          // More questions would be added here
        ],
      },
      {
        name: "Reading",
        time: 4500, // 75 minutes in seconds
        questions: [
          {
            id: "R1",
            type: "sentence",
            question: "The company's profits _____ by 15% in the last quarter.",
            options: ["increase", "increased", "are increasing", "have been increased"],
          },
          {
            id: "R2",
            type: "sentence",
            question: "Despite the economic downturn, the company managed to _____ its market position.",
            options: ["maintain", "maintaining", "maintained", "to maintain"],
          },
          // More questions would be added here
        ],
      },
    ],
  }

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  // Handle timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleSubmitTest()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Current section and question data
  const currentSectionData = test.sections[currentSection]
  const currentQuestionData = currentSectionData.questions[currentQuestion]

  // Navigation functions
  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    } else if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
      setCurrentQuestion(test.sections[currentSection - 1].questions.length - 1)
    }
  }

  const goToNextQuestion = () => {
    if (currentQuestion < currentSectionData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else if (currentSection < test.sections.length - 1) {
      setCurrentSection(currentSection + 1)
      setCurrentQuestion(0)
    }
  }

  // Handle answer selection
  const handleSelectAnswer = (answer: string) => {
    setAnswers({
      ...answers,
      [currentQuestionData.id]: answer,
    })
  }

  // Handle test submission
  const handleSubmitTest = () => {
    setIsSubmitting(true)

    // In a real app, you would send the answers to your backend
    setTimeout(() => {
      // Calculate a mock score
      const totalQuestions = test.sections.reduce((total, section) => total + section.questions.length, 0)
      const answeredQuestions = Object.keys(answers).length
      const mockScore = Math.floor((answeredQuestions / totalQuestions) * 990)

      // Navigate to results page
      router.push(`/dashboard/tests/${testId}/results?score=${mockScore}`)
    }, 1500)
  }

  // Calculate progress
  const totalQuestions = test.sections.reduce((total, section) => total + section.questions.length, 0)
  const currentQuestionNumber =
    test.sections.slice(0, currentSection).reduce((total, section) => total + section.questions.length, 0) +
    currentQuestion +
    1

  const progressPercentage = (currentQuestionNumber / totalQuestions) * 100

  return (
    <div className='min-h-screen flex flex-col bg-white'>
      {/* Test header */}
      <header className='bg-primary p-4 text-white'>
        <div className='container mx-auto flex justify-between items-center'>
          <h1 className='text-2xl font-black'>
            {test.name} - {currentSectionData.name} Section
          </h1>
          <div className='flex items-center gap-4'>
            <div className='brutalist-card bg-white text-black p-2 flex items-center'>
              <AlertCircle className='mr-2 h-5 w-5 text-primary' />
              <span className='font-bold'>
                Time Left: {formatTime(timeLeft)}
              </span>
            </div>
            <Button
              onClick={handleSubmitTest}
              className='brutalist-button bg-white text-primary'
              disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Test'}
            </Button>
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <div className='w-full bg-gray-200 h-4 border-4 border-black mt-1'>
        <div
          className='bg-[#2e8b57] h-full'
          style={{ width: `${progressPercentage}%` }}></div>
      </div>

      {/* Question content */}
      <div className='flex-1 container mx-auto py-8 px-4'>
        <div className='brutalist-container'>
          <div className='mb-6'>
            <h2 className='text-xl font-bold mb-2'>
              Question {currentQuestionNumber} of {totalQuestions}
            </h2>
            <p className='text-lg'>{currentQuestionData.question}</p>
          </div>

          {currentQuestionData.type === 'photo' && (
            <div className='mb-6'>
              <img
                src={currentQuestionData.image || '/placeholder.svg'}
                alt='Question image'
                className='border-4 border-black max-w-full h-auto'
              />
            </div>
          )}

          <div className='space-y-4 mb-8'>
            <RadioGroup
              value={answers[currentQuestionData.id] || ''}
              onValueChange={handleSelectAnswer}
              className='space-y-4'>
              {currentQuestionData.options.map((option, index) => (
                <div
                  key={index}
                  className={`test-option ${
                    answers[currentQuestionData.id] === option ? 'selected' : ''
                  }`}
                  onClick={() => handleSelectAnswer(option)}>
                  <div className='flex items-center'>
                    <Radio
                      id={`option-${index}`}
                      value={option}
                      className='mr-3'
                    />
                    <Label
                      htmlFor={`option-${index}`}
                      className='cursor-pointer font-bold text-lg w-full'>
                      {option}
                    </Label>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Navigation buttons */}
          <div className='flex justify-between'>
            <Button
              onClick={goToPreviousQuestion}
              className='brutalist-button'
              disabled={currentSection === 0 && currentQuestion === 0}>
              <ChevronLeft className='mr-2 h-5 w-5' /> Previous
            </Button>
            <Button
              onClick={goToNextQuestion}
              className='brutalist-button'
              disabled={
                currentSection === test.sections.length - 1 &&
                currentQuestion === currentSectionData.questions.length - 1
              }>
              Next <ChevronRight className='ml-2 h-5 w-5' />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

