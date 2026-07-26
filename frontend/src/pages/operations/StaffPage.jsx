import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { opsRoles, opsStaff } from '@/hooks/opsResources'
import { opsApi, extractErrorMessage } from '@/lib/apiClient'
import { useQueryClient } from '@tanstack/react-query'
import { DataTable } from '@/components/operations/DataTable'
import { Drawer } from '@/components/operations/Drawer'
import { Badge, Field, Input } from '@/components/ui/primitives'
import { Button } from '@/components/ui/Button'
import { hasPermission, useOpsMe } from '@/hooks/useOpsAuth'
import { useUiStore } from '@/store/uiStore'

function InviteStaffForm({ roles, onClose }) {
  const qc = useQueryClient()
  const pushToast = useUiStore((s) => s.pushToast)
  const [email, setEmail] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [roleIds, setRoleIds] = useState([])
  const [loading, setLoading] = useState(false)

  const toggleRole = (id) => setRoleIds((prev) => (prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await opsApi.post('/staff/invite/', { email, job_title: jobTitle, role_ids: roleIds })
      qc.invalidateQueries({ queryKey: ['ops-staff', 'list'] })
      pushToast('Staff member invited')
      onClose()
    } catch (err) {
      pushToast(extractErrorMessage(err), 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Email" htmlFor="email">
        <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </Field>
      <Field label="Job Title" htmlFor="job_title">
        <Input id="job_title" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
      </Field>
      <fieldset>
        <legend className="text-sm font-medium text-earth-900">Roles</legend>
        <div className="mt-2 space-y-1">
          {roles?.results?.map((role) => (
            <label key={role.id} className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={roleIds.includes(role.id)} onChange={() => toggleRole(role.id)} />
              {role.name}
            </label>
          ))}
        </div>
      </fieldset>
      <Button type="submit" loading={loading}>
        Send Invite
      </Button>
    </form>
  )
}

function EditStaffRolesForm({ staff, roles, onClose }) {
  const qc = useQueryClient()
  const pushToast = useUiStore((s) => s.pushToast)
  const [roleIds, setRoleIds] = useState(staff.role_ids || [])
  const [loading, setLoading] = useState(false)

  const toggleRole = (id) => setRoleIds((prev) => (prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]))

  const handleSave = async () => {
    setLoading(true)
    try {
      await opsApi.post(`/staff/${staff.id}/assign-roles/`, { role_ids: roleIds })
      qc.invalidateQueries({ queryKey: ['ops-staff', 'list'] })
      pushToast('Roles updated')
      onClose()
    } finally {
      setLoading(false)
    }
  }

  const toggleActive = async () => {
    await opsApi.post(`/staff/${staff.id}/deactivate/`, { is_active: !staff.is_active })
    qc.invalidateQueries({ queryKey: ['ops-staff', 'list'] })
    pushToast(staff.is_active ? 'Staff deactivated' : 'Staff reactivated')
    onClose()
  }

  const forceLogout = async () => {
    await opsApi.post(`/staff/${staff.id}/force-logout/`)
    pushToast('All sessions revoked for this staff member')
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-earth-600">{staff.email}</p>
      <fieldset>
        <legend className="text-sm font-medium text-earth-900">Roles</legend>
        <div className="mt-2 space-y-1">
          {roles?.results?.map((role) => (
            <label key={role.id} className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={roleIds.includes(role.id)} onChange={() => toggleRole(role.id)} />
              {role.name}
            </label>
          ))}
        </div>
      </fieldset>
      <Button onClick={handleSave} loading={loading}>
        Save Roles
      </Button>
      <div className="flex gap-2 border-t border-forest-100 pt-4">
        <Button variant={staff.is_active ? 'danger' : 'primary'} size="sm" onClick={toggleActive}>
          {staff.is_active ? 'Deactivate' : 'Reactivate'}
        </Button>
        <Button variant="outline" size="sm" onClick={forceLogout}>
          Force Logout
        </Button>
      </div>
    </div>
  )
}

function RolesManager({ roles }) {
  const { data: permissions } = useQuery({
    queryKey: ['ops-permissions'],
    queryFn: async () => (await opsApi.get('/permissions/')).data,
  })
  const createRole = opsRoles.useCreate()
  const deleteRole = opsRoles.useDelete()
  const [editing, setEditing] = useState(null)
  const [name, setName] = useState('')
  const [permCodes, setPermCodes] = useState([])

  const grouped = (permissions || []).reduce((acc, p) => {
    acc[p.module] = acc[p.module] || []
    acc[p.module].push(p)
    return acc
  }, {})

  const startEdit = (role) => {
    setEditing(role)
    setName(role.name)
    setPermCodes(role.permission_codes || [])
  }

  const togglePerm = (code) => setPermCodes((prev) => (prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]))

  const handleSave = async () => {
    if (editing?.id) {
      await opsApi.patch(`/roles/${editing.id}/`, { name, permission_codes: permCodes })
    } else {
      await createRole.mutateAsync({ name, permission_codes: permCodes })
    }
    setEditing(null)
    setName('')
    setPermCodes([])
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="space-y-2 md:col-span-1">
        <h3 className="text-sm font-semibold text-forest-800">Roles</h3>
        {roles?.results?.map((role) => (
          <div key={role.id} className="flex items-center justify-between rounded-lg border border-forest-100 p-2 text-sm">
            <button className="text-left hover:underline" onClick={() => startEdit(role)}>
              {role.name} {role.is_system && <span className="text-xs text-earth-400">(system)</span>}
            </button>
            {!role.is_system && (
              <button className="text-terracotta-700 underline" onClick={() => deleteRole.mutate(role.id)}>
                Delete
              </button>
            )}
          </div>
        ))}
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setEditing({})
            setName('')
            setPermCodes([])
          }}
        >
          New Role
        </Button>
      </div>

      <div className="md:col-span-2">
        {editing ? (
          <div>
            <Field label="Role name" htmlFor="role_name">
              <Input id="role_name" value={name} onChange={(e) => setName(e.target.value)} disabled={editing.is_system} />
            </Field>
            <div className="mt-4 max-h-96 space-y-3 overflow-y-auto">
              {Object.entries(grouped).map(([module, perms]) => (
                <div key={module}>
                  <p className="text-xs font-semibold uppercase text-earth-500">{module}</p>
                  <div className="mt-1 flex flex-wrap gap-3">
                    {perms.map((p) => (
                      <label key={p.code} className="flex items-center gap-1 text-xs">
                        <input type="checkbox" checked={permCodes.includes(p.code)} onChange={() => togglePerm(p.code)} disabled={editing.is_system} />
                        {p.code}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {!editing.is_system && (
              <Button className="mt-4" onClick={handleSave}>
                Save Role
              </Button>
            )}
          </div>
        ) : (
          <p className="text-sm text-earth-500">Select a role to view or edit its permissions.</p>
        )}
      </div>
    </div>
  )
}

export default function StaffPage() {
  const { data: me } = useOpsMe()
  const canManage = hasPermission(me, 'staff.manage')
  const canManageRoles = hasPermission(me, 'roles.manage')
  const [tab, setTab] = useState('staff')
  const { data: staff, isLoading } = opsStaff.useList()
  const { data: roles } = opsRoles.useList()
  const [showInvite, setShowInvite] = useState(false)
  const [editingStaff, setEditingStaff] = useState(null)

  const columns = [
    { key: 'email', header: 'Email' },
    { key: 'job_title', header: 'Job Title' },
    { key: 'role_names', header: 'Roles', render: (row) => row.role_names?.join(', ') || '—' },
    { key: 'is_active', header: 'Status', render: (row) => <Badge tone={row.is_active ? 'forest' : 'terracotta'}>{row.is_active ? 'Active' : 'Disabled'}</Badge> },
  ]

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-serif text-forest-800">Staff & Roles</h1>
        {tab === 'staff' && canManage && <Button onClick={() => setShowInvite(true)}>Invite Staff</Button>}
      </div>
      <div className="mb-4 flex gap-2">
        <Button size="sm" variant={tab === 'staff' ? 'primary' : 'outline'} onClick={() => setTab('staff')}>
          Staff Members
        </Button>
        <Button size="sm" variant={tab === 'roles' ? 'primary' : 'outline'} onClick={() => setTab('roles')}>
          Roles & Permissions
        </Button>
      </div>

      {tab === 'staff' ? (
        <DataTable
          columns={columns}
          data={staff?.results}
          isLoading={isLoading}
          exportFilename="staff.csv"
          rowActions={(row) =>
            canManage && (
              <button className="text-sm text-forest-700 underline" onClick={() => setEditingStaff(row)}>
                Manage
              </button>
            )
          }
        />
      ) : (
        canManageRoles && <RolesManager roles={roles} />
      )}

      <Drawer open={showInvite} title="Invite Staff Member" onClose={() => setShowInvite(false)}>
        <InviteStaffForm roles={roles} onClose={() => setShowInvite(false)} />
      </Drawer>

      <Drawer open={!!editingStaff} title="Manage Staff Member" onClose={() => setEditingStaff(null)}>
        {editingStaff && <EditStaffRolesForm staff={editingStaff} roles={roles} onClose={() => setEditingStaff(null)} />}
      </Drawer>
    </div>
  )
}
