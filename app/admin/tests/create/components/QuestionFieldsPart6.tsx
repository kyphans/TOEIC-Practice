import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Part6Template, Question } from './types';

interface QuestionFieldsPart6Props {
  question: Question;
  index: number;
  selectedQuestions: Question[];
  setSelectedQuestions: (questions: Question[]) => void;
}

const inputStyles = 'placeholder:text-gray-400 placeholder:italic';

export default function QuestionFieldsPart6({
  question,
  index,
  selectedQuestions,
  setSelectedQuestions
}: QuestionFieldsPart6Props) {
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

  const template = (question as Part6Template).template;
  return (
    <>
      <div className='mb-4'>
        <div className='flex items-center gap-4 mb-4'>
          <Button
            type='button'
            onClick={() => {
              const newQuestions = [...selectedQuestions];
              const typedQuestion = newQuestions[index] as Part6Template;
              typedQuestion.template.passageType = 'text';
              typedQuestion.template.passageImage = '';
              setSelectedQuestions(newQuestions);
            }}
            className={`brutalist-button ${template.passageType === 'text' ? 'bg-primary text-white' : 'bg-gray-100'}`}
          >
            Text Passage
          </Button>
          <Button
            type='button'
            onClick={() => {
              const newQuestions = [...selectedQuestions];
              const typedQuestion = newQuestions[index] as Part6Template;
              typedQuestion.template.passageType = 'image';
              typedQuestion.template.passage = '';
              setSelectedQuestions(newQuestions);
            }}
            className={`brutalist-button ${template.passageType === 'image' ? 'bg-primary text-white' : 'bg-gray-100'}`}
          >
            Image Passage
          </Button>
        </div>
        {template.passageType === 'text' ? (
          <Textarea
            value={template.passage || ''}
            onChange={(e) => updatePart6Template('passage', e.target.value)}
            className={cn('brutalist-input mb-2 min-h-[200px]', inputStyles)}
            placeholder="Enter text passage with blanks (e.g., The company's profits _____(1) by 25% last year.)"
          />
        ) : (
          <div className='flex flex-col gap-2'>
            <Input
              placeholder='Enter passage image URL'
              value={template.passageImage || ''}
              onChange={(e) => updatePart6Template('passageImage', e.target.value)}
              className={cn('brutalist-input', inputStyles)}
            />
            {template.passageImage && (
              <div className='relative aspect-video rounded-md overflow-hidden border-2 border-gray-200'>
                <img
                  src={template.passageImage}
                  alt='Passage'
                  className='object-cover w-full h-full'
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.svg';
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>
      {template.questions?.map((subQ, subIndex) => (
        <div key={subIndex} className='mt-4'>
          <div className='flex items-center gap-2 mb-2'>
            <span className='font-bold'>Blank #{subQ.number}</span>
          </div>
          {subQ.options?.map((option, optionIndex) => (
            <Input
              key={optionIndex}
              value={option}
              onChange={(e) => {
                const newQuestions = [...selectedQuestions];
                const typedQuestion = newQuestions[index] as Part6Template;
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
          const typedQuestion = newQuestions[index] as Part6Template;
          const currentQuestions = typedQuestion.template.questions;
          const nextNumber =
            currentQuestions.length > 0
              ? Math.max(...currentQuestions.map((q) => q.number)) + 1
              : 1;
          typedQuestion.template.questions.push({
            number: nextNumber,
            options: ['', '', '', '']
          });
          setSelectedQuestions(newQuestions);
        }}
        className='brutalist-button mt-2'
      >
        <Plus className='h-4 w-4 mr-2' />
        Add Blank
      </Button>
    </>
  );
} 