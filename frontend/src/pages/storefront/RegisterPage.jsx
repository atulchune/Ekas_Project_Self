import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { useRegister } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Field, Input } from '@/components/ui/primitives'
import { Seo } from '@/components/storefront/Seo'
import { FormContainer } from '@/components/ui/layout'
import { extractErrorMessage } from '@/lib/apiClient'

const schema = z.object({
  first_name: z.string().min(1, 'Enter your first name'),
  last_name: z.string().optional(),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'At least 8 characters'),
})

export default function RegisterPage() {
  const registerUser = useRegister()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = (data) => {
    registerUser.mutate(data, {
      onSuccess: () => navigate('/account', { replace: true }),
      onError: (err) => setError('root', { message: extractErrorMessage(err, 'Could not create your account') }),
    })
  }

  return (
    <FormContainer spacing="none" className="py-16">
      <Seo title="Create Account — EKAS Healthy Foods" />
      <h1 className="text-3xl">Create your account</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="First name" htmlFor="first_name" error={errors.first_name?.message}>
            <Input id="first_name" {...register('first_name')} invalid={!!errors.first_name} />
          </Field>
          <Field label="Last name" htmlFor="last_name">
            <Input id="last_name" {...register('last_name')} />
          </Field>
        </div>
        <Field label="Email" htmlFor="email" error={errors.email?.message}>
          <Input id="email" type="email" {...register('email')} invalid={!!errors.email} />
        </Field>
        <Field label="Password" htmlFor="password" error={errors.password?.message} hint="At least 8 characters">
          <Input id="password" type="password" {...register('password')} invalid={!!errors.password} />
        </Field>
        {errors.root && (
          <p className="text-sm text-terracotta-700" role="alert">
            {errors.root.message}
          </p>
        )}
        <Button type="submit" className="w-full" loading={registerUser.isPending}>
          Create Account
        </Button>
      </form>
      <p className="mt-6 text-sm text-earth-600">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-forest-700 underline">
          Log in
        </Link>
      </p>
    </FormContainer>
  )
}
