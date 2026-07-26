import { useState } from 'react'
import { useOpsMe, useOpsSessions, useRevokeOtherSessions } from '@/hooks/useOpsAuth'
import { api, extractErrorMessage } from '@/lib/apiClient'
import { Badge, Card, Field, Input } from '@/components/ui/primitives'
import { Button } from '@/components/ui/Button'
import { useUiStore } from '@/store/uiStore'

export default function ProfilePage() {
  const { data: me } = useOpsMe()
  const { data: sessions, isLoading } = useOpsSessions()
  const revokeOthers = useRevokeOtherSessions()
  const pushToast = useUiStore((s) => s.pushToast)

  const [passwords, setPasswords] = useState({ current_password: '', new_password: '' })
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      await api.post('/auth/change-password/', passwords)
      setPasswords({ current_password: '', new_password: '' })
      pushToast('Password changed')
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-serif text-forest-800">Profile & Security</h1>

      <Card className="p-5">
        <h2 className="text-lg text-forest-800">Account</h2>
        <p className="mt-2 text-sm text-earth-700">{me?.user?.email}</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {me?.roles?.map((r) => (
            <Badge key={r} tone="forest">
              {r}
            </Badge>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="text-lg text-forest-800">Change Password</h2>
        <form onSubmit={handleChangePassword} className="mt-3 space-y-3">
          <Field label="Current password" htmlFor="current_password">
            <Input
              id="current_password"
              type="password"
              required
              value={passwords.current_password}
              onChange={(e) => setPasswords({ ...passwords, current_password: e.target.value })}
            />
          </Field>
          <Field label="New password" htmlFor="new_password">
            <Input
              id="new_password"
              type="password"
              required
              minLength={8}
              value={passwords.new_password}
              onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })}
            />
          </Field>
          {error && <p className="text-sm text-terracotta-700">{error}</p>}
          <Button type="submit" loading={saving}>
            Update Password
          </Button>
        </form>
      </Card>

      <Card className="p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg text-forest-800">Active Sessions</h2>
          <Button size="sm" variant="outline" onClick={() => revokeOthers.mutate()} loading={revokeOthers.isPending}>
            Log Out Other Sessions
          </Button>
        </div>
        <ul className="mt-3 divide-y divide-forest-50 text-sm">
          {isLoading ? (
            <p className="py-2 text-earth-500">Loading...</p>
          ) : (
            sessions?.map((s) => (
              <li key={s.id} className="flex justify-between py-2">
                <span>
                  {s.ip_address || 'Unknown IP'} · {s.user_agent?.slice(0, 40)}
                </span>
                <Badge tone={s.is_active ? 'forest' : 'earth'}>{s.is_active ? 'Active' : 'Revoked'}</Badge>
              </li>
            ))
          )}
        </ul>
      </Card>
    </div>
  )
}
