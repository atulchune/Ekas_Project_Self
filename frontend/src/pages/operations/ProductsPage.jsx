import { useState } from 'react'
import { useForm } from 'react-hook-form'
import slugify from '@/lib/slugify'
import { opsCategories, opsProductImages, opsProducts, opsVariants } from '@/hooks/opsResources'
import { DataTable } from '@/components/operations/DataTable'
import { Drawer } from '@/components/operations/Drawer'
import { ConfirmDialog } from '@/components/operations/ConfirmDialog'
import { Badge, Field, Input, Select, Textarea } from '@/components/ui/primitives'
import { Button } from '@/components/ui/Button'
import { hasPermission, useOpsMe } from '@/hooks/useOpsAuth'
import { useUiStore } from '@/store/uiStore'

const STATUS_OPTIONS = ['draft', 'scheduled', 'published', 'archived']

function ProductForm({ product, onClose }) {
  const { data: categories } = opsCategories.useList()
  const createProduct = opsProducts.useCreate()
  const updateProduct = opsProducts.useUpdate()
  const pushToast = useUiStore((s) => s.pushToast)
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: product || {
      name: '', slug: '', category: '', short_description: '', description: '', status: 'draft',
      is_featured: false, is_bestseller: false, is_new_launch: false,
      ingredients: '', preparation: '', aroma_texture: '', culinary_uses: '', storage_instructions: '', allergens: '', shelf_life: '',
    },
  })
  const name = watch('name')

  const onSubmit = async (data) => {
    try {
      if (product) {
        await updateProduct.mutateAsync({ id: product.id, ...data })
        pushToast('Product updated')
      } else {
        await createProduct.mutateAsync(data)
        pushToast('Product created as draft')
      }
      onClose()
    } catch {
      pushToast('Could not save product', 'error')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Field label="Name" htmlFor="name">
        <Input id="name" {...register('name', { required: true })} onBlur={() => !product && setValue('slug', slugify(name || ''))} />
      </Field>
      <Field label="Slug" htmlFor="slug" hint="Used in the product URL">
        <Input id="slug" {...register('slug', { required: true })} />
      </Field>
      <Field label="Category" htmlFor="category">
        <Select id="category" {...register('category', { required: true })}>
          <option value="">Select category</option>
          {categories?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Short description" htmlFor="short_description">
        <Input id="short_description" {...register('short_description')} />
      </Field>
      <Field label="Description" htmlFor="description">
        <Textarea id="description" rows={3} {...register('description')} />
      </Field>
      <Field label="Status" htmlFor="status">
        <Select id="status" {...register('status')}>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </Field>
      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register('is_featured')} /> Featured
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register('is_bestseller')} /> Bestseller
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register('is_new_launch')} /> New launch
        </label>
      </div>
      <Field label="Ingredients" htmlFor="ingredients">
        <Textarea id="ingredients" rows={2} {...register('ingredients')} />
      </Field>
      <Field label="Preparation" htmlFor="preparation">
        <Textarea id="preparation" rows={2} {...register('preparation')} />
      </Field>
      <Field label="Aroma & Texture" htmlFor="aroma_texture">
        <Textarea id="aroma_texture" rows={2} {...register('aroma_texture')} />
      </Field>
      <Field label="Culinary Uses" htmlFor="culinary_uses">
        <Textarea id="culinary_uses" rows={2} {...register('culinary_uses')} />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Storage Instructions" htmlFor="storage_instructions">
          <Input id="storage_instructions" {...register('storage_instructions')} />
        </Field>
        <Field label="Shelf Life" htmlFor="shelf_life">
          <Input id="shelf_life" {...register('shelf_life')} />
        </Field>
      </div>
      <Field label="Allergens" htmlFor="allergens">
        <Input id="allergens" {...register('allergens')} />
      </Field>
      <Button type="submit" loading={isSubmitting}>
        {product ? 'Save Changes' : 'Create Product'}
      </Button>
    </form>
  )
}

function VariantManager({ productId }) {
  const { data } = opsVariants.useList({ product: productId })
  const createVariant = opsVariants.useCreate()
  const deleteVariant = opsVariants.useDelete()
  const [form, setForm] = useState({ label: '', sku: '', price: '', mrp: '', weight_grams: '' })

  const handleAdd = async (e) => {
    e.preventDefault()
    await createVariant.mutateAsync({ product: productId, is_default: (data?.results?.length ?? 0) === 0, ...form })
    setForm({ label: '', sku: '', price: '', mrp: '', weight_grams: '' })
  }

  return (
    <div className="mt-6 border-t border-forest-100 pt-4">
      <h3 className="text-sm font-semibold text-forest-800">Variants</h3>
      <ul className="mt-2 space-y-2 text-sm">
        {data?.results?.map((v) => (
          <li key={v.id} className="flex items-center justify-between rounded-lg border border-forest-100 p-2">
            <span>
              {v.label} · {v.sku} · ₹{v.price} (MRP ₹{v.mrp})
            </span>
            <button className="text-terracotta-700 underline" onClick={() => deleteVariant.mutate(v.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <form onSubmit={handleAdd} className="mt-3 grid grid-cols-2 gap-2">
        <Input placeholder="Label (e.g. 500ml)" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} required />
        <Input placeholder="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required />
        <Input placeholder="Price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
        <Input placeholder="MRP" type="number" value={form.mrp} onChange={(e) => setForm({ ...form, mrp: e.target.value })} required />
        <Button type="submit" size="sm" variant="outline" className="col-span-2" loading={createVariant.isPending}>
          Add Variant
        </Button>
      </form>
    </div>
  )
}

function ImageManager({ productId }) {
  const { data } = opsProductImages.useList({ product: productId })
  const createImage = opsProductImages.useCreate()
  const deleteImage = opsProductImages.useDelete()

  const handleUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append('product', productId)
    formData.append('image', file)
    formData.append('is_primary', (data?.results?.length ?? 0) === 0)
    createImage.mutate(formData)
    e.target.value = ''
  }

  return (
    <div className="mt-6 border-t border-forest-100 pt-4">
      <h3 className="text-sm font-semibold text-forest-800">Images</h3>
      <div className="mt-2 flex flex-wrap gap-2">
        {data?.results?.map((img) => (
          <div key={img.id} className="relative">
            <img src={img.image} alt="" className="size-20 rounded-lg object-cover" />
            <button
              className="absolute -right-1 -top-1 rounded-full bg-terracotta-700 px-1.5 text-xs text-ivory"
              onClick={() => deleteImage.mutate(img.id)}
              aria-label="Remove image"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <input type="file" accept="image/*" onChange={handleUpload} className="mt-3 text-sm" />
    </div>
  )
}

export default function ProductsPage() {
  const { data: me } = useOpsMe()
  const canManage = hasPermission(me, 'products.manage')
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const { data, isLoading } = opsProducts.useList({ page, search })
  const deleteProduct = opsProducts.useDelete()
  const [editing, setEditing] = useState(null)
  const [showDrawer, setShowDrawer] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'status', header: 'Status', render: (row) => <Badge tone={row.status === 'published' ? 'forest' : 'earth'}>{row.status}</Badge> },
    {
      key: 'flags',
      header: 'Flags',
      render: (row) => (
        <div className="flex gap-1">
          {row.is_featured && <Badge tone="ghee">Featured</Badge>}
          {row.is_bestseller && <Badge tone="ghee">Bestseller</Badge>}
        </div>
      ),
    },
  ]

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-serif text-forest-800">Products</h1>
        {canManage && (
          <Button
            onClick={() => {
              setEditing(null)
              setShowDrawer(true)
            }}
          >
            New Product
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={data?.results}
        isLoading={isLoading}
        search={search}
        onSearchChange={(v) => {
          setSearch(v)
          setPage(1)
        }}
        page={page}
        onPageChange={setPage}
        numPages={data?.num_pages}
        exportFilename="products.csv"
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

      <Drawer open={showDrawer} title={editing ? 'Edit Product' : 'New Product'} onClose={() => setShowDrawer(false)} wide>
        <ProductForm product={editing} onClose={() => setShowDrawer(false)} />
        {editing && <VariantManager productId={editing.id} />}
        {editing && <ImageManager productId={editing.id} />}
      </Drawer>

      <ConfirmDialog
        open={!!confirmDelete}
        title={`Delete "${confirmDelete?.name}"?`}
        description="This will permanently remove the product. This action cannot be undone."
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => {
          deleteProduct.mutate(confirmDelete.id)
          setConfirmDelete(null)
        }}
        loading={deleteProduct.isPending}
      />
    </div>
  )
}
