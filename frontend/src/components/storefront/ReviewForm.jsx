import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Field, Input, Textarea } from '@/components/ui/primitives'
import { useUiStore } from '@/store/uiStore'

export function ReviewForm({ productId, onSubmit, isAuthenticated }) {
  const [rating, setRating] = useState(5)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const pushToast = useUiStore((s) => s.pushToast)

  if (!isAuthenticated) {
    return (
      <div className="rounded-2xl border border-dashed border-forest-200 p-5 text-sm text-earth-700">
        <Link to="/login" className="font-medium text-forest-700 underline">
          Log in
        </Link>{' '}
        to write a review.
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-forest-100 bg-forest-50 p-5 text-sm text-forest-800">
        Thank you! Your review will appear once it&apos;s moderated.
      </div>
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(
      { product: productId, rating, title, body },
    )
    setSubmitted(true)
    pushToast('Review submitted for moderation')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-2xl border border-forest-100 p-5">
      <Field label="Rating">
        <div className="flex gap-1 text-2xl text-ghee-500">
          {[1, 2, 3, 4, 5].map((s) => (
            <button type="button" key={s} onClick={() => setRating(s)} aria-label={`${s} stars`}>
              {s <= rating ? '★' : '☆'}
            </button>
          ))}
        </div>
      </Field>
      <Field label="Title">
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Summarize your experience" />
      </Field>
      <Field label="Your review">
        <Textarea rows={4} value={body} onChange={(e) => setBody(e.target.value)} required />
      </Field>
      <Button type="submit">Submit Review</Button>
    </form>
  )
}
