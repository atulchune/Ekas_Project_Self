import { useState } from 'react'
import { opsAuditLogs } from '@/hooks/opsResources'
import { DataTable } from '@/components/operations/DataTable'
import { Badge } from '@/components/ui/primitives'

export default function AuditLogsPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const { data, isLoading } = opsAuditLogs.useList({ page, search })

  const columns = [
    { key: 'created_at', header: 'Time', render: (row) => new Date(row.created_at).toLocaleString() },
    { key: 'staff_email', header: 'Staff' },
    { key: 'action', header: 'Action', render: (row) => <Badge tone="forest">{row.action}</Badge> },
    { key: 'resource_type', header: 'Resource' },
    { key: 'resource_id', header: 'Resource ID' },
    { key: 'ip_address', header: 'IP' },
  ]

  return (
    <div>
      <h1 className="mb-4 text-2xl font-serif text-forest-800">Audit Logs</h1>
      <DataTable
        columns={columns}
        data={data?.results}
        isLoading={isLoading}
        search={search}
        onSearchChange={(v) => {
          setSearch(v)
          setPage(1)
        }}
        page={page}
        onPageChange={setPage}
        numPages={data?.num_pages}
        exportFilename="audit-logs.csv"
      />
    </div>
  )
}
