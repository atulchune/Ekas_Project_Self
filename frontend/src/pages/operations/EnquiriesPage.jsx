import { useState } from 'react'
import { opsEnquiries, opsEnquiryNotes } from '@/hooks/opsResources'
import { DataTable } from '@/components/operations/DataTable'
import { Drawer } from '@/components/operations/Drawer'
import { Badge, Select, Textarea } from '@/components/ui/primitives'
import { Button } from '@/components/ui/Button'
import { hasPermission, useOpsMe } from '@/hooks/useOpsAuth'

const TONE = { new: 'ghee', in_progress: 'earth', resolved: 'forest' }

function EnquiryDetail({ enquiry, onClose }) {
  const update = opsEnquiries.useUpdate()
  const { data: notes } = opsEnquiryNotes.useList({ enquiry: enquiry.id })
  const createNote = opsEnquiryNotes.useCreate()
  const [note, setNote] = useState('')

  const handleStatusChange = (status) => update.mutate({ id: enquiry.id, status })

  const handleAddNote = async (e) => {
    e.preventDefault()
    await createNote.mutateAsync({ enquiry: enquiry.id, note })
    setNote('')
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="font-medium text-forest-800">{enquiry.name}</p>
        <p className="text-sm text-earth-600">{enquiry.email} {enquiry.phone && `· ${enquiry.phone}`}</p>
        {enquiry.subject && <p className="mt-1 text-sm font-medium">{enquiry.subject}</p>}
        <p className="mt-2 text-sm text-earth-700">{enquiry.message}</p>
      </div>
      <Select value={enquiry.status} onChange={(e) => handleStatusChange(e.target.value)}>
        <option value="new">New</option>
        <option value="in_progress">In Progress</option>
        <option value="resolved">Resolved</option>
      </Select>
      <div>
        <h3 className="text-sm font-semibold text-forest-800">Notes</h3>
        <ul className="mt-2 space-y-2 text-sm">
          {notes?.results?.map((n) => (
            <li key={n.id} className="rounded-lg bg-forest-50 p-2">
              {n.note}
              <p className="mt-1 text-xs text-earth-500">{n.staff_name}</p>
            </li>
          ))}
        </ul>
        <form onSubmit={handleAddNote} className="mt-2 flex gap-2">
          <Textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Internal note" />
          <Button type="submit" size="sm" variant="outline" loading={createNote.isPending}>
            Add
          </Button>
        </form>
      </div>
    </div>
  )
}

export default function EnquiriesPage() {
  const { data: me } = useOpsMe()
  const canManage = hasPermission(me, 'enquiries.manage')
  const [page, setPage] = useState(1)
  const { data, isLoading } = opsEnquiries.useList({ page })
  const [selected, setSelected] = useState(null)

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'subject', header: 'Subject' },
    { key: 'status', header: 'Status', render: (row) => <Badge tone={TONE[row.status]}>{row.status.replace('_', ' ')}</Badge> },
    { key: 'created_at', header: 'Received', render: (row) => new Date(row.created_at).toLocaleDateString() },
  ]

  return (
    <div>
      <h1 className="mb-4 text-2xl font-serif text-forest-800">Contact Enquiries</h1>
      <DataTable
        columns={columns}
        data={data?.results}
        isLoading={isLoading}
        page={page}
        onPageChange={setPage}
        numPages={data?.num_pages}
        exportFilename="enquiries.csv"
        rowActions={(row) => (
          <button className="text-sm text-forest-700 underline" onClick={() => setSelected(row)}>
            {canManage ? 'Manage' : 'View'}
          </button>
        )}
      />
      <Drawer open={!!selected} title="Enquiry Details" onClose={() => setSelected(null)}>
        {selected && <EnquiryDetail enquiry={selected} onClose={() => setSelected(null)} />}
      </Drawer>
    </div>
  )
}
