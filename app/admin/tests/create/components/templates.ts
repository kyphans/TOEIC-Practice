import { Image, MessageSquare, Headphones, FileText } from "lucide-react"
import { TemplateGroups } from "./types"

export const questionTemplates: TemplateGroups = {
  listening: [
    {
      id: "photo-listening",
      type: "Part 1",
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
      type: "Part 2",
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
      type: "Part 3",
      section: "Listening",
      part: 3,
      icon: Headphones,
      description: "Conversations with multiple questions",
      template: {
        question: "",
        options: ["", "", "", ""],
        audio: "",
        transcript: ""
      }
    }
  ],
  reading: [
    {
      id: "sentence-completion",
      type: "Part 5",
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
      type: "Part 6",
      section: "Reading",
      part: 6,
      icon: FileText,
      description: "Complete the text",
      template: {
        question: "",
        image: "",
        options: ["", "", "", ""]
      }
    },
    {
      id: "reading-comprehension",
      type: "Part 7",
      section: "Reading",
      part: 7,
      icon: FileText,
      description: "Reading comprehension",
      template: {
        question: "",
        image: "",
        options: ["", "", "", ""]
      }
    }
  ]
} 