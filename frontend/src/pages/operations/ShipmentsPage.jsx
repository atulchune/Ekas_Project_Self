import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { opsShipments } from '@/hooks/opsResources'
import { DataTable } from '@/components/operations/DataTable'
import { Drawer } from '@/components/operations/Drawer'
import { Badge, Field, Input, Select } from '@/components/ui/primitives'
import { Button } from '@/components/ui/Button'
import { hasPermission, useOpsMe } from '@/hooks/useOpsAuth'

const STATUS_OPTIONS = ['pending', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'failed', 'returned']

function ShipmentForm({ shipment, onClose }) {
  const update = opsShipments.useUpdate()
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({ defaultValues: shipment })

  const onSubmit = async (data) => {
    await update.mutateAsync({ id: shipment.id, ...data })
    onClose()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <p className="text-sm text-earth-600">{shipment.order_number}</p>
      <Field label="Courier" htmlFor="courier_name">
        <Input id="courier_name" {...register('courier_name')} />
      </Field>
      <Field label="Tracking Number" htmlFor="tracking_number">
        <Input id="tracking_number" {...register('tracking_number')} />
      </Field>
      <Field label="Tracking URL" htmlFor="tracking_url">
        <Input id="tracking_url" {...register('tracking_url')} />
      </Field>
      <Field label="Status" htmlFor="status">
        <Select id="status" {...register('status')}>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, ' ')}
            </option>
          ))}
        </Select>
      </Field>
      <Button type="submit" loading={isSubmitting}>
        Save Shipment
      </Button>
    </form>
  )
}

export default function ShipmentsPage() {
  const { data: me } = useOpsMe()
  const canManage = hasPermission(me, 'shipments.manage')
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const { data, isLoading } = opsShipments.useList({ page, search })
  const [editing, setEditing] = useState(null)

  const columns = [
    { key: 'order_number', header: 'Order #' },
    { key: 'courier_name', header: 'Courier' },
    { key: 'tracking_number', header: 'Tracking #' },
    { key: 'status', header: 'Status', render: (row) => <Badge tone="forest" className="capitalize">{row.status.replace(/_/g, ' ')}</Badge> },
  ]

  return (
    <div>
      <h1 className="mb-4 text-2xl font-serif text-forest-800">Shipments</h1>
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
        exportFilename="shipments.csv"
        rowActions={(row) =>
          canManage && (
            <button className="text-sm text-forest-700 underline" onClick={() => setEditing(row)}>
              Edit
            </button>
          )
        }
      />
      <Drawer open={!!editing} title="Edit Shipment" onClose={() => setEditing(null)}>
        {editing && <ShipmentForm shipment={editing} onClose={() => setEditing(null)} />}
      </Drawer>
    </div>
  )
}
