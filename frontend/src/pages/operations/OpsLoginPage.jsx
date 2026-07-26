import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useOpsLogin, useOpsMe } from '@/hooks/useOpsAuth'
import { Button } from '@/components/ui/Button'
import { Field, Input } from '@/components/ui/primitives'
import { extractErrorMessage } from '@/lib/apiClient'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

export default function OpsLoginPage() {
  const { data: me, isLoading } = useOpsMe()
  const login = useOpsLogin()
  const navigate = useNavigate()
  const location = useLocation()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) })

  if (!isLoading && me) {
    return <Navigate to={location.state?.from?.pathname || '/operations/dashboard'} replace />
  }

  const onSubmit = (data) => {
    login.mutate(data, {
      onSuccess: () => navigate(location.state?.from?.pathname || '/operations/dashboard', { replace: true }),
      onError: (err) => setError('root', { message: extractErrorMessage(err, 'Invalid email or password') }),
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-forest-900 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
        <p className="font-serif text-2xl text-forest-800">EKAS Operations Portal</p>
        <p className="mt-1 text-sm text-earth-600">Staff sign-in</p>
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
          <Button type="submit" className="w-full" loading={login.isPending}>
            Sign In
          </Button>
        </form>
      </div>
    </div>
  )
}
