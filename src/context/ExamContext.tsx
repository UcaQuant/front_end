import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { submitExam as submitExamApi } from '../services/api'

type ExamContextValue = {
  sessionId: string | null
  currentPage: number
  answers: Map<string, number>
  timeLeft: number
  setAnswer: (questionId: string, optionIndex: number) => void
  nextPage: () => void
  submitExam: () => Promise<void>
  startTimer: (initialSeconds: number) => void
  setSessionId: (id: string | null) => void
  setCurrentPage: (page: number) => void
}

const ExamContext = createContext<ExamContextValue | null>(null)

export function useExam() {
  const ctx = useContext(ExamContext)
  if (!ctx) {
    throw new Error('useExam must be used within ExamProvider')
  }
  return ctx
}

type ExamProviderProps = { children: ReactNode }

export function ExamProvider({ children }: ExamProviderProps) {
  const [sessionId, setSessionIdState] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [answers, setAnswers] = useState(() => new Map<string, number>())
  const [timeLeft, setTimeLeft] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const setAnswer = useCallback((questionId: string, optionIndex: number) => {
    setAnswers((prev) => {
      const next = new Map(prev)
      next.set(questionId, optionIndex)
      return next
    })
  }, [])

  const nextPage = useCallback(() => {
    setCurrentPage((p) => p + 1)
  }, [])

  const submitExam = useCallback(async () => {
    if (!sessionId) {
      throw new Error('No active session to submit')
    }
    await submitExamApi({ attemptId: sessionId })
  }, [sessionId])

  const startTimer = useCallback((initialSeconds: number) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setTimeLeft(initialSeconds)
    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }
          return 0
        }
        return t - 1
      })
    }, 1000)
  }, [])

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const setSessionId = useCallback((id: string | null) => {
    setSessionIdState(id)
  }, [])

  const value: ExamContextValue = useMemo(
    () => ({
      sessionId,
      currentPage,
      answers,
      timeLeft,
      setAnswer,
      nextPage,
      submitExam,
      startTimer,
      setSessionId,
      setCurrentPage,
    }),
    [
      sessionId,
      currentPage,
      answers,
      timeLeft,
      setAnswer,
      nextPage,
      submitExam,
      startTimer,
      setSessionId,
      setCurrentPage,
    ],
  )

  return (
    <ExamContext.Provider value={value}>{children}</ExamContext.Provider>
  )
}
