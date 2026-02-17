import { Link, Outlet, useLocation } from 'react-router-dom'

const links: Array<{ to: string; label: string }> = [
  { to: '/', label: 'Registration' },
  { to: '/instructions', label: 'Instructions' },
  { to: '/exam', label: 'Exam' },
  { to: '/review', label: 'Review' },
  { to: '/result', label: 'Result' },
  { to: '/admin/login', label: 'Admin Login' },
]

export function AppLayout() {
  const { pathname } = useLocation()

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-baseline gap-3">
            <span className="text-lg font-semibold">
              {import.meta.env.VITE_APP_NAME ?? 'App'}
            </span>
            <span className="text-xs text-slate-500">
              API: {import.meta.env.VITE_API_BASE_URL ?? '(not set)'}
            </span>
          </div>

          <nav className="flex flex-wrap gap-2">
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
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10">
        <Outlet />
      </main>
    </div>
  )
}

