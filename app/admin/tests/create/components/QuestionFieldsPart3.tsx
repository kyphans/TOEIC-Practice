import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Part3Template, Question } from './types';

interface QuestionFieldsPart3Props {
  question: Question;
  index: number;
  selectedQuestions: Question[];
  setSelectedQuestions: (questions: Question[]) => void;
}

const inputStyles = 'placeholder:text-gray-400 placeholder:italic';

export default function QuestionFieldsPart3({
  question,
  index,
  selectedQuestions,
  setSelectedQuestions
}: QuestionFieldsPart3Props) {
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

  const template = (question as Part3Template).template;
  return (
    <>
      <Textarea
        value={template.conversation}
        onChange={(e) => updatePart3Template('conversation', e.target.value)}
        className={cn('brutalist-input mb-2 min-h-[200px]', inputStyles)}
        placeholder='Enter the conversation transcript here...'
      />
      {template.questions?.map((subQ, subIndex) => (
        <div key={subIndex} className='mt-4'>
          <Textarea
            value={subQ.question}
            onChange={(e) => {
              const newQuestions = [...selectedQuestions];
              const typedQuestion = newQuestions[index] as Part3Template;
              typedQuestion.template.questions[subIndex].question = e.target.value;
              setSelectedQuestions(newQuestions);
            }}
            className={cn('brutalist-input mb-2 min-h-[100px]', inputStyles)}
            placeholder={`Question ${subIndex + 1} - Enter your question here`}
          />
          {subQ.options?.map((option, optionIndex) => (
            <Input
              key={optionIndex}
              value={option}
              onChange={(e) => {
                const newQuestions = [...selectedQuestions];
                const typedQuestion = newQuestions[index] as Part3Template;
                typedQuestion.template.questions[subIndex].options[optionIndex] = e.target.value;
                setSelectedQuestions(newQuestions);
              }}
              className={cn('brutalist-input mb-2', inputStyles)}
              placeholder={`Option ${optionIndex + 1} - Enter your option here`}
            />
          ))}
        </div>
      ))}
      <Button
        onClick={() => {
          const newQuestions = [...selectedQuestions];
          const typedQuestion = newQuestions[index] as Part3Template;
          typedQuestion.template.questions.push({
            question: '',
            options: ['', '', '', '']
          });
          setSelectedQuestions(newQuestions);
        }}
        className='brutalist-button mt-2'>
        <Plus className='h-4 w-4 mr-2' />
        Add Question
      </Button>
    </>
  );
} 