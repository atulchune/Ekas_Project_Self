import { useEffect, useState } from 'react'
import { useMe } from '@/hooks/useAuth'
import { useQueryClient } from '@tanstack/react-query'
import { api, extractErrorMessage } from '@/lib/apiClient'
import { Card, Field, Input } from '@/components/ui/primitives'
import { Button } from '@/components/ui/Button'
import { useUiStore } from '@/store/uiStore'

export default function ProfileSettings() {
  const { data: me } = useMe()
  const qc = useQueryClient()
  const pushToast = useUiStore((s) => s.pushToast)

  const [profile, setProfile] = useState({ first_name: '', last_name: '', phone: '' })
  const [prefs, setPrefs] = useState({ notify_order_updates: true, notify_promotions: true })
  const [passwords, setPasswords] = useState({ current_password: '', new_password: '' })
  const [passwordError, setPasswordError] = useState(null)

  useEffect(() => {
    if (me?.user) {
      setProfile({ first_name: me.user.first_name || '', last_name: me.user.last_name || '', phone: me.user.phone || '' })
      setPrefs({ notify_order_updates: me.notify_order_updates, notify_promotions: me.notify_promotions })
    }
  }, [me])

  const saveProfile = async (e) => {
    e.preventDefault()
    await api.patch('/auth/me/', { ...profile, ...prefs })
    qc.invalidateQueries({ queryKey: ['me'] })
    pushToast('Profile updated')
  }

  const changePassword = async (e) => {
    e.preventDefault()
    setPasswordError(null)
    try {
      await api.post('/auth/change-password/', passwords)
      setPasswords({ current_password: '', new_password: '' })
      pushToast('Password changed')
    } catch (err) {
      setPasswordError(extractErrorMessage(err, 'Could not change password'))
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <h2 className="text-lg">Profile</h2>
        <form onSubmit={saveProfile} className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="First name" htmlFor="first_name">
              <Input id="first_name" value={profile.first_name} onChange={(e) => setProfile({ ...profile, first_name: e.target.value })} />
            </Field>
            <Field label="Last name" htmlFor="last_name">
              <Input id="last_name" value={profile.last_name} onChange={(e) => setProfile({ ...profile, last_name: e.target.value })} />
            </Field>
          </div>
          <Field label="Phone" htmlFor="phone">
            <Input id="phone" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
          </Field>
          <div className="space-y-2 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={prefs.notify_order_updates}
                onChange={(e) => setPrefs({ ...prefs, notify_order_updates: e.target.checked })}
              />
              Email me about order updates
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={prefs.notify_promotions}
                onChange={(e) => setPrefs({ ...prefs, notify_promotions: e.target.checked })}
              />
              Email me about offers and promotions
            </label>
          </div>
          <Button type="submit">Save Changes</Button>
        </form>
      </Card>

      <Card className="p-5">
        <h2 className="text-lg">Change Password</h2>
        <form onSubmit={changePassword} className="mt-4 space-y-4">
          <Field label="Current password" htmlFor="current_password">
            <Input
              id="current_password"
              type="password"
              value={passwords.current_password}
              onChange={(e) => setPasswords({ ...passwords, current_password: e.target.value })}
              required
            />
          </Field>
          <Field label="New password" htmlFor="new_password">
            <Input
              id="new_password"
              type="password"
              value={passwords.new_password}
              onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })}
              required
              minLength={8}
            />
          </Field>
          {passwordError && <p className="text-sm text-terracotta-700">{passwordError}</p>}
          <Button type="submit" variant="outline">
            Update Password
          </Button>
        </form>
      </Card>
    </div>
  )
}
