import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useExam } from '../context/ExamContext'

export default function ExamPage() {
  const navigate = useNavigate()
  const {
    sessionId,
    questions,
    currentPage,
    totalPages,
    timeLeft,
    answers,
    selectOption,
    nextPage,
    prevPage,
    loadQuestions,
    submitExam,
    isLoading,
  } = useExam()

  // Initial load
  useEffect(() => {
    if (!sessionId) {
      navigate('/')
      return
    }
    // Load first page if not loaded? Context handles state?
    // We should trigger loadQuestions(currentPage) if questions are empty?
    if (questions.length === 0) {
      loadQuestions(currentPage)
    }
  }, [sessionId, navigate, questions.length, loadQuestions, currentPage])

  // Timer formatting
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  // Handle Submit
  const handleSubmit = async () => {
    try {
      const stats = await submitExam()
      // Navigate to review page with stats
      navigate('/review', { state: { stats } })
    } catch (error) {
      console.error("Failed to submit exam:", error)
      // Optional: show error to user
    }
  }

  if (isLoading && questions.length === 0) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-slate-600 font-medium">Loading Assessment...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header / Timer */}
      <div className="sticky top-0 z-10 flex items-center justify-between rounded-xl bg-white/95 px-6 py-4 shadow-sm backdrop-blur-sm ring-1 ring-slate-900/5 transition-all">
        <div>
          <span className="text-sm font-medium text-slate-500">Page {currentPage + 1} of {totalPages}</span>
        </div>
        <div className={`flex items-center gap-2 rounded-full px-4 py-1.5 font-mono font-bold ${timeLeft < 300 ? 'bg-red-50 text-red-600 ring-1 ring-red-200' : 'bg-slate-100 text-slate-700'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 opacity-70">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
          </svg>
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {questions.map((q, idx) => (
          <div key={q.id} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 transition-all hover:shadow-md">
            <div className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-bold text-indigo-600">
                {(currentPage * 5) + idx + 1}
              </span>
              <div className="grow space-y-4">
                <p className="text-lg font-medium text-slate-900">{q.content}</p>
                <div className="space-y-3">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = answers.get(q.id) === optIdx
                    return (
                      <label
                        key={optIdx}
                        className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-all ${isSelected
                          ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600'
                          : 'border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                          }`}
                      >
                        <input
                          type="radio"
                          name={`q-${q.id}`}
                          className="h-4 w-4 border-slate-300 text-indigo-600 focus:ring-indigo-600"
                          checked={isSelected}
                          onChange={() => selectOption(q.id, optIdx)}
                        />
                        <span className={`text-base ${isSelected ? 'font-medium text-indigo-900' : 'text-slate-700'}`}>
                          {opt}
                        </span>
                      </label>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between py-6">
        <button
          onClick={prevPage}
          disabled={currentPage === 0 || isLoading}
          className="flex items-center gap-2 rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-slate-400">
            <path fillRule="evenodd" d="M11.78 5.22a.75.75 0 010 1.06L8.06 10l3.72 3.72a.75.75 0 11-1.06 1.06l-4.25-4.25a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 0z" clipRule="evenodd" />
          </svg>
          Previous
        </button>

        {currentPage === totalPages - 1 ? (
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 rounded-md bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all"
          >
            Review & Submit
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
            </svg>
          </button>
        ) : (
          <button
            onClick={nextPage}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-md bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Next
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 010-1.06z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

