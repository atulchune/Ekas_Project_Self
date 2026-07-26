import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/apiClient'

export function useMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/auth/me/')
        return data
      } catch (err) {
        if (err.response?.status === 401) return null
        throw err
      }
    },
    staleTime: 60_000,
  })
}

export function useLogin() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ email, password }) => {
      const { data } = await api.post('/auth/login/', { email, password })
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['me'] })
      qc.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}

export function useRegister() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post('/auth/register/', payload)
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['me'] })
      qc.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}

export function useLogout() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async () => api.post('/auth/logout/'),
    onSuccess: () => {
      qc.setQueryData(['me'], null)
      qc.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}

export function useAddresses() {
  return useQuery({
    queryKey: ['addresses'],
    queryFn: async () => (await api.get('/addresses/')).data,
  })
}

export function useSaveAddress() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...payload }) =>
      id ? api.patch(`/addresses/${id}/`, payload) : api.post('/addresses/', payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['addresses'] }),
  })
}

export function useDeleteAddress() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id) => api.delete(`/addresses/${id}/`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['addresses'] }),
  })
}
