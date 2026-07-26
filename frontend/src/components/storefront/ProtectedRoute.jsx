import { Navigate, useLocation } from 'react-router-dom'
import { useMe } from '@/hooks/useAuth'
import { PageLoader } from '@/components/ui/PageLoader'

export function ProtectedRoute({ children }) {
  const { data: me, isLoading } = useMe()
  const location = useLocation()

  if (isLoading) return <PageLoader />
  if (!me) return <Navigate to="/login" state={{ from: location }} replace />
  return children
}
