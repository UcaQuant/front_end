import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { registerStudent, type RegisterStudentRequest } from '../services/api'

export default function RegistrationPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterStudentRequest>()

  const onSubmit = async (data: RegisterStudentRequest) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await registerStudent(data)
      if (response && response.data && response.data.studentId) {
        localStorage.setItem('studentId', response.data.studentId)
        // Also save name for welcome message?
        localStorage.setItem('studentName', `${data.firstName} ${data.lastName}`)
        navigate('/instructions')
      } else {
        setError('Registration failed: Invalid response from server.')
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-xl ring-1 ring-slate-900/5 transition-all hover:shadow-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Welcome
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Please register to start your assessment.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 ring-1 ring-red-200">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-slate-700">
                First Name
              </label>
              <div className="mt-1">
                <input
                  id="firstName"
                  type="text"
                  autoComplete="given-name"
                  {...register('firstName', { required: 'First name is required' })}
                  className="block w-full rounded-md border-0 py-2.5 px-3.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all"
                  placeholder="Jane"
                />
                {errors.firstName && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-slate-700">
                Last Name
              </label>
              <div className="mt-1">
                <input
                  id="lastName"
                  type="text"
                  autoComplete="family-name"
                  {...register('lastName', { required: 'Last name is required' })}
                  className="block w-full rounded-md border-0 py-2.5 px-3.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all"
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="mobileNumber" className="block text-sm font-medium text-slate-700">
                Mobile Number
              </label>
              <div className="mt-1">
                <input
                  id="mobileNumber"
                  type="tel"
                  autoComplete="tel"
                  {...register('mobileNumber', {
                    required: 'Mobile number is required',
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: 'Mobile number must be 10 digits',
                    },
                  })}
                  className="block w-full rounded-md border-0 py-2.5 px-3.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all"
                  placeholder="1234567890"
                />
                {errors.mobileNumber && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.mobileNumber.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registering...
                </span>
              ) : (
                'Start Assessment'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

