import { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { opsApi } from '@/lib/apiClient'
import { Card, Field, Input } from '@/components/ui/primitives'
import { Button } from '@/components/ui/Button'
import { hasPermission, useOpsMe } from '@/hooks/useOpsAuth'
import { useUiStore } from '@/store/uiStore'

export default function SettingsPage() {
  const { data: me } = useOpsMe()
  const canManage = hasPermission(me, 'settings.manage')
  const { data, isLoading } = useQuery({
    queryKey: ['ops-settings'],
    queryFn: async () => (await opsApi.get('/settings/')).data,
  })
  const qc = useQueryClient()
  const pushToast = useUiStore((s) => s.pushToast)
  const [values, setValues] = useState({})

  useEffect(() => {
    if (data) setValues(data)
  }, [data])

  const handleSave = async (key) => {
    await opsApi.patch(`/settings/${key}/`, { value: values[key] })
    qc.invalidateQueries({ queryKey: ['ops-settings'] })
    pushToast(`${key.replace(/_/g, ' ')} updated`)
  }

  if (isLoading) return null

  return (
    <div>
      <h1 className="mb-4 text-2xl font-serif text-forest-800">Store Settings</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {Object.entries(values).map(([key, value]) => (
          <Card key={key} className="p-5">
            <Field label={key.replace(/_/g, ' ')} htmlFor={key}>
              {typeof value === 'object' ? (
                <textarea
                  id={key}
                  className="w-full rounded-lg border border-forest-200 p-2 font-mono text-xs"
                  rows={3}
                  value={JSON.stringify(value)}
                  onChange={(e) => {
                    try {
                      setValues({ ...values, [key]: JSON.parse(e.target.value) })
                    } catch {
                      /* ignore invalid JSON while typing */
                    }
                  }}
                />
              ) : (
                <Input
                  id={key}
                  value={value ?? ''}
                  onChange={(e) => setValues({ ...values, [key]: e.target.value })}
                  disabled={!canManage}
                />
              )}
            </Field>
            {canManage && (
              <Button size="sm" variant="outline" className="mt-3" onClick={() => handleSave(key)}>
                Save
              </Button>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
