"use client"

import { useUser } from "@clerk/nextjs"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, TrendingUp, Clock } from "lucide-react"

export default function Dashboard() {
  const { user } = useUser()

  // Mock data for dashboard
  const recentTests = [
    { id: 1, name: "TOEIC Test 1", date: "2023-05-15", score: 750, totalScore: 990, difficulty: "Medium" },
    { id: 2, name: "TOEIC Test 2", date: "2023-05-10", score: 720, totalScore: 990, difficulty: "Hard" },
    { id: 3, name: "TOEIC Test 3", date: "2023-05-05", score: 680, totalScore: 990, difficulty: "Easy" },
  ]

  const recommendedTests = [
    { id: 4, name: "TOEIC Test 4", difficulty: "Medium", time: 120 },
    { id: 5, name: "TOEIC Test 5", difficulty: "Hard", time: 120 },
    { id: 6, name: "TOEIC Test 6", difficulty: "Easy", time: 120 },
  ]

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
    <div className='space-y-8'>
      <div className='brutalist-container'>
        <h1 className='text-3xl font-black mb-4'>
          Welcome back, {user?.firstName}!
        </h1>
        <p className='text-lg'>Continue your TOEIC practice journey.</p>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {[
          {
            title: 'Tests Completed',
            value: '12',
            icon: BookOpen,
            color: 'bg-primary'
          },
          {
            title: 'Average Score',
            value: '720',
            icon: TrendingUp,
            color: 'bg-primary'
          },
          {
            title: 'Study Time',
            value: '24h',
            icon: Clock,
            color: 'bg-primary'
          }
        ].map((stat, index) => (
          <div key={index} className='brutalist-card p-6'>
            <div className='flex items-center mb-4'>
              <div className={`${stat.color} text-white p-3 rounded-md mr-4`}>
                <stat.icon className='h-6 w-6' />
              </div>
              <h2 className='text-xl font-bold'>{stat.title}</h2>
            </div>
            <p className='text-3xl font-black'>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Tests */}
      <div className='brutalist-container'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-2xl font-black'>Recent Tests</h2>
          <Link href='/dashboard/history'>
            <Button className='brutalist-button'>View All</Button>
          </Link>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full border-4 border-black'>
            <thead>
              <tr className='bg-primary'>
                <th className='border-4 border-black p-3 text-left text-white'>
                  Test Name
                </th>
                <th className='border-4 border-black p-3 text-left text-white'>Date</th>
                <th className='border-4 border-black p-3 text-left text-white'>
                  Difficulty
                </th>
                <th className='border-4 border-black p-3 text-left text-white'>Score</th>
                <th className='border-4 border-black p-3 text-left text-white'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentTests.map((test) => (
                <tr key={test.id} className='border-b-4 border-black'>
                  <td className='border-4 border-black p-3 font-bold'>
                    {test.name}
                  </td>
                  <td className='border-4 border-black p-3'>{test.date}</td>
                  <td className='border-4 border-black p-3'>
                    <span
                      className={`inline-block px-3 py-1 text-sm font-bold ${getDifficultyClass(
                        test.difficulty
                      )}`}>
                      {test.difficulty}
                    </span>
                  </td>
                  <td className='border-4 border-black p-3'>
                    <span className='font-bold'>{test.score}</span>/
                    {test.totalScore}
                  </td>
                  <td className='border-4 border-black p-3 text-center'>
                    <Link href={`/dashboard/tests/${test.id}/review`}>
                      <Button className='brutalist-button'>Review</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommended Tests */}
      <div className='brutalist-container'>
        <h2 className='text-2xl font-black mb-4'>Recommended Tests</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {recommendedTests.map((test) => (
            <div key={test.id} className='brutalist-card p-6'>
              <h3 className='text-xl font-bold mb-2'>{test.name}</h3>
              <div className='mb-4'>
                <span
                  className={`inline-block px-3 py-1 text-sm font-bold mr-2 ${getDifficultyClass(
                    test.difficulty
                  )}`}>
                  {test.difficulty}
                </span>
                <span className='inline-block bg-gray-200 px-3 py-1 text-sm font-bold'>
                  {test.time} min
                </span>
              </div>
              <Link href={`/dashboard/tests/${test.id}`}>
                <Button className='brutalist-button w-full'>Start Test</Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

