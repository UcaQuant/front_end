import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
    addQuestion,
    createExam,
    getExams,
    type CreateExamRequest,
    type ExamDto,
    type QuestionCreationDto,
    type QuestionDto,
} from '../services/api'

export default function ExamManagementPage() {
    const [exams, setExams] = useState<ExamDto[]>([])
    const [selectedExamId, setSelectedExamId] = useState<number | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadExams()
    }, [])

    const loadExams = async () => {
        setLoading(true)
        try {
            const data = await getExams()
            setExams(data)
        } catch (error) {
            console.error('Failed to load exams', error)
            alert('Failed to load exams')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Exam Management</h1>
                <p className="mt-1 text-slate-500">Create exams and manage questions.</p>
            </header>

            <div className="grid gap-8 lg:grid-cols-2">
                <div className="space-y-6">
                    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-slate-900">Create New Exam</h2>
                        <CreateExamForm onSuccess={loadExams} />
                    </section>

                    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-slate-900">Existing Exams</h2>
                        {loading ? (
                            <p>Loading...</p>
                        ) : exams.length === 0 ? (
                            <p className="text-slate-500">No exams found.</p>
                        ) : (
                            <ul className="divide-y divide-slate-100">
                                {exams.map((exam) => (
                                    <li key={exam.id} className="flex items-center justify-between py-3">
                                        <div>
                                            <p className="font-medium text-slate-900">{exam.title}</p>
                                            <p className="text-sm text-slate-500">{exam.timeLimitSeconds}s • {exam.questions?.length || 0} Questions</p>
                                        </div>
                                        <button
                                            onClick={() => setSelectedExamId(exam.id)}
                                            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${selectedExamId === exam.id
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                                }`}
                                        >
                                            Manage
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                </div>

                <div className="space-y-6">
                    {selectedExamId ? (
                        <>
                            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h2 className="mb-4 text-lg font-semibold text-slate-900">
                                    Questions for Exam #{selectedExamId}
                                </h2>
                                {(() => {
                                    const exam = exams.find(e => e.id === selectedExamId)
                                    if (!exam?.questions || exam.questions.length === 0) {
                                        return <p className="text-slate-500">No questions added yet.</p>
                                    }
                                    return (
                                        <ul className="space-y-4">
                                            {exam.questions.map((q) => (
                                                <li key={q.id} className="rounded-lg bg-slate-50 p-4 text-sm">
                                                    <p className="font-medium text-slate-900">{q.content}</p>
                                                    <ul className="mt-2 ml-4 list-disc text-slate-600">
                                                        {q.options.map((opt, i) => (
                                                            <li key={i} className={i === (q.selectedOption || (q as any).correctIndex) ? 'font-bold text-emerald-600' : ''}>
                                                                {opt}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </li>
                                            ))}
                                        </ul>
                                    )
                                })()}
                            </section>

                            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h2 className="mb-4 text-lg font-semibold text-slate-900">
                                    Add Question
                                </h2>
                                <AddQuestionForm examId={selectedExamId} onSuccess={loadExams} />
                            </section>
                        </>
                    ) : (
                        <div className="flex h-full items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-12 text-center text-slate-400">
                            <p>Select an exam to manage questions</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function CreateExamForm({ onSuccess }: { onSuccess: () => void }) {
    const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<CreateExamRequest>()

    const onSubmit = async (data: CreateExamRequest) => {
        try {
            await createExam(data)
            reset()
            onSuccess()
            alert('Exam created successfully')
        } catch (error) {
            console.error(error)
            alert('Failed to create exam')
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700">Title</label>
                <input
                    type="text"
                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                    {...register('title', { required: true })}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700">Time Limit (seconds)</label>
                <input
                    type="number"
                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                    {...register('timeLimitSeconds', { required: true, min: 1 })}
                />
            </div>
            <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
            >
                {isSubmitting ? 'Creating...' : 'Create Exam'}
            </button>
        </form>
    )
}

function AddQuestionForm({ examId, onSuccess }: { examId: number; onSuccess: () => void }) {
    const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<QuestionCreationDto & {
        option0: string, option1: string, option2: string, option3: string
    }>()

    const onSubmit = async (data: any) => {
        const payload: QuestionCreationDto = {
            subject: data.subject,
            content: data.content,
            options: [data.option0, data.option1, data.option2, data.option3],
            correctIndex: parseInt(data.correctIndex),
        }

        try {
            await addQuestion(examId, payload)
            reset()
            onSuccess()
            alert('Question added successfully')
        } catch (error) {
            console.error(error)
            alert('Failed to add question')
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700">Subject</label>
                <select
                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                    {...register('subject', { required: true })}
                >
                    <option value="MATH">Math</option>
                    <option value="ENGLISH">English</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700">Question Content</label>
                <textarea
                    rows={3}
                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                    {...register('content', { required: true })}
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                {[0, 1, 2, 3].map((i) => (
                    <div key={i}>
                        <label className="block text-xs font-medium text-slate-500">Option {i + 1}</label>
                        <input
                            type="text"
                            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                            {...register(`option${i}` as any, { required: true })}
                        />
                    </div>
                ))}
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700">Correct Option Index (0-3)</label>
                <select
                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                    {...register('correctIndex', { required: true })}
                >
                    <option value="0">Option 1</option>
                    <option value="1">Option 2</option>
                    <option value="2">Option 3</option>
                    <option value="3">Option 4</option>
                </select>
            </div>
            <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
            >
                {isSubmitting ? 'Adding...' : 'Add Question'}
            </button>
        </form>
    )
}
