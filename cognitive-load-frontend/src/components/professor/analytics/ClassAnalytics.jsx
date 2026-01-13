import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, AlertTriangle, Calendar, Filter, Eye } from 'lucide-react';

const ClassAnalytics = () => {
  const [selectedCourse, setSelectedCourse] = useState('CS201');
  const [selectedWeek, setSelectedWeek] = useState('current');
  const [showStudentDetails, setShowStudentDetails] = useState(false);
  const [selectedRiskLevel, setSelectedRiskLevel] = useState('all');

  const courses = [
    { id: 'CS201', name: 'Data Structures', students: 45 },
    { id: 'CS301', name: 'Algorithms', students: 38 },
    { id: 'CS101', name: 'Intro to Programming', students: 52 },
    { id: 'CS401', name: 'Database Systems', students: 35 }
  ];

  const weeklyData = {
    current: {
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      loads: [45, 52, 68, 75, 82, 35, 28],
      peak: 'Friday'
    },
    next: {
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      loads: [38, 45, 72, 89, 95, 42, 31],
      peak: 'Friday'
    }
  };

  const classStats = {
    safe: { count: 28, percentage: 62, color: 'green' },
    moderate: { count: 12, percentage: 27, color: 'yellow' },
    high: { count: 5, percentage: 11, color: 'red' }
  };

  const studentsAtRisk = [
    {
      id: 1,
      name: 'John Doe',
      loadScore: 92,
      riskLevel: 'critical',
      reasons: ['Your project due Jan 20', 'Physics exam same day', 'Math assignment due Jan 19'],
      trend: 'increasing'
    },
    {
      id: 2,
      name: 'Jane Smith',
      loadScore: 85,
      riskLevel: 'high',
      reasons: ['Your exam + 2 other assignments', 'Part-time job conflict'],
      trend: 'stable'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      loadScore: 78,
      riskLevel: 'moderate',
      reasons: ['Multiple deadlines this week', 'Study group commitments'],
      trend: 'decreasing'
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      loadScore: 88,
      riskLevel: 'high',
      reasons: ['Your assignment + internship interview', 'Family obligations'],
      trend: 'increasing'
    },
    {
      id: 5,
      name: 'Alex Brown',
      loadScore: 95,
      riskLevel: 'critical',
      reasons: ['Your project + 3 other course exams', 'Medical appointment'],
      trend: 'increasing'
    }
  ];

  const getLoadColor = (load) => {
    if (load >= 80) return 'bg-red-500';
    if (load >= 60) return 'bg-orange-500';
    if (load >= 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-green-600 bg-green-100';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'increasing': return '📈';
      case 'decreasing': return '📉';
      default: return '➡️';
    }
  };

  const filteredStudents = selectedRiskLevel === 'all' 
    ? studentsAtRisk 
    : studentsAtRisk.filter(s => s.riskLevel === selectedRiskLevel);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Class Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Monitor student cognitive load patterns and trends
          </p>
        </div>
        <button
          onClick={() => setShowStudentDetails(!showStudentDetails)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Eye className="w-4 h-4" />
          <span>{showStudentDetails ? 'Hide' : 'Show'} Student Details</span>
        </button>
      </motion.div>

      {/* Course and Week Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
              Select Course
            </h2>
            <div className="flex flex-wrap gap-2">
              {courses.map((course) => (
                <button
                  key={course.id}
                  onClick={() => setSelectedCourse(course.id)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedCourse === course.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {course.name} ({course.students})
                </button>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
              Time Period
            </h2>
            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="current">Current Week</option>
              <option value="next">Next Week</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Weekly Load Graph */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
            Weekly Load Distribution
          </h2>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Peak Day: <span className="font-semibold text-red-600">{weeklyData[selectedWeek].peak}</span>
          </div>
        </div>

        <div className="space-y-4">
          {weeklyData[selectedWeek].days.map((day, index) => {
            const load = weeklyData[selectedWeek].loads[index];
            return (
              <div key={day} className="flex items-center space-x-4">
                <div className="w-12 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {day}
                </div>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-6 relative">
                  <div
                    className={`h-6 rounded-full ${getLoadColor(load)} transition-all duration-500`}
                    style={{ width: `${load}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                    {load}%
                  </div>
                </div>
                <div className="w-16 text-sm text-gray-600 dark:text-gray-400">
                  {load >= 80 ? 'Critical' : load >= 60 ? 'High' : load >= 40 ? 'Moderate' : 'Safe'}
                </div>
              </div>
            );
          })}
        </div>

        {/* Load Legend */}
        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Safe (0-40)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Moderate (41-60)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">High (61-80)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Critical (81-100)</span>
          </div>
        </div>
      </motion.div>

      {/* Class Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">✅ Students Safe</h3>
              <p className="text-3xl font-bold">{classStats.safe.count}</p>
              <p className="text-sm opacity-90">{classStats.safe.percentage}% of class</p>
            </div>
            <Users className="w-12 h-12 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">⚠️ Moderate Load</h3>
              <p className="text-3xl font-bold">{classStats.moderate.count}</p>
              <p className="text-sm opacity-90">{classStats.moderate.percentage}% of class</p>
            </div>
            <TrendingUp className="w-12 h-12 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">🚨 High Risk</h3>
              <p className="text-3xl font-bold">{classStats.high.count}</p>
              <p className="text-sm opacity-90">{classStats.high.percentage}% of class</p>
            </div>
            <AlertTriangle className="w-12 h-12 opacity-80" />
          </div>
        </div>
      </motion.div>

      {/* Students at Risk Details */}
      {showStudentDetails && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Student Risk Analysis
            </h2>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={selectedRiskLevel}
                onChange={(e) => setSelectedRiskLevel(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Risk Levels</option>
                <option value="critical">Critical Only</option>
                <option value="high">High Risk Only</option>
                <option value="moderate">Moderate Only</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {filteredStudents.map((student) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {student.name}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(student.riskLevel)}`}>
                        {student.riskLevel.toUpperCase()}
                      </span>
                      <span className="text-lg" title={`Trend: ${student.trend}`}>
                        {getTrendIcon(student.trend)}
                      </span>
                    </div>
                    
                    <div className="mb-3">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Contributing Factors:
                      </div>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                        {student.reasons.map((reason, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-red-500 mr-2">•</span>
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-red-600 mb-1">
                      {student.loadScore}
                    </div>
                    <div className="text-xs text-gray-500">Load Score</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Load Statistics Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          📊 Load Statistics Summary
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">52</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Average Load</div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-green-600">48</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Median Load</div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-red-600">95</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Highest Load</div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">Friday</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Peak Day</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ClassAnalytics;