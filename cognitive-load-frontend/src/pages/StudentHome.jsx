import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/shared/Navbar';
import Sidebar from '../components/shared/Sidebar';
import StudentDashboard from '../components/student/dashboard/StudentDashboard';
import CalendarView from '../components/student/calendar/CalendarView';
import TimelineView from '../components/student/timeline/TimelineView';
import AITipsView from '../components/student/ai/AITipsView';
import NotificationsView from '../components/student/notifications/NotificationsView';
import PersonalEventsView from '../components/student/personal/PersonalEventsView';

const StudentHome = () => {
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', path: '/student' },
    { id: 'calendar', label: 'Calendar', icon: 'Calendar', path: '/student/calendar' },
    { id: 'timeline', label: 'Timeline', icon: 'Clock', path: '/student/timeline' },
    { id: 'ai', label: 'AI Tips', icon: 'Brain', path: '/student/ai' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell', path: '/student/notifications' },
    { id: 'personal', label: 'Personal Events', icon: 'User', path: '/student/personal' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
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
              <Route path="/" element={<StudentDashboard />} />
              <Route path="/dashboard" element={<StudentDashboard />} />
              <Route path="/calendar" element={<CalendarView />} />
              <Route path="/timeline" element={<TimelineView />} />
              <Route path="/ai" element={<AITipsView />} />
              <Route path="/notifications" element={<NotificationsView />} />
              <Route path="/personal" element={<PersonalEventsView />} />
            </Routes>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default StudentHome;