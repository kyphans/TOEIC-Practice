import questions from '../data/mock-questions.json';

export interface Question {
  id: number;
  type: string;
  question: string;
  options: string[];
  image?: string;
  audio?: string;
  section: 'Listening' | 'Reading';
  part: number;
  transcript?: string;
  correct_answer?: string;
}

export interface TestData {
  id: number;
  name: string;
  sections: {
    name: 'Listening' | 'Reading';
    time: number;
    questions: Question[];
  }[];
}

export function getMockTest(testId: number): TestData {
  const listeningQuestions = (questions as Question[]).filter(q => q.section === 'Listening');
  const readingQuestions = (questions as Question[]).filter(q => q.section === 'Reading');

  return {
    id: testId,
    name: `TOEIC Test ${testId}`,
    sections: [
      {
        name: 'Listening',
        time: 2700,
        questions: listeningQuestions,
      },
      {
        name: 'Reading',
        time: 4500,
        questions: readingQuestions,
      },
    ],
  };
} 

export function checkAnswer(question: Question, answer: string) {
  
}

// answers: { [questionId: string]: string }
export function checkAnswers(testId: string, answers: { [questionId: string]: string }) {
  console.log('testId', testId)

  console.log('answers', answers)
  
  // Lấy test data
  const test = getMockTest(Number(testId));
  let correctCount = 0;
  const correctArray: { questionId: string, isCorrect: boolean, correctAnswer: string, userAnswer: string }[] = [];

  test.sections.forEach(section => {
    section.questions.forEach(question => {
      const userAnswer = answers[question.id.toString()];
      const isCorrect = userAnswer === question.correct_answer;
      if (isCorrect) correctCount++;
      correctArray.push({
        questionId: question.id.toString(),
        isCorrect,
        correctAnswer: question.correct_answer || '',
        userAnswer: userAnswer || ''
      });
    });
  });

  console.log('correctArray', correctArray)

  // Tính điểm TOEIC (giả lập)
  const totalQuestions = correctArray.length;
  const score = Math.floor((correctCount / totalQuestions) * 990);

  return { correctCount, score, correctArray };
}