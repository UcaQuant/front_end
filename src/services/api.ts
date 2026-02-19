import axios, { AxiosError, type AxiosInstance } from 'axios'

/**
 * Centralized API client for the app.
 *
 * Base URL is configured via Vite env:
 * - VITE_API_BASE_URL=http://localhost:8080/api/v1
 */

export type ApiErrorPayload = {
  message?: string
  error?: string
  code?: string
  details?: unknown
}

export class ApiError extends Error {
  readonly status?: number
  readonly code?: string
  readonly details?: unknown

  constructor(message: string, opts?: { status?: number; code?: string; details?: unknown }) {
    super(message)
    this.name = 'ApiError'
    this.status = opts?.status
    this.code = opts?.code
    this.details = opts?.details
  }
}

function isAdminRequest(url?: string) {
  if (!url) return false

  // Axios config.url is typically a relative path like "/admin/..."
  // We attach tokens ONLY for admin endpoints except login.
  const normalized = url.startsWith('http') ? new URL(url).pathname : url
  return normalized.startsWith('/manager') || normalized.startsWith('/teacher') || (normalized.startsWith('/admin') && normalized !== '/admin/login')
}

function getAuthToken() {
  return localStorage.getItem('authToken')
}

function toApiError(err: unknown): ApiError {
  if (err instanceof ApiError) return err

  const fallback = new ApiError('Unexpected error')
  if (!axios.isAxiosError(err)) return fallback

  const axiosErr = err as AxiosError<ApiErrorPayload>

  if (axiosErr.response) {
    const status = axiosErr.response.status
    const data = axiosErr.response.data
    const message =
      data?.message ||
      data?.error ||
      axiosErr.message ||
      `Request failed with status ${status}`
    return new ApiError(message, { status, code: data?.code, details: data?.details })
  }

  if (axiosErr.request) {
    return new ApiError('Network error: failed to reach the server')
  }

  return new ApiError(axiosErr.message || 'Request failed')
}

export const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  if (isAdminRequest(config.url)) {
    const token = getAuthToken()
    if (token) {
      config.headers = config.headers ?? {}
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(toApiError(error)),
)

// -----------------------------
// Backend-aligned API methods
// -----------------------------

// --- Student Registration ---
export type RegisterStudentRequest = {
  firstName: string
  lastName: string
  mobileNumber: string
}

export type RegisterStudentResponse = {
  success: boolean
  data: {
    studentId: string
    nextAction: string
  }
}

export async function registerStudent(body: RegisterStudentRequest) {
  const res = await api.post<RegisterStudentResponse>('/students', body)
  return res.data
}

// --- Exam Flow ---
export type StartExamRequest = { studentId: string }
export type StartExamResponse = {
  sessionId: string
  durationSeconds: number
  startTime: string
}

export async function startExam(studentId: string, examId: number) {
  const res = await api.post<StartExamResponse>(`/exams/start?studentId=${studentId}&examId=${examId}`)
  return res.data
}

export type QuestionDto = {
  id: number
  content: string
  options: string[]
  selectedOption: number | null
}

export type GetQuestionsResponse = {
  questions: QuestionDto[]
  totalPages: number
  currentPage: number
  isLastPage: boolean
}

export async function getQuestions(sessionId: string, page = 0, size = 5) {
  const res = await api.get<GetQuestionsResponse>(`/exams/${sessionId}/questions`, {
    params: { page, size },
  })
  return res.data
}

export type SubmitAnswerDto = {
  questionId: number
  selectedOptionIndex: number
}

export async function submitAnswers(sessionId: string, answers: SubmitAnswerDto[]) {
  const res = await api.put(`/exams/${sessionId}/answers`, answers)
  return res.data
}

export type SubmitExamResponse = {
  answeredCount: number
  totalCount: number
  unansweredCount: number
}

export async function submitExam(sessionId: string) {
  const res = await api.post<SubmitExamResponse>(`/exams/${sessionId}/submit`)
  return res.data
}

export type FinishExamResponse = {
  downloadUrl: string
}

export async function finishExam(sessionId: string) {
  const res = await api.post<FinishExamResponse>(`/exams/${sessionId}/finish`)
  return res.data
}

export function getReportUrl(sessionId: string) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1'
  return `${baseUrl}/reports/${sessionId}/download`
}

// --- Admin/Auth ---

export type AdminLoginRequest = { username: string; password: string }
export type AdminLoginResponse = {
  token: string
  role: string
  username: string
}

export async function adminLogin(body: AdminLoginRequest) {
  const res = await api.post<AdminLoginResponse>('/auth/login', body)
  return res.data
}

export type DashboardStats = {
  totalStudents: number
  studentsRegisteredToday: number
  examsCompleted: number
}

// --- Exam Management (Teacher/Admin) ---

export type ExamDto = {
  id: number
  title: string
  timeLimitSeconds: number
  questions: QuestionDto[]
}

export type CreateExamRequest = {
  title: string
  timeLimitSeconds: number
}

export type QuestionCreationDto = {
  subject: 'MATH' | 'ENGLISH'
  content: string
  options: string[]
  correctIndex: number
}

export type StudentExamDto = {
  id: number
  title: string
  timeLimitSeconds: number
}

export async function getExams() {
  const res = await api.get<ExamDto[]>('/teacher/exams')
  return res.data
}

export async function getStudentExams() {
  const res = await api.get<StudentExamDto[]>('/exams')
  return res.data
}

export async function createExam(body: CreateExamRequest) {
  const res = await api.post<ExamDto>('/teacher/exams', body)
  return res.data
}

export async function addQuestion(examId: number, body: QuestionCreationDto) {
  const res = await api.post<QuestionDto>(`/teacher/exams/${examId}/questions`, body)
  return res.data
}


export type ExamResult = {
  mathCorrect: number
  mathTotal: number
  mathPercentage: number
  englishCorrect: number
  englishTotal: number
  englishPercentage: number
  totalCorrect: number
  totalQuestions: number
  totalPercentage: number
  completedAt: string
}

export async function getExamResult(sessionId: string) {
  const res = await api.get<ExamResult>(`/exams/${sessionId}/result`)
  return res.data
}

export async function getDashboardStats() {
  // Endpoint: /api/v1/manager/dashboard-stats
  const res = await api.get<DashboardStats>('/manager/dashboard-stats')
  return res.data
}

