import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api, extractErrorMessage } from '@/lib/apiClient'
import { Seo } from '@/components/storefront/Seo'
import { PageLoader } from '@/components/ui/PageLoader'
import { Button } from '@/components/ui/Button'
import { FormContainer } from '@/components/ui/layout'

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [state, setState] = useState('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setState('error')
      setMessage('Missing verification token.')
      return
    }
    api
      .post('/auth/verify-email/', { token })
      .then(() => setState('success'))
      .catch((err) => {
        setState('error')
        setMessage(extractErrorMessage(err, 'This verification link is invalid or expired.'))
      })
  }, [token])

  return (
    <FormContainer spacing="none" className="py-16 text-center">
      <Seo title="Verify Email — EKAS Healthy Foods" />
      {state === 'loading' && <PageLoader />}
      {state === 'success' && (
        <>
          <h1 className="text-2xl">Email verified!</h1>
          <p className="mt-2 text-earth-700">Your email address has been confirmed.</p>
          <Button as={Link} to="/account" className="mt-6">
            Go to my account
          </Button>
        </>
      )}
      {state === 'error' && (
        <>
          <h1 className="text-2xl">Verification failed</h1>
          <p className="mt-2 text-terracotta-700">{message}</p>
        </>
      )}
    </FormContainer>
  )
}
