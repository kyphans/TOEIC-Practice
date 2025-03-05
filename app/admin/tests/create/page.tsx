"use client"

import { useState } from "react"
import { DndContext, DragEndEvent, useDraggable, useDroppable, DragStartEvent } from "@dnd-kit/core"
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { GripVertical, Save, X, Plus } from "lucide-react"
import { Question } from "./components/types"
import { questionTemplates } from "./components/templates"
import { QuestionFields } from "./components/QuestionFields"
import { QuestionTemplates } from "./components/QuestionTemplates"
import { TemplatePickerDialog } from "./components/TemplatePickerDialog"

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
  setSelectedQuestions 
}: { 
  question: Question;
  index: number;
  isDraggingTemplate: boolean;
  onRemove: () => void;
  onAddAfter: (template: Question) => void;
  selectedQuestions: Question[];
  setSelectedQuestions: (questions: Question[]) => void;
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
                <h3 className="font-bold">
                  Question {index + 1}: {question.section} - Part {question.part}
                </h3>
                <p className="text-sm text-gray-600">{question.description}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
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
  const [testName, setTestName] = useState("")
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([])
  const [activeTab, setActiveTab] = useState<"listening" | "reading">("listening")
  const [draggedTemplate, setDraggedTemplate] = useState<Question | null>(null)

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

  return (
    <div className="space-y-8">
      <div className="brutalist-container">
        <h1 className="text-3xl font-black mb-4">Create New Test</h1>
        <p className="text-lg">Drag and drop components to create your test</p>
      </div>

      <div className="brutalist-container">
        <Input
          type="text"
          placeholder="Enter test name"
          value={testName}
          onChange={(e) => setTestName(e.target.value)}
          className="brutalist-input mb-4"
        />
      </div>

      <DndContext 
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <QuestionTemplates 
              activeTab={activeTab} 
              setActiveTab={setActiveTab}
              draggedTemplate={draggedTemplate}
            />
          </div>

          <div className="md:col-span-2">
            <div className="brutalist-container">
              <h2 className="text-xl font-black mb-4">Test Questions</h2>
              <DroppableQuestions 
                isDraggingTemplate={!!draggedTemplate}
                onAddToStart={addQuestionToStart}
              >
                <SortableContext 
                  items={selectedQuestions.map(q => q.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {selectedQuestions.map((question, index) => (
                    <SortableQuestion
                      key={question.id}
                      question={question}
                      index={index}
                      isDraggingTemplate={!!draggedTemplate}
                      onRemove={() => removeQuestion(index)}
                      onAddAfter={(template) => addQuestionAfter(index, template)}
                      selectedQuestions={selectedQuestions}
                      setSelectedQuestions={setSelectedQuestions}
                    />
                  ))}
                </SortableContext>
              </DroppableQuestions>
            </div>
          </div>
        </div>
      </DndContext>

      <div className="brutalist-container">
        <Button 
          className="brutalist-button" 
          onClick={() => console.log({ testName, selectedQuestions })}
          disabled={selectedQuestions.length === 0 || !testName.trim()}
        >
          <Save className="mr-2 h-5 w-5" />
          Save Test
        </Button>
      </div>
    </div>
  )
} 