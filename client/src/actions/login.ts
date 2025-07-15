import axios from 'axios'
import { validate } from '@/utils/validate'
import { AuthResponse, LoginResponse } from '@/types/auth.types'
import { useAuthStore } from '@/stores/AuthStore'

export const loginAction = async ({ request }: { request: Request }): Promise<LoginResponse> => {
  try {
    const formData = await request.formData()
    const { email, password } = Object.fromEntries(formData)

    if (typeof email !== 'string' || typeof password !== 'string') {
      return { error: 'Invalid form data', data: null }
    }

    if (!email || !password) {
      return { error: 'Email and password are required', data: null }
    }

    if (!validate('email', email) || !validate('password', password)) {
      return { error: 'Incorrect username or password, please verify and try again', data: null }
    }

    const { headers } = await axios.post('/api/auth/login', {
      email,
      password,
    })

    if (!headers.authorization) throw new Error('Login failed')

    useAuthStore.getState().setToken(headers.authorization as string)

    return { error: null, data: null }
  } catch (error) {
    console.log(error)
    if (axios.isAxiosError(error)) {
      const { message } = error.response?.data as AuthResponse
      return { error: message || 'Login unsuccessful, please try again', data: null }
    }
    return { error: 'Login unsuccessful, please try again', data: null }
  }
}
