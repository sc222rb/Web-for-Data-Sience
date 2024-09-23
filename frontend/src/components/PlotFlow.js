import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';
import PropTypes from 'prop-types';

/**
 * PlotFlow Component
 * This component fetches and plots bee flow data (arrivals and departures) from two beehives
 * over a given date range, and displays it as a line chart.
 *
 * @param {Object} hive1 - The first hive object containing hive information (id, name, etc.)
 * @param {Object} hive2 - The second hive object containing hive information (id, name, etc.)
 * @param {string} fromDate - The starting date for data filtering (format: YYYY-MM-DD)
 * @param {string} toDate - The ending date for data filtering (format: YYYY-MM-DD)
 * @param {boolean} searchTrigger - A boolean trigger to refetch data when search is initiated
 * @returns {JSX.Element} The rendered plot component
 */
const PlotFlow = ({ hive1, hive2, fromDate, toDate, searchTrigger }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data for both hives in parallel
        const [response1, response2] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/${hive1.id}/flow`, {
            params: { from: fromDate, to: toDate }
          }),
          axios.get(`${process.env.REACT_APP_API_URL}/${hive2.id}/flow`, {
            params: { from: fromDate, to: toDate }
          })
        ]);

        // Format data for plotting
        const formattedData = [
          {
            x: response1.data.map(entry => entry.hour),
            y: response1.data.map(entry => entry.avgArrivals),
            type: 'scatter',
            mode: 'lines',
            name: `${hive1.name} Arrivals`,
            line: { color: 'red', width: 3 }
          },
          {
            x: response1.data.map(entry => entry.hour),
            y: response1.data.map(entry => entry.avgDepartures),
            type: 'scatter',
            mode: 'lines',
            name: `${hive1.name} Departures`,
            line: { color: 'orange', width: 3 }
          },
          {
            x: response2.data.map(entry => entry.hour),
            y: response2.data.map(entry => entry.avgArrivals),
            type: 'scatter',
            mode: 'lines',
            name: `${hive2.name} Arrivals`,
            line: { color: 'blue', width: 3, dash: 'dash' }
          },
          {
            x: response2.data.map(entry => entry.hour),
            y: response2.data.map(entry => entry.avgDepartures),
            type: 'scatter',
            mode: 'lines',
            name: `${hive2.name} Departures`,
            line: { color: 'green', width: 3, dash: 'dash' }
          }
        ];

        setData(formattedData);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hive1, hive2, fromDate, toDate, searchTrigger]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <p>This graph displays hourly bee flow data from two beehives over time. Positive flow numbers indicate arrivals, while negative numbers denote departures.</p>
      <Plot
        data={data}
        layout={{
          title: 'Beehive Flow Over Time',
          xaxis: { title: 'Hour' },
          yaxis: { title: 'Flow' }
        }}
      />
    </div>
  );
};

PlotFlow.propTypes = {
  hive1: PropTypes.object.isRequired,
  hive2: PropTypes.object.isRequired,
  fromDate: PropTypes.string.isRequired,
  toDate: PropTypes.string.isRequired,
  searchTrigger: PropTypes.bool.isRequired
};

export default PlotFlow;
