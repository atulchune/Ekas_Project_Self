import { create } from 'zustand'

let toastId = 0

export const useUiStore = create((set) => ({
  mobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),

  toasts: [],
  pushToast: (message, tone = 'default') =>
    set((state) => ({ toasts: [...state.toasts, { id: ++toastId, message, tone }] })),
  dismissToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

  stickyBuyBar: null,
  setStickyBuyBar: (content) => set({ stickyBuyBar: content }),
}))
