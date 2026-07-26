import { useState } from 'react'
import { opsReviews } from '@/hooks/opsResources'
import { DataTable } from '@/components/operations/DataTable'
import { Drawer } from '@/components/operations/Drawer'
import { Badge, Field, Select, StarRating, Textarea } from '@/components/ui/primitives'
import { Button } from '@/components/ui/Button'
import { hasPermission, useOpsMe } from '@/hooks/useOpsAuth'

function ReviewModerationForm({ review, onClose }) {
  const update = opsReviews.useUpdate()
  const [status, setStatus] = useState(review.status)
  const [reply, setReply] = useState(review.staff_reply || '')

  const handleSubmit = async (e) => {
    e.preventDefault()
    await update.mutateAsync({ id: review.id, status, staff_reply: reply })
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <StarRating value={review.rating} />
        <p className="mt-1 font-medium text-forest-800">{review.title}</p>
        <p className="mt-1 text-sm text-earth-700">{review.body}</p>
        <p className="mt-1 text-xs text-earth-500">
          {review.customer_email} on {review.product_name}
        </p>
      </div>
      <Field label="Moderation Status" htmlFor="status">
        <Select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </Select>
      </Field>
      <Field label="Staff Reply" htmlFor="reply">
        <Textarea id="reply" rows={3} value={reply} onChange={(e) => setReply(e.target.value)} />
      </Field>
      <Button type="submit" loading={update.isPending}>
        Save
      </Button>
    </form>
  )
}

export default function ReviewsPage() {
  const { data: me } = useOpsMe()
  const canManage = hasPermission(me, 'reviews.manage')
  const [page, setPage] = useState(1)
  const { data, isLoading } = opsReviews.useList({ page })
  const [editing, setEditing] = useState(null)

  const columns = [
    { key: 'product_name', header: 'Product' },
    { key: 'customer_email', header: 'Customer' },
    { key: 'rating', header: 'Rating' },
    { key: 'status', header: 'Status', render: (row) => <Badge tone={row.status === 'approved' ? 'forest' : 'ghee'}>{row.status}</Badge> },
  ]

  return (
    <div>
      <h1 className="mb-4 text-2xl font-serif text-forest-800">Reviews</h1>
      <DataTable
        columns={columns}
        data={data?.results}
        isLoading={isLoading}
        page={page}
        onPageChange={setPage}
        numPages={data?.num_pages}
        exportFilename="reviews.csv"
        rowActions={(row) =>
          canManage && (
            <button className="text-sm text-forest-700 underline" onClick={() => setEditing(row)}>
              Moderate
            </button>
          )
        }
      />
      <Drawer open={!!editing} title="Moderate Review" onClose={() => setEditing(null)}>
        {editing && <ReviewModerationForm review={editing} onClose={() => setEditing(null)} />}
      </Drawer>
    </div>
  )
}
