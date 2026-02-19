import { Navigate, useLocation } from 'react-router-dom'
import { useExam } from '../context/ExamContext'

type ProtectedRouteProps = {
    children: JSX.Element
    role?: 'student' | 'admin' | 'teacher'
}

export function ProtectedRoute({ children, role }: ProtectedRouteProps) {
    const location = useLocation()
    const { studentId } = useExam()
    const authToken = localStorage.getItem('authToken')
    const userRole = localStorage.getItem('userRole') // e.g. 'ADMIN', 'TEACHER'

    if (role === 'student') {
        if (!studentId) {
            // Redirect to registration if not registered
            return <Navigate to="/" state={{ from: location }} replace />
        }
    } else if (role === 'admin') {
        if (!authToken || userRole !== 'ADMIN') {
            return <Navigate to="/admin/login" state={{ from: location }} replace />
        }
    } else if (role === 'teacher') {
        if (!authToken || userRole !== 'TEACHER') {
            return <Navigate to="/teacher/login" state={{ from: location }} replace />
        }
    }

    return children
}
