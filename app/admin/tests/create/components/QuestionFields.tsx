import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Question, PhotoTemplate, ConversationTemplate, ReadingTemplate, TextCompletionTemplate } from "./types"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface QuestionFieldsProps {
  question: Question
  index: number
  selectedQuestions: Question[]
  setSelectedQuestions: (questions: Question[]) => void
}

const inputStyles = "placeholder:text-gray-400 placeholder:italic"

export const QuestionFields = ({ question, index, selectedQuestions, setSelectedQuestions }: QuestionFieldsProps) => {
  const updateQuestion = <T extends Question>(newValue: string, field: keyof T["template"]) => {
    const newQuestions = [...selectedQuestions];
    const typedQuestion = newQuestions[index] as T;
    (typedQuestion.template as any)[field] = newValue;
    setSelectedQuestions(newQuestions);
  };

  const updatePhotoTemplate = (field: keyof PhotoTemplate["template"], value: string) => {
    const newQuestions = [...selectedQuestions];
    const typedQuestion = newQuestions[index] as PhotoTemplate;
    if (field === "options") {
      typedQuestion.template[field] = [value];
    } else {
      typedQuestion.template[field] = value;
    }
    setSelectedQuestions(newQuestions);
  };

  const updateConversationTemplate = (field: keyof ConversationTemplate["template"], value: string) => {
    const newQuestions = [...selectedQuestions];
    const typedQuestion = newQuestions[index] as ConversationTemplate;
    if (field === "questions") {
      typedQuestion.template[field] = [{question: value, options: []}];
    } else {
      typedQuestion.template[field] = value;
    }
    setSelectedQuestions(newQuestions);
  };

  const updateReadingTemplate = (field: keyof ReadingTemplate["template"], value: string) => {
    const newQuestions = [...selectedQuestions];
    const typedQuestion = newQuestions[index] as ReadingTemplate;
    if (field === "questions") {
      typedQuestion.template[field] = [{question: value, options: []}];
    } else {
      typedQuestion.template[field] = value;
    }
    setSelectedQuestions(newQuestions);
  };

  const updateTextCompletionTemplate = (field: keyof TextCompletionTemplate["template"], value: string) => {
    const newQuestions = [...selectedQuestions];
    const typedQuestion = newQuestions[index] as TextCompletionTemplate;
    if (field === "passageType") {
      typedQuestion.template[field] = value as "text" | "image";
    } else if (field === "questions") {
      typedQuestion.template[field] = [{number: 1, options: []}];
    } else {
      typedQuestion.template[field] = value;
    }
    setSelectedQuestions(newQuestions);
  };

  switch (question.type) {
    case "photo": {
      const template = (question as PhotoTemplate).template;
      return (
        <>
          <Textarea
            value={template.question}
            onChange={(e) => updatePhotoTemplate("question", e.target.value)}
            className={cn("brutalist-input mb-2 min-h-[100px]", inputStyles)}
            placeholder="Look at the photograph and listen to the four statements."
          />
          <div className="grid grid-cols-2 gap-4 mb-2">
            <Input
              placeholder="Enter image URL"
              value={template.image}
              onChange={(e) => updatePhotoTemplate("image", e.target.value)}
              className={cn("brutalist-input", inputStyles)}
            />
            <Input
              placeholder="Enter audio URL"
              value={template.audio}
              onChange={(e) => updatePhotoTemplate("audio", e.target.value)}
              className={cn("brutalist-input", inputStyles)}
            />
          </div>
          {template.options.map((option, optionIndex) => (
            <Input
              key={optionIndex}
              value={option}
              onChange={(e) => {
                const newQuestions = [...selectedQuestions];
                const typedQuestion = newQuestions[index] as PhotoTemplate;
                typedQuestion.template.options[optionIndex] = e.target.value;
                setSelectedQuestions(newQuestions);
              }}
              className={cn("brutalist-input mb-2", inputStyles)}
              placeholder={`Option ${optionIndex + 1} - Enter your option here`}
            />
          ))}
        </>
      )
    }

    case "conversation":
    case "reading": {
      const isConversation = question.type === "conversation";
      const template = isConversation 
        ? (question as ConversationTemplate).template
        : (question as ReadingTemplate).template;
      
      const mainFieldValue = isConversation 
        ? (question as ConversationTemplate).template.conversation
        : (question as ReadingTemplate).template.passage;
      
      return (
        <>
          <Textarea
            value={mainFieldValue}
            onChange={(e) => {
              if (isConversation) {
                updateConversationTemplate("conversation", e.target.value);
              } else {
                updateReadingTemplate("passage", e.target.value);
              }
            }}
            className={cn("brutalist-input mb-2 min-h-[200px]", inputStyles)}
            placeholder={isConversation ? "Enter the conversation transcript here..." : "Enter the reading passage here..."}
          />
          {template.questions.map((subQ, subIndex) => (
            <div key={subIndex} className="mt-4">
              <Textarea
                value={subQ.question}
                onChange={(e) => {
                  const newQuestions = [...selectedQuestions];
                  const typedQuestion = isConversation 
                    ? newQuestions[index] as ConversationTemplate
                    : newQuestions[index] as ReadingTemplate;
                  typedQuestion.template.questions[subIndex].question = e.target.value;
                  setSelectedQuestions(newQuestions);
                }}
                className={cn("brutalist-input mb-2 min-h-[100px]", inputStyles)}
                placeholder={`Question ${subIndex + 1} - Enter your question here`}
              />
              {subQ.options.map((option, optionIndex) => (
                <Input
                  key={optionIndex}
                  value={option}
                  onChange={(e) => {
                    const newQuestions = [...selectedQuestions];
                    const typedQuestion = isConversation 
                      ? newQuestions[index] as ConversationTemplate
                      : newQuestions[index] as ReadingTemplate;
                    typedQuestion.template.questions[subIndex].options[optionIndex] = e.target.value;
                    setSelectedQuestions(newQuestions);
                  }}
                  className={cn("brutalist-input mb-2", inputStyles)}
                  placeholder={`Option ${optionIndex + 1} - Enter your option here`}
                />
              ))}
            </div>
          ))}
          <Button
            onClick={() => {
              const newQuestions = [...selectedQuestions];
              const typedQuestion = isConversation 
                ? newQuestions[index] as ConversationTemplate
                : newQuestions[index] as ReadingTemplate;
              typedQuestion.template.questions.push({
                question: "",
                options: ["", "", "", ""]
              });
              setSelectedQuestions(newQuestions);
            }}
            className="brutalist-button mt-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Question
          </Button>
        </>
      )
    }

    case "text": {
      const template = (question as TextCompletionTemplate).template;
      return (
        <>
          <div className="mb-4">
            <div className="flex items-center gap-4 mb-4">
              <Button
                type="button"
                onClick={() => {
                  const newQuestions = [...selectedQuestions];
                  const typedQuestion = newQuestions[index] as TextCompletionTemplate;
                  typedQuestion.template.passageType = "text";
                  typedQuestion.template.passageImage = "";
                  setSelectedQuestions(newQuestions);
                }}
                className={`brutalist-button ${template.passageType === "text" ? "bg-primary text-white" : "bg-gray-100"}`}
              >
                Text Passage
              </Button>
              <Button
                type="button"
                onClick={() => {
                  const newQuestions = [...selectedQuestions];
                  const typedQuestion = newQuestions[index] as TextCompletionTemplate;
                  typedQuestion.template.passageType = "image";
                  typedQuestion.template.passage = "";
                  setSelectedQuestions(newQuestions);
                }}
                className={`brutalist-button ${template.passageType === "image" ? "bg-primary text-white" : "bg-gray-100"}`}
              >
                Image Passage
              </Button>
            </div>

            {template.passageType === "text" ? (
              <Textarea
                value={template.passage || ""}
                onChange={(e) => updateTextCompletionTemplate("passage", e.target.value)}
                className={cn("brutalist-input mb-2 min-h-[200px]", inputStyles)}
                placeholder="Enter text passage with blanks (e.g., The company's profits _____(1) by 25% last year.)"
              />
            ) : (
              <div className="flex flex-col gap-2">
                <Input
                  placeholder="Enter passage image URL"
                  value={template.passageImage || ""}
                  onChange={(e) => updateTextCompletionTemplate("passageImage", e.target.value)}
                  className={cn("brutalist-input", inputStyles)}
                />
                {template.passageImage && (
                  <div className="relative aspect-video rounded-md overflow-hidden border-2 border-gray-200">
                    <img 
                      src={template.passageImage} 
                      alt="Passage" 
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder.svg";
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {template.questions.map((subQ, subIndex) => (
            <div key={subIndex} className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold">Blank #{subQ.number}</span>
              </div>
              {subQ.options.map((option, optionIndex) => (
                <Input
                  key={optionIndex}
                  value={option}
                  onChange={(e) => {
                    const newQuestions = [...selectedQuestions];
                    const typedQuestion = newQuestions[index] as TextCompletionTemplate;
                    typedQuestion.template.questions[subIndex].options[optionIndex] = e.target.value;
                    setSelectedQuestions(newQuestions);
                  }}
                  className={cn("brutalist-input mb-2", inputStyles)}
                  placeholder={`Option ${optionIndex + 1} - Enter your option here`}
                />
              ))}
            </div>
          ))}
          <Button
            onClick={() => {
              const newQuestions = [...selectedQuestions];
              const typedQuestion = newQuestions[index] as TextCompletionTemplate;
              const currentQuestions = typedQuestion.template.questions;
              const nextNumber = currentQuestions.length > 0 
                ? Math.max(...currentQuestions.map(q => q.number)) + 1 
                : 1;
              typedQuestion.template.questions.push({
                number: nextNumber,
                options: ["", "", "", ""]
              });
              setSelectedQuestions(newQuestions);
            }}
            className="brutalist-button mt-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Blank
          </Button>
        </>
      )
    }

    default: {
      const template = question.template as { question: string; options: string[] };
      return (
        <>
          <Textarea
            value={template.question}
            onChange={(e) => {
              const newQuestions = [...selectedQuestions];
              const typedTemplate = newQuestions[index].template as { question: string };
              typedTemplate.question = e.target.value;
              setSelectedQuestions(newQuestions);
            }}
            className={cn("brutalist-input mb-2 min-h-[100px]", inputStyles)}
            placeholder="Enter your question here"
          />
          {template.options.map((option, optionIndex) => (
            <Input
              key={optionIndex}
              value={option}
              onChange={(e) => {
                const newQuestions = [...selectedQuestions];
                const typedTemplate = newQuestions[index].template as { options: string[] };
                typedTemplate.options[optionIndex] = e.target.value;
                setSelectedQuestions(newQuestions);
              }}
              className={cn("brutalist-input mb-2", inputStyles)}
              placeholder={`Option ${optionIndex + 1} - Enter your option here`}
            />
          ))}
        </>
      )
    }
  }
} 