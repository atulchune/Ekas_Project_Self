import { useState } from 'react'
import { useForm } from 'react-hook-form'
import slugify from '@/lib/slugify'
import { opsCategories } from '@/hooks/opsResources'
import { DataTable } from '@/components/operations/DataTable'
import { Drawer } from '@/components/operations/Drawer'
import { ConfirmDialog } from '@/components/operations/ConfirmDialog'
import { Badge, Field, Input, Textarea } from '@/components/ui/primitives'
import { Button } from '@/components/ui/Button'
import { hasPermission, useOpsMe } from '@/hooks/useOpsAuth'

function CategoryForm({ category, onClose }) {
  const createCategory = opsCategories.useCreate()
  const updateCategory = opsCategories.useUpdate()
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm({ defaultValues: category || { name: '', slug: '', description: '', is_active: true, display_order: 0 } })
  const name = watch('name')

  const onSubmit = async (data) => {
    if (category) await updateCategory.mutateAsync({ id: category.id, ...data })
    else await createCategory.mutateAsync(data)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Field label="Name" htmlFor="name">
        <Input id="name" {...register('name', { required: true })} onBlur={() => !category && setValue('slug', slugify(name || ''))} />
      </Field>
      <Field label="Slug" htmlFor="slug">
        <Input id="slug" {...register('slug', { required: true })} />
      </Field>
      <Field label="Description" htmlFor="description">
        <Textarea id="description" rows={3} {...register('description')} />
      </Field>
      <Field label="Display order" htmlFor="display_order">
        <Input id="display_order" type="number" {...register('display_order')} />
      </Field>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" {...register('is_active')} /> Active
      </label>
      <Button type="submit" loading={isSubmitting}>
        {category ? 'Save Changes' : 'Create Category'}
      </Button>
    </form>
  )
}

export default function CategoriesPage() {
  const { data: me } = useOpsMe()
  const canManage = hasPermission(me, 'categories.manage')
  const { data, isLoading } = opsCategories.useList()
  const deleteCategory = opsCategories.useDelete()
  const [editing, setEditing] = useState(null)
  const [showDrawer, setShowDrawer] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'slug', header: 'Slug' },
    { key: 'product_count', header: 'Products' },
    { key: 'is_active', header: 'Status', render: (row) => <Badge tone={row.is_active ? 'forest' : 'earth'}>{row.is_active ? 'Active' : 'Inactive'}</Badge> },
  ]

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-serif text-forest-800">Categories</h1>
        {canManage && (
          <Button
            onClick={() => {
              setEditing(null)
              setShowDrawer(true)
            }}
          >
            New Category
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={data?.results}
        isLoading={isLoading}
        exportFilename="categories.csv"
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

      <Drawer open={showDrawer} title={editing ? 'Edit Category' : 'New Category'} onClose={() => setShowDrawer(false)}>
        <CategoryForm category={editing} onClose={() => setShowDrawer(false)} />
      </Drawer>

      <ConfirmDialog
        open={!!confirmDelete}
        title={`Delete "${confirmDelete?.name}"?`}
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => {
          deleteCategory.mutate(confirmDelete.id)
          setConfirmDelete(null)
        }}
        loading={deleteCategory.isPending}
      />
    </div>
  )
}
