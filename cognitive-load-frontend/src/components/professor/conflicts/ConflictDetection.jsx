import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Calendar, Users, Brain, Eye, Filter, Clock, BookOpen } from 'lucide-react';

const ConflictDetection = () => {
  const [selectedCourse, setSelectedCourse] = useState('CS201');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [showTimeline, setShowTimeline] = useState(false);
  const [selectedConflict, setSelectedConflict] = useState(null);

  const courses = [
    { id: 'CS201', name: 'Data Structures', students: 45 },
    { id: 'CS301', name: 'Algorithms', students: 38 },
    { id: 'CS101', name: 'Intro to Programming', students: 52 },
    { id: 'CS401', name: 'Database Systems', students: 35 }
  ];

  const conflicts = [
    {
      id: 1,
      date: '2026-01-18',
      severity: 'critical',
      yourDeadline: {
        title: 'Mid-term Exam',
        type: 'Exam',
        course: 'CS201'
      },
      conflictingDeadlines: [
        { title: 'Physics Major Project', professor: 'Prof. Kumar', course: 'PHYS301' },
        { title: 'Chemistry Lab Report', professor: 'Prof. Sharma', course: 'CHEM201' }
      ],
      studentsAffected: 38,
      totalStudents: 45,
      averageLoad: 84,
      description: 'Multiple major deadlines clustered on the same day'
    },
    {
      id: 2,
      date: '2026-01-22',
      severity: 'high',
      yourDeadline: {
        title: 'Algorithm Assignment',
        type: 'Assignment',
        course: 'CS201'
      },
      conflictingDeadlines: [
        { title: 'Database Project', professor: 'Prof. Wilson', course: 'CS401' },
        { title: 'Statistics Quiz', professor: 'Prof. Brown', course: 'MATH250' }
      ],
      studentsAffected: 25,
      totalStudents: 45,
      averageLoad: 72,
      description: 'Moderate conflict with overlapping student populations'
    },
    {
      id: 3,
      date: '2026-01-25',
      severity: 'moderate',
      yourDeadline: {
        title: 'Data Structures Quiz',
        type: 'Quiz',
        course: 'CS201'
      },
      conflictingDeadlines: [
        { title: 'English Essay', professor: 'Prof. Davis', course: 'ENG102' }
      ],
      studentsAffected: 12,
      totalStudents: 45,
      averageLoad: 58,
      description: 'Minor conflict with limited student overlap'
    }
  ];

  const timelineData = [
    { date: '2026-01-15', conflicts: 0, load: 45 },
    { date: '2026-01-16', conflicts: 1, load: 52 },
    { date: '2026-01-17', conflicts: 0, load: 48 },
    { date: '2026-01-18', conflicts: 3, load: 84 },
    { date: '2026-01-19', conflicts: 1, load: 61 },
    { date: '2026-01-20', conflicts: 2, load: 75 },
    { date: '2026-01-21', conflicts: 0, load: 42 },
    { date: '2026-01-22', conflicts: 2, load: 72 },
    { date: '2026-01-23', conflicts: 0, load: 38 },
    { date: '2026-01-24', conflicts: 1, load: 55 },
    { date: '2026-01-25', conflicts: 1, load: 58 }
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'high': return 'border-orange-500 bg-orange-50 dark:bg-orange-900/20';
      case 'moderate': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      default: return 'border-gray-300 bg-gray-50 dark:bg-gray-700';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical': return '🚨';
      case 'high': return '⚠️';
      case 'moderate': return '⚡';
      default: return 'ℹ️';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Assignment': return '📘';
      case 'Exam': return '📕';
      case 'Project': return '📗';
      case 'Quiz': return '📙';
      default: return '📄';
    }
  };

  const filteredConflicts = severityFilter === 'all' 
    ? conflicts 
    : conflicts.filter(c => c.severity === severityFilter);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Conflict Detection
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Identify and resolve deadline conflicts across courses
          </p>
        </div>
        <button
          onClick={() => setShowTimeline(!showTimeline)}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
        >
          <Calendar className="w-4 h-4" />
          <span>{showTimeline ? 'Hide' : 'Show'} Timeline</span>
        </button>
      </motion.div>

      {/* Course Selection and Filters */}
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
              Filter by Severity
            </h2>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical Only</option>
                <option value="high">High Only</option>
                <option value="moderate">Moderate Only</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Conflict Timeline */}
      {showTimeline && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-purple-500" />
            Conflict Timeline - Next 2 Weeks
          </h2>
          
          <div className="space-y-3">
            {timelineData.map((day, index) => (
              <div key={day.date} className="flex items-center space-x-4">
                <div className="w-20 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div className="flex-1 relative">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        day.load >= 80 ? 'bg-red-500' :
                        day.load >= 60 ? 'bg-orange-500' :
                        day.load >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${day.load}%` }}
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                    Load: {day.load}%
                  </div>
                </div>
                <div className="w-24 text-center">
                  {day.conflicts > 0 ? (
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                      {day.conflicts} conflict{day.conflicts > 1 ? 's' : ''}
                    </span>
                  ) : (
                    <span className="text-green-600 text-xs">✓ Clear</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Conflict Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Detected Conflicts ({filteredConflicts.length})
        </h2>
        
        {filteredConflicts.map((conflict) => (
          <motion.div
            key={conflict.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`border-l-4 rounded-lg p-6 ${getSeverityColor(conflict.severity)}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getSeverityIcon(conflict.severity)}</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Conflict on {new Date(conflict.date).toLocaleDateString()}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {conflict.severity} severity conflict
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-red-600">
                  {Math.round((conflict.studentsAffected / conflict.totalStudents) * 100)}%
                </div>
                <div className="text-xs text-gray-500">Students Affected</div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Your Deadline */}
              <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                  <BookOpen className="w-4 h-4 mr-2 text-blue-500" />
                  Your Deadline
                </h4>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getTypeIcon(conflict.yourDeadline.type)}</span>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {conflict.yourDeadline.title}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {conflict.yourDeadline.course} • {conflict.yourDeadline.type}
                    </div>
                  </div>
                </div>
              </div>

              {/* Conflicting Deadlines */}
              <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2 text-red-500" />
                  Conflicting Deadlines
                </h4>
                <div className="space-y-2">
                  {conflict.conflictingDeadlines.map((deadline, index) => (
                    <div key={index} className="text-sm">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {deadline.title}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">
                        {deadline.course} • {deadline.professor}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Impact Summary */}
            <div className="mt-4 p-4 bg-white dark:bg-gray-700 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Impact Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-600 dark:text-gray-400">Students Affected</div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {conflict.studentsAffected} / {conflict.totalStudents}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600 dark:text-gray-400">Average Load</div>
                  <div className="font-semibold text-red-600">
                    {conflict.averageLoad}%
                  </div>
                </div>
                <div>
                  <div className="text-gray-600 dark:text-gray-400">Severity</div>
                  <div className={`font-semibold capitalize ${
                    conflict.severity === 'critical' ? 'text-red-600' :
                    conflict.severity === 'high' ? 'text-orange-600' : 'text-yellow-600'
                  }`}>
                    {conflict.severity}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600 dark:text-gray-400">Date</div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {new Date(conflict.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedConflict(conflict)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Brain className="w-4 h-4" />
                <span>View AI Suggestions</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                <Eye className="w-4 h-4" />
                <span>View Affected Students</span>
              </button>
              <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors">
                Ignore Conflict
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* AI Suggestions Modal */}
      {selectedConflict && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedConflict(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <Brain className="w-5 h-5 mr-2 text-purple-500" />
              🤖 AI Conflict Resolution Suggestions
            </h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                  Problem Analysis
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Your {selectedConflict.yourDeadline.title} on {new Date(selectedConflict.date).toLocaleDateString()} 
                  conflicts with {selectedConflict.conflictingDeadlines.length} other major deadline(s), 
                  affecting {selectedConflict.studentsAffected} students with an average load of {selectedConflict.averageLoad}%.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 dark:text-white">Recommended Solutions:</h4>
                
                <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20">
                  <h5 className="font-medium text-green-900 dark:text-green-200 mb-2">
                    Option 1: Move to January 21st (Recommended)
                  </h5>
                  <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                    <li>✓ Reduces average load from {selectedConflict.averageLoad}% to 52%</li>
                    <li>✓ No new conflicts created</li>
                    <li>✓ Gives students 3 extra days to prepare</li>
                    <li>✓ {Math.round(selectedConflict.studentsAffected * 0.8)} students move from "danger" to "moderate"</li>
                  </ul>
                  <button className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Apply This Solution
                  </button>
                </div>

                <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
                  <h5 className="font-medium text-yellow-900 dark:text-yellow-200 mb-2">
                    Option 2: Move to January 16th
                  </h5>
                  <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                    <li>✓ Reduces load to 61%</li>
                    <li>⚠️ Creates minor conflict with CS301 quiz</li>
                    <li>⚠️ Less preparation time for students</li>
                  </ul>
                  <button className="mt-3 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                    Consider This Option
                  </button>
                </div>

                <div className="p-4 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20">
                  <h5 className="font-medium text-red-900 dark:text-red-200 mb-2">
                    Option 3: Keep Current Date
                  </h5>
                  <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                    <li>⚠️ High stress for {selectedConflict.studentsAffected} students</li>
                    <li>⚠️ Potential impact on performance</li>
                    <li>⚠️ May require additional support measures</li>
                  </ul>
                  <button className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    Keep Current Date
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedConflict(null)}
              className="mt-6 w-full px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ConflictDetection;