import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';

export default function ProtectedRoute() {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return null; // Or a loading spinner
    }

    if (!isAuthenticated) {
        return <Navigate to="/auth" replace />;
    }

    return <Outlet />;
}
