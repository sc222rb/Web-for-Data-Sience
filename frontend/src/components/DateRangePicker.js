import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * DateRangePicker Component
 * This component provides a date range picker interface where users can select a 
 * 'from' and 'to' date within a specified range, ensuring that the dates are valid.
 * Upon selection, the search button triggers the `onSearch` callback with the selected dates.
 *
 * @param {string} initialFromDate - The initial 'from' date value (in YYYY-MM-DD format)
 * @param {string} initialToDate - The initial 'to' date value (in YYYY-MM-DD format)
 * @param {Function} onSearch - Callback function that gets called when the search button is clicked
 * @returns {JSX.Element} The rendered date range picker component
 */
const DateRangePicker = ({ fromDate: initialFromDate, toDate: initialToDate, onSearch }) => {
  const [fromDate, setFromDate] = useState(initialFromDate);
  const [toDate, setToDate] = useState(initialToDate);
  const [error, setError] = useState('');

  // Define the valid date range
  const minDate = '2017-01-01';
  const maxDate = '2019-05-31';

  // Handle date range changes and ensure validity
  const handleFromDateChange = (e) => {
    const newFromDate = e.target.value;
    if (newFromDate <= toDate) {
      setFromDate(newFromDate);
      setError(''); // Clear any previous errors
    } else {
      setError('From Date cannot be later than To Date.');
    }
  };

  const handleToDateChange = (e) => {
    const newToDate = e.target.value;
    if (newToDate >= fromDate) {
      setToDate(newToDate);
      setError(''); // Clear any previous errors
    } else {
      setError('To Date cannot be earlier than From Date.');
    }
  };

  const handleSearchClick = () => {
    if (!error) {
      onSearch(fromDate, toDate);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-gray-700 mb-3">
        <span className="text-2xl">📅</span>
        <h3 className="text-lg font-semibold">Select Date Range</h3>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        {/* From Date */}
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="fromDate" className="block text-sm font-medium text-gray-700 mb-2">
            From Date
          </label>
          <input 
            id="fromDate"
            type="date" 
            value={fromDate} 
            onChange={handleFromDateChange} 
            min={minDate} 
            max={maxDate}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg 
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                     transition-all duration-200 outline-none"
          />
        </div>

        {/* To Date */}
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="toDate" className="block text-sm font-medium text-gray-700 mb-2">
            To Date
          </label>
          <input 
            id="toDate"
            type="date" 
            value={toDate} 
            onChange={handleToDateChange} 
            min={minDate} 
            max={maxDate}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg 
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                     transition-all duration-200 outline-none"
          />
        </div>

        {/* Search Button */}
        <div>
          <button 
            onClick={handleSearchClick}
            disabled={!!error}
            className={`
              px-8 py-3 rounded-lg font-medium text-white
              transition-all duration-300 transform hover:scale-105
              flex items-center gap-2 shadow-lg whitespace-nowrap
              ${error 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
              }
            `}
          >
            <span className="text-xl">🔍</span>
            <span>Search</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg animate-shake">
          <span className="text-red-500 text-xl">⚠️</span>
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* Info Box */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
        <span className="text-blue-500 text-xl mt-0.5">ℹ️</span>
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">Available Data Range</p>
          <p className="text-blue-600">January 1, 2017 - May 31, 2019</p>
          <p className="text-xs text-blue-500 mt-1">
            Note: Würzburg hive has missing data from May 2018 to October 2018
          </p>
        </div>
      </div>
    </div>
  );
};

DateRangePicker.propTypes = {
  fromDate: PropTypes.string.isRequired,
  toDate: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
};

export default DateRangePicker;
