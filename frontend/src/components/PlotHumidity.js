import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';
import PropTypes from 'prop-types';

/**
 * PlotHumidity Component
 * This component fetches and displays humidity data over time for two beehives.
 * The data is retrieved from an API, and the component uses Plotly to visualize it
 * in the form of a line graph, showing the humidity trends for both hives.
 *
 * @param {Object} hive1 - The first hive object, containing at least an `id` and `name`
 * @param {Object} hive2 - The second hive object, containing at least an `id` and `name`
 * @param {string} fromDate - The starting date for the data query (YYYY-MM-DD format)
 * @param {string} toDate - The ending date for the data query (YYYY-MM-DD format)
 * @param {boolean} searchTrigger - A boolean value to trigger the search when changed
 * @returns {JSX.Element} The rendered plot of humidity data over time
 */
const PlotHumidity = ({ hive1, hive2, fromDate, toDate, searchTrigger }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [response1, response2] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/${hive1.id}/humidity`, {
            params: { from: fromDate, to: toDate }
          }),
          axios.get(`${process.env.REACT_APP_API_URL}/${hive2.id}/humidity`, {
            params: { from: fromDate, to: toDate }
          })
        ]);

        const formattedData = [
          {
            x: response1.data.map(entry => entry.timestamp),
            y: response1.data.map(entry => entry.humidity),
            type: 'scatter',
            mode: 'lines',
            name: hive1.name,
            marker: { color: 'red' }
          },
          {
            x: response2.data.map(entry => entry.timestamp),
            y: response2.data.map(entry => entry.humidity),
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
      <Plot
        data={data}
        layout={{
          title: 'Beehive Humidity Over Time',
          xaxis: { title: 'Timestamp' },
          yaxis: { title: 'Humidity' }
        }}
      />
    </div>
  );
};

PlotHumidity.propTypes = {
  hive1: PropTypes.object.isRequired,
  hive2: PropTypes.object.isRequired,
  fromDate: PropTypes.string.isRequired,
  toDate: PropTypes.string.isRequired,
  searchTrigger: PropTypes.bool.isRequired
};

export default PlotHumidity;
