"use client"

import useSWR from "swr"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import ExamCard from "@/components/ExamCard"
import type { ExamsResponse, Exam } from "@/types/exams.type"
import { fetcher } from "@/lib/query"

function getDifficultyClass(difficulty: string) {
  switch (difficulty) {
    case "easy":
      return "bg-green-200 text-green-800";
    case "medium":
      return "bg-yellow-200 text-yellow-800";
    case "hard":
      return "bg-red-200 text-red-800";
    default:
      return "bg-gray-200 text-gray-800";
  }
}

export default function TestManagement() {
  const [page, setPage] = useState(1)
  const pageSize = 12
  const { data, error, isLoading } = useSWR<ExamsResponse>(`/api/exams?index=${page}&pageSize=${pageSize}`, fetcher)

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-black">Exam Management</h1>
        <Link href="/admin/tests/create">
          <Button className="brutalist-button">
            <Plus className="mr-2 h-4 w-4" /> Create New Exam
          </Button>
        </Link>
      </div>

      {isLoading && <div>Loading...</div>}
      {error && <div className="text-red-500">Failed to load exams.</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.exams.map((exam) => (
          <ExamCard
            key={exam.id}
            test={{
              id: exam.id,
              name: exam.title,
              description: exam.description || '',
              difficulty: exam.strategy || 'manual',
              time: 45, // Placeholder, update if you have time info
              questions: exam.totalQuestions,
              sections: [], // Placeholder, update if you have section info
            }}
            getDifficultyClass={getDifficultyClass}
          />
        ))}
      </div>

      {/* Pagination controls */}
      <div className="flex justify-center mt-8 gap-2">
        <Button
          className="brutalist-button"
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Previous
        </Button>
        <span className="px-4 py-2">Page {page}</span>
        <Button
          className="brutalist-button"
          disabled={data && page * pageSize >= data.total}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  )
} 