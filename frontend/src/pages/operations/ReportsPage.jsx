import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { opsApi } from '@/lib/apiClient'
import { Card, Field, Input } from '@/components/ui/primitives'
import { Button } from '@/components/ui/Button'

const REPORT_LABELS = {
  sales: 'Sales',
  inventory: 'Inventory',
  payments: 'Payments',
  coupons: 'Coupon Usage',
  customers: 'Customers',
  newsletter: 'Newsletter Growth',
  refunds: 'Refunds',
}

export default function ReportsPage() {
  const { data } = useQuery({
    queryKey: ['ops-reports'],
    queryFn: async () => (await opsApi.get('/reports/')).data,
  })
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')

  const handleExport = (reportType) => {
    const params = new URLSearchParams()
    if (start) params.set('start', start)
    if (end) params.set('end', end)
    window.open(`/api/v1/operations/reports/${reportType}/export/?${params.toString()}`, '_blank')
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-serif text-forest-800">Reports</h1>
      <Card className="mb-6 p-5">
        <div className="flex flex-wrap gap-4">
          <Field label="Start date" htmlFor="start">
            <Input id="start" type="date" value={start} onChange={(e) => setStart(e.target.value)} />
          </Field>
          <Field label="End date" htmlFor="end">
            <Input id="end" type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
          </Field>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {data?.available_reports?.map((reportType) => (
          <Card key={reportType} className="flex items-center justify-between p-5">
            <span className="font-medium text-forest-800">{REPORT_LABELS[reportType] || reportType}</span>
            <Button size="sm" variant="outline" onClick={() => handleExport(reportType)}>
              Export CSV
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
