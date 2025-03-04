"use client";

import { Button } from "@/components/ui/button";
import { Question } from "@/app/mock-questions";
import { useAnswersStore } from "@/app/store/answers";
import { useEffect } from "react";

interface QuestionGridProps {
  questions: Question[];
  testId: string;
}

export function QuestionGrid({ questions, testId }: QuestionGridProps) {
  const { getAnswersByTestId, initAnswers } = useAnswersStore();

  useEffect(() => {
    // Khởi tạo answers từ localStorage nếu có
    initAnswers(testId);
  }, [testId, initAnswers]);

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
    <div className="w-full max-h-[calc(100vh-200px)] overflow-y-auto pr-2 space-y-4">
      {sortedParts.map(part => (
        <div key={part} className="space-y-2">
          <div className="text-sm font-bold border-b border-black sticky top-0 bg-white py-1">
            Part {part}: {partTitles[part]}
          </div>
          <div className="grid grid-cols-5 gap-1">
            {questionsByPart[part].map(question => {
              const hasAnswer = answers[question.id.toString()];
              return (
                <Button
                  key={question.id}
                  variant="outline"
                  size="sm"
                  onClick={() => navigateToQuestion(question.id)}
                  className={`w-8 h-8 border-2 border-black hover:bg-black hover:text-white transition-colors text-sm p-0 font-bold shadow-brutal
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
  );
} 