import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Calendar, Filter, TrendingUp, Users, BarChart3, Eye, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [dateRange, setDateRange] = useState('month');
  const [reportType, setReportType] = useState('all');
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(null);

  const reportTypes = [
    { value: 'all', label: 'All Reports' },
    { value: 'cognitive_load', label: 'Cognitive Load Reports' },
    { value: 'user_activity', label: 'User Activity Reports' },
    { value: 'system_performance', label: 'System Performance Reports' },
    { value: 'academic', label: 'Academic Reports' }
  ];

  const dateRanges = [
    { value: 'week', label: 'Last Week' },
    { value: 'month', label: 'Last Month' },
    { value: 'quarter', label: 'Last Quarter' },
    { value: 'semester', label: 'Current Semester' },
    { value: 'year', label: 'Academic Year' }
  ];

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = () => {
    // Mock reports data
    const mockReports = [
      {
        id: 1,
        title: 'Weekly Cognitive Load Summary',
        type: 'cognitive_load',
        description: 'Comprehensive analysis of student cognitive load patterns for the past week',
        generatedDate: '2026-01-12T10:00:00Z',
        size: '2.4 MB',
        format: 'PDF',
        status: 'completed',
        downloadCount: 15,
        data: {
          totalStudents: 1247,
          averageLoad: 58,
          peakLoad: 89,
          criticalStudents: 23,
          trends: '+5% from last week'
        }
      },
      {
        id: 2,
        title: 'Monthly User Activity Report',
        type: 'user_activity',
        description: 'Detailed breakdown of user engagement and system usage patterns',
        generatedDate: '2026-01-10T14:30:00Z',
        size: '1.8 MB',
        format: 'Excel',
        status: 'completed',
        downloadCount: 8,
        data: {
          activeUsers: 1156,
          newRegistrations: 45,
          peakHour: '2:00 PM',
          sessionDuration: '45 min avg'
        }
      },
      {
        id: 3,
        title: 'System Performance Analysis',
        type: 'system_performance',
        description: 'Technical performance metrics and system health indicators',
        generatedDate: '2026-01-09T09:15:00Z',
        size: '3.1 MB',
        format: 'PDF',
        status: 'completed',
        downloadCount: 12,
        data: {
          uptime: '99.8%',
          responseTime: '120ms avg',
          errorRate: '0.02%',
          cpuUsage: '67% avg'
        }
      },
      {
        id: 4,
        title: 'Academic Performance Correlation',
        type: 'academic',
        description: 'Analysis of correlation between cognitive load and academic performance',
        generatedDate: '2026-01-08T16:45:00Z',
        size: '4.2 MB',
        format: 'PDF',
        status: 'completed',
        downloadCount: 22,
        data: {
          coursesAnalyzed: 156,
          correlationStrength: '0.73',
          improvementRate: '18%',
          riskStudents: 89
        }
      },
      {
        id: 5,
        title: 'Semester Load Distribution',
        type: 'cognitive_load',
        description: 'Semester-wide cognitive load distribution across all departments',
        generatedDate: '2026-01-07T11:20:00Z',
        size: '5.6 MB',
        format: 'Excel',
        status: 'generating',
        downloadCount: 0,
        progress: 75
      }
    ];
    setReports(mockReports);
  };

  const generateReport = async (type) => {
    setGenerating(type);
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const newReport = {
        id: Date.now(),
        title: `${type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} Report`,
        type: type,
        description: `Generated ${type.replace('_', ' ')} report for ${dateRanges.find(r => r.value === dateRange)?.label.toLowerCase()}`,
        generatedDate: new Date().toISOString(),
        size: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
        format: Math.random() > 0.5 ? 'PDF' : 'Excel',
        status: 'completed',
        downloadCount: 0,
        data: {
          placeholder: 'Generated data would appear here'
        }
      };
      
      setReports([newReport, ...reports]);
      toast.success('Report generated successfully!');
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setGenerating(null);
    }
  };

  const downloadReport = (report) => {
    // Mock download functionality
    toast.success(`Downloading ${report.title}...`);
    setReports(reports.map(r => 
      r.id === report.id ? { ...r, downloadCount: r.downloadCount + 1 } : r
    ));
  };

  const filteredReports = reports.filter(report => {
    return reportType === 'all' || report.type === reportType;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'generating': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'cognitive_load': return '🧠';
      case 'user_activity': return '👥';
      case 'system_performance': return '⚡';
      case 'academic': return '📚';
      default: return '📄';
    }
  };

  const getFormatIcon = (format) => {
    switch (format) {
      case 'PDF': return '📕';
      case 'Excel': return '📗';
      case 'CSV': return '📄';
      default: return '📄';
    }
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
            Reports & Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Generate and manage system reports and analytics
          </p>
        </div>
        <button
          onClick={loadReports}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Total Reports</h3>
              <p className="text-3xl font-bold">{reports.length}</p>
            </div>
            <FileText className="w-12 h-12 opacity-80" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Completed</h3>
              <p className="text-3xl font-bold">{reports.filter(r => r.status === 'completed').length}</p>
            </div>
            <span className="text-4xl">✅</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Generating</h3>
              <p className="text-3xl font-bold">{reports.filter(r => r.status === 'generating').length}</p>
            </div>
            <span className="text-4xl">⏳</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Downloads</h3>
              <p className="text-3xl font-bold">{reports.reduce((sum, r) => sum + r.downloadCount, 0)}</p>
            </div>
            <Download className="w-12 h-12 opacity-80" />
          </div>
        </div>
      </motion.div>

      {/* Report Generation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Generate New Report
        </h2>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date Range
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {dateRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { type: 'cognitive_load', label: 'Cognitive Load', icon: '🧠' },
            { type: 'user_activity', label: 'User Activity', icon: '👥' },
            { type: 'system_performance', label: 'System Performance', icon: '⚡' },
            { type: 'academic', label: 'Academic Analysis', icon: '📚' }
          ].map((reportOption) => (
            <button
              key={reportOption.type}
              onClick={() => generateReport(reportOption.type)}
              disabled={generating === reportOption.type}
              className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors disabled:opacity-50"
            >
              <div className="text-center">
                <div className="text-3xl mb-2">{reportOption.icon}</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {generating === reportOption.type ? 'Generating...' : `Generate ${reportOption.label}`}
                </div>
                {generating === reportOption.type && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {reportTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Reports List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Available Reports ({filteredReports.length})
          </h2>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredReports.map((report) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">{getTypeIcon(report.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {report.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                      <span className="text-2xl">{getFormatIcon(report.format)}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {report.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(report.generatedDate).toLocaleDateString()}</span>
                      </span>
                      <span>{report.size}</span>
                      <span>{report.downloadCount} downloads</span>
                    </div>
                    
                    {/* Progress bar for generating reports */}
                    {report.status === 'generating' && report.progress && (
                      <div className="mt-3">
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                          <span>Generating...</span>
                          <span>{report.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${report.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedReport(report)}
                    className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  {report.status === 'completed' && (
                    <button
                      onClick={() => downloadReport(report)}
                      className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Report Preview Modal */}
      {selectedReport && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedReport(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{getTypeIcon(selectedReport.type)}</span>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {selectedReport.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedReport.description}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Report Metadata */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {new Date(selectedReport.generatedDate).toLocaleDateString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Generated</div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {selectedReport.size}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">File Size</div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {selectedReport.format}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Format</div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {selectedReport.downloadCount}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Downloads</div>
              </div>
            </div>

            {/* Report Data Preview */}
            {selectedReport.data && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Report Summary
                </h4>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(selectedReport.data).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex space-x-3">
              {selectedReport.status === 'completed' && (
                <button
                  onClick={() => downloadReport(selectedReport)}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Download Report
                </button>
              )}
              <button
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Reports;