import { useAuthStore } from '@/stores/AuthStore'

export const useAuthenticatedUser = () => {
  const user = useAuthStore((state) => state.user)

  if (!user) throw new Error('User not authenticated')

  return user
}
