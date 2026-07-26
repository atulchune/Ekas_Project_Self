import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/apiClient'

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => (await api.get('/categories/')).data,
    staleTime: 5 * 60_000,
  })
}

export function useProducts(params = {}) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => (await api.get('/products/', { params })).data,
    placeholderData: (prev) => prev,
  })
}

export function useProduct(slug) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => (await api.get(`/products/${slug}/`)).data,
    enabled: !!slug,
  })
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => (await api.get('/products/featured/')).data,
  })
}

export function useBestsellers() {
  return useQuery({
    queryKey: ['products', 'bestsellers'],
    queryFn: async () => (await api.get('/products/bestsellers/')).data,
  })
}

export function useSearchSuggestions(query) {
  return useQuery({
    queryKey: ['search-suggestions', query],
    queryFn: async () => (await api.get('/products/suggestions/', { params: { q: query } })).data,
    enabled: query.length >= 2,
  })
}

export function useBundles() {
  return useQuery({
    queryKey: ['combos'],
    queryFn: async () => (await api.get('/combos/')).data,
  })
}

export function useBundle(slug) {
  return useQuery({
    queryKey: ['combo', slug],
    queryFn: async () => (await api.get(`/combos/${slug}/`)).data,
    enabled: !!slug,
  })
}

export function usePincodeCheck() {
  return async (pincode) => (await api.get('/pincode-check/', { params: { pincode } })).data
}
