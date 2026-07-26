import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { opsAnnouncements, opsHomepageSections } from '@/hooks/opsResources'
import { DataTable } from '@/components/operations/DataTable'
import { Drawer } from '@/components/operations/Drawer'
import { ConfirmDialog } from '@/components/operations/ConfirmDialog'
import { Badge, Field, Input, Select, Textarea } from '@/components/ui/primitives'
import { Button } from '@/components/ui/Button'
import { hasPermission, useOpsMe } from '@/hooks/useOpsAuth'
import { useUiStore } from '@/store/uiStore'

const SECTION_TYPES = [
  'hero', 'trust_strip', 'category_grid', 'bestsellers', 'product_focus', 'process_story',
  'why_ekas', 'women_led', 'combos', 'recipes', 'testimonials', 'impact', 'newsletter',
]

function AnnouncementForm({ item, onClose }) {
  const create = opsAnnouncements.useCreate()
  const update = opsAnnouncements.useUpdate()
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({ defaultValues: item || { message: '', link_label: '', link_url: '', is_active: true, display_order: 0 } })

  const onSubmit = async (data) => {
    if (item) await update.mutateAsync({ id: item.id, ...data })
    else await create.mutateAsync(data)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Field label="Message" htmlFor="message">
        <Input id="message" {...register('message', { required: true })} />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Link Label" htmlFor="link_label">
          <Input id="link_label" {...register('link_label')} />
        </Field>
        <Field label="Link URL" htmlFor="link_url">
          <Input id="link_url" {...register('link_url')} />
        </Field>
      </div>
      <Field label="Display order" htmlFor="display_order">
        <Input id="display_order" type="number" {...register('display_order')} />
      </Field>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" {...register('is_active')} /> Active
      </label>
      <Button type="submit" loading={isSubmitting}>
        Save
      </Button>
    </form>
  )
}

function SectionForm({ item, onClose }) {
  const create = opsHomepageSections.useCreate()
  const update = opsHomepageSections.useUpdate()
  const pushToast = useUiStore((s) => s.pushToast)
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: item
      ? { ...item, content: JSON.stringify(item.content ?? {}, null, 2) }
      : {
          section_type: 'hero', title: '', subtitle: '', body: '', cta_label: '', cta_url: '',
          content: '{}', device_visibility: 'all', is_visible: true, display_order: 0, status: 'draft',
        },
  })

  const onSubmit = async (data) => {
    let content = data.content
    if (typeof content === 'string') {
      try {
        content = JSON.parse(content || '{}')
      } catch {
        pushToast('Content must be valid JSON', 'error')
        return
      }
    }
    const payload = { ...data, content }
    if (item) await update.mutateAsync({ id: item.id, ...payload })
    else await create.mutateAsync(payload)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Field label="Section Type" htmlFor="section_type">
        <Select id="section_type" {...register('section_type')} disabled={!!item}>
          {SECTION_TYPES.map((t) => (
            <option key={t} value={t}>
              {t.replace(/_/g, ' ')}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Title" htmlFor="title">
        <Input id="title" {...register('title')} />
      </Field>
      <Field label="Subtitle" htmlFor="subtitle">
        <Input id="subtitle" {...register('subtitle')} />
      </Field>
      <Field label="Body" htmlFor="body">
        <Textarea id="body" rows={3} {...register('body')} />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="CTA Label" htmlFor="cta_label">
          <Input id="cta_label" {...register('cta_label')} />
        </Field>
        <Field label="CTA URL" htmlFor="cta_url">
          <Input id="cta_url" {...register('cta_url')} />
        </Field>
      </div>
      <Field
        label="Structured content (JSON)"
        htmlFor="content"
        hint='e.g. {"steps": [{"title": "...", "body": "..."}]} or {"testimonials": [...]}'
      >
        <Textarea id="content" rows={4} {...register('content')} className="font-mono text-xs" />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Display order" htmlFor="display_order">
          <Input id="display_order" type="number" {...register('display_order')} />
        </Field>
        <Field label="Device" htmlFor="device_visibility">
          <Select id="device_visibility" {...register('device_visibility')}>
            <option value="all">All devices</option>
            <option value="desktop">Desktop only</option>
            <option value="mobile">Mobile only</option>
          </Select>
        </Field>
      </div>
      <Field label="Status" htmlFor="status">
        <Select id="status" {...register('status')}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </Select>
      </Field>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" {...register('is_visible')} /> Visible
      </label>
      <Button type="submit" loading={isSubmitting}>
        Save
      </Button>
    </form>
  )
}

export default function HomepageManagerPage() {
  const { data: me } = useOpsMe()
  const canManage = hasPermission(me, 'homepage.manage')
  const [tab, setTab] = useState('sections')
  const sections = opsHomepageSections.useList()
  const announcements = opsAnnouncements.useList()
  const deleteSection = opsHomepageSections.useDelete()
  const deleteAnnouncement = opsAnnouncements.useDelete()
  const [editing, setEditing] = useState(null)
  const [showDrawer, setShowDrawer] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const sectionColumns = [
    { key: 'section_type', header: 'Section' },
    { key: 'title', header: 'Title' },
    { key: 'display_order', header: 'Order' },
    { key: 'status', header: 'Status', render: (row) => <Badge tone={row.status === 'published' ? 'forest' : 'earth'}>{row.status}</Badge> },
    { key: 'is_visible', header: 'Visible', render: (row) => (row.is_visible ? 'Yes' : 'No') },
  ]
  const announcementColumns = [
    { key: 'message', header: 'Message' },
    { key: 'display_order', header: 'Order' },
    { key: 'is_active', header: 'Active', render: (row) => (row.is_active ? 'Yes' : 'No') },
  ]

  const activeResource = tab === 'sections' ? opsHomepageSections : opsAnnouncements
  const activeData = tab === 'sections' ? sections : announcements
  const activeDelete = tab === 'sections' ? deleteSection : deleteAnnouncement

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-serif text-forest-800">Homepage Manager</h1>
        {canManage && (
          <Button
            onClick={() => {
              setEditing(null)
              setShowDrawer(true)
            }}
          >
            New {tab === 'sections' ? 'Section' : 'Announcement'}
          </Button>
        )}
      </div>
      <div className="mb-4 flex gap-2">
        <Button size="sm" variant={tab === 'sections' ? 'primary' : 'outline'} onClick={() => setTab('sections')}>
          Sections
        </Button>
        <Button size="sm" variant={tab === 'announcements' ? 'primary' : 'outline'} onClick={() => setTab('announcements')}>
          Announcement Bar
        </Button>
      </div>

      <DataTable
        columns={tab === 'sections' ? sectionColumns : announcementColumns}
        data={activeData.data?.results ?? activeData.data}
        isLoading={activeData.isLoading}
        exportFilename={`${tab}.csv`}
        rowActions={(row) =>
          canManage && (
            <div className="flex justify-end gap-3">
              <button
                className="text-sm text-forest-700 underline"
                onClick={() => {
                  setEditing(row)
                  setShowDrawer(true)
                }}
              >
                Edit
              </button>
              <button className="text-sm text-terracotta-700 underline" onClick={() => setConfirmDelete(row)}>
                Delete
              </button>
            </div>
          )
        }
      />

      <Drawer open={showDrawer} title={editing ? 'Edit' : 'New'} onClose={() => setShowDrawer(false)} wide={tab === 'sections'}>
        {tab === 'sections' ? (
          <SectionForm item={editing} onClose={() => setShowDrawer(false)} />
        ) : (
          <AnnouncementForm item={editing} onClose={() => setShowDrawer(false)} />
        )}
      </Drawer>

      <ConfirmDialog
        open={!!confirmDelete}
        title="Delete this item?"
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => {
          activeDelete.mutate(confirmDelete.id)
          setConfirmDelete(null)
        }}
        loading={activeDelete.isPending}
      />
    </div>
  )
}
