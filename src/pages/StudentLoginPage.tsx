import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { studentLogin, type StudentLoginRequest } from '../services/api'
import { useExam } from '../context/ExamContext'

export default function StudentLoginPage() {
    const navigate = useNavigate()
    const { studentId, setStudentId } = useExam()
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (studentId) {
            navigate('/dashboard')
        }
    }, [studentId, navigate])

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<StudentLoginRequest>()

    const onSubmit = async (data: StudentLoginRequest) => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await studentLogin(data)
            if (response && response.data && response.data.studentId) {
                setStudentId(response.data.studentId)
                // Explicitly set authenticated state if needed, but context handles it mostly via studentId
                localStorage.setItem('studentId', response.data.studentId)
                navigate('/dashboard')
            } else {
                setError('Login failed: Invalid response from server.')
            }
        } catch (err: any) {
            setError(err.message || 'Login failed. Please check your credentials.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-[80vh] items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-xl ring-1 ring-slate-900/5 transition-all hover:shadow-2xl">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                        Student Login
                    </h2>
                    <p className="mt-2 text-sm text-slate-600">
                        Sign in to view your history and take exams.
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
                                            value: /^\d{10}$/,
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

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    type="password"
                                    autoComplete="current-password"
                                    {...register('password', { required: 'Password is required' })}
                                    className="block w-full rounded-md border-0 py-2.5 px-3.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all"
                                    placeholder="******"
                                />
                                {errors.password && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.password.message}
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
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </div>
                    <div className="text-center text-sm">
                        <a href="/" className="font-semibold text-indigo-600 hover:text-indigo-500">
                            Need to register? Click here
                        </a>
                    </div>
                </form>
            </div>
        </div>
    )
}
