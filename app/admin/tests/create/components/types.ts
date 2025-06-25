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
  type: "Part 1"
  template: {
    question: string
    image: string
    options: string[]
    audio: string
    transcript: string
  }
}

export interface Part2Template extends BaseTemplate {
  type: "Part 2"
  template: {
    question: string
    options: string[]
    audio: string
    transcript: string
  }
}

export interface Part3Template extends BaseTemplate {
  type: "Part 3"
  template: {
    question: string
    options: string[]
    audio: string
    transcript: string
  }
}

export interface Part4Template extends BaseTemplate {
  type: "Part 4"
  template: {
    question: string
    options: string[]
    audio: string
    transcript: string
  }
}

export interface Part5Template extends BaseTemplate {
  type: "Part 5"
  template: {
    question: string
    options: string[]
  }
}

export interface Part6Template extends BaseTemplate {
  type: "Part 6"
  template: {
    question: string
    image: string
    options: string[]
  }
}

export interface Part7Template extends BaseTemplate {
  type: "Part 7"
  template: {
    question: string
    image: string
    options: string[]
  }
}

export type Template = Part1Template | Part2Template | Part3Template | Part4Template | Part5Template | Part6Template | Part7Template
export type QuestionTemplate = Template & {
  existedIDInDB?: number
}

export interface TemplateGroups {
  listening: Template[]
  reading: Template[]
} 