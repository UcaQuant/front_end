import { Outlet } from 'react-router-dom'
import { ExamProvider } from '../context/ExamContext'

/**
 * Wraps exam-related routes so they have access to ExamContext
 * (session, answers, timer, setAnswer, nextPage, submitExam).
 */
export function ExamLayout() {
  return (
    <ExamProvider>
      <Outlet />
    </ExamProvider>
  )
}
