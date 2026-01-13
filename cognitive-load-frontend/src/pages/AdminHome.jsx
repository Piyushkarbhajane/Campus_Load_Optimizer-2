import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/shared/Navbar';
import Sidebar from '../components/shared/Sidebar';
import AdminDashboard from '../components/admin/dashboard/AdminDashboard';
import UserManagement from '../components/admin/users/UserManagement';
import SystemAnalytics from '../components/admin/analytics/SystemAnalytics';
import SystemSettings from '../components/admin/settings/SystemSettings';
import Reports from '../components/admin/reports/Reports';

const AdminHome = () => {
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', path: '/admin' },
    { id: 'users', label: 'User Management', icon: 'Users', path: '/admin/users' },
    { id: 'analytics', label: 'System Analytics', icon: 'BarChart3', path: '/admin/analytics' },
    { id: 'settings', label: 'System Settings', icon: 'Settings', path: '/admin/settings' },
    { id: 'reports', label: 'Reports', icon: 'FileText', path: '/admin/reports' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <Navbar />
      
      <div className="flex">
        <Sidebar items={sidebarItems} />
        
        <main className="flex-1 ml-64 p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Routes>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/analytics" element={<SystemAnalytics />} />
              <Route path="/settings" element={<SystemSettings />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminHome;