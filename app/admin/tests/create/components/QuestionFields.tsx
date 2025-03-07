import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Question, Part1Template, Part2Template, Part3Template, Part4Template, Part5Template, Part6Template, Part7Template } from "./types"
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

  const updatePart1Template = (field: keyof Part1Template["template"], value: string) => {
    const newQuestions = [...selectedQuestions];
    const typedQuestion = newQuestions[index] as Part1Template;
    if (field === "options") {
      typedQuestion.template[field] = [value];
    } else {
      typedQuestion.template[field] = value;
    }
    setSelectedQuestions(newQuestions);
  };

  const updatePart3Template = (field: keyof Part3Template["template"], value: string) => {
    const newQuestions = [...selectedQuestions];
    const typedQuestion = newQuestions[index] as Part3Template;
    if (field === "questions") {
      typedQuestion.template[field] = [{question: value, options: []}];
    } else {
      typedQuestion.template[field] = value;
    }
    setSelectedQuestions(newQuestions);
  };

  const updatePart7Template = (field: keyof Part7Template["template"], value: string) => {
    const newQuestions = [...selectedQuestions];
    const typedQuestion = newQuestions[index] as Part7Template;
    if (field === "questions") {
      typedQuestion.template[field] = [{question: value, options: []}];
    } else {
      typedQuestion.template[field] = value;
    }
    setSelectedQuestions(newQuestions);
  };

  const updatePart6Template = (field: keyof Part6Template["template"], value: string) => {
    const newQuestions = [...selectedQuestions];
    const typedQuestion = newQuestions[index] as Part6Template;
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
    case "Part1": {
      const template = (question as Part1Template).template;
      return (
        <>
          <Textarea
            value={template.question}
            onChange={(e) => updatePart1Template("question", e.target.value)}
            className={cn("brutalist-input mb-2 min-h-[100px]", inputStyles)}
            placeholder="Look at the photograph and listen to the four statements."
          />
          <div className="grid grid-cols-2 gap-4 mb-2">
            <Input
              placeholder="Enter image URL"
              value={template.image}
              onChange={(e) => updatePart1Template("image", e.target.value)}
              className={cn("brutalist-input", inputStyles)}
            />
            <Input
              placeholder="Enter audio URL"
              value={template.audio}
              onChange={(e) => updatePart1Template("audio", e.target.value)}
              className={cn("brutalist-input", inputStyles)}
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
              className={cn("brutalist-input mb-2", inputStyles)}
              placeholder={`Option ${optionIndex + 1} - Enter your option here`}
            />
          ))}
        </>
      )
    }

    case "Part3":
    case "Part4": {
      const template = (question as Part3Template | Part4Template).template;
      return (
        <>
          <Textarea
            value={template.conversation}
            onChange={(e) => updatePart3Template("conversation", e.target.value)}
            className={cn("brutalist-input mb-2 min-h-[200px]", inputStyles)}
            placeholder="Enter the conversation transcript here..."
          />
          {template.questions?.map((subQ, subIndex) => (
            <div key={subIndex} className="mt-4">
              <Textarea
                value={subQ.question}
                onChange={(e) => {
                  const newQuestions = [...selectedQuestions];
                  const typedQuestion = newQuestions[index] as Part3Template;
                  typedQuestion.template.questions[subIndex].question = e.target.value;
                  setSelectedQuestions(newQuestions);
                }}
                className={cn("brutalist-input mb-2 min-h-[100px]", inputStyles)}
                placeholder={`Question ${subIndex + 1} - Enter your question here`}
              />
              {subQ.options?.map((option, optionIndex) => (
                <Input
                  key={optionIndex}
                  value={option}
                  onChange={(e) => {
                    const newQuestions = [...selectedQuestions];
                    const typedQuestion = newQuestions[index] as Part3Template;
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
              const typedQuestion = newQuestions[index] as Part3Template;
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

    case "Part6": {
      const template = (question as Part6Template).template;
      return (
        <>
          <div className="mb-4">
            <div className="flex items-center gap-4 mb-4">
              <Button
                type="button"
                onClick={() => {
                  const newQuestions = [...selectedQuestions];
                  const typedQuestion = newQuestions[index] as Part6Template;
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
                  const typedQuestion = newQuestions[index] as Part6Template;
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
                onChange={(e) => updatePart6Template("passage", e.target.value)}
                className={cn("brutalist-input mb-2 min-h-[200px]", inputStyles)}
                placeholder="Enter text passage with blanks (e.g., The company's profits _____(1) by 25% last year.)"
              />
            ) : (
              <div className="flex flex-col gap-2">
                <Input
                  placeholder="Enter passage image URL"
                  value={template.passageImage || ""}
                  onChange={(e) => updatePart6Template("passageImage", e.target.value)}
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

          {template.questions?.map((subQ, subIndex) => (
            <div key={subIndex} className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold">Blank #{subQ.number}</span>
              </div>
              {subQ.options?.map((option, optionIndex) => (
                <Input
                  key={optionIndex}
                  value={option}
                  onChange={(e) => {
                    const newQuestions = [...selectedQuestions];
                    const typedQuestion = newQuestions[index] as Part6Template;
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
              const typedQuestion = newQuestions[index] as Part6Template;
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
          {template.options?.map((option, optionIndex) => (
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