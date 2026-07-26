import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { api, extractErrorMessage } from '@/lib/apiClient'
import { Button } from '@/components/ui/Button'
import { Field, Input } from '@/components/ui/primitives'
import { Seo } from '@/components/storefront/Seo'
import { FormContainer } from '@/components/ui/layout'

const schema = z.object({ password: z.string().min(8, 'At least 8 characters') })

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    try {
      await api.post('/auth/password-reset/confirm/', { token, password: data.password })
      navigate('/login')
    } catch (err) {
      setError('root', { message: extractErrorMessage(err, 'This reset link is invalid or expired.') })
    }
  }

  if (!token) {
    return (
      <FormContainer spacing="none" className="py-16 text-center">
        <p>Missing reset token. Please use the link from your email.</p>
        <Link to="/forgot-password" className="mt-2 inline-block text-forest-700 underline">
          Request a new link
        </Link>
      </FormContainer>
    )
  }

  return (
    <FormContainer spacing="none" className="py-16">
      <Seo title="Reset Password — EKAS Healthy Foods" />
      <h1 className="text-3xl">Choose a new password</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <Field label="New password" htmlFor="password" error={errors.password?.message}>
          <Input id="password" type="password" {...register('password')} invalid={!!errors.password} />
        </Field>
        {errors.root && (
          <p className="text-sm text-terracotta-700" role="alert">
            {errors.root.message}
          </p>
        )}
        <Button type="submit" className="w-full" loading={isSubmitting}>
          Reset Password
        </Button>
      </form>
    </FormContainer>
  )
}
