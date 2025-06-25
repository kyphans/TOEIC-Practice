'use client';
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import PlusButton from './PlusButton';
import { Question } from './types';

export default function DroppableQuestions({
  children,
  isDraggingTemplate,
  onAddToStart
}: {
  children: React.ReactNode;
  isDraggingTemplate: boolean;
  onAddToStart: (template: Question) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'questions'
  });

  return (
    <div
      ref={setNodeRef}
      className={`questions-container min-h-[200px] p-4 border-2 border-dashed transition-colors duration-200 ${
        isOver && isDraggingTemplate
          ? 'border-primary bg-primary/5'
          : 'border-gray-200'
      }`}>
      <div className='mb-8'>
        <PlusButton
          index={-1}
          isDraggingTemplate={isDraggingTemplate}
          onAddTemplate={onAddToStart}
        />
      </div>
      {children}
    </div>
  );
} 