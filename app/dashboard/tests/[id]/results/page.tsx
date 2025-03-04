"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Share2 } from "lucide-react"

export default function TestResults({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams()
  const testId = params.id
  const score = searchParams.get("score") || "0"

  // Mock test results data
  const results = {
    testName: `TOEIC Test ${testId}`,
    score: Number.parseInt(score),
    maxScore: 990,
    date: new Date().toISOString().split("T")[0],
    sections: [
      {
        name: "Listening",
        score: Math.floor(Number.parseInt(score) * 0.45),
        maxScore: 495,
        parts: [
          { name: "Part 1: Photographs", correct: 7, total: 10 },
          { name: "Part 2: Question-Response", correct: 22, total: 30 },
          { name: "Part 3: Conversations", correct: 20, total: 30 },
          { name: "Part 4: Talks", correct: 18, total: 30 },
        ],
      },
      {
        name: "Reading",
        score: Math.floor(Number.parseInt(score) * 0.55),
        maxScore: 495,
        parts: [
          { name: "Part 5: Incomplete Sentences", correct: 30, total: 40 },
          { name: "Part 6: Text Completion", correct: 8, total: 12 },
          { name: "Part 7: Reading Comprehension", correct: 32, total: 48 },
        ],
      },
    ],
  }

  // Calculate percentage score
  const percentageScore = Math.round((Number.parseInt(score) / results.maxScore) * 100)

  // Determine score level
  let scoreLevel = ""
  if (percentageScore >= 90) {
    scoreLevel = "Excellent"
  } else if (percentageScore >= 80) {
    scoreLevel = "Very Good"
  } else if (percentageScore >= 70) {
    scoreLevel = "Good"
  } else if (percentageScore >= 60) {
    scoreLevel = "Fair"
  } else {
    scoreLevel = "Needs Improvement"
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center mb-6">
        <Link href="/dashboard" className="inline-flex items-center text-primary font-bold">
          <ArrowLeft className="mr-2" /> Back to Dashboard
        </Link>
      </div>

      <div className="brutalist-container">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black">{results.testName} Results</h1>
          <div className="flex gap-4">
            <Button className="brutalist-button">
              <Download className="mr-2 h-4 w-4" /> Download
            </Button>
            <Button className="brutalist-button">
              <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
          </div>
        </div>

        {/* Overall Score */}
        <div className="brutalist-card p-8 mb-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Your Total Score</h2>
          <div className="text-6xl font-black mb-2 text-primary">{score}</div>
          <div className="text-xl mb-4">out of {results.maxScore}</div>
          <div className="inline-block bg-primary px-6 py-2 text-xl font-bold">{scoreLevel}</div>
        </div>

        {/* Score by Section */}
        <h2 className="text-2xl font-black mb-4">Score by Section</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {results.sections.map((section) => (
            <div key={section.name} className="brutalist-card p-6">
              <h3 className="text-xl font-bold mb-4">{section.name} Section</h3>
              <div className="text-4xl font-black mb-2 text-primary">{section.score}</div>
              <div className="text-lg mb-6">out of {section.maxScore}</div>

              <h4 className="font-bold mb-2">Performance by Part:</h4>
              {section.parts.map((part) => (
                <div key={part.name} className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span>{part.name}</span>
                    <span className="font-bold">
                      {part.correct}/{part.total}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 h-4 border-2 border-black">
                    <div className="bg-primary h-full" style={{ width: `${(part.correct / part.total) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href={`/dashboard/tests/${testId}/review`}>
            <Button className="brutalist-button w-full">Review Test Answers</Button>
          </Link>
          <Link href="/dashboard/tests">
            <Button className="brutalist-button w-full">Take Another Test</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

