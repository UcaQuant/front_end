import { useLocation, useNavigate } from 'react-router-dom'

export default function ResultPage() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const reportUrl = state?.reportUrl

  if (!reportUrl) {
    // If accessed directly without finishing exam, redirect or show error
    // But maybe user just finished and refreshed? 
    // Ideally we shouldn't rely only on state for critical things if we want refresh safety,
    // but the spec says "Finish Exam" returns URL. We can't get it again easily unless we store it.
    // For now, show message.
    return (
      <div className="flex flex-col items-center justify-center space-y-4 p-10">
        <p className="text-slate-500">No report available.</p>
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
          <div className="rounded-full bg-green-100 p-4">
            <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">Assessment Complete!</h1>
        <p className="text-lg text-slate-600 mb-8">
          Thank you for completing the assessment. Your results are ready.
        </p>

        <a
          href={reportUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-indigo-600 px-3.5 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download Report (PDF)
        </a>

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
