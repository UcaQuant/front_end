import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getStudentHistory, type StudentExamHistoryDto } from '../services/api'
import { useExam } from '../context/ExamContext'

export default function StudentDashboardPage() {
    const navigate = useNavigate()
    const { studentId, setStudentId } = useExam()
    const [history, setHistory] = useState<StudentExamHistoryDto[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!studentId) {
            navigate('/login')
            return
        }

        const fetchHistory = async () => {
            try {
                const data = await getStudentHistory(studentId)
                setHistory(data)
            } catch (err: any) {
                setError('Failed to load exam history.')
                console.error(err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchHistory()
    }, [studentId, navigate])

    const handleStartNewExam = () => {
        navigate('/instructions')
    }

    const handleLogout = () => {
        setStudentId(null)
        localStorage.removeItem('studentId')
        localStorage.removeItem('studentName')
        navigate('/login')
    }

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-xl">Loading dashboard...</div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="md:flex md:items-center md:justify-between mb-8">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-slate-900 sm:text-3xl sm:truncate">
                        Student Dashboard
                    </h2>
                </div>
                <div className="mt-4 flex md:mt-0 md:ml-4">
                    <button
                        onClick={handleStartNewExam}
                        type="button"
                        className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Start New Exam
                    </button>
                    <button
                        onClick={handleLogout}
                        type="button"
                        className="ml-3 inline-flex items-center px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {error && (
                <div className="rounded-md bg-red-50 p-4 mb-6">
                    <div className="flex">
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">{error}</h3>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-slate-900">Exam History</h3>
                    <p className="mt-1 max-w-2xl text-sm text-slate-500">Your past assessment results.</p>
                </div>
                <div className="border-t border-slate-200">
                    {history.length === 0 ? (
                        <div className="text-center py-10 text-slate-500">
                            No exams taken yet. Start a new exam to get results!
                        </div>
                    ) : (
                        <ul role="list" className="divide-y divide-slate-200">
                            {history.map((exam, index) => (
                                <li key={index} className="px-4 py-4 sm:px-6 hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <div className="flex items-center">
                                                <p className="text-sm font-medium text-indigo-600 truncate">{exam.examTitle}</p>
                                                <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    {exam.score} / {exam.totalQuestions} Correct
                                                </span>
                                            </div>
                                            <div className="mt-1 text-sm text-slate-500">
                                                Taken on {new Date(exam.date).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <a
                                                href={exam.reportUrl.startsWith('http') ? exam.reportUrl : `http://localhost:8080${exam.reportUrl}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-medium text-indigo-600 hover:text-indigo-500"
                                            >
                                                Download Report
                                            </a>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    )
}
