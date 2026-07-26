import { useParams } from 'react-router-dom'
import { useBlogPost } from '@/hooks/useContent'
import { PageLoader } from '@/components/ui/PageLoader'
import { Section } from '@/components/ui/layout'
import { Seo } from '@/components/storefront/Seo'

export default function BlogDetail() {
  const { slug } = useParams()
  const { data: post, isLoading } = useBlogPost(slug)

  if (isLoading) return <PageLoader />
  if (!post) return null

  return (
    <Section as="article" size="narrow" spacing="md">
      <Seo title={`${post.title} — EKAS Healthy Foods`} description={post.excerpt} image={post.cover_image} />
      {post.cover_image && <img src={post.cover_image} alt="" className="aspect-video w-full rounded-2xl object-cover" />}
      <h1 className="mt-6 text-3xl">{post.title}</h1>
      <p className="mt-1 text-sm text-earth-500">
        {post.author_name && `By ${post.author_name} · `}
        {new Date(post.created_at).toLocaleDateString()}
      </p>
      <div className="mt-6 whitespace-pre-line leading-relaxed text-earth-800">{post.body}</div>
    </Section>
  )
}
