import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Question, PhotoTemplate, ConversationTemplate, ReadingTemplate, TextCompletionTemplate } from "./types"

interface QuestionFieldsProps {
  question: Question
  index: number
  selectedQuestions: Question[]
  setSelectedQuestions: (questions: Question[]) => void
}

export const QuestionFields = ({ question, index, selectedQuestions, setSelectedQuestions }: QuestionFieldsProps) => {
  switch (question.type) {
    case "photo":
      return (
        <>
          <Input
            value={question.template.question}
            onChange={(e) => {
              const newQuestions = [...selectedQuestions]
              newQuestions[index].template.question = e.target.value
              setSelectedQuestions(newQuestions)
            }}
            className="brutalist-input mb-2"
          />
          <div className="grid grid-cols-2 gap-4 mb-2">
            <Input
              placeholder="Image URL"
              value={question.template.image}
              onChange={(e) => {
                const newQuestions = [...selectedQuestions]
                ;(newQuestions[index] as PhotoTemplate).template.image = e.target.value
                setSelectedQuestions(newQuestions)
              }}
              className="brutalist-input"
            />
            <Input
              placeholder="Audio URL"
              value={question.template.audio}
              onChange={(e) => {
                const newQuestions = [...selectedQuestions]
                ;(newQuestions[index] as PhotoTemplate).template.audio = e.target.value
                setSelectedQuestions(newQuestions)
              }}
              className="brutalist-input"
            />
          </div>
          {question.template.options.map((option, optionIndex) => (
            <Input
              key={optionIndex}
              value={option}
              onChange={(e) => {
                const newQuestions = [...selectedQuestions]
                newQuestions[index].template.options[optionIndex] = e.target.value
                setSelectedQuestions(newQuestions)
              }}
              className="brutalist-input mb-2"
              placeholder={`Option ${optionIndex + 1}`}
            />
          ))}
        </>
      )

    case "conversation":
    case "reading":
      const isConversation = question.type === "conversation"
      return (
        <>
          <textarea
            value={isConversation ? question.template.conversation : question.template.passage}
            onChange={(e) => {
              const newQuestions = [...selectedQuestions]
              if (isConversation) {
                (newQuestions[index] as ConversationTemplate).template.conversation = e.target.value
              } else {
                (newQuestions[index] as ReadingTemplate).template.passage = e.target.value
              }
              setSelectedQuestions(newQuestions)
            }}
            className="brutalist-input mb-2 w-full h-32"
            placeholder={isConversation ? "Enter conversation transcript" : "Enter reading passage"}
          />
          {question.template.questions.map((subQ, subIndex) => (
            <div key={subIndex} className="mt-4">
              <Input
                value={subQ.question}
                onChange={(e) => {
                  const newQuestions = [...selectedQuestions]
                  newQuestions[index].template.questions[subIndex].question = e.target.value
                  setSelectedQuestions(newQuestions)
                }}
                className="brutalist-input mb-2"
                placeholder={`Question ${subIndex + 1}`}
              />
              {subQ.options.map((option, optionIndex) => (
                <Input
                  key={optionIndex}
                  value={option}
                  onChange={(e) => {
                    const newQuestions = [...selectedQuestions]
                    newQuestions[index].template.questions[subIndex].options[optionIndex] = e.target.value
                    setSelectedQuestions(newQuestions)
                  }}
                  className="brutalist-input mb-2"
                  placeholder={`Option ${optionIndex + 1}`}
                />
              ))}
            </div>
          ))}
          <Button
            onClick={() => {
              const newQuestions = [...selectedQuestions]
              newQuestions[index].template.questions.push({
                question: "",
                options: ["", "", "", ""]
              })
              setSelectedQuestions(newQuestions)
            }}
            className="brutalist-button mt-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Question
          </Button>
        </>
      )

    case "text":
      const textTemplate = question.template as TextCompletionTemplate["template"]
      return (
        <>
          <div className="mb-4">
            <div className="flex items-center gap-4 mb-4">
              <Button
                type="button"
                onClick={() => {
                  const newQuestions = [...selectedQuestions]
                  const template = (newQuestions[index] as TextCompletionTemplate).template
                  template.passageType = "text"
                  template.passageImage = ""
                  setSelectedQuestions(newQuestions)
                }}
                className={`brutalist-button ${textTemplate.passageType === "text" ? "bg-primary text-white" : "bg-gray-100"}`}
              >
                Text Passage
              </Button>
              <Button
                type="button"
                onClick={() => {
                  const newQuestions = [...selectedQuestions]
                  const template = (newQuestions[index] as TextCompletionTemplate).template
                  template.passageType = "image"
                  template.passage = ""
                  setSelectedQuestions(newQuestions)
                }}
                className={`brutalist-button ${textTemplate.passageType === "image" ? "bg-primary text-white" : "bg-gray-100"}`}
              >
                Image Passage
              </Button>
            </div>

            {textTemplate.passageType === "text" ? (
              <textarea
                value={textTemplate.passage || ""}
                onChange={(e) => {
                  const newQuestions = [...selectedQuestions]
                  ;(newQuestions[index] as TextCompletionTemplate).template.passage = e.target.value
                  setSelectedQuestions(newQuestions)
                }}
                className="brutalist-input mb-2 w-full h-32"
                placeholder="Enter text passage with blanks (e.g., Text with (1) _____ to fill in)"
              />
            ) : (
              <div className="flex flex-col gap-2">
                <Input
                  placeholder="Passage Image URL"
                  value={textTemplate.passageImage || ""}
                  onChange={(e) => {
                    const newQuestions = [...selectedQuestions]
                    ;(newQuestions[index] as TextCompletionTemplate).template.passageImage = e.target.value
                    setSelectedQuestions(newQuestions)
                  }}
                  className="brutalist-input"
                />
                {textTemplate.passageImage && (
                  <div className="relative aspect-video rounded-md overflow-hidden border-2 border-gray-200">
                    <img 
                      src={textTemplate.passageImage} 
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

          {textTemplate.questions.map((subQ, subIndex) => (
            <div key={subIndex} className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold">Blank #{subQ.number}</span>
              </div>
              {subQ.options.map((option, optionIndex) => (
                <Input
                  key={optionIndex}
                  value={option}
                  onChange={(e) => {
                    const newQuestions = [...selectedQuestions]
                    ;(newQuestions[index] as TextCompletionTemplate).template.questions[subIndex].options[optionIndex] = e.target.value
                    setSelectedQuestions(newQuestions)
                  }}
                  className="brutalist-input mb-2"
                  placeholder={`Option ${optionIndex + 1}`}
                />
              ))}
            </div>
          ))}
          <Button
            onClick={() => {
              const newQuestions = [...selectedQuestions]
              const currentQuestions = (newQuestions[index] as TextCompletionTemplate).template.questions
              const nextNumber = currentQuestions.length > 0 
                ? Math.max(...currentQuestions.map(q => q.number)) + 1 
                : 1
              ;(newQuestions[index] as TextCompletionTemplate).template.questions.push({
                number: nextNumber,
                options: ["", "", "", ""]
              })
              setSelectedQuestions(newQuestions)
            }}
            className="brutalist-button mt-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Blank
          </Button>
        </>
      )

    default:
      return (
        <>
          <Input
            value={question.template.question}
            onChange={(e) => {
              const newQuestions = [...selectedQuestions]
              newQuestions[index].template.question = e.target.value
              setSelectedQuestions(newQuestions)
            }}
            className="brutalist-input mb-2"
          />
          {question.template.options.map((option, optionIndex) => (
            <Input
              key={optionIndex}
              value={option}
              onChange={(e) => {
                const newQuestions = [...selectedQuestions]
                newQuestions[index].template.options[optionIndex] = e.target.value
                setSelectedQuestions(newQuestions)
              }}
              className="brutalist-input mb-2"
              placeholder={`Option ${optionIndex + 1}`}
            />
          ))}
        </>
      )
  }
} 