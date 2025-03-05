import { LucideIcon } from "lucide-react"

export interface BaseTemplate {
  id: string
  type: string
  section: string
  part: number
  icon: LucideIcon
  description: string
}

export interface PhotoTemplate extends BaseTemplate {
  type: "photo"
  template: {
    question: string
    image: string
    options: string[]
    audio: string
    transcript: string
  }
}

export interface QATemplate extends BaseTemplate {
  type: "qa"
  template: {
    question: string
    options: string[]
    audio: string
    transcript: string
  }
}

export interface ConversationTemplate extends BaseTemplate {
  type: "conversation"
  template: {
    conversation: string
    questions: Array<{
      question: string
      options: string[]
    }>
    audio: string
  }
}

export interface ReadingTemplate extends BaseTemplate {
  type: "reading"
  template: {
    passage: string
    questions: Array<{
      question: string
      options: string[]
    }>
  }
}

export interface SentenceTemplate extends BaseTemplate {
  type: "sentence"
  template: {
    question: string
    options: string[]
  }
}

export interface TextCompletionTemplate extends BaseTemplate {
  type: "text"
  template: {
    passage: string
    questions: Array<{
      number: number
      options: string[]
    }>
  }
}

export type Template = PhotoTemplate | QATemplate | ConversationTemplate | ReadingTemplate | SentenceTemplate | TextCompletionTemplate
export type Question = Template

export interface TemplateGroups {
  listening: Template[]
  reading: Template[]
} 