import { Navigate, useLocation } from 'react-router-dom'
import { useAdminAuth } from '../context/AdminAuthContext'

export default function ProtectedAdminRoute({ children }) {
  const { session, isAdmin, hasMfa, loading } = useAdminAuth()
  const location = useLocation()

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-silver">Loading…</div>
  }
  if (!session) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />
  }
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink text-mist text-center px-6">
        <div>
          <p className="font-display text-3xl tracking-widest2 mb-3">ACCESS DENIED</p>
          <p className="text-silver text-sm">This account is not an authorized administrator.</p>
        </div>
      </div>
    )
  }
  if (!hasMfa) {
    return <Navigate to="/admin/mfa-setup" replace />
  }
  return children
}
