import { useState } from 'react'
import { useForm } from 'react-hook-form'
import slugify from '@/lib/slugify'
import { opsRecipeIngredients, opsRecipes } from '@/hooks/opsResources'
import { DataTable } from '@/components/operations/DataTable'
import { Drawer } from '@/components/operations/Drawer'
import { ConfirmDialog } from '@/components/operations/ConfirmDialog'
import { Badge, Field, Input, Select, Textarea } from '@/components/ui/primitives'
import { Button } from '@/components/ui/Button'
import { hasPermission, useOpsMe } from '@/hooks/useOpsAuth'

function IngredientsManager({ recipeId }) {
  const { data } = opsRecipeIngredients.useList({ recipe: recipeId })
  const create = opsRecipeIngredients.useCreate()
  const remove = opsRecipeIngredients.useDelete()
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState('')

  const handleAdd = async (e) => {
    e.preventDefault()
    await create.mutateAsync({ recipe: recipeId, name, quantity, display_order: data?.results?.length ?? 0 })
    setName('')
    setQuantity('')
  }

  return (
    <div className="mt-6 border-t border-forest-100 pt-4">
      <h3 className="text-sm font-semibold text-forest-800">Ingredients</h3>
      <ul className="mt-2 space-y-1 text-sm">
        {data?.results?.map((ing) => (
          <li key={ing.id} className="flex justify-between rounded-lg border border-forest-100 p-2">
            <span>
              {ing.quantity} {ing.name}
            </span>
            <button className="text-terracotta-700 underline" onClick={() => remove.mutate(ing.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <form onSubmit={handleAdd} className="mt-2 flex gap-2">
        <Input placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-28" />
        <Input placeholder="Ingredient" value={name} onChange={(e) => setName(e.target.value)} required />
        <Button type="submit" size="sm" variant="outline" loading={create.isPending}>
          Add
        </Button>
      </form>
    </div>
  )
}

function RecipeForm({ recipe, onClose }) {
  const create = opsRecipes.useCreate()
  const update = opsRecipes.useUpdate()
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: recipe
      ? { ...recipe, instructions: (recipe.instructions || []).join('\n') }
      : {
          title: '', slug: '', description: '', prep_time_minutes: 10, cook_time_minutes: 10, servings: 2,
          difficulty: 'easy', instructions: '', status: 'draft',
        },
  })
  const title = watch('title')

  const onSubmit = async (data) => {
    const payload = { ...data, instructions: data.instructions.split('\n').filter(Boolean) }
    if (recipe) await update.mutateAsync({ id: recipe.id, ...payload })
    else await create.mutateAsync(payload)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Field label="Title" htmlFor="title">
        <Input id="title" {...register('title', { required: true })} onBlur={() => !recipe && setValue('slug', slugify(title || ''))} />
      </Field>
      <Field label="Slug" htmlFor="slug">
        <Input id="slug" {...register('slug', { required: true })} />
      </Field>
      <Field label="Description" htmlFor="description">
        <Textarea id="description" rows={2} {...register('description')} />
      </Field>
      <div className="grid grid-cols-3 gap-3">
        <Field label="Prep (min)" htmlFor="prep_time_minutes">
          <Input id="prep_time_minutes" type="number" {...register('prep_time_minutes')} />
        </Field>
        <Field label="Cook (min)" htmlFor="cook_time_minutes">
          <Input id="cook_time_minutes" type="number" {...register('cook_time_minutes')} />
        </Field>
        <Field label="Servings" htmlFor="servings">
          <Input id="servings" type="number" {...register('servings')} />
        </Field>
      </div>
      <Field label="Difficulty" htmlFor="difficulty">
        <Select id="difficulty" {...register('difficulty')}>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </Select>
      </Field>
      <Field label="Instructions" htmlFor="instructions" hint="One step per line">
        <Textarea id="instructions" rows={5} {...register('instructions')} />
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

export default function RecipesPage() {
  const { data: me } = useOpsMe()
  const canManage = hasPermission(me, 'recipes.manage')
  const { data, isLoading } = opsRecipes.useList()
  const deleteRecipe = opsRecipes.useDelete()
  const [editing, setEditing] = useState(null)
  const [showDrawer, setShowDrawer] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const columns = [
    { key: 'title', header: 'Title' },
    { key: 'difficulty', header: 'Difficulty' },
    { key: 'status', header: 'Status', render: (row) => <Badge tone={row.status === 'published' ? 'forest' : 'earth'}>{row.status}</Badge> },
  ]

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-serif text-forest-800">Recipes</h1>
        {canManage && (
          <Button
            onClick={() => {
              setEditing(null)
              setShowDrawer(true)
            }}
          >
            New Recipe
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={data?.results}
        isLoading={isLoading}
        exportFilename="recipes.csv"
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

      <Drawer open={showDrawer} title={editing ? 'Edit Recipe' : 'New Recipe'} onClose={() => setShowDrawer(false)} wide>
        <RecipeForm recipe={editing} onClose={() => setShowDrawer(false)} />
        {editing && <IngredientsManager recipeId={editing.id} />}
      </Drawer>

      <ConfirmDialog
        open={!!confirmDelete}
        title={`Delete "${confirmDelete?.title}"?`}
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => {
          deleteRecipe.mutate(confirmDelete.id)
          setConfirmDelete(null)
        }}
        loading={deleteRecipe.isPending}
      />
    </div>
  )
}
