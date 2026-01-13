import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';

const ErrorMessage = ({ message, onRetry, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex flex-col items-center justify-center p-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg ${className}`}
    >
      <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
      
      <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
        Something went wrong
      </h3>
      
      <p className="text-red-600 dark:text-red-300 text-center mb-4 max-w-md">
        {message || 'An unexpected error occurred. Please try again.'}
      </p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      )}
    </motion.div>
  );
};

export default ErrorMessage;