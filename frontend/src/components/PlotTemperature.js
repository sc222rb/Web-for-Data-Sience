import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';
import PropTypes from 'prop-types';

/**
 * PlotTemperature Component
 * This component fetches and displays temperature data over time for two beehives.
 * It retrieves data from an API and visualizes it using Plotly, showing the temperature trends
 * for both hives.
 *
 * @param {Object} hive1 - The first hive object, containing at least an `id` and `name`
 * @param {Object} hive2 - The second hive object, containing at least an `id` and `name`
 * @param {string} fromDate - The starting date for the data query (YYYY-MM-DD format)
 * @param {string} toDate - The ending date for the data query (YYYY-MM-DD format)
 * @param {boolean} searchTrigger - A boolean value to trigger the search when changed
 * @returns {JSX.Element} The rendered plot of temperature data over time
 */
const PlotTemperature = ({ hive1, hive2, fromDate, toDate, searchTrigger }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data for both hives in parallel
        const [response1, response2] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/${hive1.id}/temperature`, {
            params: { from: fromDate, to: toDate }
          }),
          axios.get(`${process.env.REACT_APP_API_URL}/${hive2.id}/temperature`, {
            params: { from: fromDate, to: toDate }
          })
        ]);

        // Format data for plotting
        const formattedData = [
          {
            x: response1.data.map(entry => entry.hour),
            y: response1.data.map(entry => entry.avgTemperature),
            type: 'scatter',
            mode: 'lines',
            name: hive1.name,
            marker: { color: 'red' }
          },
          {
            x: response2.data.map(entry => entry.hour),
            y: response2.data.map(entry => entry.avgTemperature),
            type: 'scatter',
            mode: 'lines',
            name: hive2.name,
            marker: { color: 'blue' }
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
      <p>This graph displays hourly bee temperature data from two beehives over time.</p>
      <Plot
        data={data}
        layout={{
          title: 'Beehive Temperature Over Time',
          xaxis: { title: 'Timestamp' },
          yaxis: { title: 'Temperature (ºC)' }
        }}
      />
    </div>
  );
};
PlotTemperature.propTypes = {
  hive1: PropTypes.object.isRequired,
  hive2: PropTypes.object.isRequired,
  fromDate: PropTypes.string.isRequired,
  toDate: PropTypes.string.isRequired,
  searchTrigger: PropTypes.bool.isRequired
};

export default PlotTemperature;
