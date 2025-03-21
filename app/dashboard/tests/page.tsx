"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Clock, BarChart } from "lucide-react"

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
    <div className="space-y-8">
      <div className="brutalist-container">
        <h1 className="text-3xl font-black mb-4">Practice Tests</h1>
        <p className="text-lg">Choose a test to practice and improve your TOEIC score.</p>
      </div>

      {Object.entries(groupedTests).map(([difficulty, tests]) => (
        <div key={difficulty} className="space-y-4">
          <h2 className="text-2xl font-black">{difficulty} Tests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tests.map((test) => (
              <div key={test.id} className="brutalist-card p-6">
                <h3 className="text-xl font-bold mb-2">{test.name}</h3>
                <p className="mb-4">{test.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`inline-block px-3 py-1 text-sm font-bold ${getDifficultyClass(test.difficulty)}`}>
                    {test.difficulty}
                  </span>
                  <span className="inline-block bg-gray-200 px-3 py-1 text-sm font-bold flex items-center">
                    <Clock className="h-4 w-4 mr-1" /> {test.time} min
                  </span>
                  <span className="inline-block bg-gray-200 px-3 py-1 text-sm font-bold flex items-center">
                    <BarChart className="h-4 w-4 mr-1" /> {test.questions} questions
                  </span>
                </div>

                <div className="mb-4">
                  <h4 className="font-bold mb-2">Sections:</h4>
                  <div className="flex gap-2">
                    {test.sections.map((section) => (
                      <span key={section} className="inline-block border-2 border-black px-3 py-1 text-sm font-bold">
                        {section}
                      </span>
                    ))}
                  </div>
                </div>

                <Link href={`/dashboard/tests/${test.id}`}>
                  <Button className="brutalist-button w-full">Start Test</Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

