"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash } from "lucide-react"
import Link from "next/link"

interface Test {
  id: number
  name: string
  sections: {
    name: string
    questions: any[]
  }[]
}

export default function TestManagement() {
  const [tests, setTests] = useState<Test[]>([])

  useEffect(() => {
    fetchTests()
  }, [])

  const fetchTests = async () => {
    try {
      const response = await fetch("/api/tests")
      const data = await response.json()
      setTests(data.tests)
    } catch (error) {
      console.error("Error fetching tests:", error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this test?")) return

    try {
      await fetch(`/api/tests/${id}`, {
        method: "DELETE",
      })
      fetchTests() // Refresh list
    } catch (error) {
      console.error("Error deleting test:", error)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-black">Test Management</h1>
        <Link href="/admin/tests/create">
          <Button className="brutalist-button">
            <Plus className="mr-2 h-4 w-4" /> Create New Test
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {tests?.map((test) => (
          <div
            key={test.id}
            className="brutalist-container p-4 flex justify-between items-center"
          >
            <div>
              <h2 className="text-xl font-bold">{test.name}</h2>
              <p className="text-gray-600">
                {test.sections.reduce(
                  (total, section) => total + section.questions.length,
                  0
                )}{" "}
                questions
              </p>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/tests/${test.id}/edit`}>
                <Button className="brutalist-button">
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Button>
              </Link>
              <Button
                onClick={() => handleDelete(test.id)}
                className="brutalist-button bg-red-500 text-white"
              >
                <Trash className="mr-2 h-4 w-4" /> Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 