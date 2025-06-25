"use client"

import { useUser, UserButton } from "@clerk/nextjs"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { Home, BookOpen, History, User, Shield } from "lucide-react"
import { QuestionGrid } from "@/components/QuestionGrid"
import { getMockTest, Question as TestQuestion } from "@/app/mock-questions-real"
import { useAnswersStore } from "@/app/store/answers"
import { useTimerStore } from "@/app/store/timer"
import { checkAnswers } from "@/lib/testHelper"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SubmitTestDialog } from "@/components/SubmitTestDialog";

export default function TestsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const pathname = usePathname()
  const [currentTestQuestions, setCurrentTestQuestions] = useState<TestQuestion[]>([])
  const [currentTestName, setCurrentTestName] = useState<string>("")
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const { clearAnswers } = useAnswersStore()
  const { clearTimer } = useTimerStore()

  // Tính toán các giá trị từ pathname một lần duy nhất khi pathname thay đổi
  const { isTestTaking, testMatch, currentTestId } = useMemo(() => {
    const isTestTaking = pathname.includes('/tests/') && pathname.includes('/take')
    const testMatch = pathname.match(/\/dashboard\/tests\/(\d+)\/take/)
    const currentTestId = testMatch ? testMatch[1] : null
    return { isTestTaking, testMatch, currentTestId }
  }, [pathname])

  useEffect(() => {
    if (testMatch && currentTestId) {
      const mockTest = getMockTest(parseInt(currentTestId))
      const allQuestions = mockTest.sections.flatMap(section => section.questions)
      setCurrentTestQuestions(allQuestions)
      setCurrentTestName(mockTest.name)
    } else {
      setCurrentTestQuestions([])
      setCurrentTestName("")
    }
  }, [currentTestId, testMatch])

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/login")
    }
  }, [user, isLoaded, router])

  // Lấy answers từ store để show trong modal
  const getAnswersByTestId = useAnswersStore(state => state.getAnswersByTestId);
  const answers = currentTestId ? getAnswersByTestId(currentTestId) : {};

  // Phân loại câu hỏi đã trả lời/chưa trả lời
  const answeredQuestions = currentTestQuestions.filter(q => answers[q.id?.toString?.()]);
  const unansweredQuestions = currentTestQuestions.filter(q => !answers[q.id?.toString?.()]);

  // Handle test submission
  const handleSubmitTest = () => {
    if (!currentTestId) return;
    const { correctCount, score } = checkAnswers(currentTestId, answers);
    clearAnswers();
    clearTimer(currentTestId);
    router.push(`/dashboard/tests/${currentTestId}/results?score=${score}&correct=${correctCount}`);
  };

  // Hàm mở modal khi nhấn Submit Test
  const handleOpenSubmitModal = () => setShowSubmitModal(true);
  // Hàm đóng modal
  const handleCloseSubmitModal = () => setShowSubmitModal(false);
  // Hàm xác nhận submit
  const handleConfirmSubmit = () => {
    setShowSubmitModal(false);
    handleSubmitTest();
  };

  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-bold">Loading...</div>
      </div>
    )
  }

  return (
    <div className='flex flex-col'>
      <SubmitTestDialog
        open={showSubmitModal}
        onOpenChange={setShowSubmitModal}
        answeredQuestions={answeredQuestions}
        unansweredQuestions={unansweredQuestions}
        onConfirm={handleConfirmSubmit}
        onCancel={handleCloseSubmitModal}
      />
      <div className='flex flex-col md:flex-row flex-1'>
        {/* Main content and QuestionGrid side by side */}
        <div className='flex flex-1 flex-row min-h-0'>
          {/* Main content (children) */}
          <div className='flex-1 overflow-y-auto min-w-0 max-h-[calc(100vh-76px)]'>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
} 