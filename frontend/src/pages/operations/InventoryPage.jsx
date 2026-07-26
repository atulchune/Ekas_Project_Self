import { useState } from 'react'
import { opsInventory } from '@/hooks/opsResources'
import { opsApi } from '@/lib/apiClient'
import { useQueryClient } from '@tanstack/react-query'
import { DataTable } from '@/components/operations/DataTable'
import { Drawer } from '@/components/operations/Drawer'
import { Badge, Field, Input, Textarea } from '@/components/ui/primitives'
import { Button } from '@/components/ui/Button'
import { hasPermission, useOpsMe } from '@/hooks/useOpsAuth'
import { useUiStore } from '@/store/uiStore'

function StockActionForm({ inventory, mode, onClose }) {
  const [quantity, setQuantity] = useState('')
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const qc = useQueryClient()
  const pushToast = useUiStore((s) => s.pushToast)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (mode === 'restock') {
        await opsApi.post(`/inventory/${inventory.variant}/restock/`, { quantity: Number(quantity), reason })
      } else {
        await opsApi.post(`/inventory/${inventory.variant}/adjust/`, { on_hand_quantity: Number(quantity), reason })
      }
      qc.invalidateQueries({ queryKey: ['ops-inventory'] })
      pushToast(mode === 'restock' ? 'Stock restocked' : 'Stock adjusted')
      onClose()
    } catch {
      pushToast('Could not update stock', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-earth-600">
        {inventory.product_name} · {inventory.variant_label} · {inventory.sku}
      </p>
      <Field label={mode === 'restock' ? 'Quantity to add' : 'New on-hand quantity'} htmlFor="quantity">
        <Input id="quantity" type="number" required value={quantity} onChange={(e) => setQuantity(e.target.value)} />
      </Field>
      <Field label="Reason" htmlFor="reason" hint="Required for audit trail">
        <Textarea id="reason" required rows={2} value={reason} onChange={(e) => setReason(e.target.value)} />
      </Field>
      <Button type="submit" loading={loading}>
        {mode === 'restock' ? 'Confirm Restock' : 'Confirm Adjustment'}
      </Button>
    </form>
  )
}

export default function InventoryPage() {
  const { data: me } = useOpsMe()
  const canManage = hasPermission(me, 'inventory.manage')
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const { data, isLoading } = opsInventory.useList({ page, search })
  const [action, setAction] = useState(null)

  const columns = [
    { key: 'product_name', header: 'Product' },
    { key: 'sku', header: 'SKU' },
    { key: 'on_hand_quantity', header: 'On hand' },
    { key: 'reserved_quantity', header: 'Reserved' },
    {
      key: 'available_quantity',
      header: 'Available',
      render: (row) => (
        <Badge tone={row.available_quantity <= row.low_stock_threshold ? 'terracotta' : 'forest'}>{row.available_quantity}</Badge>
      ),
    },
    { key: 'low_stock_threshold', header: 'Low stock at' },
  ]

  return (
    <div>
      <h1 className="mb-4 text-2xl font-serif text-forest-800">Inventory</h1>
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
        exportFilename="inventory.csv"
        rowActions={(row) =>
          canManage && (
            <div className="flex justify-end gap-3">
              <button className="text-sm text-forest-700 underline" onClick={() => setAction({ mode: 'restock', inventory: row })}>
                Restock
              </button>
              <button className="text-sm text-earth-700 underline" onClick={() => setAction({ mode: 'adjust', inventory: row })}>
                Adjust
              </button>
            </div>
          )
        }
      />

      <Drawer open={!!action} title={action?.mode === 'restock' ? 'Restock' : 'Adjust Stock'} onClose={() => setAction(null)}>
        {action && <StockActionForm inventory={action.inventory} mode={action.mode} onClose={() => setAction(null)} />}
      </Drawer>
    </div>
  )
}
