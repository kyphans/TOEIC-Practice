"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, TrendingUp, Eye } from "lucide-react"

export default function TestHistory() {
  // Mock test history data
  const testHistory = [
    {
      id: 1,
      name: "TOEIC Test 1",
      date: "2023-05-15",
      score: 750,
      totalScore: 990,
      time: "01:45:30",
    },
    {
      id: 2,
      name: "TOEIC Test 2",
      date: "2023-05-10",
      score: 720,
      totalScore: 990,
      time: "01:52:15",
    },
    {
      id: 3,
      name: "TOEIC Listening Practice",
      date: "2023-05-05",
      score: 420,
      totalScore: 495,
      time: "00:42:10",
    },
    {
      id: 4,
      name: "TOEIC Reading Practice",
      date: "2023-04-28",
      score: 380,
      totalScore: 495,
      time: "01:10:45",
    },
    {
      id: 5,
      name: "TOEIC Quick Test",
      date: "2023-04-20",
      score: 480,
      totalScore: 600,
      time: "00:55:30",
    },
    {
      id: 6,
      name: "TOEIC Test 3",
      date: "2023-04-15",
      score: 680,
      totalScore: 990,
      time: "01:48:20",
    },
  ]

  // Calculate average score
  const totalScorePercentages = testHistory.map((test) => (test.score / test.totalScore) * 100)
  const averageScorePercentage =
    totalScorePercentages.reduce((sum, score) => sum + score, 0) / totalScorePercentages.length

  return (
    <div className="space-y-8 p-6">
      <div className="brutalist-container">
        <h1 className="text-3xl font-black mb-4">Test History</h1>
        <p className="text-lg">Review your past test attempts and track your progress over time.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: "Tests Taken",
            value: testHistory.length.toString(),
            icon: Calendar,
            color: "bg-primary",
          },
          {
            title: "Average Score",
            value: `${Math.round(averageScorePercentage)}%`,
            icon: TrendingUp,
            color: "bg-primary",
          },
          {
            title: "Last Test",
            value: testHistory[0].date,
            icon: Clock,
            color: "bg-primary",
          },
        ].map((stat, index) => (
          <div key={index} className="brutalist-card p-6">
            <div className="flex items-center mb-4">
              <div className={`${stat.color} text-white p-3 rounded-md mr-4`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold">{stat.title}</h2>
            </div>
            <p className="text-3xl font-black">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Test History Table */}
      <div className="brutalist-container">
        <h2 className="text-2xl font-black mb-4">Your Test History</h2>

        <div className="overflow-x-auto">
          <table className="w-full border-4 border-black">
            <thead>
              <tr className="bg-primary">
                <th className="border-4 border-black p-3 text-left text-white text-white">Test Name</th>
                <th className="border-4 border-black p-3 text-left text-white text-white">Date</th>
                <th className="border-4 border-black p-3 text-left text-white text-white">Score</th>
                <th className="border-4 border-black p-3 text-left text-white text-white">Time Taken</th>
                <th className="border-4 border-black p-3 text-left text-white text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {testHistory.map((test) => (
                <tr key={test.id} className="border-b-4 border-black">
                  <td className="border-4 border-black p-3 font-bold">{test.name}</td>
                  <td className="border-4 border-black p-3">{test.date}</td>
                  <td className="border-4 border-black p-3">
                    <div className="flex items-center">
                      <span className="font-bold">{test.score}</span>/{test.totalScore}
                      <span className="ml-2 text-sm">({Math.round((test.score / test.totalScore) * 100)}%)</span>
                    </div>
                  </td>
                  <td className="border-4 border-black p-3">{test.time}</td>
                  <td className="border-4 border-black p-3">
                    <div className="flex gap-2 justify-center">
                      <Link href={`/dashboard/tests/${test.id}/results?score=${test.score}`}>
                        <Button className="brutalist-button">
                          <Eye className="mr-2 h-4 w-4" /> View
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Progress Chart */}
      <div className="brutalist-container">
        <h2 className="text-2xl font-black mb-4">Your Progress</h2>
        <div className="h-64 border-4 border-black p-4">
          <div className="h-full flex items-end">
            {testHistory
              .slice()
              .reverse()
              .map((test, index) => {
                const percentage = (test.score / test.totalScore) * 100
                return (
                  <div key={test.id} className="flex-1 flex flex-col items-center justify-end h-full">
                    <div className="w-4/5 bg-primary" style={{ height: `${percentage}%` }}></div>
                    <div className="mt-2 text-xs font-bold transform -rotate-45 origin-top-left">{test.date}</div>
                  </div>
                )
              })}
          </div>
        </div>
      </div>
    </div>
  )
}

