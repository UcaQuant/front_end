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
import {
  startExam as startExamApi,
  submitAnswers as submitAnswersApi,
  submitExam as submitExamApi,
  finishExam as finishExamApi,
  type QuestionDto,
} from '../services/api'

type ExamContextValue = {
  sessionId: string | null
  studentId: string | null
  questions: QuestionDto[]
  currentPage: number
  totalPages: number
  answers: Map<number, number> // questionId -> optionIndex
  timeLeft: number
  isLoading: boolean

  startExam: (studentId: string, examId: number) => Promise<void>
  loadQuestions: (page: number) => Promise<void>
  selectOption: (questionId: number, optionIndex: number) => void
  submitCurrentAnswers: () => Promise<void>
  submitExam: () => Promise<{ answeredCount: number; totalCount: number; unansweredCount: number } | undefined> // Marks as SUBMITTED
  finishExam: () => Promise<string> // Marks as COMPLETED, returns report URL
  setStudentId: (id: string | null) => void

  nextPage: () => void
  prevPage: () => void
}

const ExamContext = createContext<ExamContextValue | null>(null)

export function useExam() {
  const ctx = useContext(ExamContext)
  if (!ctx) {
    throw new Error('useExam must be used within ExamProvider')
  }
  return ctx
}

export function ExamProvider({ children }: { children: ReactNode }) {
  const [sessionId, setSessionId] = useState<string | null>(() => localStorage.getItem('sessionId'))
  const [studentId, setStudentId] = useState<string | null>(() => localStorage.getItem('studentId'))

  const [questions, setQuestions] = useState<QuestionDto[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const [answers, setAnswers] = useState<Map<number, number>>(() => {
    // TODO: Load from localStorage if needed for crash recovery, 
    // but backend should provide saved answers on fetch.
    return new Map()
  })

  const [timeLeft, setTimeLeft] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Persist session info
  useEffect(() => {
    if (sessionId) localStorage.setItem('sessionId', sessionId)
    else localStorage.removeItem('sessionId')
  }, [sessionId])

  useEffect(() => {
    if (studentId) localStorage.setItem('studentId', studentId)
    else localStorage.removeItem('studentId')
  }, [studentId])

  const startTimer = useCallback((seconds: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setTimeLeft(seconds)
    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          return 0
        }
        return t - 1
      })
    }, 1000)
  }, [])

  // Start Exam
  const startExam = useCallback(async (sId: string, examId: number) => {
    setIsLoading(true)
    try {
      setStudentId(sId)
      const data = await startExamApi(sId, examId)
      setSessionId(data.sessionId)
      startTimer(data.durationSeconds)
      // Reset state for new exam
      setAnswers(new Map())
      setCurrentPage(0)
    } finally {
      setIsLoading(false)
    }
  }, [startTimer])

  // Load Questions (and sync answers from backend if needed)
  // Backend spec says: "Do NOT expose correct_index". 
  // It also says: "selectedOption: null // or existing selection if autosaved"
  // So we can populate our answers map from the fetched questions.
  // BUT: The component might call this on page change.
  const loadQuestions = useCallback(async (page: number) => {
    if (!sessionId) return
    setIsLoading(true)
    try {
      // We need to import getQuestions from api, but I missed exporting it in the import statement above? 
      // No, I need to add it to the import.
      // Wait, I can't modify the import inside this function. 
      // I will use `import { getQuestions } ...` at top level. 
      // For now, let's assume I fixed the imports in the replacement string.
      const { getQuestions } = await import('../services/api')

      const data = await getQuestions(sessionId, page, 5) // size 5 default
      setQuestions(data.questions)
      setTotalPages(data.totalPages)
      setCurrentPage(data.currentPage)

      // Sync answers from backend
      setAnswers(prev => {
        const next = new Map(prev)
        data.questions.forEach(q => {
          if (q.selectedOption !== null && q.selectedOption !== undefined) {
            next.set(q.id, q.selectedOption)
          }
        })
        return next
      })
    } finally {
      setIsLoading(false)
    }
  }, [sessionId])

  const selectOption = useCallback((qId: number, optIdx: number) => {
    setAnswers(prev => {
      const next = new Map(prev)
      next.set(qId, optIdx)
      return next
    })
  }, [])

  const submitCurrentAnswers = useCallback(async () => {
    if (!sessionId) return
    // Collect answers for current page's questions to save bandwidth/calls?
    // Or just all modified answers? 
    // The API `submitAnswers` takes a list.
    // Let's send only the answers that correspond to the current visible questions 
    // OR just send the single answer if we want to autosave per click (but that might be too many calls).
    // The spec says: "Frontend calls PUT ... When Student navigates between pages or clicks Next".
    // So we should call this on `nextPage`.

    // Let's gather answers for the *current questions*
    const answersToSend = questions
      .map(q => ({
        questionId: q.id,
        selectedOptionIndex: answers.get(q.id)
      }))
      .filter(a => a.selectedOptionIndex !== undefined) as { questionId: number, selectedOptionIndex: number }[]

    if (answersToSend.length > 0) {
      await submitAnswersApi(sessionId, answersToSend)
    }
  }, [sessionId, questions, answers])

  const nextPage = useCallback(async () => {
    // Save first
    await submitCurrentAnswers()
    if (currentPage < totalPages - 1) {
      await loadQuestions(currentPage + 1)
    }
  }, [currentPage, totalPages, submitCurrentAnswers, loadQuestions])

  const prevPage = useCallback(async () => {
    // Maybe save here too?
    await submitCurrentAnswers()
    if (currentPage > 0) {
      await loadQuestions(currentPage - 1)
    }
  }, [currentPage, submitCurrentAnswers, loadQuestions])

  const submitExam = useCallback(async () => {
    if (!sessionId) {
      throw new Error("No session")
    }
    await submitCurrentAnswers() // Save pending
    const data = await submitExamApi(sessionId)
    return data
  }, [sessionId, submitCurrentAnswers])

  const finishExam = useCallback(async () => {
    if (!sessionId) throw new Error("No session")
    const res = await finishExamApi(sessionId)
    // Clear local session
    localStorage.removeItem('sessionId')
    // localStorage.removeItem('studentId') // Keep student ID to show results
    setSessionId(null)
    // setStudentId(null) // Keep student ID to show results
    const url = res.downloadUrl.startsWith('http')
      ? res.downloadUrl
      : `http://localhost:8080${res.downloadUrl}`
    return url
  }, [sessionId])

  const value = useMemo(() => ({
    sessionId,
    studentId,
    questions,
    currentPage,
    totalPages,
    answers,
    timeLeft,
    isLoading,
    startExam,
    loadQuestions,
    selectOption,
    submitCurrentAnswers,
    submitExam,
    finishExam,
    setStudentId,
    nextPage,
    prevPage
  }), [
    sessionId,
    studentId,
    questions,
    currentPage,
    totalPages,
    answers,
    timeLeft,
    isLoading,
    startExam,
    loadQuestions,
    selectOption,
    submitCurrentAnswers,
    submitExam,
    finishExam,
    setStudentId,
    nextPage,
    prevPage,
  ])

  return <ExamContext.Provider value={value}>{children}</ExamContext.Provider>
}
