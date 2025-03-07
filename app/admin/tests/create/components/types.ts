import { LucideIcon } from "lucide-react"

export interface BaseTemplate {
  id: string
  type: string
  section: string
  part: number
  icon: LucideIcon
  description: string
}

export interface Part1Template extends BaseTemplate {
  type: "Part1"
  template: {
    question: string
    image: string
    options: string[]
    audio: string
    transcript: string
  }
}

export interface Part2Template extends BaseTemplate {
  type: "Part2"
  template: {
    question: string
    options: string[]
    audio: string
    transcript: string
  }
}

export interface Part3Template extends BaseTemplate {
  type: "Part3"
  template: {
    conversation: string
    questions: Array<{
      question: string
      options: string[]
    }>
    audio: string
  }
}

export interface Part4Template extends BaseTemplate {
  type: "Part4"
  template: {
    conversation: string
    questions: Array<{
      question: string
      options: string[]
    }>
    audio: string
  }
}

export interface Part5Template extends BaseTemplate {
  type: "Part5"
  template: {
    question: string
    options: string[]
  }
}

export interface Part6Template extends BaseTemplate {
  type: "Part6"
  template: {
    passage?: string
    passageImage?: string
    passageType: "text" | "image"
    questions: Array<{
      number: number
      options: string[]
    }>
  }
}

export interface Part7Template extends BaseTemplate {
  type: "Part7"
  template: {
    passage: string
    questions: Array<{
      question: string
      options: string[]
    }>
  }
}

export type Template = Part1Template | Part2Template | Part3Template | Part4Template | Part5Template | Part6Template | Part7Template
export type Question = Template

export interface TemplateGroups {
  listening: Template[]
  reading: Template[]
} 