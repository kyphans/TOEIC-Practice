'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Question } from './types';
import { questionTemplates } from './templates';

interface TemplatePickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTemplate: (template: Question) => void;
}

export function TemplatePickerDialog({
  open,
  onOpenChange,
  onSelectTemplate
}: TemplatePickerDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-3xl'>
        <DialogHeader>
          <DialogTitle>Add New Question</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue='listening'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='listening'>Listening</TabsTrigger>
            <TabsTrigger value='reading'>Reading</TabsTrigger>
          </TabsList>
          {(['listening', 'reading'] as const).map((section) => (
            <TabsContent key={section} value={section}>
              <div className='grid grid-cols-1 gap-4'>
                {questionTemplates[section].map((template) => (
                  <Card
                    key={template.id}
                    className='brutalist-card p-4 cursor-pointer hover:bg-gray-50'
                    onClick={() => {
                      onSelectTemplate(template);
                      onOpenChange(false);
                    }}>
                    <div className='flex items-center gap-2'>
                      <template.icon className='h-5 w-5' />
                      <div>
                        <h3 className='font-bold'>Part {template.part}</h3>
                        <p className='text-sm text-gray-600'>
                          {template.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
