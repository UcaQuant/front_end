import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { ApiError, type RegisterStudentRequest } from '../../services/api'
import { registerStudentWithRetry } from '../../services/studentService'

type FormValues = {
  firstName: string
  lastName: string
  mobile: string
}

type ToastState =
  | { type: 'success'; message: string }
  | { type: 'error'; message: string }
  | null

export default function RegistrationPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>()

  const [toast, setToast] = useState<ToastState>(null)
  const navigate = useNavigate()

  const onSubmit = async (values: FormValues) => {
    setToast(null)
    const payload: RegisterStudentRequest = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      // You can extend this later with grade/school
    }

    try {
      const result = await registerStudentWithRetry(payload)
      // Store student id for later steps (e.g. starting exam)
      localStorage.setItem('studentId', result.studentId)
      setToast({ type: 'success', message: 'Registration successful! Redirecting…' })
      reset({ firstName: '', lastName: '', mobile: '' })
      // Short delay so the user can see the toast before navigation
      setTimeout(() => navigate('/instructions'), 600)
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 409) {
          setToast({
            type: 'error',
            message: 'You are already registered. Please proceed to the instructions.',
          })
          return
        }
        setToast({
          type: 'error',
          message: err.message || 'Failed to register. Please try again.',
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
      <div className="w-full max-w-xl space-y-6">
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
          <h1 className="text-2xl font-bold tracking-tight">Student Registration</h1>
          <p className="text-sm text-slate-600">
            Enter your details to register for the 9th Grade Assessment Platform.
          </p>
        </header>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-800">
                First Name
              </label>
              <input
                type="text"
                className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                placeholder="e.g. Ali"
                {...register('firstName', {
                  required: 'First name is required',
                  minLength: {
                    value: 2,
                    message: 'First name must be at least 2 characters',
                  },
                  maxLength: {
                    value: 50,
                    message: 'First name must be at most 50 characters',
                  },
                  pattern: {
                    value: /^[A-Za-z]+$/,
                    message: 'First name should contain letters only',
                  },
                })}
              />
              {errors.firstName && (
                <p className="text-xs text-rose-600">{errors.firstName.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-800">
                Last Name
              </label>
              <input
                type="text"
                className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                placeholder="e.g. Khan"
                {...register('lastName', {
                  required: 'Last name is required',
                  minLength: {
                    value: 2,
                    message: 'Last name must be at least 2 characters',
                  },
                  maxLength: {
                    value: 50,
                    message: 'Last name must be at most 50 characters',
                  },
                  pattern: {
                    value: /^[A-Za-z]+$/,
                    message: 'Last name should contain letters only',
                  },
                })}
              />
              {errors.lastName && (
                <p className="text-xs text-rose-600">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-800">
              Mobile Number
            </label>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              placeholder="10-digit mobile number"
              {...register('mobile', {
                required: 'Mobile number is required',
                pattern: {
                  value: /^\d{10}$/,
                  message: 'Mobile number must be exactly 10 digits',
                },
              })}
            />
            {errors.mobile && (
              <p className="text-xs text-rose-600">{errors.mobile.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting && (
              <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
            {isSubmitting ? 'Submitting...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  )
}

