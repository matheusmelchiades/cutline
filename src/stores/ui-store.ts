import { create } from 'zustand'

interface UIStore {
  selectedSurferId: string | null
  setSelectedSurferId: (id: string | null) => void
}

export const useUIStore = create<UIStore>()((set) => ({
  selectedSurferId: null,
  setSelectedSurferId: (id) => set({ selectedSurferId: id }),
}))
