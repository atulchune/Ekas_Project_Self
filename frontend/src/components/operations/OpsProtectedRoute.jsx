import { Navigate, useLocation } from 'react-router-dom'
import { useOpsMe } from '@/hooks/useOpsAuth'
import { PageLoader } from '@/components/ui/PageLoader'

export function OpsProtectedRoute({ children }) {
  const { data: me, isLoading } = useOpsMe()
  const location = useLocation()

  if (isLoading) return <PageLoader />
  if (!me) return <Navigate to="/operations/login" state={{ from: location }} replace />
  return children
}
