import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Seo } from '@/components/storefront/Seo'
import { FormContainer } from '@/components/ui/layout'

export default function NotFound() {
  return (
    <FormContainer spacing="none" className="py-24 text-center">
      <Seo title="Page Not Found — EKAS Healthy Foods" />
      <p className="font-serif text-6xl text-forest-300">404</p>
      <h1 className="mt-4 text-2xl">This page has wandered off</h1>
      <p className="mt-2 text-earth-700">The page you're looking for doesn't exist or has moved.</p>
      <Button as={Link} to="/" className="mt-6">
        Back to Home
      </Button>
    </FormContainer>
  )
}
