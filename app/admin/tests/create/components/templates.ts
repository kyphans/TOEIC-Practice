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
        question: "",
        image: "",
        options: ["", "", "", ""],
        audio: "",
        transcript: ""
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
        question: "",
        options: ["", "", "", ""],
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
        conversation: "",
        questions: [
          {
            question: "",
            options: ["", "", "", ""]
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
        question: "",
        options: ["", "", "", ""]
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
        passage: "",
        passageImage: "",
        passageType: "text",
        questions: [
          {
            number: 1,
            options: ["", "", "", ""]
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
        passage: "",
        questions: [
          {
            question: "",
            options: ["", "", "", ""]
          }
        ]
      }
    }
  ]
} 