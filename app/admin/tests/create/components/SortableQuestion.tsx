'use client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GripVertical, X } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import PlusButton from './PlusButton';
import { Question } from './types';
import { QuestionFields } from '../components/QuestionFields';

export default function SortableQuestion({
  question,
  index,
  isDraggingTemplate,
  onRemove,
  onAddAfter,
  selectedQuestions,
  setSelectedQuestions,
  sortOrder
}: {
  question: Question;
  index: number;
  isDraggingTemplate: boolean;
  onRemove: () => void;
  onAddAfter: (template: Question) => void;
  selectedQuestions: Question[];
  setSelectedQuestions: (questions: Question[]) => void;
  sortOrder: 'newest' | 'oldest';
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: question.id,
    data: {
      type: 'question',
      question,
      index
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  // Tính số thứ tự dựa trên sortOrder
  const displayNumber =
    sortOrder === 'newest' ? index + 1 : selectedQuestions.length - index;

  return (
    <div className='question-item relative mb-8'>
      <Card
        ref={setNodeRef}
        style={style}
        className={`brutalist-card p-4 ${
          isDragging ? 'opacity-50 shadow-lg z-10' : ''
        }`}>
        <div className='flex justify-between items-start'>
          <div
            {...attributes}
            {...listeners}
            className='flex items-center gap-2 cursor-grab active:cursor-grabbing'>
            <GripVertical className='h-5 w-5' />
            <div>
              <div className='flex items-center gap-2'>
                <span className='inline-flex items-center justify-center w-8 h-8 text-sm font-bold bg-primary text-white rounded-full'>
                  {displayNumber}
                </span>
                <h3 className='font-bold'>
                  {question.section} - Part {question.part}
                </h3>
              </div>
              <p className='text-sm text-gray-600 mt-1'>
                {question.description}
              </p>
            </div>
          </div>
          <Button
            variant='ghost'
            size='sm'
            onClick={onRemove}
            className='hover:bg-red-100 hover:text-red-500'>
            <X className='h-4 w-4' />
          </Button>
        </div>
        <div className='mt-4'>
          <QuestionFields
            question={question}
            index={index}
            selectedQuestions={selectedQuestions}
            setSelectedQuestions={setSelectedQuestions}
          />
        </div>
      </Card>
      <div className='mt-2'>
        <PlusButton
          index={index}
          isDraggingTemplate={isDraggingTemplate}
          onAddTemplate={onAddAfter}
        />
      </div>
    </div>
  );
}
