import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getExamResult, type ExamResult } from '../services/api'
import { useExam } from '../context/ExamContext'

export default function ResultPage() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { sessionId } = useExam()
  const [result, setResult] = useState<ExamResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reportUrl = state?.reportUrl
  // Ideally we use the sessionId from context, or if missing (refresh), maybe URL param?
  // For now rely on context or pass it in state. 
  // If context is lost on refresh, user might need to click "Finish" again or we persist sessionId.
  // Implementation Plan said: "Fetch and display results using GET /api/v1/exams/{sessionId}/result"

  const effectiveSessionId = sessionId || state?.sessionId

  useEffect(() => {
    if (!effectiveSessionId) {
      // weak fallback to just showing reportUrl if available, else error
      setLoading(false)
      return
    }

    getExamResult(effectiveSessionId)
      .then(setResult)
      .catch(err => {
        console.error("Failed to fetch result", err)
        setError("Could not load detailed results.")
      })
      .finally(() => setLoading(false))
  }, [effectiveSessionId])

  if (loading) return <div className="p-10 text-center">Loading results...</div>

  if (!result && !reportUrl) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 p-10">
        <p className="text-slate-500">No result details available.</p>
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
    <div className="mx-auto max-w-3xl space-y-8 p-6">
      <div className="rounded-2xl bg-white p-10 shadow-xl ring-1 ring-slate-900/5 text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-green-100 p-4">
            <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Assessment Complete!</h1>
        <p className="text-lg text-slate-600 mb-8">
          Here is your performance summary.
        </p>

        {result && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-left">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-2">Total Score</h3>
              <div className="text-3xl font-bold text-indigo-600">{Math.round(result.totalPercentage)}%</div>
              <div className="text-sm text-slate-500">{result.totalCorrect} / {result.totalQuestions} correct</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-2">Math</h3>
              <div className="text-2xl font-bold text-slate-700">{Math.round(result.mathPercentage)}%</div>
              <div className="text-sm text-slate-500">{result.mathCorrect} / {result.mathTotal} correct</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-2">English</h3>
              <div className="text-2xl font-bold text-slate-700">{Math.round(result.englishPercentage)}%</div>
              <div className="text-sm text-slate-500">{result.englishCorrect} / {result.englishTotal} correct</div>
            </div>
          </div>
        )}

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {reportUrl && (
          <a
            href={reportUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-indigo-600 px-3.5 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all mb-4"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download Full Report (PDF)
          </a>
        )}

        <button
          onClick={() => navigate('/')}
          className="mt-6 text-sm text-slate-500 hover:text-slate-800"
        >
          Back to Home
        </button>
      </div>
    </div>
  )
}

