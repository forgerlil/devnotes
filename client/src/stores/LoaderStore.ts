import { type StateCreator } from 'zustand'
import { create } from 'zustand'
import { LoaderStore } from '@/types/auth.types'

export const loaderStoreCreator: StateCreator<LoaderStore> = (set) => ({
  loadingProgress: 0,
  setLoadingProgress: (progress: number) => set({ loadingProgress: progress }),
})

export const useLoaderStore = create<LoaderStore>()(loaderStoreCreator)
