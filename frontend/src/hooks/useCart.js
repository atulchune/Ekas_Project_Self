import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/apiClient'

export function useCart() {
  return useQuery({
    queryKey: ['cart'],
    queryFn: async () => (await api.get('/cart/')).data,
    staleTime: 10_000,
  })
}

export function useAddToCart() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ variantId, quantity = 1, bundleId }) =>
      (await api.post('/cart/', { variant_id: variantId, quantity, bundle_id: bundleId })).data,
    onSuccess: (data) => qc.setQueryData(['cart'], data),
  })
}

export function useUpdateCartItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ itemId, quantity }) =>
      (await api.patch(`/cart/items/${itemId}/`, { quantity })).data,
    onSuccess: (data) => qc.setQueryData(['cart'], data),
  })
}

export function useRemoveCartItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (itemId) => (await api.delete(`/cart/items/${itemId}/`)).data,
    onSuccess: (data) => qc.setQueryData(['cart'], data),
  })
}

export function useApplyCoupon() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (code) => (await api.post('/cart/apply-coupon/', { code })).data,
    onSuccess: (data) => qc.setQueryData(['cart'], data),
  })
}

export function useWishlist() {
  return useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => (await api.get('/wishlist/')).data,
  })
}

export function useToggleWishlist() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ productId, wishlistItemId, add }) =>
      add ? api.post('/wishlist/', { product_id: productId }) : api.delete(`/wishlist/${wishlistItemId}/`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['wishlist'] }),
  })
}

export function useRecentlyViewed() {
  return useQuery({
    queryKey: ['recently-viewed'],
    queryFn: async () => (await api.get('/recently-viewed/')).data,
  })
}

export function useTrackRecentlyViewed() {
  return useMutation({
    mutationFn: async (productId) => api.post('/recently-viewed/', { product_id: productId }),
  })
}
