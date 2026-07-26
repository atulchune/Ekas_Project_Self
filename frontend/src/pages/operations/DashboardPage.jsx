import { useQuery } from '@tanstack/react-query'
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { opsApi } from '@/lib/apiClient'
import { Card } from '@/components/ui/primitives'
import { PageLoader } from '@/components/ui/PageLoader'

const CHART_COLORS = ['#2e5c31', '#dba431', '#c46a44', '#5c7c2c', '#8a5a34']

function StatCard({ label, value, sub }) {
  return (
    <Card className="p-5">
      <p className="text-sm text-earth-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-forest-800">{value}</p>
      {sub && <p className="mt-1 text-xs text-earth-500">{sub}</p>}
    </Card>
  )
}

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['ops-dashboard'],
    queryFn: async () => (await opsApi.get('/dashboard/')).data,
    refetchInterval: 60_000,
  })

  if (isLoading) return <PageLoader />
  if (!data) return null

  const salesData = [
    { period: 'Today', revenue: Number(data.sales_today.revenue) },
    { period: 'This week', revenue: Number(data.sales_week.revenue) },
    { period: 'This month', revenue: Number(data.sales_month.revenue) },
  ]
  const paymentData = Object.entries(data.payment_status_breakdown || {}).map(([status, count]) => ({ status, count }))

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-serif text-forest-800">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Revenue today" value={`₹${data.sales_today.revenue}`} sub={`${data.sales_today.orders} orders`} />
        <StatCard label="Pending fulfilment" value={data.pending_fulfilment} />
        <StatCard label="Avg. order value" value={`₹${Number(data.average_order_value).toFixed(0)}`} />
        <StatCard label="Cancellations" value={data.cancellations} sub={`${data.refunds} refunds`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="text-lg text-forest-800">Sales overview</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e4e7" />
                <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="revenue" fill="#2e5c31" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-lg text-forest-800">Payment status</h2>
          <div className="mt-4 h-64">
            {paymentData.length ? (
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={paymentData} dataKey="count" nameKey="status" outerRadius={90} label>
                    {paymentData.map((entry, i) => (
                      <Cell key={entry.status} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-earth-500">No payment data yet.</p>
            )}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="text-lg text-forest-800">Best sellers</h2>
          <ul className="mt-3 divide-y divide-forest-50 text-sm">
            {data.best_sellers.length ? (
              data.best_sellers.map((b, i) => (
                <li key={i} className="flex justify-between py-2">
                  <span>{b.product_name}</span>
                  <span className="font-medium">{b.units_sold} sold</span>
                </li>
              ))
            ) : (
              <p className="py-2 text-earth-500">No sales yet.</p>
            )}
          </ul>
        </Card>

        <Card className="p-5">
          <h2 className="text-lg text-forest-800">Low stock variants</h2>
          <ul className="mt-3 divide-y divide-forest-50 text-sm">
            {data.low_stock_variants.length ? (
              data.low_stock_variants.map((v, i) => (
                <li key={i} className="flex justify-between py-2">
                  <span>
                    {v.product} ({v.sku})
                  </span>
                  <span className="font-medium text-terracotta-700">{v.available} left</span>
                </li>
              ))
            ) : (
              <p className="py-2 text-earth-500">All stock levels healthy.</p>
            )}
          </ul>
        </Card>
      </div>

      <Card className="p-5">
        <h2 className="text-lg text-forest-800">Recent orders</h2>
        <ul className="mt-3 divide-y divide-forest-50 text-sm">
          {data.recent_orders.map((o) => (
            <li key={o.order_number} className="flex justify-between py-2">
              <span>{o.order_number}</span>
              <span className="capitalize text-earth-600">{o.status.replace(/_/g, ' ')}</span>
              <span className="font-medium">₹{o.total}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
