import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useLogin } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Field, Input } from '@/components/ui/primitives'
import { Seo } from '@/components/storefront/Seo'
import { FormContainer } from '@/components/ui/layout'
import { extractErrorMessage } from '@/lib/apiClient'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

export default function LoginPage() {
  const login = useLogin()
  const navigate = useNavigate()
  const location = useLocation()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = (data) => {
    login.mutate(data, {
      onSuccess: () => navigate(location.state?.from?.pathname || '/account', { replace: true }),
      onError: (err) => setError('root', { message: extractErrorMessage(err, 'Invalid email or password') }),
    })
  }

  return (
    <FormContainer spacing="none" className="py-16">
      <Seo title="Log In — EKAS Healthy Foods" />
      <h1 className="text-3xl">Welcome back</h1>
      <p className="mt-1 text-earth-600">Log in to manage orders, addresses, and your wishlist.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <Field label="Email" htmlFor="email" error={errors.email?.message}>
          <Input id="email" type="email" {...register('email')} invalid={!!errors.email} />
        </Field>
        <Field label="Password" htmlFor="password" error={errors.password?.message}>
          <Input id="password" type="password" {...register('password')} invalid={!!errors.password} />
        </Field>
        {errors.root && (
          <p className="text-sm text-terracotta-700" role="alert">
            {errors.root.message}
          </p>
        )}
        <div className="flex items-center justify-between">
          <Link to="/forgot-password" className="text-sm text-forest-700 underline">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" className="w-full" loading={login.isPending}>
          Log In
        </Button>
      </form>
      <p className="mt-6 text-sm text-earth-600">
        New to EKAS?{' '}
        <Link to="/register" className="font-medium text-forest-700 underline">
          Create an account
        </Link>
      </p>
    </FormContainer>
  )
}
