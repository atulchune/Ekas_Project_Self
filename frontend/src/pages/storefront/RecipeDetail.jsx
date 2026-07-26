import { Link, useParams } from 'react-router-dom'
import { useRecipe } from '@/hooks/useContent'
import { PageLoader } from '@/components/ui/PageLoader'
import { Badge } from '@/components/ui/primitives'
import { Section } from '@/components/ui/layout'
import { Seo } from '@/components/storefront/Seo'

export default function RecipeDetail() {
  const { slug } = useParams()
  const { data: recipe, isLoading } = useRecipe(slug)

  if (isLoading) return <PageLoader />
  if (!recipe) return null

  return (
    <Section size="narrow" spacing="md">
      <Seo title={`${recipe.title} — EKAS Healthy Foods`} description={recipe.description} image={recipe.image} />
      {recipe.image && <img src={recipe.image} alt="" className="aspect-video w-full rounded-2xl object-cover" />}
      <h1 className="mt-6 text-3xl">{recipe.title}</h1>
      <p className="mt-2 text-earth-700">{recipe.description}</p>
      <div className="mt-4 flex flex-wrap gap-2 text-sm text-earth-600">
        <span>{recipe.prep_time_minutes} min prep</span> · <span>{recipe.cook_time_minutes} min cook</span> ·{' '}
        <span>Serves {recipe.servings}</span> · <span className="capitalize">{recipe.difficulty}</span>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {recipe.dietary_tags?.map((tag) => (
          <Badge key={tag} tone="forest">
            {tag}
          </Badge>
        ))}
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-3">
        <div>
          <h2 className="text-xl">Ingredients</h2>
          <ul className="mt-3 space-y-2 text-sm text-earth-700">
            {recipe.ingredients.map((ing) => (
              <li key={ing.id}>
                {ing.quantity} {ing.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-2">
          <h2 className="text-xl">Instructions</h2>
          <ol className="mt-3 space-y-3 text-sm text-earth-700">
            {recipe.instructions.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="font-serif text-lg text-ghee-500">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {recipe.ekas_products?.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl">Made with</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {recipe.ekas_products.map((productSlug) => (
              <Link
                key={productSlug}
                to={`/products/${productSlug}`}
                className="rounded-full bg-forest-50 px-3 py-1 text-sm capitalize text-forest-700 hover:bg-forest-100"
              >
                {productSlug.replace(/-/g, ' ')}
              </Link>
            ))}
          </div>
        </div>
      )}
    </Section>
  )
}
