"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, BarChart, BookOpen } from "lucide-react"

export default function TestDetails({ params }: { params: { id: string } }) {
  const router = useRouter()
  const testId = params.id
  const [isStarting, setIsStarting] = useState(false)

  // Mock test data - in a real app, you would fetch this from an API
  const test = {
    id: Number.parseInt(testId),
    name: `TOEIC Test ${testId}`,
    description: "This test simulates the real TOEIC exam with listening and reading sections.",
    instructions:
      "The test consists of two sections: Listening and Reading. You will have 2 hours to complete the test. Make sure you have headphones for the listening section.",
    difficulty: "Medium",
    time: 120,
    sections: [
      {
        name: "Listening",
        time: 45,
        parts: [
          { name: "Part 1: Photographs", questions: 10 },
          { name: "Part 2: Question-Response", questions: 30 },
          { name: "Part 3: Conversations", questions: 30 },
          { name: "Part 4: Talks", questions: 30 },
        ],
      },
      {
        name: "Reading",
        time: 75,
        parts: [
          { name: "Part 5: Incomplete Sentences", questions: 40 },
          { name: "Part 6: Text Completion", questions: 12 },
          { name: "Part 7: Reading Comprehension", questions: 48 },
        ],
      },
    ],
    totalQuestions: 200,
  }

  const handleStartTest = () => {
    setIsStarting(true)
    // In a real app, you would prepare the test data here
    setTimeout(() => {
      router.push(`/dashboard/tests/${testId}/take`)
    }, 1000)
  }

  return (
    <div className="space-y-8 p-4">
      <div className="flex items-center mb-6">
        <Link href="/dashboard/tests" className="inline-flex items-center text-primary font-bold">
          <ArrowLeft className="mr-2" /> Back to Tests
        </Link>
      </div>

      <div className="brutalist-container">
        <h1 className="text-3xl font-black mb-4">{test.name}</h1>
        <p className="text-lg mb-6">{test.description}</p>

        <div className="flex flex-wrap gap-4 mb-6">
          <div className="brutalist-card p-4 flex items-center">
            <Clock className="h-6 w-6 mr-2 text-primary" />
            <div>
              <div className="text-sm font-bold">Time</div>
              <div className="text-xl font-black">{test.time} min</div>
            </div>
          </div>

          <div className="brutalist-card p-4 flex items-center">
            <BarChart className="h-6 w-6 mr-2 text-primary" />
            <div>
              <div className="text-sm font-bold">Questions</div>
              <div className="text-xl font-black">{test.totalQuestions}</div>
            </div>
          </div>

          <div className="brutalist-card p-4 flex items-center">
            <BookOpen className="h-6 w-6 mr-2 text-primary" />
            <div>
              <div className="text-sm font-bold">Difficulty</div>
              <div className="text-xl font-black">{test.difficulty}</div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-black mb-4">Instructions</h2>
          <div className="brutalist-card p-4">
            <p>{test.instructions}</p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-black mb-4">Test Structure</h2>
          {test.sections.map((section) => (
            <div key={section.name} className="brutalist-card p-4 mb-4">
              <h3 className="text-xl font-bold mb-2">
                {section.name} Section ({section.time} minutes)
              </h3>
              <ul className="space-y-2">
                {section.parts.map((part) => (
                  <li key={part.name} className="flex justify-between border-b-2 border-black pb-2">
                    <span>{part.name}</span>
                    <span className="font-bold">{part.questions} questions</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Button onClick={handleStartTest} className="brutalist-button w-full py-4 text-xl" disabled={isStarting}>
          {isStarting ? "Preparing Test..." : "Start Test Now"}
        </Button>
      </div>
    </div>
  )
}

