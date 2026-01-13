import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, AlertTriangle, TrendingUp, Clock, BookOpen, Plus, Edit, Trash2, Brain } from 'lucide-react';

const StatCard = ({ title, value, subtitle, icon: Icon, color, onClick }) => (
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
      </div>
      <Icon className="w-12 h-12 opacity-80" />
    </div>
  </motion.div>
);

const ProfessorDashboard = () => {
  const [selectedCourse, setSelectedCourse] = useState('CS201');
  const [showCreateDeadline, setShowCreateDeadline] = useState(false);
  const [showStudentsAtRisk, setShowStudentsAtRisk] = useState(false);

  const courses = [
    { id: 'CS201', name: 'Data Structures', students: 45, loadLevel: 'medium' },
    { id: 'CS301', name: 'Algorithms', students: 38, loadLevel: 'high' },
    { id: 'CS101', name: 'Intro to Programming', students: 52, loadLevel: 'low' },
    { id: 'CS401', name: 'Database Systems', students: 35, loadLevel: 'moderate' }
  ];

  const stats = [
    {
      title: 'Active Courses',
      value: '4',
      subtitle: 'This semester',
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
      onClick: () => {}
    },
    {
      title: 'Total Students',
      value: '170',
      subtitle: 'Across all courses',
      icon: Users,
      color: 'from-green-500 to-green-600',
      onClick: () => {}
    },
    {
      title: 'Upcoming Deadlines',
      value: '12',
      subtitle: 'Next 7 days',
      icon: Calendar,
      color: 'from-yellow-500 to-yellow-600',
      onClick: () => {}
    },
    {
      title: 'High Load Students',
      value: '8',
      subtitle: 'Need attention',
      icon: AlertTriangle,
      color: 'from-red-500 to-red-600',
      onClick: () => setShowStudentsAtRisk(true)
    }
  ];

  const existingDeadlines = [
    { id: 1, title: 'Assignment 1', date: '2026-01-15', difficulty: 3, students: 45, type: 'Assignment' },
    { id: 2, title: 'Mid-term Project', date: '2026-01-20', difficulty: 5, students: 45, type: 'Project' },
    { id: 3, title: 'Quiz 2', date: '2026-01-25', difficulty: 2, students: 45, type: 'Quiz' }
  ];

  const studentsAtRisk = [
    { name: 'John Doe', loadScore: 92, reason: 'Your project + 2 other course exams' },
    { name: 'Jane Smith', loadScore: 85, reason: 'Your exam + 1 major project from another course' },
    { name: 'Mike Johnson', loadScore: 88, reason: 'Your assignment + 2 exams same day' }
  ];

  const conflictDetection = {
    date: 'Jan 18',
    status: 'CRITICAL CLUSTER',
    yourCourse: 'Mid-term Exam',
    otherCourses: [
      'Physics Major Project (Prof. Kumar)',
      'Chemistry Lab Report (Prof. Sharma)'
    ],
    impact: '38 out of 45 students affected',
    avgLoad: 84
  };

  const aiSuggestions = [
    {
      problem: 'High cognitive overload on Jan 18',
      affectedStudents: '38/45 (84%)',
      options: [
        {
          title: 'Move your Mid-term Exam to Jan 21',
          benefits: [
            'Reduces average load from 84 to 52',
            'No new conflicts created',
            'Gives students 3 extra days',
            '35 students move from "danger" to "moderate"'
          ],
          recommended: true
        },
        {
          title: 'Move to Jan 16',
          benefits: [
            'Creates minor conflict with CS301 quiz',
            'Still reduces load to 61'
          ]
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Professor Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Monitor student cognitive load and manage course deadlines
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

      {/* Course Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Course Selection
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
              {course.name} ({course.students} students)
            </button>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deadline Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Manage Deadlines - {selectedCourse}
            </h2>
            <button
              onClick={() => setShowCreateDeadline(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Deadline</span>
            </button>
          </div>

          <div className="space-y-3">
            {existingDeadlines.map((deadline) => (
              <div key={deadline.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {deadline.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {deadline.type} • Due: {new Date(deadline.date).toLocaleDateString()} • 
                    Difficulty: {'●'.repeat(deadline.difficulty)}{'○'.repeat(5-deadline.difficulty)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {deadline.students} students affected
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Class Load Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
            Class Load Overview
          </h2>

          {/* Weekly Load Graph Placeholder */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Average Class Load Score
            </h3>
            <div className="h-32 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <TrendingUp className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">Load Graph Visualization</p>
                <p className="text-xs">Coming Soon</p>
              </div>
            </div>
          </div>

          {/* Class Statistics */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900 dark:text-white">
              📊 Class Statistics for Jan 15-21:
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
                <span className="text-green-800 dark:text-green-200">✅ Students Safe</span>
                <span className="font-medium text-green-800 dark:text-green-200">28 (62%)</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                <span className="text-yellow-800 dark:text-yellow-200">⚠️ Moderate Load</span>
                <span className="font-medium text-yellow-800 dark:text-yellow-200">12 (27%)</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-red-50 dark:bg-red-900/20 rounded">
                <span className="text-red-800 dark:text-red-200">🚨 High Risk</span>
                <span className="font-medium text-red-800 dark:text-red-200">5 (11%)</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Conflict Detection & AI Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conflict Detection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
            Conflict Detection
          </h2>

          <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg">
            <h3 className="font-bold text-red-800 dark:text-red-200 mb-2">
              ⚠️ Deadline Conflicts Detected!
            </h3>
            <div className="space-y-2 text-sm">
              <p className="text-red-700 dark:text-red-300">
                <strong>{conflictDetection.date} - {conflictDetection.status}</strong>
              </p>
              <p className="text-red-600 dark:text-red-400">
                Your Course: {conflictDetection.yourCourse}
              </p>
              <div className="text-red-600 dark:text-red-400">
                Other Courses:
                <ul className="ml-4 mt-1">
                  {conflictDetection.otherCourses.map((course, index) => (
                    <li key={index}>• {course}</li>
                  ))}
                </ul>
              </div>
              <p className="text-red-700 dark:text-red-300 font-medium">
                Impact: {conflictDetection.impact}
              </p>
              <p className="text-red-700 dark:text-red-300 font-medium">
                Average load on this day: {conflictDetection.avgLoad} (Danger!)
              </p>
            </div>
            <button className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
              View AI Suggestions
            </button>
          </div>
        </motion.div>

        {/* AI Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
            <Brain className="w-5 h-5 mr-2 text-purple-500" />
            🤖 AI Scheduling Assistant
          </h2>

          {aiSuggestions.map((suggestion, index) => (
            <div key={index} className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="font-medium text-blue-900 dark:text-blue-200 mb-2">
                  Problem: {suggestion.problem}
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                  Affected Students: {suggestion.affectedStudents}
                </p>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-blue-900 dark:text-blue-200">
                    Suggested Solutions:
                  </h4>
                  {suggestion.options.map((option, optionIndex) => (
                    <div key={optionIndex} className={`p-3 rounded border-l-4 ${
                      option.recommended 
                        ? 'bg-green-50 border-green-500 dark:bg-green-900/20' 
                        : 'bg-gray-50 border-gray-300 dark:bg-gray-700'
                    }`}>
                      <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                        Option {optionIndex + 1}: {option.title}
                        {option.recommended && (
                          <span className="ml-2 px-2 py-1 bg-green-500 text-white text-xs rounded">
                            Recommended
                          </span>
                        )}
                      </h5>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        {option.benefits.map((benefit, benefitIndex) => (
                          <li key={benefitIndex}>✓ {benefit}</li>
                        ))}
                      </ul>
                      <div className="mt-3 flex space-x-2">
                        <button className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors">
                          Apply Option {optionIndex + 1}
                        </button>
                        <button className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400 transition-colors">
                          Dismiss
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Students at Risk Modal */}
      {showStudentsAtRisk && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowStudentsAtRisk(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              High Risk Students on Jan 18
            </h3>
            
            <div className="space-y-3">
              {studentsAtRisk.map((student, index) => (
                <div key={index} className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-red-900 dark:text-red-200">
                        {student.name}
                      </h4>
                      <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                        Reason: {student.reason}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-red-600">
                        {student.loadScore}
                      </div>
                      <div className="text-xs text-red-500">Load Score</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowStudentsAtRisk(false)}
              className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Create Deadline Modal */}
      {showCreateDeadline && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowCreateDeadline(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Create New Deadline
            </h3>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="Mid-term Exam"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Type
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option>Exam</option>
                  <option>Assignment</option>
                  <option>Project</option>
                  <option>Quiz</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Difficulty (1-5)
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  defaultValue="3"
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Weightage (% of total grade)
                </label>
                <input
                  type="number"
                  placeholder="30"
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Estimated Hours
                </label>
                <input
                  type="number"
                  placeholder="8"
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </form>

            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => setShowCreateDeadline(false)}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Create Deadline
              </button>
              <button
                onClick={() => setShowCreateDeadline(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ProfessorDashboard;