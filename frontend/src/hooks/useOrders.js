import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/apiClient'

export function useCheckout() {
  return useMutation({
    mutationFn: async (payload) => (await api.post('/checkout/', payload)).data,
  })
}

export function useVerifyPayment() {
  return useMutation({
    mutationFn: async (payload) => (await api.post('/payments/verify/', payload)).data,
  })
}

export function useMockSimulatePayment() {
  return useMutation({
    mutationFn: async (orderNumber) => (await api.post('/payments/mock/simulate/', { order_number: orderNumber })).data,
  })
}

export function useOrders(params = {}) {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: async () => (await api.get('/orders/', { params })).data,
  })
}

export function useOrder(orderNumber) {
  return useQuery({
    queryKey: ['order', orderNumber],
    queryFn: async () => (await api.get(`/orders/${orderNumber}/`)).data,
    enabled: !!orderNumber,
  })
}

export function useCancelOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ orderNumber, reason }) =>
      (await api.post(`/orders/${orderNumber}/cancel/`, { reason })).data,
    onSuccess: (_, { orderNumber }) => {
      qc.invalidateQueries({ queryKey: ['order', orderNumber] })
      qc.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}
