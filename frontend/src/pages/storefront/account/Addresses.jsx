import { useState } from 'react'
import { useAddresses, useDeleteAddress, useSaveAddress } from '@/hooks/useAuth'
import { Card, EmptyState } from '@/components/ui/primitives'
import { Button } from '@/components/ui/Button'
import { AddressForm } from '@/components/storefront/AddressForm'
import { useUiStore } from '@/store/uiStore'

export default function Addresses() {
  const { data: addresses, isLoading } = useAddresses()
  const saveAddress = useSaveAddress()
  const deleteAddress = useDeleteAddress()
  const pushToast = useUiStore((s) => s.pushToast)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)

  const handleSubmit = (payload) => {
    saveAddress.mutate(
      { id: editing?.id, ...payload },
      {
        onSuccess: () => {
          pushToast('Address saved')
          setShowForm(false)
          setEditing(null)
        },
      }
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg">Saved Addresses</h2>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setEditing(null)
            setShowForm((s) => !s)
          }}
        >
          {showForm ? 'Cancel' : 'Add Address'}
        </Button>
      </div>

      {showForm && (
        <Card className="p-5">
          <AddressForm defaultValues={editing} onSubmit={handleSubmit} isSubmitting={saveAddress.isPending} />
        </Card>
      )}

      {!isLoading && addresses?.length === 0 && !showForm && (
        <EmptyState title="No saved addresses" description="Add an address to speed up checkout." />
      )}

      <div className="space-y-3">
        {addresses?.map((addr) => (
          <Card key={addr.id} className="flex items-start justify-between p-4">
            <div className="text-sm">
              <p className="font-medium text-forest-800">
                {addr.full_name} {addr.is_default && <span className="ml-2 text-xs text-leaf-600">Default</span>}
              </p>
              <p className="text-earth-600">{addr.phone}</p>
              <p className="text-earth-600">
                {addr.line1}, {addr.line2 && `${addr.line2}, `}
                {addr.city}, {addr.state} {addr.pincode}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                className="text-sm font-medium text-forest-700 underline"
                onClick={() => {
                  setEditing(addr)
                  setShowForm(true)
                }}
              >
                Edit
              </button>
              <button className="text-sm font-medium text-terracotta-700 underline" onClick={() => deleteAddress.mutate(addr.id)}>
                Delete
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
