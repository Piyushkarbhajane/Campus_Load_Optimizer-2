import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Lightbulb, TrendingUp, Calendar, Users, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const AIRecommendations = () => {
  const [selectedCourse, setSelectedCourse] = useState('CS201');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [appliedSuggestions, setAppliedSuggestions] = useState([]);

  const courses = [
    { id: 'CS201', name: 'Data Structures', students: 45 },
    { id: 'CS301', name: 'Algorithms', students: 38 },
    { id: 'CS101', name: 'Intro to Programming', students: 52 },
    { id: 'CS401', name: 'Database Systems', students: 35 }
  ];

  const mockRecommendations = [
    {
      id: 1,
      type: 'scheduling',
      priority: 'high',
      title: 'Deadline Conflict Resolution',
      problem: 'High cognitive overload detected on January 18th',
      impact: {
        studentsAffected: 38,
        totalStudents: 45,
        currentLoad: 84,
        projectedLoad: 52
      },
      suggestions: [
        {
          id: 'a',
          title: 'Move Mid-term Exam to January 21st',
          benefits: [
            'Reduces average load from 84% to 52%',
            'No new conflicts created',
            'Gives students 3 extra days to prepare',
            '35 students move from "danger" to "moderate" zone'
          ],
          risks: [
            'Slight delay in course schedule'
          ],
          confidence: 95,
          recommended: true
        },
        {
          id: 'b',
          title: 'Split exam into two smaller assessments',
          benefits: [
            'Distributes cognitive load over time',
            'Reduces single-point failure stress',
            'Better learning assessment'
          ],
          risks: [
            'Requires curriculum restructuring',
            'More grading work for professor'
          ],
          confidence: 78,
          recommended: false
        }
      ]
    },
    {
      id: 2,
      type: 'workload',
      priority: 'medium',
      title: 'Assignment Load Balancing',
      problem: 'Uneven workload distribution across the semester',
      impact: {
        studentsAffected: 45,
        totalStudents: 45,
        currentLoad: 65,
        projectedLoad: 48
      },
      suggestions: [
        {
          id: 'c',
          title: 'Redistribute assignment deadlines',
          benefits: [
            'More even workload distribution',
            'Better learning pace',
            'Reduced peak stress periods'
          ],
          risks: [
            'May affect course timeline'
          ],
          confidence: 87,
          recommended: true
        }
      ]
    },
    {
      id: 3,
      type: 'support',
      priority: 'low',
      title: 'Student Support Enhancement',
      problem: '8 students consistently showing high cognitive load',
      impact: {
        studentsAffected: 8,
        totalStudents: 45,
        currentLoad: 78,
        projectedLoad: 58
      },
      suggestions: [
        {
          id: 'd',
          title: 'Implement study group program',
          benefits: [
            'Peer support system',
            'Collaborative learning',
            'Reduced individual stress'
          ],
          risks: [
            'Requires coordination effort'
          ],
          confidence: 72,
          recommended: true
        }
      ]
    }
  ];

  useEffect(() => {
    generateRecommendations();
  }, [selectedCourse]);

  const generateRecommendations = async () => {
    setLoading(true);
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRecommendations(mockRecommendations);
    setLoading(false);
  };

  const applySuggestion = (recommendationId, suggestionId) => {
    const recommendation = recommendations.find(r => r.id === recommendationId);
    const suggestion = recommendation.suggestions.find(s => s.id === suggestionId);
    
    setAppliedSuggestions([...appliedSuggestions, { recommendationId, suggestionId }]);
    toast.success(`Applied: ${suggestion.title}`);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'medium': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low': return 'border-green-500 bg-green-50 dark:bg-green-900/20';
      default: return 'border-gray-300 bg-gray-50 dark:bg-gray-700';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return '🚨';
      case 'medium': return '⚠️';
      case 'low': return 'ℹ️';
      default: return '📋';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'scheduling': return '📅';
      case 'workload': return '⚖️';
      case 'support': return '🤝';
      default: return '💡';
    }
  };

  const isApplied = (recommendationId, suggestionId) => {
    return appliedSuggestions.some(a => a.recommendationId === recommendationId && a.suggestionId === suggestionId);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            🤖 AI Recommendations
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Intelligent suggestions to optimize student cognitive load
          </p>
        </div>
        <button
          onClick={generateRecommendations}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Analyzing...' : 'Refresh Suggestions'}</span>
        </button>
      </motion.div>

      {/* Course Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
          Select Course for Analysis
        </h2>
        <div className="flex flex-wrap gap-2">
          {courses.map((course) => (
            <button
              key={course.id}
              onClick={() => setSelectedCourse(course.id)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedCourse === course.id
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {course.name} ({course.students} students)
            </button>
          ))}
        </div>
      </motion.div>

      {/* AI Analysis Status */}
      {loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center"
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                🤖 AI is analyzing your course data...
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Processing student load patterns, deadline conflicts, and optimization opportunities
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Recommendations */}
      {!loading && recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
            <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
            AI-Generated Recommendations ({recommendations.length})
          </h2>

          {recommendations.map((recommendation) => (
            <motion.div
              key={recommendation.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`border-l-4 rounded-lg p-6 ${getPriorityColor(recommendation.priority)}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getPriorityIcon(recommendation.priority)}</span>
                  <span className="text-2xl">{getTypeIcon(recommendation.type)}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {recommendation.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                      {recommendation.priority} priority • {recommendation.type}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Impact</div>
                  <div className="text-lg font-bold text-blue-600">
                    {Math.round((recommendation.impact.studentsAffected / recommendation.impact.totalStudents) * 100)}%
                  </div>
                  <div className="text-xs text-gray-500">of students</div>
                </div>
              </div>

              {/* Problem Description */}
              <div className="mb-4 p-4 bg-white dark:bg-gray-700 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2 text-orange-500" />
                  Problem Identified
                </h4>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  {recommendation.problem}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600 dark:text-gray-400">Students Affected</div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {recommendation.impact.studentsAffected} / {recommendation.impact.totalStudents}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600 dark:text-gray-400">Current Load</div>
                    <div className="font-semibold text-red-600">
                      {recommendation.impact.currentLoad}%
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600 dark:text-gray-400">Projected Load</div>
                    <div className="font-semibold text-green-600">
                      {recommendation.impact.projectedLoad}%
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600 dark:text-gray-400">Improvement</div>
                    <div className="font-semibold text-blue-600">
                      -{recommendation.impact.currentLoad - recommendation.impact.projectedLoad}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Suggestions */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 dark:text-white flex items-center">
                  <Brain className="w-4 h-4 mr-2 text-purple-500" />
                  AI Suggestions
                </h4>
                
                {recommendation.suggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className={`p-4 rounded-lg border-2 ${
                      suggestion.recommended 
                        ? 'border-green-300 bg-green-50 dark:bg-green-900/20' 
                        : 'border-gray-200 bg-gray-50 dark:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900 dark:text-white mb-1">
                          {suggestion.title}
                          {suggestion.recommended && (
                            <span className="ml-2 px-2 py-1 bg-green-500 text-white text-xs rounded">
                              Recommended
                            </span>
                          )}
                        </h5>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          AI Confidence: {suggestion.confidence}%
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {isApplied(recommendation.id, suggestion.id) ? (
                          <span className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-800 rounded-lg text-sm">
                            <CheckCircle className="w-4 h-4" />
                            <span>Applied</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => applySuggestion(recommendation.id, suggestion.id)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                          >
                            Apply Solution
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Benefits */}
                      <div>
                        <h6 className="font-medium text-green-800 dark:text-green-200 mb-2">
                          ✅ Benefits
                        </h6>
                        <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                          {suggestion.benefits.map((benefit, index) => (
                            <li key={index}>• {benefit}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Risks */}
                      <div>
                        <h6 className="font-medium text-orange-800 dark:text-orange-200 mb-2">
                          ⚠️ Considerations
                        </h6>
                        <ul className="text-sm text-orange-700 dark:text-orange-300 space-y-1">
                          {suggestion.risks.map((risk, index) => (
                            <li key={index}>• {risk}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Applied Suggestions Summary */}
      {appliedSuggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6"
        >
          <h2 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-3 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            Applied Suggestions ({appliedSuggestions.length})
          </h2>
          <p className="text-sm text-green-700 dark:text-green-300">
            You have successfully applied {appliedSuggestions.length} AI recommendation{appliedSuggestions.length > 1 ? 's' : ''}. 
            These changes should help optimize your students' cognitive load and improve their learning experience.
          </p>
        </motion.div>
      )}

      {/* No Recommendations */}
      {!loading && recommendations.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            Great Job! No Issues Detected
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Your course scheduling appears to be well-optimized. Students have manageable cognitive loads.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default AIRecommendations;