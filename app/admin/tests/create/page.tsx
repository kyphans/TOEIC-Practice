"use client"

import { useState, useEffect, useRef } from "react"
import { DndContext, DragEndEvent, useDraggable, useDroppable, DragStartEvent } from "@dnd-kit/core"
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { GripVertical, Save, X, Plus, ArrowDownAZ, ArrowUpAZ, Loader2, CheckCircle2 } from "lucide-react"
import { Question } from "./components/types"
import { questionTemplates } from "./components/templates"
import { QuestionFields } from "./components/QuestionFields"
import { QuestionTemplates } from "./components/QuestionTemplates"
import { TemplatePickerDialog } from "./components/TemplatePickerDialog"
import { useToast } from "@/components/ui/use-toast"
import { QuestionGridCreate } from "./components/QuestionGridCreate"
import { ImportQuestionsDialog } from './components/ImportQuestionsDialog'

function PlusButton({ 
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
    id: `question-plus-${index}`,
  });

  return (
    <>
      <div 
        ref={setNodeRef}
        className="h-[50px]"
      >
        <button
          onClick={() => setShowPicker(true)}
          className={`w-full h-full border-2 border-dashed rounded-md flex items-center justify-center bg-white transition-all ${
            (isOver && isDraggingTemplate) 
              ? 'border-primary bg-primary/10' 
              : 'border-gray-300 hover:bg-gray-50'
          }`}
        >
          <Plus className={`h-6 w-6 ${
            (isOver && isDraggingTemplate) ? 'text-primary' : 'text-gray-400'
          }`} />
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

function DroppableQuestions({ 
  children, 
  isDraggingTemplate,
  onAddToStart 
}: { 
  children: React.ReactNode;
  isDraggingTemplate: boolean;
  onAddToStart: (template: Question) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'questions',
  });

  return (
    <div 
      ref={setNodeRef}
      className={`questions-container min-h-[200px] p-4 border-2 border-dashed transition-colors duration-200 ${
        isOver && isDraggingTemplate
          ? 'border-primary bg-primary/5' 
          : 'border-gray-200'
      }`}
    >
      <div className="mb-8">
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

function SortableQuestion({ 
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
  sortOrder: "newest" | "oldest";
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
    transition,
  };

  // Tính số thứ tự dựa trên sortOrder
  const displayNumber = sortOrder === "newest" 
    ? index + 1 
    : selectedQuestions.length - index;

  return (
    <>
      <div className="question-item relative mb-8">
        <Card
          ref={setNodeRef}
          style={style}
          className={`brutalist-card p-4 ${isDragging ? 'opacity-50 shadow-lg z-10' : ''}`}
        >
          <div className="flex justify-between items-start">
            <div {...attributes} {...listeners} className="flex items-center gap-2 cursor-grab active:cursor-grabbing">
              <GripVertical className="h-5 w-5" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-8 h-8 text-sm font-bold bg-primary text-white rounded-full">
                    {displayNumber}
                  </span>
                  <h3 className="font-bold">
                    {question.section} - Part {question.part}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 mt-1">{question.description}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="hover:bg-red-100 hover:text-red-500"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-4">
            <QuestionFields 
              question={question}
              index={index}
              selectedQuestions={selectedQuestions}
              setSelectedQuestions={setSelectedQuestions}
            />
          </div>
        </Card>
        
        <div className="mt-2">
          <PlusButton 
            index={index} 
            isDraggingTemplate={isDraggingTemplate}
            onAddTemplate={onAddAfter}
          />
        </div>
      </div>
    </>
  );
}

export default function CreateTest() {
  const [testName, setTestName] = useState(() => {
    // Khôi phục từ localStorage khi component mount
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('draftTest');
      if (saved) {
        const { name } = JSON.parse(saved);
        return name || "";
      }
    }
    return "";
  })
  
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>(() => {
    // Khôi phục questions từ localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('draftTest');
      if (saved) {
        const { questions } = JSON.parse(saved);
        return questions || [];
      }
    }
    return [];
  })

  const [activeTab, setActiveTab] = useState<"listening" | "reading">("listening")
  const [draggedTemplate, setDraggedTemplate] = useState<Question | null>(null)
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()
  const [showImportDialog, setShowImportDialog] = useState(false)

  // Ref để scroll đến câu hỏi
  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Lưu vào localStorage mỗi khi có thay đổi
  useEffect(() => {
    if (testName || selectedQuestions.length > 0) {
      localStorage.setItem('draftTest', JSON.stringify({
        name: testName,
        questions: selectedQuestions
      }));
    }
  }, [testName, selectedQuestions]);

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
      const newQuestion: Question = {
        ...template,
        id: `question-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        template: JSON.parse(JSON.stringify(template.template))
      };

      // Nếu thả vào nút plus đầu tiên
      if (over.id === 'question-plus--1') {
        setSelectedQuestions(prev => [newQuestion, ...prev]);
      }
      // Nếu thả vào nút plus của câu hỏi
      else if (typeof over.id === 'string' && over.id.startsWith('question-plus-')) {
        const index = parseInt(over.id.split('-')[2]);
        const newQuestions = [...selectedQuestions];
        newQuestions.splice(index + 1, 0, newQuestion);
        setSelectedQuestions(newQuestions);
      }
      // Nếu thả vào khu vực chung
      else if (over.id === 'questions') {
        setSelectedQuestions(prev => [...prev, newQuestion]);
      }
    }

    // Handle reordering questions
    if (active.data.current?.type === 'question' && over.id !== 'questions') {
      const oldIndex = selectedQuestions.findIndex(q => q.id === active.id);
      const newIndex = selectedQuestions.findIndex(q => q.id === over.id);
      
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
    const newQuestions = [...selectedQuestions]
    newQuestions.splice(index, 1)
    setSelectedQuestions(newQuestions)
  }

  const addQuestionAfter = (index: number, template: Question) => {
    const newQuestion: Question = {
      ...template,
      id: `question-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      template: JSON.parse(JSON.stringify(template.template))
    };
    const newQuestions = [...selectedQuestions];
    newQuestions.splice(index + 1, 0, newQuestion);
    setSelectedQuestions(newQuestions);
  };

  const addQuestionToStart = (template: Question) => {
    const newQuestion: Question = {
      ...template,
      id: `question-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      template: JSON.parse(JSON.stringify(template.template))
    };
    setSelectedQuestions(prev => [newQuestion, ...prev]);
  };

  const handleSort = () => {
    const newOrder = sortOrder === "newest" ? "oldest" : "newest";
    setSortOrder(newOrder);
    
    const sortedQuestions = [...selectedQuestions].sort((a, b) => {
      const aId = parseInt(a.id.split('-')[1]); // Get timestamp from id
      const bId = parseInt(b.id.split('-')[1]);
      return newOrder === "newest" ? bId - aId : aId - bId;
    });
    
    setSelectedQuestions(sortedQuestions);
  };

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Giả lập API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Log ra JSON
      console.log('Test Data:', JSON.stringify({
        name: testName,
        questions: selectedQuestions.map(q => ({
          type: q.type,
          section: q.section,
          part: q.part,
          template: q.template
        }))
      }, null, 2))

      // Xóa dữ liệu tạm trong localStorage
      localStorage.removeItem('draftTest');

      // Hiển thị thông báo thành công
      toast({
        title: "Test saved successfully!",
        description: `Created test "${testName}" with ${selectedQuestions.length} questions.`,
        duration: 3000,
      })

    } catch (error) {
      toast({
        title: "Error saving test",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all fields? This action cannot be undone.')) {
      setTestName("");
      setSelectedQuestions([]);
      localStorage.removeItem('draftTest');
      toast({
        title: "Reset successful",
        description: "All fields have been cleared.",
        duration: 3000,
      });
    }
  }

  const scrollToQuestion = (index: number) => {
    questionRefs.current[index]?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'center'
    });
  };

  const handleImportQuestions = (importedQuestions: Question[]) => {
    setSelectedQuestions(prev => [...prev, ...importedQuestions])
    toast({
      title: "Questions imported successfully!",
      description: `Added ${importedQuestions.length} questions to the test.`,
      duration: 3000,
    })
  }

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
              placeholder='Enter test name'
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
                <div className="flex items-center gap-2">
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
              <div className='max-h-[calc(100vh)] overflow-y-auto pr-4'>
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