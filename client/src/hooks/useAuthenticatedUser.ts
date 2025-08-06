import { useAuthStore } from '@/stores/AuthStore'
import { useNavigate } from 'react-router'

export const useAuthenticatedUser = () => {
  const user = useAuthStore((state) => state.user)
  const isLoggingOut = useAuthStore((state) => state.isLoggingOut)
  const navigate = useNavigate()

  if (!user && !isLoggingOut) {
    void navigate('/login', { replace: true })
  }

  return user
}
