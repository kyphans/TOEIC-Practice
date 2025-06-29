"use client"

import useSWR from "swr"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import ExamCard from "@/components/ExamCard"
import { fetcher } from "@/lib/query"
import type { ExamsResponse } from "@/types/exams.type"

function getDifficultyClass(difficulty: string) {
  switch (difficulty) {
    case "easy":
      return "bg-green-200 text-green-800"
    case "medium":
      return "bg-yellow-200 text-yellow-800"
    case "hard":
      return "bg-red-200 text-red-800"
    default:
      return "bg-gray-200 text-gray-800"
  }
}

export default function Tests() {
  const [page, setPage] = useState(1)
  const pageSize = 6
  const { data, error, isLoading } = useSWR<any>(`/api/exams?difficulty=easy,medium,hard&group=true&pageSize=${pageSize}&index=${page}`, fetcher)

  // API trả về dạng { easy: [...], medium: [...], hard: [...] }
  const difficulties = [
    { key: 'easy', label: 'Easy' },
    { key: 'medium', label: 'Medium' },
    { key: 'hard', label: 'Hard' },
  ]

  return (
    <div className="space-y-8 p-4">
      <div className="brutalist-container">
        <h1 className="text-3xl font-black mb-4">Practice Tests</h1>
        <p className="text-lg">Choose a test to practice and improve your TOEIC score.</p>
      </div>

      {isLoading && <div>Loading...</div>}
      {error && <div className="text-red-500">Failed to load exams.</div>}

      {difficulties.map(({ key, label }) => (
        data?.[key]?.length > 0 && (
          <div key={key} className="space-y-4">
            <h2 className="text-2xl font-black">{label} Tests</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data[key].map((exam: any) => {
                // Tính tổng thời gian nếu có
                const totalTime = Array.isArray(exam.sections)
                  ? exam.sections.reduce((sum: number, s: { time: number | null }) => sum + (typeof s.time === 'number' && !isNaN(s.time) ? s.time : 0), 0)
                  : null;
                return (
                  <ExamCard
                    key={exam.id}
                    data={{
                      id: exam.id,
                      name: exam.title,
                      description: exam.description || '',
                      difficulty: exam.difficulty,
                      time: totalTime || null,
                      questions: exam.totalQuestions,
                      sections: exam.sections,
                    }}
                    getDifficultyClass={getDifficultyClass}
                  />
                );
              })}
            </div>
          </div>
        )
      ))}

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
        {/* Không thể xác định tổng số trang khi group, nên chỉ disable khi không có dữ liệu */}
        <Button
          className="brutalist-button"
          disabled={Object.values(data || {}).every((arr: any) => !arr?.length)}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

