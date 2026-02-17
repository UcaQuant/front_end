import { Link, useLocation } from 'react-router-dom'

export default function NotFoundPage() {
  const location = useLocation()

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">404 - Page not found</h1>
      <p className="text-slate-600">
        No route matches <code className="font-mono">{location.pathname}</code>.
      </p>
      <Link
        to="/"
        className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-white font-medium hover:bg-indigo-700 active:bg-indigo-800 transition"
      >
        Go to Registration
      </Link>
    </section>
  )
}

