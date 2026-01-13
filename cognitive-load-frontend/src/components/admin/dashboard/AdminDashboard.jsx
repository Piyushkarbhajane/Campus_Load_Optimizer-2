import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, AlertTriangle, TrendingUp, Activity, Server, Database, Shield } from 'lucide-react';

const StatCard = ({ title, value, subtitle, icon: Icon, color, trend, onClick }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    onClick={onClick}
    className={`bg-gradient-to-r ${color} rounded-xl p-6 text-white shadow-lg cursor-pointer`}
  >
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-3xl font-bold">{value}</p>
        <p className="text-sm opacity-90 mt-1">{subtitle}</p>
        {trend && (
          <p className="text-xs opacity-75 mt-1">{trend}</p>
        )}
      </div>
      <Icon className="w-12 h-12 opacity-80" />
    </div>
  </motion.div>
);

const AdminDashboard = () => {
  const [systemStats, setSystemStats] = useState({});
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [systemHealth, setSystemHealth] = useState({});

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    // Mock system statistics
    setSystemStats({
      totalStudents: 1247,
      activeProfessors: 89,
      totalCourses: 156,
      systemLoad: 67,
      activeAlerts: 23,
      avgCognitiveLoad: 58,
      peakUsageHour: '2:00 PM',
      systemUptime: '99.8%'
    });

    setRecentAlerts([
      {
        id: 1,
        type: 'high_load',
        message: 'CS301 class showing critical cognitive load (avg 89%)',
        timestamp: '2026-01-12T14:30:00Z',
        severity: 'critical',
        course: 'CS301 - Algorithms'
      },
      {
        id: 2,
        type: 'system',
        message: 'Database performance degraded - response time increased',
        timestamp: '2026-01-12T13:15:00Z',
        severity: 'warning',
        course: 'System'
      },
      {
        id: 3,
        type: 'conflict',
        message: '15 deadline conflicts detected for January 18th',
        timestamp: '2026-01-12T12:00:00Z',
        severity: 'high',
        course: 'Multiple Courses'
      }
    ]);

    setSystemHealth({
      database: { status: 'healthy', responseTime: '45ms', uptime: '99.9%' },
      api: { status: 'healthy', responseTime: '120ms', uptime: '99.8%' },
      cache: { status: 'warning', responseTime: '200ms', uptime: '98.5%' },
      storage: { status: 'healthy', usage: '67%', available: '2.1TB' }
    });
  };

  const stats = [
    {
      title: 'Total Students',
      value: systemStats.totalStudents?.toLocaleString() || '0',
      subtitle: 'Registered users',
      trend: '+12% from last month',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      onClick: () => {}
    },
    {
      title: 'Active Professors',
      value: systemStats.activeProfessors || '0',
      subtitle: 'Teaching staff',
      trend: '+3% from last month',
      icon: BookOpen,
      color: 'from-green-500 to-green-600',
      onClick: () => {}
    },
    {
      title: 'System Load',
      value: `${systemStats.systemLoad || 0}%`,
      subtitle: 'Current capacity',
      trend: 'Optimal range',
      icon: Activity,
      color: 'from-yellow-500 to-yellow-600',
      onClick: () => {}
    },
    {
      title: 'Active Alerts',
      value: systemStats.activeAlerts || '0',
      subtitle: 'Requires attention',
      trend: '-5% from yesterday',
      icon: AlertTriangle,
      color: 'from-red-500 to-red-600',
      onClick: () => {}
    }
  ];

  const getAlertColor = (severity) => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'high': return 'border-orange-500 bg-orange-50 dark:bg-orange-900/20';
      case 'warning': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      default: return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
    }
  };

  const getAlertIcon = (severity) => {
    switch (severity) {
      case 'critical': return '🚨';
      case 'high': return '⚠️';
      case 'warning': return '⚡';
      default: return 'ℹ️';
    }
  };

  const getHealthStatus = (status) => {
    switch (status) {
      case 'healthy': return { color: 'text-green-600', bg: 'bg-green-100', icon: '✅' };
      case 'warning': return { color: 'text-yellow-600', bg: 'bg-yellow-100', icon: '⚠️' };
      case 'error': return { color: 'text-red-600', bg: 'bg-red-100', icon: '❌' };
      default: return { color: 'text-gray-600', bg: 'bg-gray-100', icon: '❓' };
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          System-wide cognitive load management and analytics
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Health */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
            <Server className="w-5 h-5 mr-2 text-blue-500" />
            System Health
          </h2>
          
          <div className="space-y-4">
            {Object.entries(systemHealth).map(([service, health]) => {
              const statusInfo = getHealthStatus(health.status);
              return (
                <div key={service} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{statusInfo.icon}</span>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white capitalize">
                        {service}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {health.responseTime && `Response: ${health.responseTime}`}
                        {health.usage && `Usage: ${health.usage}`}
                        {health.uptime && ` • Uptime: ${health.uptime}`}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.color}`}>
                    {health.status}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Recent Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
            Recent Alerts
          </h2>
          
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className={`border-l-4 rounded-lg p-4 ${getAlertColor(alert.severity)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <span className="text-lg">{getAlertIcon(alert.severity)}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {alert.message}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {alert.course} • {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                    alert.severity === 'critical' ? 'bg-red-100 text-red-800' :
                    alert.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {alert.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <button className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            View All Alerts
          </button>
        </motion.div>
      </div>

      {/* System Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
          System Overview
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{systemStats.totalCourses}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Courses</div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{systemStats.avgCognitiveLoad}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Avg Cognitive Load</div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{systemStats.peakUsageHour}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Peak Usage</div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{systemStats.systemUptime}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">System Uptime</div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
          <Shield className="w-5 h-5 mr-2 text-purple-500" />
          Quick Actions
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
            <Database className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-sm font-medium text-gray-900 dark:text-white">Backup System</div>
          </button>
          <button className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
            <Users className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-sm font-medium text-gray-900 dark:text-white">Manage Users</div>
          </button>
          <button className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors">
            <TrendingUp className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-sm font-medium text-gray-900 dark:text-white">View Reports</div>
          </button>
          <button className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
            <Shield className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-sm font-medium text-gray-900 dark:text-white">Security Settings</div>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;