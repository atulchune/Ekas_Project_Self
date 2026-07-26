import axios from 'axios'

function createApiClient({ baseURL, refreshPath }) {
  const client = axios.create({
    baseURL,
    withCredentials: true,
    xsrfCookieName: 'ekas_csrftoken',
    xsrfHeaderName: 'X-CSRFToken',
  })

  let refreshing = null

  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const { response, config } = error
      if (!response) return Promise.reject(error)

      if (response.status === 401 && !config._retried && !config.url?.includes('/auth/')) {
        config._retried = true
        try {
          refreshing = refreshing || client.post(refreshPath)
          await refreshing
          refreshing = null
          return client(config)
        } catch (refreshError) {
          refreshing = null
          return Promise.reject(error)
        }
      }
      return Promise.reject(error)
    }
  )

  return client
}

export const api = createApiClient({ baseURL: '/api/v1', refreshPath: '/auth/refresh/' })
export const opsApi = createApiClient({ baseURL: '/api/v1/operations', refreshPath: '/auth/refresh/' })

export function extractErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  const data = error?.response?.data
  if (data?.error?.message) {
    const msg = data.error.message
    if (typeof msg === 'string') return msg
    if (typeof msg === 'object') {
      const first = Object.values(msg)[0]
      return Array.isArray(first) ? first[0] : String(first)
    }
  }
  return fallback
}
