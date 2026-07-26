import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { opsApi } from '@/lib/apiClient'

export function useOpsMe() {
  return useQuery({
    queryKey: ['ops-me'],
    queryFn: async () => {
      try {
        const { data } = await opsApi.get('/auth/me/')
        return data
      } catch (err) {
        if (err.response?.status === 401) return null
        throw err
      }
    },
    staleTime: 30_000,
    retry: false,
  })
}

export function useOpsLogin() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ email, password }) => (await opsApi.post('/auth/login/', { email, password })).data,
    onSuccess: (data) => qc.setQueryData(['ops-me'], data),
  })
}

export function useOpsLogout() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async () => opsApi.post('/auth/logout/'),
    onSuccess: () => qc.setQueryData(['ops-me'], null),
  })
}

export function useOpsSessions() {
  return useQuery({
    queryKey: ['ops-sessions'],
    queryFn: async () => (await opsApi.get('/auth/sessions/')).data,
  })
}

export function useRevokeOtherSessions() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async () => opsApi.delete('/auth/sessions/'),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ops-sessions'] }),
  })
}

export function hasPermission(me, code) {
  if (!me) return false
  if (me.is_super_admin) return true
  return me.permissions?.includes(code)
}
