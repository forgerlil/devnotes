import { redirect } from 'react-router'
import axios, { AxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/stores/AuthStore'
import type { User } from '@/types/auth.types'
import { toastError } from '@/lib/toastify'
import { useLoaderStore } from '@/stores/LoaderStore'

export const authRedirection = async () => {
  const { token, user, setToken, setUser } = useAuthStore.getState()
  const { setLoadingProgress } = useLoaderStore.getState()
  if (user) {
    setLoadingProgress(100)
    return redirect('/notes/1')
  }

  try {
    const options: Partial<AxiosRequestConfig> = {
      headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' },
    }

    if (token) options.headers!.authorization = token

    const res = await axios<User>('/api/auth/me', options)

    setLoadingProgress(30)

    if (res.headers.authorization && typeof res.headers.authorization === 'string') {
      const accessToken = res.headers.authorization.split(' ')[1]
      setLoadingProgress(60)
      setToken(accessToken)
      setUser(res.data)
      setLoadingProgress(100)

      return redirect('/notes/1')
    } else {
      return redirect('/login')
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status !== 401) {
        toastError((error.response?.data as { message: string })?.message || 'An error occurred')
      }
    }
  }
}
