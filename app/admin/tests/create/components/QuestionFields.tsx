'use client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
  Question,
  Part1Template,
  Part2Template,
  Part3Template,
  Part4Template,
  Part5Template,
  Part6Template,
  Part7Template
} from './types';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import QuestionFieldsPart1 from './QuestionFieldsPart1';
import QuestionFieldsPart3 from './QuestionFieldsPart3';
import QuestionFieldsPart6 from './QuestionFieldsPart6';

interface QuestionFieldsProps {
  question: Question;
  index: number;
  selectedQuestions: Question[];
  setSelectedQuestions: (questions: Question[]) => void;
}

const inputStyles = 'placeholder:text-gray-400 placeholder:italic';

export const QuestionFields = ({
  question,
  index,
  selectedQuestions,
  setSelectedQuestions
}: QuestionFieldsProps) => {
  const updateQuestion = <T extends Question>(
    newValue: string,
    field: keyof T['template']
  ) => {
    const newQuestions = [...selectedQuestions];
    const typedQuestion = newQuestions[index] as T;
    (typedQuestion.template as any)[field] = newValue;
    setSelectedQuestions(newQuestions);
  };

  const updatePart1Template = (
    field: keyof Part1Template['template'],
    value: string
  ) => {
    const newQuestions = [...selectedQuestions];
    const typedQuestion = newQuestions[index] as Part1Template;
    if (field === 'options') {
      typedQuestion.template[field] = [value];
    } else {
      typedQuestion.template[field] = value;
    }
    setSelectedQuestions(newQuestions);
  };

  const updatePart3Template = (
    field: keyof Part3Template['template'],
    value: string
  ) => {
    const newQuestions = [...selectedQuestions];
    const typedQuestion = newQuestions[index] as Part3Template;
    if (field === 'questions') {
      typedQuestion.template[field] = [{ question: value, options: [] }];
    } else {
      typedQuestion.template[field] = value;
    }
    setSelectedQuestions(newQuestions);
  };

  const updatePart7Template = (
    field: keyof Part7Template['template'],
    value: string
  ) => {
    const newQuestions = [...selectedQuestions];
    const typedQuestion = newQuestions[index] as Part7Template;
    if (field === 'questions') {
      typedQuestion.template[field] = [{ question: value, options: [] }];
    } else {
      typedQuestion.template[field] = value;
    }
    setSelectedQuestions(newQuestions);
  };

  const updatePart6Template = (
    field: keyof Part6Template['template'],
    value: string
  ) => {
    const newQuestions = [...selectedQuestions];
    const typedQuestion = newQuestions[index] as Part6Template;
    if (field === 'passageType') {
      typedQuestion.template[field] = value as 'text' | 'image';
    } else if (field === 'questions') {
      typedQuestion.template[field] = [{ number: 1, options: [] }];
    } else {
      typedQuestion.template[field] = value;
    }
    setSelectedQuestions(newQuestions);
  };

  switch (question.type) {
    case 'Part1': {
      return (
        <QuestionFieldsPart1
          question={question}
          index={index}
          selectedQuestions={selectedQuestions}
          setSelectedQuestions={setSelectedQuestions}
        />
      );
    }
    case 'Part3': {
      return (
        <QuestionFieldsPart3
          question={question}
          index={index}
          selectedQuestions={selectedQuestions}
          setSelectedQuestions={setSelectedQuestions}
        />
      );
    }
    case 'Part4': {
      return (
        <QuestionFieldsPart3
          question={question}
          index={index}
          selectedQuestions={selectedQuestions}
          setSelectedQuestions={setSelectedQuestions}
        />
      );
    }
    case 'Part6': {
      return (
        <QuestionFieldsPart6
          question={question}
          index={index}
          selectedQuestions={selectedQuestions}
          setSelectedQuestions={setSelectedQuestions}
        />
      );
    }
    default: {
      const template = question.template as {
        question: string;
        options: string[];
      };
      return (
        <>
          <Textarea
            value={template.question}
            onChange={(e) => {
              const newQuestions = [...selectedQuestions];
              const typedTemplate = newQuestions[index].template as {
                question: string;
              };
              typedTemplate.question = e.target.value;
              setSelectedQuestions(newQuestions);
            }}
            className={cn('brutalist-input mb-2 min-h-[100px]', inputStyles)}
            placeholder='Enter your question here'
          />
          {template.options?.map((option, optionIndex) => (
            <Input
              key={optionIndex}
              value={option}
              onChange={(e) => {
                const newQuestions = [...selectedQuestions];
                const typedTemplate = newQuestions[index].template as {
                  options: string[];
                };
                typedTemplate.options[optionIndex] = e.target.value;
                setSelectedQuestions(newQuestions);
              }}
              className={cn('brutalist-input mb-2', inputStyles)}
              placeholder={`Option ${optionIndex + 1} - Enter your option here`}
            />
          ))}
        </>
      );
    }
  }
};
