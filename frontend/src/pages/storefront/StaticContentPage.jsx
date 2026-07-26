import { useStaticPage } from '@/hooks/useContent'
import { PageLoader } from '@/components/ui/PageLoader'
import { EmptyState } from '@/components/ui/primitives'
import { Section } from '@/components/ui/layout'
import { Seo } from '@/components/storefront/Seo'

export default function StaticContentPage({ slug, title }) {
  const { data: page, isLoading, isError } = useStaticPage(slug)

  if (isLoading) return <PageLoader />

  return (
    <Section size="narrow" spacing="lg">
      <Seo title={`${title} — EKAS Healthy Foods`} />
      <h1 className="text-3xl">{page?.title || title}</h1>
      {isError || !page ? (
        <EmptyState title="Content coming soon" description="This page is being prepared and will be published shortly." />
      ) : (
        <div className="mt-6 max-w-none whitespace-pre-line leading-relaxed text-earth-800">{page.body}</div>
      )}
    </Section>
  )
}
