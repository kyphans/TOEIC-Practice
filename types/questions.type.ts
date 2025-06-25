export type QuestionResponse = {
  id: number;
  content: string;
  choices: string[];
  correctAnswer: string;
  sectionName: string;
  typeName: string;
  createdAt: string;
  media: { mediaType: string | null; content: string | null }[];
};