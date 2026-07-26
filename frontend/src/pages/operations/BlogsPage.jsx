import { useState } from 'react'
import { useForm } from 'react-hook-form'
import slugify from '@/lib/slugify'
import { opsBlogPosts } from '@/hooks/opsResources'
import { DataTable } from '@/components/operations/DataTable'
import { Drawer } from '@/components/operations/Drawer'
import { ConfirmDialog } from '@/components/operations/ConfirmDialog'
import { Badge, Field, Input, Select, Textarea } from '@/components/ui/primitives'
import { Button } from '@/components/ui/Button'
import { hasPermission, useOpsMe } from '@/hooks/useOpsAuth'

function BlogForm({ post, onClose }) {
  const create = opsBlogPosts.useCreate()
  const update = opsBlogPosts.useUpdate()
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm({ defaultValues: post || { title: '', slug: '', excerpt: '', body: '', category: '', status: 'draft' } })
  const title = watch('title')

  const onSubmit = async (data) => {
    if (post) await update.mutateAsync({ id: post.id, ...data })
    else await create.mutateAsync(data)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Field label="Title" htmlFor="title">
        <Input id="title" {...register('title', { required: true })} onBlur={() => !post && setValue('slug', slugify(title || ''))} />
      </Field>
      <Field label="Slug" htmlFor="slug">
        <Input id="slug" {...register('slug', { required: true })} />
      </Field>
      <Field label="Category" htmlFor="category">
        <Input id="category" {...register('category')} />
      </Field>
      <Field label="Excerpt" htmlFor="excerpt">
        <Input id="excerpt" {...register('excerpt')} />
      </Field>
      <Field label="Body" htmlFor="body">
        <Textarea id="body" rows={6} {...register('body')} />
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

export default function BlogsPage() {
  const { data: me } = useOpsMe()
  const canManage = hasPermission(me, 'blogs.manage')
  const { data, isLoading } = opsBlogPosts.useList()
  const deletePost = opsBlogPosts.useDelete()
  const [editing, setEditing] = useState(null)
  const [showDrawer, setShowDrawer] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const columns = [
    { key: 'title', header: 'Title' },
    { key: 'category', header: 'Category' },
    { key: 'status', header: 'Status', render: (row) => <Badge tone={row.status === 'published' ? 'forest' : 'earth'}>{row.status}</Badge> },
  ]

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-serif text-forest-800">Blogs</h1>
        {canManage && (
          <Button
            onClick={() => {
              setEditing(null)
              setShowDrawer(true)
            }}
          >
            New Post
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={data?.results}
        isLoading={isLoading}
        exportFilename="blog-posts.csv"
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

      <Drawer open={showDrawer} title={editing ? 'Edit Post' : 'New Post'} onClose={() => setShowDrawer(false)} wide>
        <BlogForm post={editing} onClose={() => setShowDrawer(false)} />
      </Drawer>

      <ConfirmDialog
        open={!!confirmDelete}
        title={`Delete "${confirmDelete?.title}"?`}
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => {
          deletePost.mutate(confirmDelete.id)
          setConfirmDelete(null)
        }}
        loading={deletePost.isPending}
      />
    </div>
  )
}
