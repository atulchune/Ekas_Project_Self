import { Link } from 'react-router-dom'
import { useRecipes } from '@/hooks/useContent'
import { Card, EmptyState, Skeleton } from '@/components/ui/primitives'
import { Section, PageHeader } from '@/components/ui/layout'
import { Seo } from '@/components/storefront/Seo'

export default function RecipesList() {
  const { data, isLoading } = useRecipes()
  const recipes = data?.results ?? data ?? []

  return (
    <Section size="wide" spacing="md">
      <Seo title="Recipes — EKAS Healthy Foods" description="Traditional recipes using EKAS ghee, oils, and honey." />
      <PageHeader title="Recipe Inspiration" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-64" />)
          : recipes.map((recipe) => (
              <Card as={Link} to={`/recipes/${recipe.slug}`} key={recipe.id} className="overflow-hidden p-0">
                {recipe.image && <img src={recipe.image} alt="" className="aspect-video w-full object-cover" />}
                <div className="p-4">
                  <h2 className="text-lg text-forest-800">{recipe.title}</h2>
                  <p className="mt-1 text-sm text-earth-700">
                    {recipe.prep_time_minutes + recipe.cook_time_minutes} min · {recipe.difficulty} · Serves {recipe.servings}
                  </p>
                </div>
              </Card>
            ))}
      </div>
      {!isLoading && recipes.length === 0 && <EmptyState title="No recipes published yet" />}
    </Section>
  )
}
