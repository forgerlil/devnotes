import { redirect } from 'react-router'
import axios, { AxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/stores/AuthStore'
import type { User } from '@/types/auth.types'

export const authwall = async () => {
  const { token, user } = useAuthStore.getState()
  if (user) return

  try {
    const options: Partial<AxiosRequestConfig> = {
      headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' },
    }

    if (token) options.headers!.authorization = token

    const res = await axios<User>('/api/auth/me', options)

    if (res.headers.authorization && typeof res.headers.authorization === 'string') {
      const accessToken = res.headers.authorization.split(' ')[1]
      useAuthStore.getState().setToken(accessToken)
    }

    useAuthStore.getState().setUser(res.data)
  } catch (error) {
    console.error(error)
    return redirect('/login')
  }
}
