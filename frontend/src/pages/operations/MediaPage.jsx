import { useState } from 'react'
import { opsMedia } from '@/hooks/opsResources'
import { Card } from '@/components/ui/primitives'
import { Button } from '@/components/ui/Button'
import { hasPermission, useOpsMe } from '@/hooks/useOpsAuth'
import { useUiStore } from '@/store/uiStore'
import { extractErrorMessage } from '@/lib/apiClient'

export default function MediaPage() {
  const { data: me } = useOpsMe()
  const canManage = hasPermission(me, 'media.manage')
  const { data, isLoading } = opsMedia.useList({ page_size: 60 })
  const createMedia = opsMedia.useCreate()
  const deleteMedia = opsMedia.useDelete()
  const pushToast = useUiStore((s) => s.pushToast)
  const [altText, setAltText] = useState('')

  const handleUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)
    formData.append('asset_type', file.type.startsWith('video') ? 'video' : 'image')
    formData.append('alt_text', altText)
    createMedia.mutate(formData, {
      onSuccess: () => {
        pushToast('Media uploaded')
        setAltText('')
      },
      onError: (err) => pushToast(extractErrorMessage(err), 'error'),
    })
    e.target.value = ''
  }

  const handleDelete = (item) => {
    deleteMedia.mutate(item.id, { onError: (err) => pushToast(extractErrorMessage(err, 'Cannot delete: media in use'), 'error') })
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-serif text-forest-800">Media Library</h1>

      {canManage && (
        <Card className="mb-6 p-5">
          <label className="block text-sm font-medium text-earth-900">Alt text (for accessibility)</label>
          <input
            className="mt-1 w-full max-w-md rounded-lg border border-forest-200 px-3 py-2 text-sm"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            placeholder="Describe this image"
          />
          <div className="mt-3">
            <input type="file" accept="image/*,video/*" onChange={handleUpload} />
          </div>
        </Card>
      )}

      {isLoading ? (
        <p className="text-earth-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-6">
          {data?.results?.map((item) => (
            <div key={item.id} className="group relative overflow-hidden rounded-xl border border-forest-100">
              {item.asset_type === 'video' ? (
                <video src={item.file} className="aspect-square w-full object-cover" muted />
              ) : (
                <img src={item.file} alt={item.alt_text} className="aspect-square w-full object-cover" />
              )}
              {canManage && (
                <button
                  className="absolute right-1 top-1 rounded-full bg-white/90 px-2 py-1 text-xs text-terracotta-700 opacity-0 group-hover:opacity-100"
                  onClick={() => handleDelete(item)}
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      {!isLoading && data?.results?.length === 0 && <p className="text-earth-500">No media uploaded yet.</p>}
    </div>
  )
}
