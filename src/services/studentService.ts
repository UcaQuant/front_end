import { ApiError, registerStudent, type RegisterStudentRequest } from './api'

export type RegisterStudentResult = {
  studentId: string
}

/**
 * Register a student with simple retry logic for transient network issues.
 */
export async function registerStudentWithRetry(
  payload: RegisterStudentRequest,
  maxRetries = 2,
): Promise<RegisterStudentResult> {
  let lastError: unknown

  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    try {
      const res = await registerStudent(payload)
      return { studentId: res.studentId }
    } catch (err) {
      lastError = err

      // For ApiError, only retry when there's no HTTP status (likely network error)
      if (err instanceof ApiError && err.status) {
        break
      }

      // If this was the final attempt, break and rethrow below.
      if (attempt === maxRetries) {
        break
      }
    }
  }

  throw lastError
}

