import { useMutation, useQuery } from '@tanstack/react-query'
import { api } from '@/lib/apiClient'

export function useHomepageContent() {
  return useQuery({
    queryKey: ['homepage'],
    queryFn: async () => (await api.get('/homepage/')).data,
    staleTime: 60_000,
  })
}

export function useRecipes() {
  return useQuery({
    queryKey: ['recipes'],
    queryFn: async () => (await api.get('/recipes/')).data,
  })
}

export function useRecipe(slug) {
  return useQuery({
    queryKey: ['recipe', slug],
    queryFn: async () => (await api.get(`/recipes/${slug}/`)).data,
    enabled: !!slug,
  })
}

export function useBlogPosts() {
  return useQuery({
    queryKey: ['blog'],
    queryFn: async () => (await api.get('/blog/')).data,
  })
}

export function useBlogPost(slug) {
  return useQuery({
    queryKey: ['blog', slug],
    queryFn: async () => (await api.get(`/blog/${slug}/`)).data,
    enabled: !!slug,
  })
}

export function useStaticPage(slug) {
  return useQuery({
    queryKey: ['page', slug],
    queryFn: async () => (await api.get(`/pages/${slug}/`)).data,
    enabled: !!slug,
    retry: false,
  })
}

export function useSubscribeNewsletter() {
  return useMutation({
    mutationFn: async (email) => api.post('/newsletter/subscribe/', { email, source: 'footer' }),
  })
}

export function useSubmitContact() {
  return useMutation({
    mutationFn: async (payload) => api.post('/contact/', payload),
  })
}

export function useProductReviews(productSlug) {
  return useQuery({
    queryKey: ['reviews', productSlug],
    queryFn: async () => (await api.get('/reviews/', { params: { product: productSlug } })).data,
    enabled: !!productSlug,
  })
}

export function useSubmitReview() {
  return useMutation({
    mutationFn: async (payload) => (await api.post('/reviews/', payload)).data,
  })
}

export function useNotifyMe() {
  return useMutation({
    mutationFn: async ({ email, variantId }) => api.post('/stock-notifications/', { email, variant: variantId }),
  })
}
