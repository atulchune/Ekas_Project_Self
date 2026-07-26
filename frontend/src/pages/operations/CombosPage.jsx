import { useState } from 'react'
import { useForm } from 'react-hook-form'
import slugify from '@/lib/slugify'
import { opsBundleItems, opsBundles, opsVariants } from '@/hooks/opsResources'
import { DataTable } from '@/components/operations/DataTable'
import { Drawer } from '@/components/operations/Drawer'
import { ConfirmDialog } from '@/components/operations/ConfirmDialog'
import { Badge, Field, Input, Select, Textarea } from '@/components/ui/primitives'
import { Button } from '@/components/ui/Button'
import { hasPermission, useOpsMe } from '@/hooks/useOpsAuth'

function BundleItemsManager({ bundleId }) {
  const { data: variants } = opsVariants.useList({ page_size: 200 })
  const { data: items } = opsBundleItems.useList({ bundle: bundleId })
  const createItem = opsBundleItems.useCreate()
  const deleteItem = opsBundleItems.useDelete()
  const [variantId, setVariantId] = useState('')
  const [quantity, setQuantity] = useState(1)

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!variantId) return
    await createItem.mutateAsync({ bundle: bundleId, variant: variantId, quantity })
    setVariantId('')
    setQuantity(1)
  }

  return (
    <div className="mt-6 border-t border-forest-100 pt-4">
      <h3 className="text-sm font-semibold text-forest-800">Combo Items</h3>
      <ul className="mt-2 space-y-2 text-sm">
        {items?.results?.map((item) => (
          <li key={item.id} className="flex items-center justify-between rounded-lg border border-forest-100 p-2">
            <span>
              {item.product_name} × {item.quantity}
            </span>
            <button className="text-terracotta-700 underline" onClick={() => deleteItem.mutate(item.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <form onSubmit={handleAdd} className="mt-3 flex gap-2">
        <Select value={variantId} onChange={(e) => setVariantId(e.target.value)}>
          <option value="">Select variant</option>
          {variants?.results?.map((v) => (
            <option key={v.id} value={v.id}>
              {v.sku}
            </option>
          ))}
        </Select>
        <Input type="number" min={1} value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-20" />
        <Button type="submit" size="sm" variant="outline" loading={createItem.isPending}>
          Add
        </Button>
      </form>
    </div>
  )
}

function BundleForm({ bundle, onClose }) {
  const create = opsBundles.useCreate()
  const update = opsBundles.useUpdate()
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm({ defaultValues: bundle || { name: '', slug: '', description: '', bundle_price: '', status: 'draft', is_active: true } })
  const name = watch('name')

  const onSubmit = async (data) => {
    if (bundle) await update.mutateAsync({ id: bundle.id, ...data })
    else await create.mutateAsync(data)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Field label="Name" htmlFor="name">
        <Input id="name" {...register('name', { required: true })} onBlur={() => !bundle && setValue('slug', slugify(name || ''))} />
      </Field>
      <Field label="Slug" htmlFor="slug">
        <Input id="slug" {...register('slug', { required: true })} />
      </Field>
      <Field label="Description" htmlFor="description">
        <Textarea id="description" rows={3} {...register('description')} />
      </Field>
      <Field label="Combo Price" htmlFor="bundle_price">
        <Input id="bundle_price" type="number" step="0.01" {...register('bundle_price', { required: true })} />
      </Field>
      <Field label="Status" htmlFor="status">
        <Select id="status" {...register('status')}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </Select>
      </Field>
      <Button type="submit" loading={isSubmitting}>
        Save
      </Button>
    </form>
  )
}

export default function CombosPage() {
  const { data: me } = useOpsMe()
  const canManage = hasPermission(me, 'combos.manage')
  const { data, isLoading } = opsBundles.useList()
  const deleteBundle = opsBundles.useDelete()
  const [editing, setEditing] = useState(null)
  const [showDrawer, setShowDrawer] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'bundle_price', header: 'Price', render: (row) => `₹${row.bundle_price}` },
    { key: 'status', header: 'Status', render: (row) => <Badge tone={row.status === 'published' ? 'forest' : 'earth'}>{row.status}</Badge> },
  ]

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-serif text-forest-800">Combo Packs</h1>
        {canManage && (
          <Button
            onClick={() => {
              setEditing(null)
              setShowDrawer(true)
            }}
          >
            New Combo
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={data?.results}
        isLoading={isLoading}
        exportFilename="combos.csv"
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

      <Drawer open={showDrawer} title={editing ? 'Edit Combo' : 'New Combo'} onClose={() => setShowDrawer(false)}>
        <BundleForm bundle={editing} onClose={() => setShowDrawer(false)} />
        {editing && <BundleItemsManager bundleId={editing.id} />}
      </Drawer>

      <ConfirmDialog
        open={!!confirmDelete}
        title={`Delete "${confirmDelete?.name}"?`}
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => {
          deleteBundle.mutate(confirmDelete.id)
          setConfirmDelete(null)
        }}
        loading={deleteBundle.isPending}
      />
    </div>
  )
}
