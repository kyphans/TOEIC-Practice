export type Exam = {
  id: number;
  title: string;
  description: string | null;
  totalQuestions: number;
  strategy: string;
  createdBy: string | null;
  createdAt: string;
};

export type ExamsResponse = {
  exams: Exam[];
  total: number;
};

export type ExamSection = {
  name: 'Listening' | 'Reading';
  time: number;
  questions: ExamQuestion[];
};

export type ExamQuestion = {
  id: number;
  question: string;
  options: string[];
  image?: string;
  audio?: string;
  section: 'Listening' | 'Reading';
  part_code: string;
  transcript?: string;
};

export type ExamDetailResponse = {
  exam_attempt_id: number;
  id: number;
  name: string;
  sections: ExamSection[];
}; 