import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export default function PrivateRoute({children}) {
  const location = useLocation();
  const { user } = useAuthStore();
  
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }


  return children;;
}
