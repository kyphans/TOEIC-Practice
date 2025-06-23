"use client";

import { Button } from "@/components/ui/button";
import { Question } from "@/app/mock-questions-real";
import { useAnswersStore } from "@/app/store/answers";
import { useTimerStore } from "@/app/store/timer";
import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

interface QuestionGridProps {
  questions: Question[];
  testId: string;
  testName?: string;
  onSubmitTest?: () => void;
}

export function QuestionGrid({ questions, testId, testName, onSubmitTest }: QuestionGridProps) {
  const { getAnswersByTestId, initAnswers } = useAnswersStore();
  const { timeLeft, decrementTime } = useTimerStore();

  useEffect(() => {
    // Khởi tạo answers từ localStorage nếu có
    initAnswers(testId);
  }, [testId, initAnswers]);

  // Format time as hours, minutes, seconds with abbreviations
  const formatTime = (seconds: number) => {
    if (seconds <= 0) return "0s";
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    let timeString = "";
    
    if (hours > 0) {
      timeString += `${hours}h`;
    }
    
    if (minutes > 0) {
      if (timeString.length > 0) timeString += " ";
      timeString += `${minutes}m`;
    }
    
    if (remainingSeconds > 0 || (hours === 0 && minutes === 0)) {
      if (timeString.length > 0) timeString += " ";
      timeString += `${remainingSeconds}s`;
    }
    
    return timeString;
  };

  // Handle timer
  useEffect(() => {
    if (!onSubmitTest) return; // Chỉ chạy timer nếu có onSubmitTest

    const timer = setInterval(() => {
      if (timeLeft[testId] <= 1) {
        clearInterval(timer);
        onSubmitTest();
      } else {
        decrementTime(testId);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [testId, timeLeft, decrementTime, onSubmitTest]);

  const answers = getAnswersByTestId(testId);

  const navigateToQuestion = (questionId: number) => {
    // Thay đổi hash URL mà không reload trang
    window.location.hash = `question${questionId}`;
  };

  // Nhóm câu hỏi theo part
  const questionsByPart = questions.reduce((acc, question) => {
    const part = question.part;
    if (!acc[part]) {
      acc[part] = [];
    }
    acc[part].push(question);
    return acc;
  }, {} as Record<number, Question[]>);

  // Tạo mảng các part được sắp xếp
  const sortedParts = Object.keys(questionsByPart)
    .map(Number)
    .sort((a, b) => a - b);

  // Mapping tên các part
  const partTitles: Record<number, string> = {
    1: "Photographs",
    2: "Question-Response",
    3: "Conversations",
    4: "Short Talks",
    5: "Incomplete Sentences",
    6: "Text Completion",
    7: "Reading Comprehension"
  };

  return (
    <div className="w-full space-y-2">
      {/* Test header - chỉ hiển thị khi có testName và onSubmitTest */}
      {testName && onSubmitTest && (
        <header className='bg-primary p-3 text-white sticky top-0 z-10'>
          <div className='w-full'>
            <h1 className='text-lg sm:text-xl font-black truncate w-full'>
              {testName}
            </h1>
            <div className='w-full'>
              <div className='brutalist-card bg-white text-black p-1 sm:p-2 flex items-center text-sm sm:text-base w-full sm:w-auto'>
                <AlertCircle className='mr-1 h-4 w-4 sm:h-5 sm:w-5 text-primary' />
                <span className='font-bold'>
                  Time: {formatTime(timeLeft[testId] || 0)}
                </span>
              </div>
            </div>
          </div>
        </header>
      )}

      <div className={`${testName && onSubmitTest ? 'max-h-[calc(100vh-200px)]' : 'max-h-[calc(100vh-200px)]'} overflow-y-auto pr-2 space-y-2`}>
        {sortedParts.map(part => (
          <div key={part} className="space-y-1">
            <div className={`text-xs sm:text-sm font-bold border-b border-black ${testName && onSubmitTest ? 'top-[120px] sm:top-14' : 'top-0'} bg-white py-1`}>
              Part {part}: {partTitles[part]}
            </div>
            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-1">
              {questionsByPart[part].map(question => {
                const hasAnswer = answers[question.id.toString()];
                return (
                  <Button
                    key={question.id}
                    variant="outline"
                    size="sm"
                    onClick={() => navigateToQuestion(question.id)}
                    className={`w-6 h-6 sm:w-7 sm:h-7 border border-black hover:bg-black hover:text-white transition-colors text-xs p-0 font-bold shadow-brutal
                      ${hasAnswer ? 'bg-primary text-white' : ''}`}
                  >
                    {question.id}
                  </Button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center pt-4">
        <Button
          onClick={onSubmitTest}
          className='brutalist-button bg-white text-primary text-sm sm:text-base py-1 px-2 sm:py-2 sm:px-3 h-auto w-full sm:w-auto'>
          Submit Test
        </Button>
      </div>
    </div>
  );
} 