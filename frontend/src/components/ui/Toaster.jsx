import { useEffect } from 'react'
import { useUiStore } from '@/store/uiStore'
import clsx from 'clsx'

function Toast({ toast, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(() => onDismiss(toast.id), 4000)
    return () => clearTimeout(t)
  }, [toast.id, onDismiss])

  return (
    <div
      role="status"
      className={clsx(
        'pointer-events-auto rounded-xl px-4 py-3 text-sm shadow-lg',
        toast.tone === 'error' ? 'bg-terracotta-700 text-ivory' : 'bg-forest-800 text-ivory'
      )}
    >
      {toast.message}
    </div>
  )
}

export function Toaster() {
  const toasts = useUiStore((s) => s.toasts)
  const dismissToast = useUiStore((s) => s.dismissToast)
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onDismiss={dismissToast} />
      ))}
    </div>
  )
}
