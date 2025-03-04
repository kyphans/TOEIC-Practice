import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface AnswersState {
  answers: Record<string, string>
  setAnswer: (questionId: string, answer: string) => void
  clearAnswers: () => void
  getAnswersByTestId: (testId: string) => Record<string, string>
  initAnswers: (testId: string) => void
}

export const useAnswersStore = create<AnswersState>()(
  persist(
    (set, get) => ({
      answers: {},
      setAnswer: (questionId: string, answer: string) => {
        set((state) => ({
          answers: {
            ...state.answers,
            [questionId]: answer,
          },
        }))
      },
      clearAnswers: () => set({ answers: {} }),
      getAnswersByTestId: (testId: string) => {
        const state = get()
        return Object.entries(state.answers)
          .filter(([key]) => key.startsWith(`${testId}-`))
          .reduce((acc, [key, value]) => {
            const questionId = key.split('-')[1]
            acc[questionId] = value
            return acc
          }, {} as Record<string, string>)
      },
      initAnswers: (testId: string) => {
        // Kiểm tra xem có answers trong localStorage không
        const storedAnswers = localStorage.getItem(`test-answers-${testId}`)
        if (storedAnswers) {
          try {
            const parsedAnswers = JSON.parse(storedAnswers)
            set((state) => ({
              answers: {
                ...state.answers,
                ...Object.entries(parsedAnswers).reduce((acc, [key, value]) => {
                  acc[`${testId}-${key}`] = value
                  return acc
                }, {} as Record<string, string>),
              },
            }))
          } catch (error) {
            console.error('Error parsing stored answers:', error)
          }
        }
      },
    }),
    {
      name: 'test-answers-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ answers: state.answers }),
    }
  )
) 