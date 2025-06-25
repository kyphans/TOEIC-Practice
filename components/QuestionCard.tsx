import { RadioGroup, Radio } from "@/components/ui/radio";
import { Label } from "@/components/ui/label";

interface QuestionCardProps {
  question: any;
  answer: string;
  onSelectAnswer: (questionId: string, answer: string) => void;
  questionNumber: number;
}

export function QuestionCard({ question, answer, onSelectAnswer, questionNumber }: QuestionCardProps) {
  return (
    <div
      id={`question${question.id}`}
      className={`py-4 scroll-mt-20 border-b border-gray-200`}>
      <div className='mb-4'>
        <h3 className='text-lg sm:text-xl font-bold mb-2 sm:mb-4'>
          Question {questionNumber}
        </h3>
        <p className='text-base sm:text-lg'>
          {question.question}
        </p>
      </div>
      {question.type === 'photo' && question.image && (
        <div className='mb-4 flex justify-center'>
          <img
            src={question.image}
            alt='Question image'
            className='max-w-full sm:max-w-[400px] h-auto'
          />
        </div>
      )}
      <div className='space-y-2 sm:space-y-3'>
        <RadioGroup
          value={answer || ''}
          onValueChange={(value) => onSelectAnswer(question.id.toString(), value)}
          className='space-y-2 sm:space-y-3'>
          {question.options.map((option: string, index: number) => (
            <div
              key={index}
              className={`test-option cursor-pointer ${answer === option ? 'selected' : ''}`}
              onClick={() => onSelectAnswer(question.id.toString(), option)}>
              <div className='flex items-center w-full'>
                <Radio
                  id={`${question.id}-option-${index}`}
                  value={option}
                  className='mr-2 sm:mr-3 shadcn-radio'
                  checked={answer === option}
                  onChange={() => onSelectAnswer(question.id.toString(), option)}
                />
                <Label
                  htmlFor={`${question.id}-option-${index}`}
                  className='cursor-pointer font-medium text-base sm:text-lg w-full'>
                  {option}
                </Label>
              </div>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
} 