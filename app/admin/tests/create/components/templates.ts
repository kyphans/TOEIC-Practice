import { Image, MessageSquare, Headphones, FileText } from "lucide-react"
import { TemplateGroups } from "./types"

export const questionTemplates: TemplateGroups = {
  listening: [
    {
      id: "photo-listening",
      type: "photo",
      section: "Listening",
      part: 1,
      icon: Image,
      description: "Questions based on photographs",
      template: {
        question: "Look at the photograph and listen to the four statements.",
        image: "/placeholder.svg",
        options: ["Option 1", "Option 2", "Option 3", "Option 4"],
        audio: "",
        transcript: "Look at the photograph. Now listen to the four statements."
      }
    },
    {
      id: "qa-listening",
      type: "qa",
      section: "Listening",
      part: 2,
      icon: MessageSquare,
      description: "Question and Response",
      template: {
        question: "Listen to the question and select the best response.",
        options: ["Response 1", "Response 2", "Response 3", "Response 4"],
        audio: "",
        transcript: ""
      }
    },
    {
      id: "conversation",
      type: "conversation",
      section: "Listening",
      part: 3,
      icon: Headphones,
      description: "Conversations with multiple questions",
      template: {
        conversation: "Conversation transcript goes here",
        questions: [
          {
            question: "Question about the conversation",
            options: ["Option 1", "Option 2", "Option 3", "Option 4"]
          }
        ],
        audio: ""
      }
    }
  ],
  reading: [
    {
      id: "sentence-completion",
      type: "sentence",
      section: "Reading",
      part: 5,
      icon: FileText,
      description: "Complete the sentence",
      template: {
        question: "Complete the sentence with the correct word.",
        options: ["Option 1", "Option 2", "Option 3", "Option 4"]
      }
    },
    {
      id: "text-completion",
      type: "text",
      section: "Reading",
      part: 6,
      icon: FileText,
      description: "Complete the text",
      template: {
        passage: "Text passage with (1) _____ to fill in",
        passageImage: "",
        passageType: "text",
        questions: [
          {
            number: 1,
            options: ["Option 1", "Option 2", "Option 3", "Option 4"]
          }
        ]
      }
    },
    {
      id: "reading-comprehension",
      type: "reading",
      section: "Reading",
      part: 7,
      icon: FileText,
      description: "Reading comprehension",
      template: {
        passage: "Reading passage goes here",
        questions: [
          {
            question: "Question about the passage",
            options: ["Option 1", "Option 2", "Option 3", "Option 4"]
          }
        ]
      }
    }
  ]
} 