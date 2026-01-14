import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Landing from '../../pages/Landing';
import { Loader2 } from 'lucide-react';

const HomeRedirect = () => {
    const { user, loading, isAuthenticated } = useAuth();

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (isAuthenticated && user) {
        switch (user.role) {
            case 'admin':
                return <Navigate to="/admin" replace />;
            case 'professor':
                return <Navigate to="/professor" replace />;
            case 'student':
                return <Navigate to="/student" replace />;
            default:
                return <Landing />;
        }
    }

    return <Landing />;
};

export default HomeRedirect;
