import { motion } from 'framer-motion';
import { dateUtils } from '../../../utils/dateUtils';

const LoadCalendar = ({ loadData, onDayClick }) => {
  const getLoadColor = (level) => {
    switch (level) {
      case 'critical': return 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg';
      case 'high': return 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg';
      case 'moderate': return 'bg-gradient-to-br from-yellow-500 to-yellow-600 text-white shadow-lg';
      default: return 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg';
    }
  };

  const getLegendColor = (level) => {
    switch (level) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'moderate': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  return (
    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          📅 7-Day Load View
        </h3>
        
        {/* Legend */}
        <div className="flex items-center space-x-2 text-xs">
          <div className="flex items-center space-x-1">
            <div className={`w-3 h-3 rounded-full ${getLegendColor('low')}`}></div>
            <span className="text-gray-600 dark:text-gray-400">Safe</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className={`w-3 h-3 rounded-full ${getLegendColor('moderate')}`}></div>
            <span className="text-gray-600 dark:text-gray-400">Moderate</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className={`w-3 h-3 rounded-full ${getLegendColor('high')}`}></div>
            <span className="text-gray-600 dark:text-gray-400">High</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className={`w-3 h-3 rounded-full ${getLegendColor('critical')}`}></div>
            <span className="text-gray-600 dark:text-gray-400">Critical</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {loadData?.map((day, index) => (
          <motion.div
            key={day.date}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            onClick={() => onDayClick?.(day.date)}
            className={`
              ${getLoadColor(day.level)}
              aspect-square rounded-xl cursor-pointer transition-all duration-200
              hover:scale-110 hover:shadow-xl
              flex flex-col items-center justify-center
              relative overflow-hidden
              ${day.isToday ? 'ring-2 ring-blue-400 ring-offset-2 dark:ring-offset-gray-800' : ''}
            `}
          >
            {/* Background pattern for today */}
            {day.isToday && (
              <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
            )}
            
            <div className="relative z-10 text-center">
              <div className="text-xs font-medium opacity-80 mb-1">
                {day.dayName}
              </div>
              <div className="text-lg font-bold">
                {new Date(day.date).getDate()}
              </div>
              <div className="text-xs font-semibold mt-1">
                {day.score}
              </div>
            </div>

            {/* Hover tooltip */}
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              {dateUtils.formatDate(day.date, 'MMM dd')} - Load: {day.score}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            Week Overview
          </span>
          <div className="flex items-center space-x-4">
            <span className="text-gray-900 dark:text-white">
              Avg: {Math.round(loadData?.reduce((sum, day) => sum + day.score, 0) / (loadData?.length || 1))}
            </span>
            <span className="text-gray-900 dark:text-white">
              Peak: {Math.max(...(loadData?.map(day => day.score) || [0]))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadCalendar;