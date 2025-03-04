"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ChevronLeft, ChevronRight, Check, X, HelpCircle } from "lucide-react"

export default function TestReview({ params }: { params: { id: string } }) {
  const testId = params.id
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [showExplanation, setShowExplanation] = useState(false)

  // Mock test review data
  const testReview = {
    id: Number.parseInt(testId),
    name: `TOEIC Test ${testId}`,
    date: "2023-05-15",
    score: 750,
    totalScore: 990,
    timeSpent: "01:45:30",
    sections: [
      {
        name: "Listening",
        score: 380,
        maxScore: 495,
        correctAnswers: 76,
        totalQuestions: 100,
        questions: [
          {
            id: "L1",
            type: "photo",
            question:
              "Look at the picture and listen to the four statements. Choose the statement that best describes the picture.",
            image: "/placeholder.svg?height=300&width=400",
            options: [
              "A. The man is sitting at his desk.",
              "B. The man is standing near the window.",
              "C. The man is typing on a computer.",
              "D. The man is talking on the phone.",
            ],
            userAnswer: "C",
            correctAnswer: "D",
            explanation:
              "In the image, the man is clearly talking on the phone while standing near his desk. He is not typing on a computer as indicated in option C.",
          },
          {
            id: "L2",
            type: "audio",
            question:
              "Listen to the question and the three responses. Choose the response that best answers the question.",
            options: ["A. I'll be there at 3 PM.", "B. The meeting starts at 2 PM.", "C. I prefer morning meetings."],
            userAnswer: "B",
            correctAnswer: "B",
            explanation:
              "The question asked about the meeting time, and option B correctly states when the meeting starts.",
          },
          {
            id: "L3",
            type: "conversation",
            question: "What will the woman probably do next?",
            options: ["A. Call a client.", "B. Attend a meeting.", "C. Review a report.", "D. Take a lunch break."],
            userAnswer: "B",
            correctAnswer: "B",
            explanation:
              "Based on the conversation, the woman mentioned she needs to prepare for an upcoming meeting, indicating she will attend it next.",
          },
          {
            id: "L4",
            type: "talk",
            question: "What is the main topic of the announcement?",
            options: [
              "A. A new company policy.",
              "B. An upcoming office renovation.",
              "C. Changes to the work schedule.",
              "D. A team-building event.",
            ],
            userAnswer: "A",
            correctAnswer: "B",
            explanation:
              "The announcement primarily discussed the details of the upcoming office renovation, including timeline and temporary arrangements.",
          },
          // More listening questions would be added here
        ],
      },
      {
        name: "Reading",
        score: 370,
        maxScore: 495,
        correctAnswers: 74,
        totalQuestions: 100,
        questions: [
          {
            id: "R1",
            type: "sentence",
            question: "The company's profits _____ by 15% in the last quarter.",
            options: ["A. increase", "B. increased", "C. are increasing", "D. have been increased"],
            userAnswer: "B",
            correctAnswer: "B",
            explanation:
              "The sentence requires a past tense verb to describe a completed action in the last quarter. 'Increased' is the correct past tense form.",
          },
          {
            id: "R2",
            type: "sentence",
            question: "Despite the economic downturn, the company managed to _____ its market position.",
            options: ["A. maintain", "B. maintaining", "C. maintained", "D. to maintain"],
            userAnswer: "A",
            correctAnswer: "A",
            explanation:
              "After 'managed to', we need the base form of the verb. 'Maintain' is the correct form in this context.",
          },
          {
            id: "R3",
            type: "text-completion",
            question:
              "The following text is missing a sentence. Choose the most appropriate option to complete the text.\n\nThe marketing team presented their new campaign strategy. _____. The CEO approved the budget allocation for the project.",
            options: [
              "A. The finance department calculated the costs.",
              "B. They emphasized the importance of social media advertising.",
              "C. Several employees were absent from the meeting.",
              "D. The office building was renovated last year.",
            ],
            userAnswer: "A",
            correctAnswer: "B",
            explanation:
              "Option B provides the most logical connection between the marketing team's presentation and the CEO's budget approval, focusing on a key aspect of their strategy.",
          },
          {
            id: "R4",
            type: "reading-comprehension",
            question: "According to the passage, what was the main reason for the company's success?",
            passage:
              "TechInnovate has seen remarkable growth over the past five years. While competitors focused on traditional marketing channels, TechInnovate invested heavily in digital transformation and customer experience. This strategic decision, combined with their agile development process, allowed them to respond quickly to market changes and customer needs.",
            options: [
              "A. Aggressive marketing campaigns",
              "B. Lower prices than competitors",
              "C. Digital transformation and customer focus",
              "D. Expanding to international markets",
            ],
            userAnswer: "C",
            correctAnswer: "C",
            explanation:
              "The passage explicitly states that TechInnovate's investment in digital transformation and customer experience, along with their agile development process, were key to their success.",
          },
          // More reading questions would be added here
        ],
      },
    ],
    weaknesses: [
      "Listening to announcements and talks",
      "Reading comprehension of complex business texts",
      "Vocabulary related to business negotiations",
    ],
    strengths: [
      "Understanding conversations and dialogues",
      "Grammar and sentence structure",
      "Comprehension of short texts",
    ],
    recommendations: [
      "Practice with more business-related listening materials",
      "Focus on reading longer passages about business topics",
      "Review vocabulary related to negotiations and contracts",
    ],
  }

  // Combine all questions from all sections for easier navigation
  const allQuestions = testReview.sections.flatMap((section) =>
    section.questions.map((question) => ({
      ...question,
      section: section.name,
    })),
  )

  const currentQuestionData = allQuestions[currentQuestion]

  // Navigation functions
  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setShowExplanation(false)
    }
  }

  const goToNextQuestion = () => {
    if (currentQuestion < allQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setShowExplanation(false)
    }
  }

  // Calculate progress
  const totalQuestions = allQuestions.length
  const progressPercentage = ((currentQuestion + 1) / totalQuestions) * 100

  // Determine if the current answer is correct
  const isCorrect = currentQuestionData.userAnswer === currentQuestionData.correctAnswer

  return (
    <div className="space-y-8">
      <div className="flex items-center mb-6">
        <Link href="/dashboard/history" className="inline-flex items-center text-primary font-bold">
          <ArrowLeft className="mr-2" /> Back to History
        </Link>
      </div>

      {/* Test Summary */}
      <div className="brutalist-container mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-black">{testReview.name} Review</h1>
          <div className="text-xl font-bold">
            Score: <span className="text-primary">{testReview.score}</span>/{testReview.totalScore}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {testReview.sections.map((section) => (
            <div key={section.name} className="brutalist-card p-4">
              <h3 className="text-lg font-bold mb-2">{section.name}</h3>
              <div className="text-2xl font-black mb-1">
                {section.score}/{section.maxScore}
              </div>
              <div className="text-sm mb-2">
                {section.correctAnswers} of {section.totalQuestions} questions correct
              </div>
              <div className="w-full bg-gray-200 h-4 border-2 border-black">
                <div
                  className="bg-primary h-full"
                  style={{ width: `${(section.correctAnswers / section.totalQuestions) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Question Navigation */}
      <div className="brutalist-container mb-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            Question {currentQuestion + 1} of {totalQuestions}
          </h2>
          <div className="text-lg">
            Section: <span className="font-bold">{currentQuestionData.section}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 h-4 border-2 border-black mb-4">
          <div className="bg-primary h-full" style={{ width: `${progressPercentage}%` }}></div>
        </div>

        {/* Question content */}
        <div className="mb-6">
          <div className="flex items-start gap-2 mb-4">
            <div className={`p-2 rounded-full ${isCorrect ? "bg-green-500" : "bg-red-500"} text-white`}>
              {isCorrect ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
            </div>
            <div>
              <p className="text-lg font-bold mb-2">{currentQuestionData.question}</p>
              {currentQuestionData.passage && (
                <div className="p-4 border-2 border-black bg-gray-50 mb-4">
                  <p>{currentQuestionData.passage}</p>
                </div>
              )}
            </div>
          </div>

          {currentQuestionData.type === "photo" && (
            <div className="mb-6">
              <img
                src={currentQuestionData.image || "/placeholder.svg"}
                alt="Question image"
                className="border-4 border-black max-w-full h-auto"
              />
            </div>
          )}

          <div className="space-y-3 mb-6">
            {currentQuestionData.options.map((option, index) => {
              const optionLetter = option.split(".")[0]
              const isUserAnswer = currentQuestionData.userAnswer === optionLetter
              const isCorrectAnswer = currentQuestionData.correctAnswer === optionLetter

              let bgColor = ""
              if (isUserAnswer && isCorrectAnswer) bgColor = "bg-green-100 border-green-500"
              else if (isUserAnswer && !isCorrectAnswer) bgColor = "bg-red-100 border-red-500"
              else if (isCorrectAnswer) bgColor = "bg-green-100 border-green-500"

              return (
                <div key={index} className={`p-4 border-4 ${bgColor || "border-black"}`}>
                  <div className="flex items-center">
                    <div className="mr-3 font-bold">{option}</div>
                    {isUserAnswer && !isCorrectAnswer && <X className="h-5 w-5 text-red-500 ml-auto" />}
                    {isCorrectAnswer && <Check className="h-5 w-5 text-green-500 ml-auto" />}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mb-6">
            <Button onClick={() => setShowExplanation(!showExplanation)} className="brutalist-button flex items-center">
              <HelpCircle className="mr-2 h-5 w-5" />
              {showExplanation ? "Hide Explanation" : "Show Explanation"}
            </Button>

            {showExplanation && (
              <div className="mt-4 p-4 border-4 border-black bg-yellow-50">
                <h3 className="font-bold mb-2">Explanation:</h3>
                <p>{currentQuestionData.explanation}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between">
          <Button onClick={goToPreviousQuestion} className="brutalist-button" disabled={currentQuestion === 0}>
            <ChevronLeft className="mr-2 h-5 w-5" /> Previous Question
          </Button>
          <Button
            onClick={goToNextQuestion}
            className="brutalist-button"
            disabled={currentQuestion === allQuestions.length - 1}
          >
            Next Question <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Performance Analysis */}
      <div className="brutalist-container">
        <h2 className="text-2xl font-black mb-6">Performance Analysis</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-red-500">Areas for Improvement</h3>
            <ul className="space-y-2">
              {testReview.weaknesses.map((weakness, index) => (
                <li key={index} className="flex items-start">
                  <X className="h-5 w-5 text-red-500 mr-2 mt-1 flex-shrink-0" />
                  <span>{weakness}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 text-green-500">Strengths</h3>
            <ul className="space-y-2">
              {testReview.strengths.map((strength, index) => (
                <li key={index} className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Recommendations</h3>
          <div className="brutalist-card p-4">
            <ul className="space-y-2">
              {testReview.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                    {index + 1}
                  </div>
                  <span>{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Link href="/dashboard/tests">
            <Button className="brutalist-button">Practice Another Test</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

