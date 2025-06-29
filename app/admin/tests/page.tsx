"use client"

import useSWR from "swr"
import { useState, useCallback } from "react"
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
  const pageSize = 10
  const [deletingId, setDeletingId] = useState<number | string | null>(null)
  const { data, error, isLoading, mutate } = useSWR<ExamsResponse>(`/api/exams?index=${page}&pageSize=${pageSize}`, fetcher)

  // Hàm xóa exam
  const handleDelete = useCallback(async (id: number | string) => {
    if (!window.confirm("Are you sure you want to delete this exam? This action cannot be undone.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/exams/${id}`, { method: 'DELETE' });
      if (res.status === 204) {
        mutate(); // reload danh sách
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete exam.');
      }
    } catch (err) {
      alert('Failed to delete exam.');
    } finally {
      setDeletingId(null);
    }
  }, [mutate]);

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
        {data?.exams?.map((exam) => {
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
                time: typeof totalTime === 'number' && !isNaN(totalTime) ? totalTime : '',
                questions: exam.totalQuestions,
                sections: exam.sections,
              }}
              getDifficultyClass={getDifficultyClass}
              onDelete={handleDelete}
              deletingId={deletingId}
            />
          );
        })}
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