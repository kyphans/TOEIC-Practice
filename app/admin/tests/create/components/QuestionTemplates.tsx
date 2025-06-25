'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { useDraggable, DragOverlay } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { questionTemplates } from './templates';
import type { Question } from './types';

interface QuestionTemplatesProps {
  activeTab: 'listening' | 'reading';
  setActiveTab: (value: 'listening' | 'reading') => void;
  draggedTemplate: Question | null;
}

function TemplateCard({ template }: { template: Question }) {
  return (
    <Card className='brutalist-card p-4 mb-4 cursor-grab active:cursor-grabbing'>
      <div className='flex items-center gap-2'>
        <template.icon className='h-5 w-5' />
        <div>
          <h3 className='font-bold'>Part {template.part}</h3>
          <p className='text-sm text-gray-600'>{template.description}</p>
        </div>
      </div>
    </Card>
  );
}

function DraggableTemplateItem({
  template,
  index
}: {
  template: Question;
  index: number;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: template.id,
    data: {
      type: 'template',
      template,
      index
    }
  });

  return (
    <div ref={setNodeRef} {...attributes} {...listeners}>
      <TemplateCard template={template} />
    </div>
  );
}

export function QuestionTemplates({
  activeTab,
  setActiveTab,
  draggedTemplate
}: QuestionTemplatesProps) {
  return (
    <div className='brutalist-container'>
      <Tabs
        defaultValue='listening'
        onValueChange={(value) =>
          setActiveTab(value as 'listening' | 'reading')
        }>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='listening'>Listening</TabsTrigger>
          <TabsTrigger value='reading'>Reading</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab}>
          <div className='min-h-[100px]'>
            {questionTemplates[activeTab].map((template, index) => (
              <DraggableTemplateItem
                key={template.id}
                template={template}
                index={index}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <DragOverlay dropAnimation={null}>
        {draggedTemplate ? (
          <div
            style={{
              backgroundColor: 'white',
              cursor: 'grabbing'
            }}>
            <TemplateCard template={draggedTemplate} />
          </div>
        ) : null}
      </DragOverlay>
    </div>
  );
}
