import axios from 'axios'
import { validate } from '@/utils/validate'
import { AuthResponse, LoginResponse } from '@/types/auth.types'
import { useAuthStore } from '@/stores/AuthStore'

export const registerAction = async ({ request }: { request: Request }): Promise<LoginResponse> => {
  try {
    const formData = await request.formData()
    const { email, password, confirmPassword } = Object.fromEntries(formData)

    if (
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      typeof confirmPassword !== 'string'
    ) {
      return { error: 'Invalid form data', data: null }
    }

    if (!email || !password || !confirmPassword) {
      return { error: 'All fields are required', data: null }
    }

    if (
      !validate('email', email) ||
      !validate('password', password) ||
      !validate('password', confirmPassword) ||
      !validate('compare', confirmPassword, password)
    ) {
      return { error: 'Invalid form data - please verify form requirements', data: null }
    }

    const { headers } = await axios.post('/api/auth/signup', {
      email,
      password,
      confirmPassword,
    })

    if (!headers.authorization) throw new Error('Registration failed')

    useAuthStore.getState().setToken(headers.authorization as string)

    return { error: null, data: null }
  } catch (error) {
    console.log(error)
    if (axios.isAxiosError(error)) {
      const { message } = error.response?.data as AuthResponse
      return { error: message || 'Registration unsuccessful, please try again', data: null }
    }
    return { error: 'Registration unsuccessful, please try again', data: null }
  }
}
