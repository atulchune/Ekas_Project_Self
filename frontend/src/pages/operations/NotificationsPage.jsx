import { useState } from 'react'
import { opsNotifications } from '@/hooks/opsResources'
import { DataTable } from '@/components/operations/DataTable'
import { Badge } from '@/components/ui/primitives'

const TONE = { sent: 'forest', failed: 'terracotta', pending: 'ghee' }

export default function NotificationsPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = opsNotifications.useList({ page })

  const columns = [
    { key: 'channel', header: 'Channel' },
    { key: 'template_code', header: 'Template' },
    { key: 'recipient', header: 'Recipient' },
    { key: 'subject', header: 'Subject' },
    { key: 'status', header: 'Status', render: (row) => <Badge tone={TONE[row.status] || 'earth'}>{row.status}</Badge> },
    { key: 'created_at', header: 'Sent At', render: (row) => new Date(row.created_at).toLocaleString() },
  ]

  return (
    <div>
      <h1 className="mb-4 text-2xl font-serif text-forest-800">Notifications</h1>
      <DataTable
        columns={columns}
        data={data?.results}
        isLoading={isLoading}
        page={page}
        onPageChange={setPage}
        numPages={data?.num_pages}
        exportFilename="notifications.csv"
        emptyMessage="No notifications sent yet."
      />
    </div>
  )
}
