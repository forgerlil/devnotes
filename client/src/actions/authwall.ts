import { useAuthStore } from '@/stores/AuthStore'
import { redirect } from 'react-router'
import type { LoaderFunctionArgs } from 'react-router'

export const authwall = ({ request }: LoaderFunctionArgs) => {
  const { token } = useAuthStore.getState()
  if (!token) {
    return redirect('/login')
  }
}
