"use client";

import { Button } from "@/components/ui/button";
import { Question } from "./types";
import { Card } from "@/components/ui/card";

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


  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg">Question Grid</h3>
        <span className="text-sm font-medium bg-secondary px-2 py-1 rounded">
          Total: {questions.length}
        </span>
      </div>
      {sortedParts.map(part => (
        <div key={part} className="space-y-1.5">
          <div className="text-sm font-bold py-1 px-2 rounded bg-primary/10">
            Part {part}: {partTitles[part]}
          </div>
          <div className="inline-grid grid-cols-5 gap-2">
            {questionsByPart[part].map((question, idx) => {
              const questionIndex = questions.findIndex(q => q.id === question.id);
              return (
                <Button
                  key={question.id}
                  variant="outline"
                  size="sm"
                  onClick={() => onQuestionClick(questionIndex)}
                  className="w-7 h-7 p-0 rounded border-2 border-black font-bold text-sm
                    bg-primary text-white
                    transition-colors shadow-brutal"
                >
                  {questionIndex + 1}
                </Button>
              );
            })}
          </div>
        </div>
      ))}
    </Card>
  );
} 