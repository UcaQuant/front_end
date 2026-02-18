import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { AppLayout } from './components/AppLayout'
import { ExamLayout } from './components/ExamLayout'
import AdminLoginPage from './pages/AdminLoginPage'
import ExamPage from './pages/ExamPage'
import InstructionsPage from './pages/InstructionsPage'
import NotFoundPage from './pages/NotFoundPage'
import RegistrationPage from './pages/public/RegistrationPage'
import ResultPage from './pages/ResultPage'
import ReviewPage from './pages/ReviewPage'

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <AppLayout />,
      children: [
        { index: true, element: <RegistrationPage /> },
        { path: 'admin/login', element: <AdminLoginPage /> },
        {
          element: <ExamLayout />,
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
