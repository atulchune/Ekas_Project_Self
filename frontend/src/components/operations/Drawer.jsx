import { X } from 'lucide-react'

export function Drawer({ open, title, onClose, children, wide }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[80] flex justify-end">
      <div className="absolute inset-0 bg-earth-900/40" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`relative flex h-full ${wide ? 'w-full max-w-2xl' : 'w-full max-w-md'} flex-col bg-white shadow-xl`}
      >
        <div className="flex items-center justify-between border-b border-forest-100 px-5 py-4">
          <h2 className="text-lg font-semibold text-forest-800">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="rounded-full p-1 hover:bg-forest-50">
            <X className="size-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  )
}
