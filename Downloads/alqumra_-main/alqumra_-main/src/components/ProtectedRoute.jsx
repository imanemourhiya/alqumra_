import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Protects a route by required role.
 * - Not logged in → redirect to /login
 * - Wrong role → redirect to /
 */
export default function ProtectedRoute({ children, requiredRole }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/" replace />;

  return children;
}
