import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, Activity, Calendar, Filter, Download, RefreshCw } from 'lucide-react';

const SystemAnalytics = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [selectedMetric, setSelectedMetric] = useState('cognitive_load');
  const [loading, setLoading] = useState(false);

  const timeRanges = [
    { value: 'day', label: 'Last 24 Hours' },
    { value: 'week', label: 'Last Week' },
    { value: 'month', label: 'Last Month' },
    { value: 'semester', label: 'Current Semester' }
  ];

  const metrics = [
    { value: 'cognitive_load', label: 'Cognitive Load', icon: '🧠' },
    { value: 'user_activity', label: 'User Activity', icon: '👥' },
    { value: 'system_performance', label: 'System Performance', icon: '⚡' },
    { value: 'course_analytics', label: 'Course Analytics', icon: '📚' }
  ];

  // Mock analytics data
  const analyticsData = {
    cognitive_load: {
      overview: {
        average: 58,
        peak: 89,
        trend: '+5%',
        critical_students: 23
      },
      daily: [
        { date: '2026-01-06', value: 52, students: 1247 },
        { date: '2026-01-07', value: 55, students: 1251 },
        { date: '2026-01-08', value: 61, students: 1248 },
        { date: '2026-01-09', value: 58, students: 1252 },
        { date: '2026-01-10', value: 64, students: 1249 },
        { date: '2026-01-11', value: 67, students: 1253 },
        { date: '2026-01-12', value: 58, students: 1247 }
      ],
      distribution: {
        safe: { count: 789, percentage: 63 },
        moderate: { count: 312, percentage: 25 },
        high: { count: 123, percentage: 10 },
        critical: { count: 23, percentage: 2 }
      }
    },
    user_activity: {
      overview: {
        daily_active: 1156,
        peak_hour: '2:00 PM',
        trend: '+8%',
        new_users: 45
      },
      hourly: [
        { hour: '00:00', users: 45 },
        { hour: '02:00', users: 23 },
        { hour: '04:00', users: 12 },
        { hour: '06:00', users: 89 },
        { hour: '08:00', users: 234 },
        { hour: '10:00', users: 567 },
        { hour: '12:00', users: 789 },
        { hour: '14:00', users: 1156 },
        { hour: '16:00', users: 934 },
        { hour: '18:00', users: 678 },
        { hour: '20:00', users: 456 },
        { hour: '22:00', users: 234 }
      ]
    },
    system_performance: {
      overview: {
        uptime: '99.8%',
        response_time: '120ms',
        trend: '-2%',
        errors: 12
      },
      metrics: {
        cpu_usage: 67,
        memory_usage: 72,
        disk_usage: 45,
        network_io: 58
      }
    },
    course_analytics: {
      overview: {
        total_courses: 156,
        active_courses: 142,
        trend: '+3%',
        avg_enrollment: 28
      },
      top_courses: [
        { name: 'CS101 - Intro to Programming', students: 89, load: 45 },
        { name: 'MATH201 - Calculus II', students: 76, load: 67 },
        { name: 'PHYS101 - General Physics', students: 72, load: 58 },
        { name: 'CS201 - Data Structures', students: 68, load: 72 },
        { name: 'ENG102 - Technical Writing', students: 65, load: 41 }
      ]
    }
  };

  const refreshData = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
  };

  const exportData = () => {
    // Mock export functionality
    const data = JSON.stringify(analyticsData[selectedMetric], null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedMetric}_analytics_${timeRange}.json`;
    a.click();
  };

  const getLoadColor = (load) => {
    if (load >= 80) return 'bg-red-500';
    if (load >= 60) return 'bg-orange-500';
    if (load >= 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const currentData = analyticsData[selectedMetric];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            System Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Comprehensive system-wide analytics and insights
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={refreshData}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={exportData}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
              Select Metric
            </h2>
            <div className="flex flex-wrap gap-2">
              {metrics.map((metric) => (
                <button
                  key={metric.value}
                  onClick={() => setSelectedMetric(metric.value)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    selectedMetric === metric.value
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <span>{metric.icon}</span>
                  <span>{metric.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
              Time Range
            </h2>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {timeRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Overview Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        {Object.entries(currentData.overview).map(([key, value]) => (
          <div key={key} className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2 capitalize">
                  {key.replace('_', ' ')}
                </h3>
                <p className="text-3xl font-bold">{value}</p>
              </div>
              <div className="text-4xl opacity-80">
                {selectedMetric === 'cognitive_load' && key === 'average' && '🧠'}
                {selectedMetric === 'user_activity' && key === 'daily_active' && '👥'}
                {selectedMetric === 'system_performance' && key === 'uptime' && '⚡'}
                {selectedMetric === 'course_analytics' && key === 'total_courses' && '📚'}
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Main Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
            {metrics.find(m => m.value === selectedMetric)?.label} Trends
          </h2>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {timeRanges.find(r => r.value === timeRange)?.label}
          </div>
        </div>

        {/* Cognitive Load Chart */}
        {selectedMetric === 'cognitive_load' && currentData.daily && (
          <div className="space-y-4">
            {currentData.daily.map((day, index) => (
              <div key={day.date} className="flex items-center space-x-4">
                <div className="w-20 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-6 relative">
                  <div
                    className={`h-6 rounded-full ${getLoadColor(day.value)} transition-all duration-500`}
                    style={{ width: `${day.value}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                    {day.value}%
                  </div>
                </div>
                <div className="w-16 text-sm text-gray-600 dark:text-gray-400">
                  {day.students} users
                </div>
              </div>
            ))}
          </div>
        )}

        {/* User Activity Chart */}
        {selectedMetric === 'user_activity' && currentData.hourly && (
          <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
            {currentData.hourly.map((hour) => (
              <div key={hour.hour} className="text-center">
                <div className="bg-gray-200 dark:bg-gray-700 rounded h-20 flex items-end justify-center mb-2">
                  <div
                    className="bg-blue-500 rounded-b w-full transition-all duration-500"
                    style={{ height: `${(hour.users / 1200) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">{hour.hour}</div>
                <div className="text-xs font-medium text-gray-900 dark:text-white">{hour.users}</div>
              </div>
            ))}
          </div>
        )}

        {/* System Performance Metrics */}
        {selectedMetric === 'system_performance' && currentData.metrics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Object.entries(currentData.metrics).map(([metric, value]) => (
              <div key={metric} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-2">{value}%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                  {metric.replace('_', ' ')}
                </div>
                <div className="mt-2 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getLoadColor(value)}`}
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Course Analytics */}
        {selectedMetric === 'course_analytics' && currentData.top_courses && (
          <div className="space-y-3">
            {currentData.top_courses.map((course, index) => (
              <div key={course.name} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl font-bold text-blue-600">#{index + 1}</div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {course.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {course.students} students enrolled
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {course.load}%
                  </div>
                  <div className="text-xs text-gray-500">Avg Load</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Distribution Chart (for cognitive load) */}
      {selectedMetric === 'cognitive_load' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Load Distribution
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(currentData.distribution).map(([level, data]) => (
              <div key={level} className={`p-4 rounded-lg ${
                level === 'safe' ? 'bg-green-50 dark:bg-green-900/20' :
                level === 'moderate' ? 'bg-yellow-50 dark:bg-yellow-900/20' :
                level === 'high' ? 'bg-orange-50 dark:bg-orange-900/20' :
                'bg-red-50 dark:bg-red-900/20'
              }`}>
                <div className="text-center">
                  <div className={`text-2xl font-bold mb-2 ${
                    level === 'safe' ? 'text-green-600' :
                    level === 'moderate' ? 'text-yellow-600' :
                    level === 'high' ? 'text-orange-600' :
                    'text-red-600'
                  }`}>
                    {data.count}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 capitalize mb-1">
                    {level} ({data.percentage}%)
                  </div>
                  <div className="bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        level === 'safe' ? 'bg-green-500' :
                        level === 'moderate' ? 'bg-yellow-500' :
                        level === 'high' ? 'bg-orange-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${data.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              Refreshing Analytics Data
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Please wait while we update the latest metrics...
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SystemAnalytics;