'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { QuestionResponse } from '@/types/questions.type';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import {
  ArrowDownAZ,
  ArrowUpAZ,
  FileText,
  Loader2,
  Save,
  X
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import DroppableQuestions from './components/DroppableQuestions';
import { ImportQuestionsDialog } from './components/ImportQuestionsDialog';
import { QuestionGridCreate } from './components/QuestionGridCreate';
import { QuestionTemplates } from './components/QuestionTemplates';
import SortableQuestion from './components/SortableQuestion';
import { QuestionTemplate, Template } from './components/types';

export default function CreateTest() {
  // ===== STATE =====
  const [testName, setTestName] = useState('Example Test Title');

  const [selectedQuestions, setSelectedQuestions] = useState<
    QuestionTemplate[]
  >([]);
  const [activeTab, setActiveTab] = useState<'listening' | 'reading'>(
    'listening'
  );
  const [draggedTemplate, setDraggedTemplate] =
    useState<QuestionTemplate | null>(null);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const [showImportDialog, setShowImportDialog] = useState(false);

  // ===== REFS =====
  // Ref để scroll đến câu hỏi
  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // ===== EFFECTS =====
  // Khi trang mount, nếu có localStorage.selectedQuestionsForExam thì map và setSelectedQuestions
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Load selectedQuestionsForExam
    const raw = localStorage.getItem('selectedQuestionsForExam');
    if (raw) {
      try {
        const rows = JSON.parse(raw) as QuestionResponse[];
        if (Array.isArray(rows) && rows.length > 0) {
          setSelectedQuestions((prev) => {
            const mapped = mapQuestionsFromTable(rows);
            return [...mapped, ...prev];
          });
        }
      } catch {
        // handle error silently
      }
      localStorage.removeItem('selectedQuestionsForExam');
    }

    // Load draftTest
    const saved = localStorage.getItem('draftTest');
    if (saved) {
      try {
        const { questions, name } = JSON.parse(saved);
        if (questions) setSelectedQuestions((prev) => [...prev, ...questions]);
        if (name) setTestName(name);
      } catch {
        // handle error silently
      }
    }
  }, []);

  // Lưu vào localStorage mỗi khi có thay đổi
  useEffect(() => {
    if (testName || selectedQuestions.length > 0) {
      localStorage.setItem(
        'draftTest',
        JSON.stringify({
          name: testName,
          questions: selectedQuestions
        })
      );
    }
  }, [testName, selectedQuestions]);

  // ===== FUNCTION HANDLERS & UTILS =====
  // Mapper: từ data table sang QuestionTemplate[]
  // ... existing code ...
  function mapQuestionsFromTable(rows: QuestionResponse[]): QuestionTemplate[] {
    return rows.map((row: QuestionResponse, idx: number) => {
      let partNumber = 5; // default fallback
      if (row.sectionName) {
        const match = row.sectionName.match(/Part\s*(\d+)/i);
        if (match && match[1]) {
          partNumber = parseInt(match[1], 10);
        }
      }
      const section =
        partNumber >= 1 && partNumber <= 4 ? 'Listening' : 'Reading';
      const sortedOptions = [
        row.correctAnswer,
        ...row.choices.filter((choice: string) => choice !== row.correctAnswer)
      ];
      const base = {
        id: `imported-${Date.now()}-${idx}`,
        existedIDInDB: row.id,
        section,
        part: partNumber,
        icon: FileText,
        description: row.typeName || ''
      };
      switch (partNumber) {
        case 1:
          return {
            ...base,
            type: 'Part 1',
            template: {
              question: row.content,
              image:
                row.media.find((_) => _.mediaType === 'image')?.content || '',
              options: sortedOptions,
              audio:
                row.media.find((_) => _.mediaType === 'audio')?.content || '',
              transcript:
                row.media.find((_) => _.mediaType === 'transcript')?.content ||
                ''
            }
          };
        case 2:
          return {
            ...base,
            type: 'Part 2',
            template: {
              question: row.content,
              options: sortedOptions,
              audio:
                row.media.find((_) => _.mediaType === 'audio')?.content || '',
              transcript:
                row.media.find((_) => _.mediaType === 'transcript')?.content ||
                ''
            }
          };
        case 3:
          return {
            ...base,
            type: 'Part 3',
            template: {
              question: row.content,
              options: sortedOptions,
              audio:
                row.media.find((_) => _.mediaType === 'audio')?.content || '',
              transcript:
                row.media.find((_) => _.mediaType === 'transcript')?.content ||
                ''
            }
          };
        case 4:
          return {
            ...base,
            type: 'Part 4',
            template: {
              question: row.content,
              options: sortedOptions,
              audio:
                row.media.find((_) => _.mediaType === 'audio')?.content || '',
              transcript:
                row.media.find((_) => _.mediaType === 'transcript')?.content ||
                ''
            }
          };
        case 5:
          return {
            ...base,
            type: 'Part 5',
            template: {
              question: row.content,
              options: sortedOptions
            }
          };
        case 6:
          return {
            ...base,
            type: 'Part 6',
            template: {
              question: row.content,
              image:
                row.media.find((_) => _.mediaType === 'image')?.content || '',
              options: sortedOptions
            }
          };
        case 7:
          return {
            ...base,
            type: 'Part 7',
            template: {
              question: row.content,
              image:
                row.media.find((_) => _.mediaType === 'image')?.content || '',
              options: sortedOptions
            }
          };
        default:
          return {
            ...base,
            type: 'Part 5',
            template: {
              question: row.content,
              options: sortedOptions
            }
          };
      }
    });
  }

  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === 'template') {
      setDraggedTemplate(event.active.data.current.template);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setDraggedTemplate(null);
      return;
    }

    // Handle dropping template
    if (active.data.current?.type === 'template') {
      const template = active.data.current.template;
      const newQuestion: QuestionTemplate = {
        ...template,
        id: `question-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        template: JSON.parse(JSON.stringify(template.template))
      };

      // Nếu thả vào nút plus đầu tiên
      if (over.id === 'question-plus--1') {
        setSelectedQuestions((prev) => [newQuestion, ...prev]);
      }
      // Nếu thả vào nút plus của câu hỏi
      else if (
        typeof over.id === 'string' &&
        over.id.startsWith('question-plus-')
      ) {
        const index = parseInt(over.id.split('-')[2]);
        const newQuestions = [...selectedQuestions];
        newQuestions.splice(index + 1, 0, newQuestion);
        setSelectedQuestions(newQuestions);
      }
      // Nếu thả vào khu vực chung
      else if (over.id === 'questions') {
        setSelectedQuestions((prev) => [...prev, newQuestion]);
      }
    }

    // Handle reordering questions
    if (active.data.current?.type === 'question' && over.id !== 'questions') {
      const oldIndex = selectedQuestions.findIndex((q) => q.id === active.id);
      const newIndex = selectedQuestions.findIndex((q) => q.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newQuestions = [...selectedQuestions];
        const [movedQuestion] = newQuestions.splice(oldIndex, 1);
        newQuestions.splice(newIndex, 0, movedQuestion);
        setSelectedQuestions(newQuestions);
      }
    }

    setDraggedTemplate(null);
  };

  const handleDragCancel = () => {
    setDraggedTemplate(null);
  };

  const removeQuestion = (index: number) => {
    const newQuestions = [...selectedQuestions];
    newQuestions.splice(index, 1);
    setSelectedQuestions(newQuestions);
  };

  const addQuestionAfter = (index: number, template: QuestionTemplate) => {
    const newQuestion: QuestionTemplate = {
      ...template,
      id: `question-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      template: JSON.parse(JSON.stringify(template.template))
    };
    const newQuestions = [...selectedQuestions];
    newQuestions.splice(index + 1, 0, newQuestion);
    setSelectedQuestions(newQuestions);
  };

  const addQuestionToStart = (template: QuestionTemplate) => {
    const newQuestion: QuestionTemplate = {
      ...template,
      id: `question-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      template: JSON.parse(JSON.stringify(template.template))
    };
    setSelectedQuestions((prev) => [newQuestion, ...prev]);
  };

  const handleSort = () => {
    const newOrder = sortOrder === 'newest' ? 'oldest' : 'newest';
    setSortOrder(newOrder);

    const sortedQuestions = [...selectedQuestions].sort((a, b) => {
      const aId = parseInt(a.id.split('-')[1]); // Get timestamp from id
      const bId = parseInt(b.id.split('-')[1]);
      return newOrder === 'newest' ? bId - aId : aId - bId;
    });

    setSelectedQuestions(sortedQuestions);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Validate trước khi gửi
      if (!testName.trim()) {
        toast({
          title: 'Test name is required',
          description: 'Please enter a test name.',
          variant: 'destructive',
          duration: 3000
        });
        setIsSaving(false);
        return;
      }
      if (selectedQuestions.length === 0) {
        toast({
          title: 'No questions selected',
          description: 'Please add at least one question to the test.',
          variant: 'destructive',
          duration: 3000
        });
        setIsSaving(false);
        return;
      }

      // Gọi API tạo đề thi
      const res = await fetch('/api/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testName,
          questions: selectedQuestions
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save test');
      }

      // Xóa dữ liệu tạm trong localStorage
      localStorage.removeItem('draftTest');

      toast({
        title: 'Test saved successfully!',
        description: `Created test "${testName}" with ${selectedQuestions.length} questions.`,
        duration: 3000
      });
      // Optionally reset form
      setTestName('');
      setSelectedQuestions([]);
    } catch (error: any) {
      toast({
        title: 'Error saving test',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
        duration: 3000
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (
      window.confirm(
        'Are you sure you want to reset all fields? This action cannot be undone.'
      )
    ) {
      setTestName('');
      setSelectedQuestions([]);
      localStorage.removeItem('draftTest');
      toast({
        title: 'Reset successful',
        description: 'All fields have been cleared.',
        duration: 3000
      });
    }
  };

  const scrollToQuestion = (index: number) => {
    questionRefs.current[index]?.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  };

  const handleImportQuestions = (importedQuestions: QuestionTemplate[]) => {
    setSelectedQuestions((prev) => [...prev, ...importedQuestions]);
    toast({
      title: 'Questions imported successfully!',
      description: `Added ${importedQuestions.length} questions to the test.`,
      duration: 3000
    });
  };

  // ===== RENDER =====
  return (
    <div className='space-y-8'>
      <div className='brutalist-container'>
        <h1 className='text-3xl font-black mb-4'>Create New Test</h1>
        <p className='text-lg'>Drag and drop components to create your test</p>
      </div>

      <div className='brutalist-container !p-0'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6 items-center'>
          <div className='flex gap-4 flex-wrap md:col-span- p-6'>
            <Button
              className='brutalist-button flex-1 sm:flex-none'
              onClick={handleSave}
              disabled={
                !testName.trim() || selectedQuestions.length === 0 || isSaving
              }>
              {isSaving ? (
                <>
                  <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                  Saving Test...
                </>
              ) : (
                <>
                  <Save className='mr-2 h-5 w-5' />
                  Save Test
                </>
              )}
            </Button>

            <Button
              className='brutalist-button flex-1 sm:flex-none bg-red-500 hover:bg-red-600 text-white'
              onClick={handleReset}
              disabled={isSaving}>
              <X className='mr-2 h-5 w-5' />
              Reset All Fields
            </Button>
          </div>

          <div className='md:col-span-3 py-6 pr-6'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-xl font-black'>Test Name</h2>
            </div>
            <Input
              type='text'
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              className='brutalist-input w-full text-xl font-bold'
            />
          </div>
        </div>
      </div>

      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
          <div className='md:col-span-1'>
            <QuestionTemplates
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              draggedTemplate={draggedTemplate}
            />

            {selectedQuestions.length > 0 && (
              <div className='mt-4'>
                <QuestionGridCreate
                  questions={selectedQuestions}
                  onQuestionClick={scrollToQuestion}
                />
              </div>
            )}
          </div>

          <div className='md:col-span-3'>
            <div className='brutalist-container'>
              <div className='flex justify-between items-center mb-4 sticky top-0 bg-white z-10'>
                <h2 className='text-xl font-black'>Test Questions</h2>
                <div className='flex items-center gap-2'>
                  <Button
                    onClick={() => setShowImportDialog(true)}
                    variant='outline'
                    className='brutalist-button flex items-center gap-2'>
                    Import Questions
                  </Button>
                  <Button
                    onClick={handleSort}
                    variant='outline'
                    className='brutalist-button flex items-center gap-2'>
                    {sortOrder === 'newest' ? (
                      <>
                        <ArrowDownAZ className='h-4 w-4' />
                        Newest First
                      </>
                    ) : (
                      <>
                        <ArrowUpAZ className='h-4 w-4' />
                        Oldest First
                      </>
                    )}
                  </Button>
                </div>
              </div>
              <div className='pr-4'>
                <DroppableQuestions
                  isDraggingTemplate={!!draggedTemplate}
                  onAddToStart={addQuestionToStart}>
                  <SortableContext
                    items={selectedQuestions.map((q) => q.id)}
                    strategy={verticalListSortingStrategy}>
                    {selectedQuestions.map((question, index) => (
                      <div
                        key={question.id}
                        ref={(el) => {
                          questionRefs.current[index] = el;
                        }}>
                        <SortableQuestion
                          question={question}
                          index={index}
                          isDraggingTemplate={!!draggedTemplate}
                          onRemove={() => removeQuestion(index)}
                          onAddAfter={(template) =>
                            addQuestionAfter(index, template)
                          }
                          selectedQuestions={selectedQuestions}
                          setSelectedQuestions={setSelectedQuestions}
                          sortOrder={sortOrder}
                        />
                      </div>
                    ))}
                  </SortableContext>
                </DroppableQuestions>
              </div>
            </div>
          </div>
        </div>
      </DndContext>

      <ImportQuestionsDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        onImport={handleImportQuestions}
      />
    </div>
  );
}
