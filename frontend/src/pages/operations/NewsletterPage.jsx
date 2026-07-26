import { useState } from 'react'
import { opsNewsletterSubscribers } from '@/hooks/opsResources'
import { opsApi } from '@/lib/apiClient'
import { DataTable } from '@/components/operations/DataTable'
import { Card, Field, Input, Textarea } from '@/components/ui/primitives'
import { Button } from '@/components/ui/Button'
import { hasPermission, useOpsMe } from '@/hooks/useOpsAuth'
import { useUiStore } from '@/store/uiStore'

export default function NewsletterPage() {
  const { data: me } = useOpsMe()
  const canManage = hasPermission(me, 'newsletter.manage')
  const [page, setPage] = useState(1)
  const { data, isLoading } = opsNewsletterSubscribers.useList({ page })
  const pushToast = useUiStore((s) => s.pushToast)
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)

  const columns = [
    { key: 'email', header: 'Email' },
    { key: 'source', header: 'Source' },
    { key: 'is_active', header: 'Active', render: (row) => (row.is_active ? 'Yes' : 'No') },
    { key: 'created_at', header: 'Subscribed', render: (row) => new Date(row.created_at).toLocaleDateString() },
  ]

  const sendCampaign = async (e) => {
    e.preventDefault()
    setSending(true)
    try {
      await opsApi.post('/newsletter/send-campaign/', { subject, body })
      pushToast('Newsletter campaign queued')
      setSubject('')
      setBody('')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-serif text-forest-800">Newsletter</h1>

      {canManage && (
        <Card className="p-5">
          <h2 className="text-lg text-forest-800">Send Campaign</h2>
          <form onSubmit={sendCampaign} className="mt-3 space-y-3">
            <Field label="Subject" htmlFor="subject">
              <Input id="subject" required value={subject} onChange={(e) => setSubject(e.target.value)} />
            </Field>
            <Field label="Body" htmlFor="body">
              <Textarea id="body" rows={4} required value={body} onChange={(e) => setBody(e.target.value)} />
            </Field>
            <Button type="submit" loading={sending}>
              Send to All Subscribers
            </Button>
          </form>
        </Card>
      )}

      <DataTable
        columns={columns}
        data={data?.results}
        isLoading={isLoading}
        page={page}
        onPageChange={setPage}
        numPages={data?.num_pages}
        exportFilename="newsletter-subscribers.csv"
      />
    </div>
  )
}
