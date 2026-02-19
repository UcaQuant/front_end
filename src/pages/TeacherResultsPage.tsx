import { useEffect, useState } from 'react'
import { getTeacherStudentResults } from '../services/api'
import type { TeacherStudentResultDto } from '../services/api'

export default function TeacherResultsPage() {
    const [results, setResults] = useState<TeacherStudentResultDto[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const data = await getTeacherStudentResults()
                setResults(data)
            } catch (err: any) {
                setError(err.message || 'Failed to fetch results')
            } finally {
                setIsLoading(false)
            }
        }
        fetchResults()
    }, [])

    if (isLoading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="mx-auto max-w-4xl p-6">
                <div className="rounded-xl bg-red-50 p-4 text-red-700 ring-1 ring-red-200">
                    {error}
                </div>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-6xl px-4 py-8">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Student Results</h1>
                    <p className="text-slate-500">View performance across all students and exams</p>
                </div>
            </div>

            <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Student</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Exam</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Score</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Percentage</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Date</th>
                            <th className="px-6 py-3 text-right text-sm font-semibold text-slate-900">Report</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {results.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-10 text-center text-slate-500">
                                    No results found.
                                </td>
                            </tr>
                        ) : (
                            results.map((res) => (
                                <tr key={res.sessionId} className="hover:bg-slate-50 transition">
                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">
                                        {res.studentName}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                                        {res.examTitle}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                                        {res.score} / {res.totalQuestions}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${res.percentage >= 70 ? 'bg-green-100 text-green-700' :
                                            res.percentage >= 40 ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                            {res.percentage.toFixed(1)}%
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                                        {new Date(res.date).toLocaleDateString()}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                                        <a
                                            href={`http://localhost:8080/api/v1/reports/${res.sessionId}/download`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-indigo-600 hover:text-indigo-900 font-medium"
                                        >
                                            Download PDF
                                        </a>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
