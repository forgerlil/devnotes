import { create } from 'zustand'
import { AuthStore, User } from '@/types/auth.types'

export const useAuthStore = create<AuthStore>((set) => ({
  token: null,
  user: null,
  setToken: (token: string | null) => set({ token }),
  setUser: (user: User | null) => set({ user }),
}))
