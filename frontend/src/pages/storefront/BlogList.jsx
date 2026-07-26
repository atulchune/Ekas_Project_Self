import { Link } from 'react-router-dom'
import { useBlogPosts } from '@/hooks/useContent'
import { Card, EmptyState, Skeleton } from '@/components/ui/primitives'
import { Section, PageHeader } from '@/components/ui/layout'
import { Seo } from '@/components/storefront/Seo'

export default function BlogList() {
  const { data, isLoading } = useBlogPosts()
  const posts = data?.results ?? data ?? []

  return (
    <Section size="wide" spacing="md">
      <Seo title="Blog — EKAS Healthy Foods" />
      <PageHeader title="Blog" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-64" />)
          : posts.map((post) => (
              <Card as={Link} to={`/blog/${post.slug}`} key={post.id} className="overflow-hidden p-0">
                {post.cover_image && <img src={post.cover_image} alt="" className="aspect-video w-full object-cover" />}
                <div className="p-4">
                  <h2 className="text-lg text-forest-800">{post.title}</h2>
                  <p className="mt-1 text-sm text-earth-700">{post.excerpt}</p>
                </div>
              </Card>
            ))}
      </div>
      {!isLoading && posts.length === 0 && <EmptyState title="No articles published yet" />}
    </Section>
  )
}
