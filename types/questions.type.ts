export type QuestionResponse = {
  id: number;
  content: string;
  choices: string[];
  correctAnswer: string;
  difficulty: string | null;
  topic: string | null;
  sectionName: string;
  typeName: string;
  createdAt: string;
  media: { mediaType: string | null; content: string | null }[];
};