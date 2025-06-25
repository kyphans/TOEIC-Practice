'use client';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Question } from './types';
import { AlertCircle, CheckCircle2, Copy } from 'lucide-react';

interface ImportQuestionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (questions: Question[]) => void;
}

const sampleJSON = {
  questions: [
    {
      type: 'Part1',
      section: 'Listening',
      part: 1,
      template: {
        question: 'Sample question text',
        image: 'https://example.com/image.jpg',
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        audio: 'https://example.com/audio.mp3',
        transcript: 'Sample transcript text'
      }
    },
    {
      type: 'Part3',
      section: 'Listening',
      part: 3,
      template: {
        conversation: 'Sample conversation text',
        questions: [
          {
            question: 'Sample question 1',
            options: ['Option A', 'Option B', 'Option C', 'Option D']
          }
        ],
        audio: 'https://example.com/audio.mp3'
      }
    },
    {
      type: 'Part7',
      section: 'Reading',
      part: 7,
      template: {
        passage: 'Sample reading passage',
        questions: [
          {
            question: 'Sample question 1',
            options: ['Option A', 'Option B', 'Option C', 'Option D']
          }
        ]
      }
    }
  ]
};

export function ImportQuestionsDialog({
  open,
  onOpenChange,
  onImport
}: ImportQuestionsDialogProps) {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);

  const validateAndFormatJSON = (input: string) => {
    try {
      // Parse JSON to validate
      const parsed = JSON.parse(input);

      // Validate structure
      if (!parsed.questions || !Array.isArray(parsed.questions)) {
        throw new Error("JSON must have a 'questions' array");
      }

      // Validate each question
      parsed.questions.forEach((question: any, index: number) => {
        if (!question.type) {
          throw new Error(`Question at index ${index} is missing 'type'`);
        }
        if (!question.section) {
          throw new Error(`Question at index ${index} is missing 'section'`);
        }
        if (!question.part) {
          throw new Error(`Question at index ${index} is missing 'part'`);
        }
        if (!question.template) {
          throw new Error(`Question at index ${index} is missing 'template'`);
        }
      });

      // Format JSON with 2 spaces indentation
      const formatted = JSON.stringify(parsed, null, 2);
      setJsonInput(formatted);
      setError(null);
      setIsValid(true);
      return parsed;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON format');
      setIsValid(false);
      return null;
    }
  };

  const handleImport = () => {
    const parsed = validateAndFormatJSON(jsonInput);
    if (parsed) {
      // Add unique IDs to imported questions
      const questionsWithIds = parsed.questions.map((q: Question) => ({
        ...q,
        id: `question-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }));
      onImport(questionsWithIds);
      onOpenChange(false);
      setJsonInput('');
      setError(null);
      setIsValid(false);
    }
  };

  const copyExample = () => {
    const exampleJSON = JSON.stringify(sampleJSON, null, 2);
    navigator.clipboard.writeText(exampleJSON);
    setJsonInput(exampleJSON);
    validateAndFormatJSON(exampleJSON);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Import Questions from JSON</DialogTitle>
          <DialogDescription>
            Paste your JSON data below. The JSON must contain a "questions"
            array with each question having type, section, part, and template
            fields.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          <div className='flex justify-between items-center'>
            <span className='text-sm text-gray-500'>Format Example:</span>
            <Button
              variant='outline'
              size='sm'
              onClick={copyExample}
              className='flex items-center gap-2'>
              <Copy className='h-4 w-4' />
              Copy Example
            </Button>
          </div>

          <Textarea
            value={jsonInput}
            onChange={(e) => {
              setJsonInput(e.target.value);
              if (e.target.value) {
                validateAndFormatJSON(e.target.value);
              } else {
                setError(null);
                setIsValid(false);
              }
            }}
            placeholder='Paste your JSON here...'
            className='font-mono min-h-[500px] text-sm'
          />

          {error && (
            <div className='flex items-center gap-2 text-red-500 text-sm'>
              <AlertCircle className='h-4 w-4' />
              {error}
            </div>
          )}

          {isValid && (
            <div className='flex items-center gap-2 text-green-500 text-sm'>
              <CheckCircle2 className='h-4 w-4' />
              Valid JSON format
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => {
              onOpenChange(false);
              setJsonInput('');
              setError(null);
              setIsValid(false);
            }}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={!isValid}>
            Import Questions
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
