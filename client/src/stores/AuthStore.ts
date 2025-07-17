import { type StateCreator } from 'zustand'
import { create } from 'zustand'
import { AuthStore, User } from '@/types/auth.types'

export const authStoreCreator: StateCreator<AuthStore> = (set) => ({
  token: null,
  user: null,
  setToken: (token: string | null) => set({ token }),
  setUser: (user: User | null) => set({ user }),
})

export const useAuthStore = create<AuthStore>()(authStoreCreator)
