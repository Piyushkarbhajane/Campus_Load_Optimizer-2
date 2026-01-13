import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/shared/Navbar';
import Sidebar from '../components/shared/Sidebar';
import ProfessorDashboard from '../components/professor/dashboard/ProfessorDashboard';
import DeadlineManagement from '../components/professor/deadlines/DeadlineManagement';
import ClassAnalytics from '../components/professor/analytics/ClassAnalytics';
import ConflictDetection from '../components/professor/conflicts/ConflictDetection';
import AIRecommendations from '../components/professor/ai/AIRecommendations';

const ProfessorHome = () => {
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', path: '/professor' },
    { id: 'deadlines', label: 'Manage Deadlines', icon: 'Calendar', path: '/professor/deadlines' },
    { id: 'analytics', label: 'Class Analytics', icon: 'BarChart3', path: '/professor/analytics' },
    { id: 'conflicts', label: 'Conflict Detection', icon: 'AlertTriangle', path: '/professor/conflicts' },
    { id: 'ai', label: 'AI Recommendations', icon: 'Brain', path: '/professor/ai' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
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
              <Route path="/" element={<ProfessorDashboard />} />
              <Route path="/deadlines" element={<DeadlineManagement />} />
              <Route path="/analytics" element={<ClassAnalytics />} />
              <Route path="/conflicts" element={<ConflictDetection />} />
              <Route path="/ai" element={<AIRecommendations />} />
            </Routes>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default ProfessorHome;