
export type Question = {
  id: number;
  content: string;
  choices: string[];
  correctAnswer: string;
  sectionName: string;
  typeName: string;
  createdAt: string;
};