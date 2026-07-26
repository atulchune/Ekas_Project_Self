import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Field, Input } from '@/components/ui/primitives'

const schema = z.object({
  full_name: z.string().min(2, 'Enter the recipient name'),
  phone: z.string().min(10, 'Enter a valid 10-digit phone number').max(15),
  line1: z.string().min(3, 'Enter the address line'),
  line2: z.string().optional(),
  city: z.string().min(2, 'Enter a city'),
  state: z.string().min(2, 'Enter a state'),
  pincode: z.string().min(6, 'Enter a valid 6-digit pincode').max(6),
  is_default: z.boolean().optional(),
})

export function AddressForm({ defaultValues, onSubmit, submitLabel = 'Save Address', isSubmitting }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema), defaultValues })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Field label="Full name" htmlFor="full_name" error={errors.full_name?.message}>
        <Input id="full_name" {...register('full_name')} invalid={!!errors.full_name} />
      </Field>
      <Field label="Phone number" htmlFor="phone" error={errors.phone?.message}>
        <Input id="phone" {...register('phone')} invalid={!!errors.phone} />
      </Field>
      <Field label="Address line 1" htmlFor="line1" error={errors.line1?.message}>
        <Input id="line1" {...register('line1')} invalid={!!errors.line1} />
      </Field>
      <Field label="Address line 2 (optional)" htmlFor="line2">
        <Input id="line2" {...register('line2')} />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="City" htmlFor="city" error={errors.city?.message}>
          <Input id="city" {...register('city')} invalid={!!errors.city} />
        </Field>
        <Field label="State" htmlFor="state" error={errors.state?.message}>
          <Input id="state" {...register('state')} invalid={!!errors.state} />
        </Field>
      </div>
      <Field label="Pincode" htmlFor="pincode" error={errors.pincode?.message}>
        <Input id="pincode" {...register('pincode')} invalid={!!errors.pincode} maxLength={6} />
      </Field>
      <label className="flex items-center gap-2 text-sm text-earth-700">
        <input type="checkbox" {...register('is_default')} /> Set as default address
      </label>
      <Button type="submit" loading={isSubmitting}>
        {submitLabel}
      </Button>
    </form>
  )
}
