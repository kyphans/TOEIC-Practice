"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Clock, BarChart } from "lucide-react"
import ExamCard from "@/components/ExamCard"

export default function Tests() {
  // Mock data for available tests
  const availableTests = [
    {
      id: 1,
      name: "TOEIC Test 1",
      description: "A complete TOEIC test with listening and reading sections",
      difficulty: "Medium",
      time: 120,
      sections: ["Listening", "Reading"],
      questions: 200,
    },
    {
      id: 2,
      name: "TOEIC Test 2",
      description: "Practice test focusing on business communication scenarios",
      difficulty: "Hard",
      time: 120,
      sections: ["Listening", "Reading"],
      questions: 200,
    },
    {
      id: 3,
      name: "TOEIC Listening Practice",
      description: "Focused practice for the listening section only",
      difficulty: "Medium",
      time: 45,
      sections: ["Listening"],
      questions: 100,
    },
    {
      id: 4,
      name: "TOEIC Reading Practice",
      description: "Focused practice for the reading section only",
      difficulty: "Easy",
      time: 75,
      sections: ["Reading"],
      questions: 100,
    },
    {
      id: 5,
      name: "TOEIC Quick Test",
      description: "A shorter version of the TOEIC test for quick practice",
      difficulty: "Medium",
      time: 60,
      sections: ["Listening", "Reading"],
      questions: 100,
    },
    {
      id: 6,
      name: "TOEIC Advanced Test",
      description: "Challenging test for advanced learners",
      difficulty: "Hard",
      time: 120,
      sections: ["Listening", "Reading"],
      questions: 200,
    },
  ]

  // Group tests by difficulty
  const groupedTests = {
    Easy: availableTests.filter((test) => test.difficulty === "Easy"),
    Medium: availableTests.filter((test) => test.difficulty === "Medium"),
    Hard: availableTests.filter((test) => test.difficulty === "Hard"),
  }

  // Function to get difficulty class
  const getDifficultyClass = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "difficulty-easy"
      case "Medium":
        return "difficulty-medium"
      case "Hard":
        return "difficulty-hard"
      default:
        return "difficulty-medium"
    }
  }

  return (
    <div className="space-y-8 p-4">
      <div className="brutalist-container">
        <h1 className="text-3xl font-black mb-4">Practice Tests</h1>
        <p className="text-lg">Choose a test to practice and improve your TOEIC score.</p>
      </div>

      {Object.entries(groupedTests).map(([difficulty, tests]) => (
        <div key={difficulty} className="space-y-4">
          <h2 className="text-2xl font-black">{difficulty} Tests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tests.map((test) => (
              <ExamCard key={test.id} test={test} getDifficultyClass={getDifficultyClass} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

