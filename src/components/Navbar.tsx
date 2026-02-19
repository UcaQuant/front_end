import { Link, useLocation } from 'react-router-dom'
import { useExam } from '../context/ExamContext'

export function Navbar() {
    const { pathname } = useLocation()
    const { studentId, sessionId } = useExam()

    const authToken = localStorage.getItem('authToken')
    const userRole = localStorage.getItem('userRole')

    const isAdmin = authToken && userRole === 'ADMIN'
    const isTeacher = authToken && userRole === 'TEACHER'

    const links: { to: string; label: string }[] = []

    // Student Links
    if (studentId) {
        links.push({ to: '/dashboard', label: 'Dashboard' })
        if (sessionId) {
            // In active exam session
            links.push({ to: '/exam', label: 'Exam' })
        } else if (pathname === '/result') {
            // Exam finished
            links.push({ to: '/result', label: 'Result' })
        } else {
            links.push({ to: '/instructions', label: 'Instructions' })
        }
    } else {
        // Not registered as student
        if (!isAdmin && !isTeacher) {
            links.push({ to: '/', label: 'Register' })
            links.push({ to: '/login', label: 'Student Login' })
        }
    }

    // Admin/Teacher Links
    if (isAdmin) {
        links.push({ to: '/admin/dashboard', label: 'Admin Dashboard' })
    }
    if (isTeacher) {
        links.push({ to: '/teacher/exams', label: 'My Exams' })
        links.push({ to: '/teacher/results', label: 'Student Results' })
    }

    if (!isAdmin && !isTeacher && !studentId) {
        links.push({ to: '/admin/login', label: 'Admin Login' })
        links.push({ to: '/teacher/login', label: 'Teacher Login' })
    }

    const handleLogout = () => {
        // Clear all storage
        localStorage.clear()
        // Force reload to reset state
        window.location.href = '/'
    }

    return (
        <div className="mx-auto max-w-5xl px-4 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-baseline gap-3">
                <Link
                    to={studentId ? '/dashboard' : isAdmin ? '/admin/dashboard' : isTeacher ? '/teacher/exams' : '/'}
                    className="text-lg font-semibold hover:text-indigo-600 transition"
                >
                    Assessment Platform
                </Link>
            </div>

            <nav className="flex flex-wrap gap-2 items-center">
                {links.map((l) => {
                    const active = pathname === l.to
                    return (
                        <Link
                            key={l.to}
                            to={l.to}
                            className={[
                                'rounded-md px-3 py-1.5 text-sm font-medium transition',
                                active
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-slate-100 text-slate-800 hover:bg-slate-200',
                            ].join(' ')}
                        >
                            {l.label}
                        </Link>
                    )
                })}

                {(studentId || isAdmin || isTeacher) && (
                    <button
                        onClick={handleLogout}
                        className="ml-2 rounded-md px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition"
                    >
                        Exit
                    </button>
                )}
            </nav>
        </div>
    )
}
