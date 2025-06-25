'use client';
import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Plus } from 'lucide-react';
import { TemplatePickerDialog } from './TemplatePickerDialog';
import { Question } from './types';

export default function PlusButton({
  index,
  isDraggingTemplate,
  onAddTemplate
}: {
  index: number;
  isDraggingTemplate: boolean;
  onAddTemplate: (template: Question) => void;
}) {
  const [showPicker, setShowPicker] = useState(false);
  const { setNodeRef, isOver } = useDroppable({
    id: `question-plus-${index}`
  });

  return (
    <>
      <div ref={setNodeRef} className='h-[50px]'>
        <button
          onClick={() => setShowPicker(true)}
          className={`w-full h-full border-2 border-dashed rounded-md flex items-center justify-center bg-white transition-all ${
            isOver && isDraggingTemplate
              ? 'border-primary bg-primary/10'
              : 'border-gray-300 hover:bg-gray-50'
          }`}>
          <Plus
            className={`h-6 w-6 ${
              isOver && isDraggingTemplate ? 'text-primary' : 'text-gray-400'
            }`}
          />
        </button>
      </div>

      <TemplatePickerDialog
        open={showPicker}
        onOpenChange={setShowPicker}
        onSelectTemplate={onAddTemplate}
      />
    </>
  );
}
