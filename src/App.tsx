import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { AppLayout } from './components/AppLayout'
import { ExamLayout } from './components/ExamLayout'
import { ProtectedRoute } from './components/ProtectedRoute'
import AdminLoginPage from './pages/AdminLoginPage'
import DashboardPage from './pages/DashboardPage'
import ExamManagementPage from './pages/ExamManagementPage'
import ExamPage from './pages/ExamPage'
import InstructionsPage from './pages/InstructionsPage'
import TeacherLoginPage from './pages/TeacherLoginPage'
import NotFoundPage from './pages/NotFoundPage'
import RegistrationPage from './pages/RegistrationPage'
import ResultPage from './pages/ResultPage'
import ReviewPage from './pages/ReviewPage'

import { ExamProvider } from './context/ExamContext'

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <ExamProvider>
          <AppLayout />
        </ExamProvider>
      ),
      children: [
        { index: true, element: <RegistrationPage /> },
        { path: 'admin/login', element: <AdminLoginPage /> },
        {
          path: 'admin/dashboard',
          element: (
            <ProtectedRoute role="admin">
              <DashboardPage />
            </ProtectedRoute>
          )
        },
        {
          path: 'teacher/exams',
          element: (
            <ProtectedRoute role="teacher">
              <ExamManagementPage />
            </ProtectedRoute>
          )
        },
        { path: 'teacher/login', element: <TeacherLoginPage /> },
        {
          element: (
            <ProtectedRoute role="student">
              <ExamLayout />
            </ProtectedRoute>
          ),
          children: [
            { path: 'instructions', element: <InstructionsPage /> },
            { path: 'exam', element: <ExamPage /> },
            { path: 'review', element: <ReviewPage /> },
            { path: 'result', element: <ResultPage /> },
          ],
        },
        { path: '*', element: <NotFoundPage /> },
      ],
    },
  ])

  return <RouterProvider router={router} />
}

export default App
