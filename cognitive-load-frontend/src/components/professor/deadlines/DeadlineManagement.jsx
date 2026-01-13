import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Plus, Edit, Trash2, Search, Filter, BookOpen, Clock, Users, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const DeadlineManagement = () => {
  const [deadlines, setDeadlines] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('CS201');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDeadline, setEditingDeadline] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const courses = [
    { id: 'CS201', name: 'Data Structures', students: 45 },
    { id: 'CS301', name: 'Algorithms', students: 38 },
    { id: 'CS101', name: 'Intro to Programming', students: 52 },
    { id: 'CS401', name: 'Database Systems', students: 35 }
  ];

  useEffect(() => {
    loadDeadlines();
  }, [selectedCourse]);

  const loadDeadlines = () => {
    // Mock data for deadlines
    const mockDeadlines = [
      {
        id: 1,
        title: 'Assignment 1',
        type: 'Assignment',
        date: '2026-01-15',
        difficulty: 3,
        weightage: 15,
        estimatedHours: 8,
        studentsAffected: 45,
        description: 'Basic data structure implementation'
      },
      {
        id: 2,
        title: 'Mid-term Project',
        type: 'Project',
        date: '2026-01-20',
        difficulty: 5,
        weightage: 30,
        estimatedHours: 20,
        studentsAffected: 45,
        description: 'Complex algorithm analysis project'
      },
      {
        id: 3,
        title: 'Quiz 2',
        type: 'Quiz',
        date: '2026-01-25',
        difficulty: 2,
        weightage: 10,
        estimatedHours: 2,
        studentsAffected: 45,
        description: 'Quick assessment on sorting algorithms'
      }
    ];
    setDeadlines(mockDeadlines);
  };

  const handleCreateDeadline = (formData) => {
    const newDeadline = {
      id: Date.now(),
      ...formData,
      studentsAffected: courses.find(c => c.id === selectedCourse)?.students || 0
    };
    setDeadlines([...deadlines, newDeadline]);
    setShowCreateModal(false);
    toast.success('Deadline created successfully!');
  };

  const handleEditDeadline = (formData) => {
    setDeadlines(deadlines.map(d => 
      d.id === editingDeadline.id ? { ...d, ...formData } : d
    ));
    setShowEditModal(false);
    setEditingDeadline(null);
    toast.success('Deadline updated successfully!');
  };

  const handleDeleteDeadline = (id) => {
    if (window.confirm('Are you sure you want to delete this deadline?')) {
      setDeadlines(deadlines.filter(d => d.id !== id));
      toast.success('Deadline deleted successfully!');
    }
  };

  const filteredDeadlines = deadlines.filter(deadline => {
    const matchesSearch = deadline.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || deadline.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Assignment': return '📘';
      case 'Exam': return '📕';
      case 'Project': return '📗';
      case 'Quiz': return '📙';
      default: return '📄';
    }
  };

  const getDifficultyStars = (difficulty) => {
    return '★'.repeat(difficulty) + '☆'.repeat(5 - difficulty);
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
            Deadline Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Create and manage course deadlines
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create Deadline</span>
        </button>
      </motion.div>

      {/* Course Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
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
              {course.name} ({course.students} students)
            </button>
          ))}
        </div>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search deadlines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Types</option>
              <option value="assignment">Assignments</option>
              <option value="exam">Exams</option>
              <option value="project">Projects</option>
              <option value="quiz">Quizzes</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Deadlines Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Deadlines for {courses.find(c => c.id === selectedCourse)?.name}
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Difficulty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Weight
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Students
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredDeadlines.map((deadline) => (
                <tr key={deadline.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{getTypeIcon(deadline.type)}</span>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {deadline.title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {deadline.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {deadline.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {new Date(deadline.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <span className="text-yellow-500">{getDifficultyStars(deadline.difficulty)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {deadline.weightage}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900 dark:text-white">
                      <Users className="w-4 h-4 mr-1" />
                      {deadline.studentsAffected}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingDeadline(deadline);
                          setShowEditModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteDeadline(deadline.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Create Deadline Modal */}
      {showCreateModal && (
        <DeadlineModal
          title="Create New Deadline"
          onSubmit={handleCreateDeadline}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {/* Edit Deadline Modal */}
      {showEditModal && editingDeadline && (
        <DeadlineModal
          title="Edit Deadline"
          deadline={editingDeadline}
          onSubmit={handleEditDeadline}
          onClose={() => {
            setShowEditModal(false);
            setEditingDeadline(null);
          }}
        />
      )}
    </div>
  );
};

const DeadlineModal = ({ title, deadline, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    title: deadline?.title || '',
    type: deadline?.type || 'Assignment',
    date: deadline?.date || '',
    difficulty: deadline?.difficulty || 3,
    weightage: deadline?.weightage || 0,
    estimatedHours: deadline?.estimatedHours || 0,
    description: deadline?.description || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          {title}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="Assignment">Assignment</option>
              <option value="Exam">Exam</option>
              <option value="Project">Project</option>
              <option value="Quiz">Quiz</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Difficulty (1-5): {formData.difficulty}
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={formData.difficulty}
              onChange={(e) => setFormData({...formData, difficulty: parseInt(e.target.value)})}
              className="w-full"
            />
            <div className="text-yellow-500 text-center">
              {'★'.repeat(formData.difficulty)}{'☆'.repeat(5-formData.difficulty)}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Weightage (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={formData.weightage}
              onChange={(e) => setFormData({...formData, weightage: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Estimated Hours
            </label>
            <input
              type="number"
              min="1"
              value={formData.estimatedHours}
              onChange={(e) => setFormData({...formData, estimatedHours: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              rows="3"
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {deadline ? 'Update' : 'Create'} Deadline
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default DeadlineManagement;