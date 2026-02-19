import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { adminLogin, ApiError, type AdminLoginRequest } from '../services/api'

type FormValues = {
  username: string
  password: string
}

type ToastState =
  | { type: 'success'; message: string }
  | { type: 'error'; message: string }
  | null

export default function AdminLoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>()

  const [toast, setToast] = useState<ToastState>(null)

  const onSubmit = async (values: FormValues) => {
    setToast(null)
    const payload: AdminLoginRequest = {
      username: values.username.trim(),
      password: values.password,
    }

    try {
      const res = await adminLogin(payload)
      // Store token for admin routes (matches interceptor key)
      localStorage.setItem('authToken', res.token)
      localStorage.setItem('userRole', res.role || 'ADMIN') // Fallback if role is missing
      localStorage.setItem('username', res.username)

      setToast({ type: 'success', message: 'Login successful.' })
      // Redirect to dashboard
      window.location.href = '/admin/dashboard'
    } catch (err) {
      if (err instanceof ApiError) {
        setToast({
          type: 'error',
          message: err.message || 'Invalid credentials. Please try again.',
        })
        return
      }
      setToast({
        type: 'error',
        message: 'Network error: please check your connection and try again.',
      })
    }
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md space-y-6">
        {toast && (
          <div
            className={[
              'rounded-md border px-4 py-3 text-sm',
              toast.type === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                : 'border-rose-200 bg-rose-50 text-rose-800',
            ].join(' ')}
          >
            {toast.message}
          </div>
        )}

        <header className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Admin Login</h1>
          <p className="text-sm text-slate-600">
            Enter your admin credentials to access protected features.
          </p>
        </header>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-800">
              Username
            </label>
            <input
              type="text"
              className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              placeholder="admin"
              {...register('username', {
                required: 'Username is required',
              })}
            />
            {errors.username && (
              <p className="text-xs text-rose-600">{errors.username.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-800">
              Password
            </label>
            <input
              type="password"
              className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              placeholder="••••••••"
              {...register('password', {
                required: 'Password is required',
              })}
            />
            {errors.password && (
              <p className="text-xs text-rose-600">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting && (
              <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
            {isSubmitting ? 'Logging in…' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
