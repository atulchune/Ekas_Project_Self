import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, MapPin, Phone } from 'lucide-react'
import { useSubmitContact } from '@/hooks/useContent'
import { Button } from '@/components/ui/Button'
import { Card, Field, Input, Textarea } from '@/components/ui/primitives'
import { Section, SidebarLayout } from '@/components/ui/layout'
import { Seo } from '@/components/storefront/Seo'

const CONTACT_DETAILS = [
  { icon: Phone, label: '+91 90812 38888', href: 'tel:+919081238888' },
  { icon: Mail, label: 'wecare@ekashealthyfoods.com', href: 'mailto:wecare@ekashealthyfoods.com' },
  { icon: MapPin, label: 'Plot No. 39, Diamond Industrial Estate, Daman 396210', href: null },
]

const schema = z.object({
  name: z.string().min(2, 'Enter your name'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, 'Tell us a bit more (at least 10 characters)'),
})

export default function ContactPage() {
  const submitContact = useSubmitContact()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = (data) => submitContact.mutate(data, { onSuccess: () => reset() })

  return (
    <Section size="default" spacing="lg">
      <Seo title="Contact Us — EKAS Healthy Foods" />
      <h1 className="text-3xl">Contact Us</h1>
      <p className="mt-2 max-w-2xl text-earth-700">
        Questions about an order, ingredients, or wholesale? We'd love to hear from you.
      </p>

      <SidebarLayout
        className="mt-8"
        aside={
          <Card className="space-y-4 p-5">
            <h2 className="text-lg">Reach us directly</h2>
            <ul className="space-y-3 text-sm text-earth-700">
              {CONTACT_DETAILS.map(({ icon: Icon, label, href }) => (
                <li key={label} className="flex items-start gap-3">
                  <Icon className="mt-0.5 size-4 shrink-0 text-forest-700" aria-hidden="true" />
                  {href ? (
                    <a href={href} className="min-w-0 break-words hover:text-forest-700">
                      {label}
                    </a>
                  ) : (
                    <span className="min-w-0 break-words">{label}</span>
                  )}
                </li>
              ))}
            </ul>
          </Card>
        }
      >
        {isSubmitSuccessful ? (
          <div className="rounded-2xl bg-forest-50 p-5 text-forest-800">
            Thank you for reaching out! Our team will respond within 1-2 business days.
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Name" htmlFor="name" error={errors.name?.message}>
                <Input id="name" {...register('name')} invalid={!!errors.name} />
              </Field>
              <Field label="Email" htmlFor="email" error={errors.email?.message}>
                <Input id="email" type="email" {...register('email')} invalid={!!errors.email} />
              </Field>
            </div>
            <Field label="Phone (optional)" htmlFor="phone">
              <Input id="phone" {...register('phone')} />
            </Field>
            <Field label="Subject (optional)" htmlFor="subject">
              <Input id="subject" {...register('subject')} />
            </Field>
            <Field label="Message" htmlFor="message" error={errors.message?.message}>
              <Textarea id="message" rows={5} {...register('message')} invalid={!!errors.message} />
            </Field>
            <Button type="submit" loading={submitContact.isPending}>
              Send Message
            </Button>
          </form>
        )}
      </SidebarLayout>
    </Section>
  )
}
