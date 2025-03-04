import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface TimerState {
  timeLeft: Record<string, number> // testId -> seconds
  setTimeLeft: (testId: string, seconds: number) => void
  clearTimer: (testId: string) => void
  decrementTime: (testId: string) => void
}

export const useTimerStore = create<TimerState>()(
  persist(
    (set) => ({
      timeLeft: {},
      setTimeLeft: (testId: string, seconds: number) =>
        set((state) => ({
          timeLeft: {
            ...state.timeLeft,
            [testId]: seconds,
          },
        })),
      clearTimer: (testId: string) =>
        set((state) => {
          const { [testId]: _, ...rest } = state.timeLeft
          return { timeLeft: rest }
        }),
      decrementTime: (testId: string) =>
        set((state) => ({
          timeLeft: {
            ...state.timeLeft,
            [testId]: Math.max(0, (state.timeLeft[testId] || 0) - 1),
          },
        })),
    }),
    {
      name: 'test-timer-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
) 