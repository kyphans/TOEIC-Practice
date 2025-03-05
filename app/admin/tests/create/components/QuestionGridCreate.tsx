"use client";

import { Button } from "@/components/ui/button";
import { Question } from "./types";

interface QuestionGridCreateProps {
  questions: Question[];
  onQuestionClick: (index: number) => void;
}

export function QuestionGridCreate({ questions, onQuestionClick }: QuestionGridCreateProps) {
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

  // Tìm index của câu hỏi trong mảng gốc
  const findQuestionIndex = (question: Question) => {
    return questions.findIndex(q => q.id === question.id);
  };

  // Tính số thứ tự liên tục từ part thấp đến cao
  let questionNumber = 1;

  return (
    <div className="brutalist-container">
      <h3 className="text-lg font-bold mb-4">Question Overview</h3>
      <div className="space-y-4">
        {sortedParts.map(part => (
          <div key={part} className="space-y-2">
            <div className="text-sm font-bold border-b-2 border-black py-1">
              Part {part}: {partTitles[part]}
            </div>
            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-1">
              {questionsByPart[part].map((question) => {
                const globalIndex = findQuestionIndex(question);
                const isValid = question.template.questions?.length > 0 || 
                              (question.template.options?.length > 0 && question.template.question);
                
                const currentNumber = questionNumber++;
                
                return (
                  <Button
                    key={question.id}
                    variant="outline"
                    size="sm"
                    onClick={() => onQuestionClick(globalIndex)}
                    className={`w-8 h-8 border-2 border-black hover:bg-black hover:text-white transition-colors text-sm p-0 font-bold shadow-brutal
                      ${isValid ? 'bg-primary text-white' : 'bg-red-100'}`}
                  >
                    {currentNumber}
                  </Button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 