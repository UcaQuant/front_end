import { ApiError, registerStudent, type RegisterStudentRequest } from './api'

export type RegisterStudentResult = {
  studentId: string
}


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


      if (err instanceof ApiError && err.status) {
        break
      }


      if (attempt === maxRetries) {
        break
      }
    }
  }

  throw lastError
}

