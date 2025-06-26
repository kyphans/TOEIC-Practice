export enum Difficulty {
  Easy = 'easy',
  Medium = 'medium',
  Hard = 'hard',
}

export enum PartCode {
  Part1 = 'part1',
  Part2 = 'part2',
  Part3 = 'part3',
  Part4 = 'part4',
  Part5 = 'part5',
  Part6 = 'part6',
  Part7 = 'part7',
}

export enum SectionName {
  Listening = 'Listening',
  Reading = 'Reading',
}

export enum QuestionSectionName {
  Listening = 'Listening',
  Reading = 'Reading',
}

export type Exam = {
  id: number;
  title: string;
  description: string | null;
  totalQuestions: number;
  strategy: string;
  sections: ExamSection[];
  difficulty: Difficulty;
  createdBy: string | null;
  createdAt: string;
};

export type ExamsResponse = {
  exams: Exam[];
  total: number;
};

export type ExamQuestion = {
  id: number;
  question: string;
  options: string[];
  image?: string;
  audio?: string;
  section: SectionName;
  part_code: PartCode;
  transcript?: string;
};

export type ExamSection = {
  name: SectionName;
  time: number;
  questions: ExamQuestion[];
};

export type ExamDetailResponse = {
  exam_attempt_id: number;
  id: number;
  name: string;
  sections: ExamSection[];
}; 