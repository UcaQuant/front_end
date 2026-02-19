import axios, { AxiosError, type AxiosInstance } from 'axios'



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


  const normalized = url.startsWith('http') ? new URL(url).pathname : url
  return normalized.startsWith('/admin') && normalized !== '/admin/login'
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
  baseURL: import.meta.env.VITE_API_BASE_URL,
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



export type RegisterStudentRequest = {
  firstName: string
  lastName: string
  grade?: number
  school?: string
}

export type RegisterStudentResponse = {
  studentId: string
}

export async function registerStudent(body: RegisterStudentRequest) {
  const res = await api.post<RegisterStudentResponse>('/students/register', body)
  return res.data
}

export type StartExamRequest = { studentId: string }
export type StartExamResponse = { attemptId: string; startedAt: string }

export async function startExam(body: StartExamRequest) {
  const res = await api.post<StartExamResponse>('/exam/start', body)
  return res.data
}

export type SubmitExamRequest = { attemptId: string }
export type SubmitExamResponse = { attemptId: string; submittedAt: string }

export async function submitExam(body: SubmitExamRequest) {
  const res = await api.post<SubmitExamResponse>('/exam/submit', body)
  return res.data
}

export type GetResultResponse = {
  attemptId: string
  score: number
  maxScore: number
}

export async function getResult(attemptId: string) {
  const res = await api.get<GetResultResponse>(`/result/${encodeURIComponent(attemptId)}`)
  return res.data
}

export type AdminLoginRequest = { username: string; password: string }
export type AdminLoginResponse = { token: string }

export async function adminLogin(body: AdminLoginRequest) {

  const res = await api.post<AdminLoginResponse>('/admin/login', body)
  return res.data
}

