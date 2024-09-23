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
      setError('');  // Clear any previous errors
    } else {
      setError('From Date cannot be later than To Date.');
    }
  };

  const handleToDateChange = (e) => {
    const newToDate = e.target.value;
    if (newToDate >= fromDate) {
      setToDate(newToDate);
      setError('');  // Clear any previous errors
    } else {
      setError('To Date cannot be earlier than From Date.');
    }
  };

  const handleSearchClick = () => {
    onSearch(fromDate, toDate);
  };

  return (
    <div className="mb-4">
      <label htmlFor="fromDate" className="mr-2">From Date:</label>
      <input 
        type="date" 
        value={fromDate} 
        onChange={handleFromDateChange} 
        min={minDate} 
        max={maxDate}
        className="border rounded p-2"
      />
      <label htmlFor="toDate" className="ml-4 mr-2">To Date:</label>
      <input 
        type="date" 
        value={toDate} 
        onChange={handleToDateChange} 
        min={minDate} 
        max={maxDate}
        className="border rounded p-2"
      />
      <button 
        onClick={handleSearchClick} 
        className="ml-4 p-2 bg-blue-500 text-white rounded">
        Search
      </button>
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
}

  // Add prop validation
  DateRangePicker.propTypes = {
    fromDate: PropTypes.string.isRequired,
    toDate: PropTypes.string.isRequired,
    onSearch: PropTypes.func.isRequired,
  };

export default DateRangePicker;
