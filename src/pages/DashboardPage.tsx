import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDashboardStats, type DashboardStats } from '../services/api'

export default function DashboardPage() {
    const navigate = useNavigate()
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const token = localStorage.getItem('authToken')
        if (!token) {
            navigate('/admin/login')
            return
        }

        getDashboardStats()
            .then(setStats)
            .catch((err) => {
                console.error(err)
                setError('Failed to load dashboard data.')
                if (err.status === 401 || err.status === 403) {
                    localStorage.removeItem('authToken')
                    navigate('/admin/login')
                }
            })
            .finally(() => setLoading(false))
    }, [navigate])

    const handleLogout = () => {
        localStorage.removeItem('authToken')
        navigate('/admin/login')
    }

    if (loading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4">
                <p className="text-red-600">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                >
                    Retry
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <header className="flex items-center justify-between border-b border-slate-200 pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
                    <p className="mt-1 text-slate-500">Overview of system activity and performance.</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Sign Out
                </button>
            </header>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* Total Students Card */}
                <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:shadow-md">
                    <div className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Total Students</p>
                                <p className="text-2xl font-bold text-slate-900">{stats?.totalStudents}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-50 px-6 py-3">
                        <p className="text-xs font-medium text-slate-500">All registered students</p>
                    </div>
                </div>

                {/* Registered Today Card */}
                <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:shadow-md">
                    <div className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">New Today</p>
                                <p className="text-2xl font-bold text-slate-900">{stats?.studentsRegisteredToday}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-50 px-6 py-3">
                        <p className="text-xs font-medium text-slate-500">Registered in last 24h</p>
                    </div>
                </div>

                {/* Exams Completed Card */}
                <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:shadow-md">
                    <div className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Exams Completed</p>
                                <p className="text-2xl font-bold text-slate-900">{stats?.examsCompleted}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-50 px-6 py-3">
                        <p className="text-xs font-medium text-slate-500">Total finished sessions</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
