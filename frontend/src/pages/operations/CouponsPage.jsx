import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { opsCoupons, opsPromotions } from '@/hooks/opsResources'
import { DataTable } from '@/components/operations/DataTable'
import { Drawer } from '@/components/operations/Drawer'
import { ConfirmDialog } from '@/components/operations/ConfirmDialog'
import { Badge, Field, Input, Select } from '@/components/ui/primitives'
import { Button } from '@/components/ui/Button'
import { hasPermission, useOpsMe } from '@/hooks/useOpsAuth'

function DiscountForm({ resource, item, hasCode, onClose }) {
  const create = resource.useCreate()
  const update = resource.useUpdate()
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: item || {
      name: '', code: '', discount_type: 'percentage', discount_value: '', scope: 'all',
      min_order_value: 0, grants_free_shipping: false, is_active: true, stackable: false, priority: 0,
      usage_limit_total: '', usage_limit_per_customer: 1,
    },
  })

  const onSubmit = async (data) => {
    if (item) await update.mutateAsync({ id: item.id, ...data })
    else await create.mutateAsync(data)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Field label="Name" htmlFor="name">
        <Input id="name" {...register('name', { required: true })} />
      </Field>
      {hasCode && (
        <Field label="Coupon Code" htmlFor="code">
          <Input id="code" {...register('code', { required: true })} className="uppercase" />
        </Field>
      )}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Discount Type" htmlFor="discount_type">
          <Select id="discount_type" {...register('discount_type')}>
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed amount</option>
          </Select>
        </Field>
        <Field label="Discount Value" htmlFor="discount_value">
          <Input id="discount_value" type="number" step="0.01" {...register('discount_value', { required: true })} />
        </Field>
      </div>
      <Field label="Scope" htmlFor="scope">
        <Select id="scope" {...register('scope')}>
          <option value="all">Entire order</option>
          <option value="category">Specific categories</option>
          <option value="product">Specific products</option>
        </Select>
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Min order value" htmlFor="min_order_value">
          <Input id="min_order_value" type="number" {...register('min_order_value')} />
        </Field>
        <Field label="Priority" htmlFor="priority">
          <Input id="priority" type="number" {...register('priority')} />
        </Field>
      </div>
      {hasCode && (
        <div className="grid grid-cols-2 gap-4">
          <Field label="Total usage limit" htmlFor="usage_limit_total">
            <Input id="usage_limit_total" type="number" {...register('usage_limit_total')} />
          </Field>
          <Field label="Per customer limit" htmlFor="usage_limit_per_customer">
            <Input id="usage_limit_per_customer" type="number" {...register('usage_limit_per_customer')} />
          </Field>
        </div>
      )}
      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register('grants_free_shipping')} /> Free shipping
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register('stackable')} /> Stackable
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register('is_active')} /> Active
        </label>
      </div>
      <Button type="submit" loading={isSubmitting}>
        Save
      </Button>
    </form>
  )
}

export default function CouponsPage() {
  const { data: me } = useOpsMe()
  const canManage = hasPermission(me, 'coupons.manage')
  const [tab, setTab] = useState('coupons')
  const resource = tab === 'coupons' ? opsCoupons : opsPromotions
  const { data, isLoading } = resource.useList()
  const deleteItem = resource.useDelete()
  const [editing, setEditing] = useState(null)
  const [showDrawer, setShowDrawer] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const columns = [
    { key: 'name', header: 'Name' },
    ...(tab === 'coupons' ? [{ key: 'code', header: 'Code' }] : []),
    { key: 'discount_type', header: 'Type' },
    { key: 'discount_value', header: 'Value' },
    { key: 'is_active', header: 'Active', render: (row) => <Badge tone={row.is_active ? 'forest' : 'earth'}>{row.is_active ? 'Yes' : 'No'}</Badge> },
  ]

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-serif text-forest-800">Coupons & Offers</h1>
        {canManage && (
          <Button
            onClick={() => {
              setEditing(null)
              setShowDrawer(true)
            }}
          >
            New {tab === 'coupons' ? 'Coupon' : 'Promotion'}
          </Button>
        )}
      </div>
      <div className="mb-4 flex gap-2">
        <Button size="sm" variant={tab === 'coupons' ? 'primary' : 'outline'} onClick={() => setTab('coupons')}>
          Coupon Codes
        </Button>
        <Button size="sm" variant={tab === 'promotions' ? 'primary' : 'outline'} onClick={() => setTab('promotions')}>
          Automatic Promotions
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data?.results}
        isLoading={isLoading}
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

      <Drawer open={showDrawer} title={editing ? 'Edit' : 'New'} onClose={() => setShowDrawer(false)}>
        <DiscountForm resource={resource} item={editing} hasCode={tab === 'coupons'} onClose={() => setShowDrawer(false)} />
      </Drawer>

      <ConfirmDialog
        open={!!confirmDelete}
        title={`Delete "${confirmDelete?.name}"?`}
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => {
          deleteItem.mutate(confirmDelete.id)
          setConfirmDelete(null)
        }}
        loading={deleteItem.isPending}
      />
    </div>
  )
}
