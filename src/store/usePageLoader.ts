import { create } from 'zustand'

interface PageLoaderStore {
  count: number
  push: () => void
  pop: () => void
}

export const usePageLoader = create<PageLoaderStore>((set) => ({
  count: 0,
  push: () => set((s) => ({ count: s.count + 1 })),
  pop: () => set((s) => ({ count: Math.max(0, s.count - 1) })),
}))
