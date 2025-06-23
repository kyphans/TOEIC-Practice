import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import React from "react";

interface Question {
  id: number;
  // ... các trường khác nếu cần
}

interface SubmitTestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  answeredQuestions: Question[];
  unansweredQuestions: Question[];
  onConfirm: () => void;
  onCancel: () => void;
}

export function SubmitTestDialog({
  open,
  onOpenChange,
  answeredQuestions,
  unansweredQuestions,
  onConfirm,
  onCancel,
}: SubmitTestDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='brutalist-card max-w-lg'>
        <DialogHeader>
          <DialogTitle className='text-primary'>
            Confirm Submit Test
          </DialogTitle>
          <DialogDescription className='mb-2'>
            Please review your answers before submitting. Below is the summary:
          </DialogDescription>
        </DialogHeader>
        <div className='mb-2'>
          <div className='font-semibold mb-1'>
            Answered Questions ({answeredQuestions.length}):
          </div>
          <div className='flex flex-wrap gap-1 mb-2'>
            {answeredQuestions.length > 0 ? (
              answeredQuestions.map((q) => (
                <span
                  key={q.id}
                  className='inline-block px-1 bg-primary text-white rounded brutalist-button text-xs font-bold border border-black'>
                  {q.id}
                </span>
              ))
            ) : (
              <span className='text-xs text-gray-500'>None</span>
            )}
          </div>
          <div className='font-semibold mb-1'>
            Unanswered Questions ({unansweredQuestions.length}):
          </div>
          <div className='flex flex-wrap gap-1'>
            {unansweredQuestions.length > 0 ? (
              unansweredQuestions.map((q) => (
                <span
                  key={q.id}
                  className='inline-block px-1 rounded brutalist-button-hover text-xs font-bold border border-black bg-red-100 text-white'>
                  {q.id}
                </span>
              ))
            ) : (
              <span className='text-xs text-gray-500'>None</span>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button
            variant='outline'
            className='brutalist-button-outline'
            onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant='destructive'
            className='brutalist-button'
            onClick={onConfirm}>
            Confirm Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 