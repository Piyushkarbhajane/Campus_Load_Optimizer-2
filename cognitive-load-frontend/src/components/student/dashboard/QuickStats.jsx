import { motion } from 'framer-motion';
import { Calendar, TrendingUp, Clock, AlertTriangle } from 'lucide-react';

const QuickStats = ({ totalDeadlines, avgLoad, freeDays, peakDays }) => {
  const stats = [
    {
      icon: <Calendar className="w-6 h-6" />,
      label: 'Deadlines',
      value: totalDeadlines,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      label: 'Avg Load',
      value: avgLoad,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    },
    {
      icon: <Clock className="w-6 h-6" />,
      label: 'Free Days',
      value: freeDays,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      icon: <AlertTriangle className="w-6 h-6" />,
      label: 'Peak Days',
      value: peakDays,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    },
  ];

  return (
    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        📊 Quick Stats
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`${stat.bgColor} rounded-xl p-4 text-center hover:scale-105 transition-transform cursor-pointer`}
          >
            <div className={`${stat.color} flex justify-center mb-2`}>
              {stat.icon}
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default QuickStats;