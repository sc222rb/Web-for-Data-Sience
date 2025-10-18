import React from 'react';
import PropTypes from 'prop-types';

/**
 * Loading Component
 */
export const LoadingSpinner = ({ message = 'Loading data...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-20 h-20 border-4 border-blue-200 rounded-full"></div>
        {/* Spinning ring */}
        <div className="w-20 h-20 border-4 border-blue-600 rounded-full 
                      border-t-transparent animate-spin absolute top-0 left-0"></div>
        {/* Inner pulse */}
        <div className="w-12 h-12 bg-blue-500 rounded-full absolute top-4 left-4 
                      animate-pulse"></div>
      </div>
      <p className="mt-6 text-lg text-gray-700 font-medium animate-pulse">
        {message}
      </p>
      <div className="flex gap-2 mt-3">
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-100"></div>
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200"></div>
      </div>
    </div>
  );
};

LoadingSpinner.propTypes = {
  message: PropTypes.string,
};

/**
 * Error Component
 */
export const ErrorMessage = ({ message = 'An error occurred', onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 max-w-md w-full">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Oops! Something went wrong
          </h3>
          <p className="text-gray-600 mb-6">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="bg-red-500 text-white px-6 py-3 rounded-lg 
                       hover:bg-red-600 transition-all duration-300 
                       transform hover:scale-105 font-medium"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

ErrorMessage.propTypes = {
  message: PropTypes.string,
  onRetry: PropTypes.func,
};

/**
 * Empty State Component
 */
export const EmptyState = ({ 
  icon = '📭', 
  title = 'No Data Available',
  message = 'Try selecting a different date range.'
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="text-8xl mb-4 opacity-50">{icon}</div>
      <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-center max-w-md">{message}</p>
    </div>
  );
};

EmptyState.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string,
  message: PropTypes.string,
};

/**
 * Data Card Component
 */
export const DataCard = ({ icon, title, value, unit, trend, color = 'blue' }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    red: 'from-red-500 to-red-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition-all duration-300`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-4xl">{icon}</span>
        {trend && (
          <span className={`text-sm font-medium px-2 py-1 rounded-full ${
            trend > 0 ? 'bg-green-400' : 'bg-red-400'
          }`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <h4 className="text-sm font-medium opacity-90 mb-1">{title}</h4>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold">{value}</span>
        {unit && <span className="text-sm opacity-75">{unit}</span>}
      </div>
    </div>
  );
};

DataCard.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  unit: PropTypes.string,
  trend: PropTypes.number,
  color: PropTypes.oneOf(['blue', 'green', 'red', 'purple', 'orange']),
};