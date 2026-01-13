import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

const Debug = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  return (
    <div className="fixed top-4 right-4 bg-black text-white p-4 rounded-lg text-xs z-50 max-w-xs">
      <h3 className="font-bold mb-2">Debug Info:</h3>
      <div>Path: {location.pathname}</div>
      <div>Loading: {loading ? 'Yes' : 'No'}</div>
      <div>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</div>
      <div>User: {user ? user.email : 'None'}</div>
      <div>Role: {user?.role || 'None'}</div>
    </div>
  );
};

export default Debug;