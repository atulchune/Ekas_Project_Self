import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { opsApi } from '@/lib/apiClient'

/**
 * Factory producing a matched set of list/get/create/update/delete hooks for
 * a single Operations Portal REST resource. Every ops screen (products,
 * categories, coupons, staff, ...) is CRUD over one of these resources, so
 * centralizing the wiring here keeps ~20 modules from re-implementing the
 * same query/mutation boilerplate.
 */
export function createOpsResource(resourcePath, key) {
  const listKey = [key, 'list']

  function useList(params = {}) {
    return useQuery({
      queryKey: [...listKey, params],
      queryFn: async () => (await opsApi.get(`/${resourcePath}/`, { params })).data,
      placeholderData: (prev) => prev,
    })
  }

  function useGet(id) {
    return useQuery({
      queryKey: [key, id],
      queryFn: async () => (await opsApi.get(`/${resourcePath}/${id}/`)).data,
      enabled: !!id,
    })
  }

  function useCreate() {
    const qc = useQueryClient()
    return useMutation({
      mutationFn: async (payload) => (await opsApi.post(`/${resourcePath}/`, payload)).data,
      onSuccess: () => qc.invalidateQueries({ queryKey: listKey }),
    })
  }

  function useUpdate() {
    const qc = useQueryClient()
    return useMutation({
      mutationFn: async ({ id, ...payload }) => (await opsApi.patch(`/${resourcePath}/${id}/`, payload)).data,
      onSuccess: (_, { id }) => {
        qc.invalidateQueries({ queryKey: listKey })
        qc.invalidateQueries({ queryKey: [key, id] })
      },
    })
  }

  function useDelete() {
    const qc = useQueryClient()
    return useMutation({
      mutationFn: async (id) => opsApi.delete(`/${resourcePath}/${id}/`),
      onSuccess: () => qc.invalidateQueries({ queryKey: listKey }),
    })
  }

  return { useList, useGet, useCreate, useUpdate, useDelete }
}
