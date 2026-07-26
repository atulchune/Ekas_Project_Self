import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { api } from '@/lib/apiClient'
import { Button } from '@/components/ui/Button'
import { Field, Input } from '@/components/ui/primitives'
import { Seo } from '@/components/storefront/Seo'
import { FormContainer } from '@/components/ui/layout'

const schema = z.object({ email: z.string().email('Enter a valid email') })

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    await api.post('/auth/password-reset/', data)
    setSent(true)
  }

  return (
    <FormContainer spacing="none" className="py-16">
      <Seo title="Forgot Password — EKAS Healthy Foods" />
      <h1 className="text-3xl">Reset your password</h1>
      {sent ? (
        <p className="mt-4 text-earth-700">If an account exists for that email, we&apos;ve sent password reset instructions.</p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <Field label="Email" htmlFor="email" error={errors.email?.message}>
            <Input id="email" type="email" {...register('email')} invalid={!!errors.email} />
          </Field>
          <Button type="submit" className="w-full" loading={isSubmitting}>
            Send Reset Link
          </Button>
        </form>
      )}
    </FormContainer>
  )
}
