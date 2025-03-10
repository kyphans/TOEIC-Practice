"use client"

import { useUser, UserButton } from "@clerk/nextjs"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, BookOpen, History, User, Shield } from "lucide-react"
import { QuestionGrid } from "@/components/QuestionGrid"
import { getMockTest, Question as TestQuestion } from "@/app/mock-questions"
import { useAnswersStore } from "@/app/store/answers"
import { useTimerStore } from "@/app/store/timer"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoaded } = useUser()
  console.log(user)
  const router = useRouter()
  const pathname = usePathname()
  const [currentTestQuestions, setCurrentTestQuestions] = useState<TestQuestion[]>([])
  const [currentTestName, setCurrentTestName] = useState<string>("")
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

  // Handle test submission
  const handleSubmitTest = () => {
    if (!currentTestId) return;
    
    // Lấy answers từ store
    const answers = useAnswersStore.getState().getAnswersByTestId(currentTestId);
    
    // Lấy test data
    const test = getMockTest(parseInt(currentTestId));
    
    // Calculate a mock score
    const totalQuestions = test.sections.reduce((total, section) => total + section.questions.length, 0);
    const answeredQuestions = Object.keys(answers).length;
    const mockScore = Math.floor((answeredQuestions / totalQuestions) * 990);

    // Clear answers and timer
    clearAnswers();
    clearTimer(currentTestId);

    // Navigate to results page
    router.push(`/dashboard/tests/${currentTestId}/results?score=${mockScore}`);
  };

  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-bold">Loading...</div>
      </div>
    )
  }

  // Menu items for the sidebar
  const menuItems = [
    { href: "/dashboard", label: "Home", icon: Home },
    { href: "/dashboard/tests", label: "Practice Tests", icon: BookOpen },
    { href: "/dashboard/history", label: "History", icon: History },
    { href: "/dashboard/profile", label: "Profile", icon: User },
    ...(user.publicMetadata.role === "admin" ? [{ href: "/admin", label: "Admin Dashboard", icon: Shield }] : []),
  ]

  // Check if the current path matches a menu item
  const isActive = (path: string) => {
    if (path === "/dashboard" && pathname === "/dashboard") {
      return true
    }
    return pathname.startsWith(path) && path !== "/dashboard"
  }

  // Check if user is admin
  // const isAdmin = user.publicMetadata.role === "admin"
  const isAdmin = true;


  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b-8 border-black bg-primary p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/dashboard">
            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase">TOEIC Practice</h1>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-white font-bold hidden sm:inline">Welcome, {user.firstName}</span>
            <UserButton afterSignOutUrl="/login" />
          </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row flex-1">
        {/* Sidebar */}
        <aside className={`${isTestTaking ? 'w-full md:w-72' : 'w-full md:w-64'} border-r-0 md:border-r-8 border-b-8 md:border-b-0 border-black bg-white flex flex-col`}>
          <nav className="p-4 flex-none">
            <ul className="flex md:block space-x-2 md:space-x-0 space-y-0 md:space-y-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={`sidebar-menu-item flex items-center ${isActive(item.href) ? "active" : ""}`}>
                    <item.icon className="mr-0 md:mr-2 h-5 w-5" />
                    <span className="hidden md:inline">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* QuestionGrid bên dưới nav khi đang làm bài test */}
          {isTestTaking && currentTestQuestions.length > 0 && currentTestId && (
            <div className="sticky top-0 p-2 sm:p-3 border-t-4 sm:border-t-8 border-black bg-white z-50 overflow-hidden">
              <QuestionGrid 
                questions={currentTestQuestions} 
                testId={currentTestId} 
                testName={currentTestName}
                onSubmitTest={handleSubmitTest}
              />
            </div>
          )}
        </aside>

        {/* Main content */}
        <main className="flex-1 p-3 sm:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

