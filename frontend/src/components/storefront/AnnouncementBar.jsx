import { useState } from 'react'
import { useHomepageContent } from '@/hooks/useContent'

export function AnnouncementBar() {
  const { data } = useHomepageContent()
  const [dismissed, setDismissed] = useState(false)
  const announcements = data?.announcements ?? []

  if (dismissed || announcements.length === 0) return null

  return (
    <div className="relative bg-forest-800 px-4 py-2 text-center text-sm text-ivory">
      <span>{announcements[0].message}</span>
      {announcements[0].link_url && (
        <a href={announcements[0].link_url} className="ml-2 underline underline-offset-2">
          {announcements[0].link_label || 'Learn more'}
        </a>
      )}
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss announcement"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-ivory/70 hover:text-ivory"
      >
        ✕
      </button>
    </div>
  )
}
