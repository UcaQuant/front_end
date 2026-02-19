import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useExam } from '../context/ExamContext'

export default function ReviewPage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { finishExam } = useExam()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const stats = state?.stats

  const handleFinish = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const reportUrl = await finishExam()
      navigate('/result', { state: { reportUrl } })
    } catch (err: any) {
      setError(err.message || 'Failed to finish exam. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 p-10">
        <p className="text-red-500">No stats available. Please start the exam properly.</p>
        <button
          onClick={() => navigate('/')}
          className="text-indigo-600 hover:text-indigo-500 font-medium"
        >
          Go to Home
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl text-center">
      <div className="rounded-2xl bg-white p-10 shadow-xl ring-1 ring-slate-900/5">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-indigo-100 p-4">
            <svg className="h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Exams Submitted!</h1>
        <p className="text-slate-500 mb-8">
          Your answers have been successfully submitted. Here is a summary of your attempt:
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
          <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <dt className="text-sm font-medium text-slate-500">Total Questions</dt>
            <dd className="mt-1 text-2xl font-semibold text-slate-900">{stats.totalCount}</dd>
          </div>
          <div className="rounded-xl bg-green-50 p-4 ring-1 ring-green-200">
            <dt className="text-sm font-medium text-green-600">Answered</dt>
            <dd className="mt-1 text-2xl font-semibold text-green-700">{stats.answeredCount}</dd>
          </div>
          <div className="rounded-xl bg-amber-50 p-4 ring-1 ring-amber-200">
            <dt className="text-sm font-medium text-amber-600">Unanswered</dt>
            <dd className="mt-1 text-2xl font-semibold text-amber-700">{stats.unansweredCount}</dd>
          </div>
        </div>

        <p className="text-sm text-slate-600 mb-8">
          Click <strong>Finish</strong> to verify your account and generate your report.
          <br /> <span className="text-xs text-slate-400">You cannot change your answers anymore.</span>
        </p>

        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-700 ring-1 ring-red-200 text-left">
            {error}
          </div>
        )}

        <button
          onClick={handleFinish}
          disabled={isLoading}
          className="w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? 'Finishing...' : 'Finish & View Results'}
        </button>
      </div>
    </div>
  )
}
