import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useExam } from '../context/ExamContext'

export default function InstructionsPage() {
  const navigate = useNavigate()
  const { startExam, studentId } = useExam()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [studentName, setStudentName] = useState<string | null>(null)
  const [exams, setExams] = useState<any[]>([])
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null)

  useEffect(() => {
    // Check if student is registered
    if (!studentId) {
      navigate('/')
      return
    }
    setStudentName(localStorage.getItem('studentName'))

    // Fetch exams
    import('../services/api').then(api => {
      api.getStudentExams().then(data => {
        setExams(data)
        if (data.length > 0) {
          setSelectedExamId(data[0].id)
        }
      }).catch(err => console.error("Failed to fetch exams", err))
    })

  }, [studentId, navigate])

  const handleStart = async () => {
    if (!studentId || !selectedExamId) return
    setIsLoading(true)
    setError(null)
    try {
      await startExam(studentId, selectedExamId)
      navigate('/exam')
    } catch (err: any) {
      setError(err.message || 'Failed to start exam. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 p-6">
      <div className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-slate-900/5">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Assessment Instructions
        </h1>
        {studentName && (
          <p className="mt-2 text-lg text-slate-600">
            Welcome, <span className="font-semibold text-indigo-600">{studentName}</span>!
          </p>
        )}

        <div className="mt-6">
          <label className="block text-sm font-medium leading-6 text-slate-900">Select Assessment</label>
          <div className="mt-2">
            <select
              value={selectedExamId || ''}
              onChange={(e) => setSelectedExamId(Number(e.target.value))}
              className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            >
              <option value="" disabled>-- Select an Assessment --</option>
              {exams.map(exam => (
                <option key={exam.id} value={exam.id}>{exam.title} ({Math.round(exam.timeLimitSeconds / 60)} mins)</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-8 space-y-4 text-slate-700">
          <p>
            Please read the following instructions carefully before starting the assessment:
          </p>
          <ul className="list-inside list-disc space-y-2 pl-4 marker:text-indigo-500">
            <li>The assessment consists of <strong>Math</strong> and <strong>English</strong> questions.</li>
            <li>You will have a specific time limit to complete the exam.</li>
            <li>Use the <strong>Next</strong> and <strong>Previous</strong> buttons to navigate between questions.</li>
            <li>Your answers are <strong>automatically saved</strong> as you proceed.</li>
            <li>Once you submit the exam, you cannot make any changes.</li>
            <li>Do not refresh the page or close the browser window during the exam.</li>
          </ul>
        </div>

        {error && (
          <div className="mt-6 rounded-md bg-red-50 p-4 text-sm text-red-700 ring-1 ring-red-200">
            {error}
          </div>
        )}

        <div className="mt-10 flex justify-end">
          <button
            onClick={handleStart}
            disabled={isLoading || !selectedExamId}
            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Starting...
              </span>
            ) : (
              'I Understand, Start Exam'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

