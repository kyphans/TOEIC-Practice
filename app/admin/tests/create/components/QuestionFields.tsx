import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Question, PhotoTemplate, ConversationTemplate, ReadingTemplate } from "./types"

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
          <div className="grid grid-cols-2 gap-4">
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