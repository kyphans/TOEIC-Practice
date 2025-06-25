import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Part1Template, Question } from './types';

interface QuestionFieldsPart1Props {
  question: Question;
  index: number;
  selectedQuestions: Question[];
  setSelectedQuestions: (questions: Question[]) => void;
}

const inputStyles = 'placeholder:text-gray-400 placeholder:italic';

export default function QuestionFieldsPart1({
  question,
  index,
  selectedQuestions,
  setSelectedQuestions
}: QuestionFieldsPart1Props) {
  const updatePart1Template = (
    field: keyof Part1Template['template'],
    value: string
  ) => {
    const newQuestions = [...selectedQuestions];
    const typedQuestion = newQuestions[index] as Part1Template;
    if (field === 'options') {
      typedQuestion.template[field] = [value];
    } else {
      typedQuestion.template[field] = value;
    }
    setSelectedQuestions(newQuestions);
  };

  const template = (question as Part1Template).template;
  return (
    <>
      <Textarea
        value={template.question}
        onChange={(e) => updatePart1Template('question', e.target.value)}
        className={cn('brutalist-input mb-2 min-h-[100px]', inputStyles)}
        placeholder='Look at the photograph and listen to the four statements.'
      />
      <div className='grid grid-cols-2 gap-4 mb-2'>
        <Input
          placeholder='Enter image URL'
          value={template.image}
          onChange={(e) => updatePart1Template('image', e.target.value)}
          className={cn('brutalist-input', inputStyles)}
        />
        <Input
          placeholder='Enter audio URL'
          value={template.audio}
          onChange={(e) => updatePart1Template('audio', e.target.value)}
          className={cn('brutalist-input', inputStyles)}
        />
      </div>
      {template.options?.map((option, optionIndex) => (
        <Input
          key={optionIndex}
          value={option}
          onChange={(e) => {
            const newQuestions = [...selectedQuestions];
            const typedQuestion = newQuestions[index] as Part1Template;
            typedQuestion.template.options[optionIndex] = e.target.value;
            setSelectedQuestions(newQuestions);
          }}
          className={cn('brutalist-input mb-2', inputStyles)}
          placeholder={`Option ${optionIndex + 1} - Enter your option here`}
        />
      ))}
    </>
  );
} 